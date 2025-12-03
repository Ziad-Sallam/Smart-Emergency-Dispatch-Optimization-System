import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, AlertCircle } from 'lucide-react';
import type { Incident } from '@/types';
import { cn } from '@/lib/utils';

interface IncidentCardProps {
  incident: Incident;
  onAssign: (incident: Incident) => void;
  onResolve: (incident: Incident) => void;
  onClick: (incident: Incident) => void;
}

const severityColors = {
  critical: 'bg-critical text-critical-foreground',
  high: 'bg-destructive text-destructive-foreground',
  medium: 'bg-warning text-warning-foreground',
  low: 'bg-muted text-muted-foreground',
};

const statusColors = {
  reported: 'bg-warning text-warning-foreground',
  assigned: 'bg-primary text-primary-foreground',
  resolved: 'bg-success text-success-foreground',
};

const typeIcons = {
  medical: '🏥',
  fire: '🔥',
  police: '🚔',
};

export default function IncidentCard({
  incident,
  onAssign,
  onResolve,
  onClick,
}: IncidentCardProps) {
  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:shadow-md',
        incident.severity === 'critical' && 'border-critical border-2'
      )}
      onClick={() => onClick(incident)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{typeIcons[incident.type]}</span>
            <div>
              <h3 className="font-semibold text-sm capitalize">{incident.type} Emergency</h3>
              <p className="text-xs text-muted-foreground">ID: {incident.id.slice(0, 8)}</p>
            </div>
          </div>
          <Badge className={severityColors[incident.severity]}>{incident.severity}</Badge>
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
            <span className="text-xs">{incident.location.address}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs">
              {formatDistanceToNow(new Date(incident.reported_at), { addSuffix: true })}
            </span>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <AlertCircle className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
            <span className="text-xs">{incident.description}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Badge className={statusColors[incident.status]} variant="outline">
            {incident.status}
          </Badge>
          <div className="flex gap-2">
            {incident.status === 'reported' && (
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onAssign(incident);
                }}
              >
                Assign
              </Button>
            )}
            {incident.status === 'assigned' && (
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onResolve(incident);
                }}
              >
                Resolve
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
