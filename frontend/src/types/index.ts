export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  withCount?: boolean;
}

export type IncidentType = 'medical' | 'fire' | 'police';
export type IncidentStatus = 'reported' | 'assigned' | 'resolved';
export type IncidentSeverity = 'critical' | 'high' | 'medium' | 'low';

export type VehicleType = 'ambulance' | 'fire_truck' | 'police_car';
export type VehicleStatus = 'available' | 'on_route' | 'busy' | 'maintenance';

export interface Incident {
  id: string;
  type: IncidentType;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  severity: IncidentSeverity;
  status: IncidentStatus;
  reported_at: string;
  assigned_vehicle_id?: string;
  description: string;
  resolved_at?: string;
}

export interface Vehicle {
  id: string;
  type: VehicleType;
  status: VehicleStatus;
  current_location: {
    lat: number;
    lng: number;
  };
  capacity: number;
  assigned_incident_id?: string;
  unit_number: string;
  station: string;
}

export interface Assignment {
  id: string;
  incident_id: string;
  vehicle_id: string;
  assigned_at: string;
  completed_at?: string;
  response_time?: number;
}

export interface User {
  id: string;
  username: string;
  role: 'dispatcher' | 'admin';
  created_at: string;
}

export interface Notification {
  id: string;
  type: 'new_incident' | 'unassigned_alert' | 'status_change' | 'system_alert';
  message: string;
  timestamp: string;
  read: boolean;
  incident_id?: string;
}

export interface AnalyticsData {
  avgResponseTime: number;
  minResponseTime: number;
  maxResponseTime: number;
  totalIncidents: number;
  resolvedIncidents: number;
  activeIncidents: number;
  vehicleUtilization: number;
  responseTimesByType: {
    medical: number;
    fire: number;
    police: number;
  };
}
