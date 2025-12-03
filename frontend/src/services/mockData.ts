import type { Incident, Vehicle, User } from '@/types';

export const MOCK_USERS: User[] = [
  {
    id: '1',
    username: 'dispatcher1',
    role: 'dispatcher',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    username: 'admin',
    role: 'admin',
    created_at: new Date().toISOString(),
  },
];

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: '1',
    type: 'medical',
    location: {
      lat: 40.7580,
      lng: -73.9855,
      address: '123 Main St, New York, NY',
    },
    severity: 'critical',
    status: 'reported',
    reported_at: new Date(Date.now() - 5 * 60000).toISOString(),
    description: 'Cardiac arrest reported, patient unconscious',
  },
  {
    id: '2',
    type: 'fire',
    location: {
      lat: 40.7614,
      lng: -73.9776,
      address: '456 Park Ave, New York, NY',
    },
    severity: 'high',
    status: 'assigned',
    reported_at: new Date(Date.now() - 15 * 60000).toISOString(),
    assigned_vehicle_id: '2',
    description: 'Building fire on 3rd floor, smoke visible',
  },
  {
    id: '3',
    type: 'police',
    location: {
      lat: 40.7489,
      lng: -73.9680,
      address: '789 Broadway, New York, NY',
    },
    severity: 'medium',
    status: 'reported',
    reported_at: new Date(Date.now() - 10 * 60000).toISOString(),
    description: 'Robbery in progress at convenience store',
  },
  {
    id: '4',
    type: 'medical',
    location: {
      lat: 40.7505,
      lng: -73.9934,
      address: '321 West St, New York, NY',
    },
    severity: 'medium',
    status: 'assigned',
    reported_at: new Date(Date.now() - 20 * 60000).toISOString(),
    assigned_vehicle_id: '1',
    description: 'Elderly patient fallen, possible fracture',
  },
  {
    id: '5',
    type: 'fire',
    location: {
      lat: 40.7549,
      lng: -73.9840,
      address: '555 5th Ave, New York, NY',
    },
    severity: 'low',
    status: 'resolved',
    reported_at: new Date(Date.now() - 60 * 60000).toISOString(),
    resolved_at: new Date(Date.now() - 30 * 60000).toISOString(),
    description: 'Small kitchen fire, extinguished',
  },
];

export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: '1',
    type: 'ambulance',
    status: 'on_route',
    current_location: {
      lat: 40.7510,
      lng: -73.9920,
    },
    capacity: 2,
    unit_number: 'AMB-101',
    station: 'Station 1',
    assigned_incident_id: '4',
  },
  {
    id: '2',
    type: 'fire_truck',
    status: 'on_route',
    current_location: {
      lat: 40.7600,
      lng: -73.9800,
    },
    capacity: 6,
    unit_number: 'FIRE-201',
    station: 'Station 2',
    assigned_incident_id: '2',
  },
  {
    id: '3',
    type: 'police_car',
    status: 'available',
    current_location: {
      lat: 40.7520,
      lng: -73.9750,
    },
    capacity: 2,
    unit_number: 'POL-301',
    station: 'Precinct 3',
  },
  {
    id: '4',
    type: 'ambulance',
    status: 'available',
    current_location: {
      lat: 40.7590,
      lng: -73.9870,
    },
    capacity: 2,
    unit_number: 'AMB-102',
    station: 'Station 1',
  },
  {
    id: '5',
    type: 'fire_truck',
    status: 'available',
    current_location: {
      lat: 40.7480,
      lng: -73.9700,
    },
    capacity: 6,
    unit_number: 'FIRE-202',
    station: 'Station 2',
  },
  {
    id: '6',
    type: 'police_car',
    status: 'busy',
    current_location: {
      lat: 40.7560,
      lng: -73.9810,
    },
    capacity: 2,
    unit_number: 'POL-302',
    station: 'Precinct 3',
  },
  {
    id: '7',
    type: 'ambulance',
    status: 'maintenance',
    current_location: {
      lat: 40.7530,
      lng: -73.9900,
    },
    capacity: 2,
    unit_number: 'AMB-103',
    station: 'Station 1',
  },
  {
    id: '8',
    type: 'police_car',
    status: 'available',
    current_location: {
      lat: 40.7470,
      lng: -73.9650,
    },
    capacity: 2,
    unit_number: 'POL-303',
    station: 'Precinct 3',
  },
];

export function generateRandomIncident(): Incident {
  const types: Incident['type'][] = ['medical', 'fire', 'police'];
  const severities: Incident['severity'][] = ['critical', 'high', 'medium', 'low'];
  const type = types[Math.floor(Math.random() * types.length)];
  const severity = severities[Math.floor(Math.random() * severities.length)];

  const descriptions = {
    medical: [
      'Chest pain reported',
      'Difficulty breathing',
      'Severe allergic reaction',
      'Traffic accident with injuries',
      'Unconscious person',
    ],
    fire: [
      'Smoke detected in building',
      'Gas leak reported',
      'Electrical fire',
      'Vehicle fire',
      'Wildfire spreading',
    ],
    police: [
      'Domestic disturbance',
      'Suspicious activity',
      'Traffic violation',
      'Theft reported',
      'Public disturbance',
    ],
  };

  return {
    id: `INC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    location: {
      lat: 40.7489 + (Math.random() - 0.5) * 0.02,
      lng: -73.9680 + (Math.random() - 0.5) * 0.02,
      address: `${Math.floor(Math.random() * 999) + 1} ${['Main', 'Park', 'Broadway', 'West', '5th'][Math.floor(Math.random() * 5)]} St, New York, NY`,
    },
    severity,
    status: 'reported',
    reported_at: new Date().toISOString(),
    description: descriptions[type][Math.floor(Math.random() * descriptions[type].length)],
  };
}
