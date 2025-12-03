import { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MapPin, Navigation } from 'lucide-react';
import type { Incident, Vehicle } from '@/types';
import { cn } from '@/lib/utils';

interface AssignVehicleDialogProps {
  incident: Incident | null;
  vehicles: Vehicle[];
  open: boolean;
  onClose: () => void;
  onAssign: (incidentId: string, vehicleId: string) => void;
}

const vehicleTypeMatch = {
  medical: 'ambulance',
  fire: 'fire_truck',
  police: 'police_car',
};

const vehicleIcons = {
  ambulance: '🚑',
  fire_truck: '🚒',
  police_car: '🚓',
};

const statusColors = {
  available: 'bg-success text-success-foreground',
  on_route: 'bg-primary text-primary-foreground',
  busy: 'bg-warning text-warning-foreground',
  maintenance: 'bg-muted text-muted-foreground',
};

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function AssignVehicleDialog({
  incident,
  vehicles,
  open,
  onClose,
  onAssign,
}: AssignVehicleDialogProps) {
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);

  const sortedVehicles = useMemo(() => {
    if (!incident) return [];

    const matchingType = vehicleTypeMatch[incident.type];
    const availableVehicles = vehicles.filter(
      (v) => v.type === matchingType && v.status === 'available'
    );

    return availableVehicles
      .map((vehicle) => ({
        ...vehicle,
        distance: calculateDistance(
          incident.location.lat,
          incident.location.lng,
          vehicle.current_location.lat,
          vehicle.current_location.lng
        ),
      }))
      .sort((a, b) => a.distance - b.distance);
  }, [incident, vehicles]);

  const handleAssign = () => {
    if (incident && selectedVehicle) {
      onAssign(incident.id, selectedVehicle);
      setSelectedVehicle(null);
      onClose();
    }
  };

  if (!incident) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Assign Vehicle to Incident</DialogTitle>
          <DialogDescription>
            Select an available vehicle to respond to this {incident.type} emergency
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Incident Details</h3>
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-medium">Type:</span> {incident.type}
              </p>
              <p>
                <span className="font-medium">Severity:</span> {incident.severity}
              </p>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>{incident.location.address}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">
              Available Vehicles ({sortedVehicles.length})
            </h3>
            {sortedVehicles.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No available vehicles of matching type found
              </div>
            ) : (
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-2">
                  {sortedVehicles.map((vehicle) => (
                    <div
                      key={vehicle.id}
                      className={cn(
                        'p-4 border rounded-lg cursor-pointer transition-all hover:border-primary',
                        selectedVehicle === vehicle.id && 'border-primary bg-primary/5'
                      )}
                      onClick={() => setSelectedVehicle(vehicle.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{vehicleIcons[vehicle.type]}</span>
                          <div>
                            <h4 className="font-semibold">{vehicle.unit_number}</h4>
                            <p className="text-sm text-muted-foreground">{vehicle.station}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={statusColors[vehicle.status]}>
                            {vehicle.status}
                          </Badge>
                          <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                            <Navigation className="h-3 w-3" />
                            <span>{vehicle.distance.toFixed(2)} km</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleAssign} disabled={!selectedVehicle}>
              Assign Vehicle
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
