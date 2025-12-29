import time
from datetime import datetime
from django.core.management.base import BaseCommand
from django.db import connection
from app import repo
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer


class Command(BaseCommand):
    help = 'Runs the notification service checking for timeouts'

    def handle(self, *args, **options):
        self.channel_layer = get_channel_layer()
        self.stdout.write(self.style.SUCCESS('Starting Notification Service...'))
        
        while True:
            try:
                self.check_unassigned_incidents()
                self.check_unresolved_incidents()
                
                # Sleep for 30 seconds before next check
                time.sleep(30)
            except KeyboardInterrupt:
                self.stdout.write(self.style.SUCCESS('Stopping Notification Service...'))
                break
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'Error in notification loop: {str(e)}'))
                time.sleep(30)

    def check_unassigned_incidents(self):
        """
        Check for incidents that are REPORTED but not assigned for > 2 mins
        """
        with connection.cursor() as cursor:
            # Find incidents reported > 2 mins ago, status='REPORTED'
            # And we haven't already created a 'Incident #ID Unassigned Timeout' notification
            cursor.execute("""
                SELECT i.incident_id, i.type, i.severity_level, i.time_reported, 
                       ST_X(i.location) as lng, ST_Y(i.location) as lat
                FROM incident i
                WHERE i.status = 'REPORTED'
                AND i.time_reported < DATE_SUB(NOW(), INTERVAL 2 MINUTE)
                AND NOT EXISTS (
                    SELECT 1 FROM admin_notification an 
                    WHERE an.title LIKE CONCAT('Unassigned Timeout: Incident #', i.incident_id)
                )
            """)
            
            rows = cursor.fetchall()
            for row in rows:
                incident_id = row[0]
                inc_type = row[1]
                severity = row[2]
                
                title = f"Unassigned Timeout: Incident #{incident_id}"
                body = f"Incident #{incident_id} ({inc_type}, {severity}) has been unassigned for more than 2 minutes!"
                
                repo.create_admin_notification(title, body)
                self.stdout.write(f"Created unassigned notification for incident {incident_id}")

                # Broadcast
                async_to_sync(self.channel_layer.group_send)(
                    "group_ADMIN",
                    {
                        "type": "broadcast_message",
                        "message": {
                             "action": "new_notification",
                             "title": title,
                             "body": body,
                             "incident_id": incident_id,
                             "created_at": datetime.now().isoformat()
                        }
                    }
                )


    def check_unresolved_incidents(self):
        """
        Check for incidents that are not RESOLVED for > 2 mins
        """
        with connection.cursor() as cursor:
            # Find incidents > 2 mins old, status != 'RESOLVED'
            # And we haven't created a 'Unresolved Timeout' notification yet
            # Note: We might want to send this periodically? 
            # For now, let's send it ONCE when it crosses the 2 min mark.
            cursor.execute("""
                SELECT i.incident_id, i.type, i.severity_level, i.time_reported, i.status
                FROM incident i
                WHERE i.status != 'RESOLVED'
                AND i.time_reported < DATE_SUB(NOW(), INTERVAL 2 MINUTE)
                AND NOT EXISTS (
                    SELECT 1 FROM admin_notification an 
                    WHERE an.title LIKE CONCAT('Resolution Timeout: Incident #', i.incident_id)
                )
            """)
            
            rows = cursor.fetchall()
            for row in rows:
                incident_id = row[0]
                inc_type = row[1]
                severity = row[2]
                status = row[4]
                
                title = f"Resolution Timeout: Incident #{incident_id}"
                body = f"Incident #{incident_id} ({inc_type}, {severity}) is still {status} after 2 minutes."
                
                repo.create_admin_notification(title, body)
                self.stdout.write(f"Created resolution timeout notification for incident {incident_id}")

                # Broadcast
                async_to_sync(self.channel_layer.group_send)(
                    "group_ADMIN",
                    {
                        "type": "broadcast_message",
                        "message": {
                             "action": "new_notification",
                             "title": title,
                             "body": body,
                             "incident_id": incident_id,
                             "created_at": datetime.now().isoformat()
                        }
                    }
                )

