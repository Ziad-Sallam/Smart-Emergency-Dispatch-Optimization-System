import { formatDistanceToNow } from 'date-fns';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Bell, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import type { Notification } from '@/types';
import { cn } from '@/lib/utils';

interface NotificationsPanelProps {
  notifications: Notification[];
  open: boolean;
  onClose: () => void;
  onNotificationClick: (id: string) => void;
}

const notificationIcons = {
  new_incident: AlertCircle,
  unassigned_alert: AlertTriangle,
  status_change: Info,
  system_alert: Bell,
};

const notificationColors = {
  new_incident: 'text-critical',
  unassigned_alert: 'text-warning',
  status_change: 'text-primary',
  system_alert: 'text-muted-foreground',
};

export default function NotificationsPanel({
  notifications,
  open,
  onClose,
  onNotificationClick,
}: NotificationsPanelProps) {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>Recent alerts and system notifications</SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] mt-6">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No notifications</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => {
                const Icon = notificationIcons[notification.type];
                return (
                  <div
                    key={notification.id}
                    className={cn(
                      'p-4 border rounded-lg cursor-pointer transition-all hover:bg-muted/50',
                      !notification.read && 'bg-primary/5 border-primary/20'
                    )}
                    onClick={() => onNotificationClick(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className={cn('h-5 w-5 mt-0.5', notificationColors[notification.type])} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="text-sm font-medium">
                            {notification.type.replace('_', ' ').toUpperCase()}
                          </p>
                          {!notification.read && (
                            <Badge variant="default" className="text-xs">
                              New
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(notification.timestamp), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
