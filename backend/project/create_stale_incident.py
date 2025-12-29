
import os
import django
import sys
from django.db import connection

# Setup Django environment
sys.path.append('d:/collage/db/Smart-Emergency-Dispatch-Optimization-System/backend/project')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project.settings')
django.setup()

def create_stale_incident():
    print("Creating a stale incident (5 minutes old)...")
    try:
        with connection.cursor() as cursor:
            # Insert incident with time_reported = NOW - 5 mins
            cursor.execute("""
                INSERT INTO incident (type, severity_level, location, status, time_reported)
                VALUES ('FIRE', 'CRITICAL', ST_GeomFromText('POINT(-74.006 40.7128)', 4326), 'REPORTED', DATE_SUB(NOW(), INTERVAL 5 MINUTE))
            """)
            incident_id = cursor.lastrowid
            print(f"Success! Created stale Incident #{incident_id}")
            print("Now run 'python manage.py run_notification_service' and check your notifications.")
    except Exception as e:
        print(f"Failed: {e}")

if __name__ == "__main__":
    create_stale_incident()
