import type { Incident, Vehicle } from '@/types';
import { Badge } from '@/components/ui/badge';

interface DispatchMapProps {
  incidents: Incident[];
  vehicles: Vehicle[];
  onIncidentClick?: (incident: Incident) => void;
  onVehicleClick?: (vehicle: Vehicle) => void;
}

const incidentIcons = {
  medical: {
    critical: '🚨',
    high: '🏥',
    medium: '⚕️',
    low: '🩹',
  },
  fire: {
    critical: '🔥',
    high: '🔥',
    medium: '🧯',
    low: '💨',
  },
  police: {
    critical: '🚔',
    high: '🚓',
    medium: '👮',
    low: '🚦',
  },
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

export default function DispatchMap({
  incidents,
  vehicles,
  onIncidentClick,
  onVehicleClick,
}: DispatchMapProps) {
  const activeIncidents = incidents.filter((i) => i.status !== 'resolved');

  return (
    <div className="w-full h-full relative bg-muted">
      <img
        src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1920&h=1080&fit=crop"
        alt="City Map"
        className="w-full h-full object-cover opacity-80"
      />
      
      <div className="absolute inset-0 pointer-events-none">
        <div className="relative w-full h-full">
          {activeIncidents.map((incident, index) => {
            const top = 20 + (index * 15) % 60;
            const left = 15 + (index * 20) % 70;
            
            return (
              <div
                key={incident.id}
                className="absolute pointer-events-auto cursor-pointer hover:scale-110 transition-transform"
                style={{ top: `${top}%`, left: `${left}%` }}
                onClick={() => onIncidentClick?.(incident)}
                title={`${incident.type} - ${incident.severity} - ${incident.location.address}`}
              >
                <div className="flex flex-col items-center">
                  <div className="text-4xl drop-shadow-lg">
                    {incidentIcons[incident.type][incident.severity]}
                  </div>
                  <Badge className="mt-1 text-xs" variant="secondary">
                    {incident.type}
                  </Badge>
                </div>
              </div>
            );
          })}

          {vehicles.map((vehicle, index) => {
            const top = 25 + (index * 12) % 55;
            const left = 20 + (index * 18) % 65;
            
            return (
              <div
                key={vehicle.id}
                className="absolute pointer-events-auto cursor-pointer hover:scale-110 transition-transform"
                style={{ top: `${top}%`, left: `${left}%` }}
                onClick={() => onVehicleClick?.(vehicle)}
                title={`${vehicle.unit_number} - ${vehicle.status}`}
              >
                <div className="flex flex-col items-center">
                  <div className="text-3xl drop-shadow-lg">
                    {vehicleIcons[vehicle.type]}
                  </div>
                  <Badge className={`mt-1 text-xs ${statusColors[vehicle.status]}`}>
                    {vehicle.unit_number}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm p-3 rounded-lg border shadow-lg">
        <h3 className="font-semibold text-sm mb-2">Map Legend</h3>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-lg">🚨🏥</span>
            <span>Medical Incidents</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">🔥🧯</span>
            <span>Fire Incidents</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">🚔👮</span>
            <span>Police Incidents</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">🚑🚒🚓</span>
            <span>Emergency Vehicles</span>
          </div>
        </div>
      </div>

      <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm p-3 rounded-lg border shadow-lg">
        <div className="text-sm font-semibold">Active Status</div>
        <div className="text-2xl font-bold text-primary">{activeIncidents.length}</div>
        <div className="text-xs text-muted-foreground">Incidents</div>
      </div>
    </div>
  );
}
