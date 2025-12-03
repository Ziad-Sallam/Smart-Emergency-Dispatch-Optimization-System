import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/contexts/AuthContext';
import { useDispatch } from '@/contexts/DispatchContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Bell, LogOut, Search, BarChart3, Shield, User } from 'lucide-react';
import DispatchMap from '@/components/dispatch/DispatchMap';
import IncidentCard from '@/components/dispatch/IncidentCard';
import AssignVehicleDialog from '@/components/dispatch/AssignVehicleDialog';
import NotificationsPanel from '@/components/dispatch/NotificationsPanel';
import type { Incident, IncidentType, IncidentStatus } from '@/types';
import { toast } from 'sonner';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const {
    incidents,
    vehicles,
    assignVehicleToIncident,
    resolveIncident,
    notifications,
    markNotificationAsRead,
    unreadNotificationsCount,
  } = useDispatch();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<IncidentType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<IncidentStatus | 'all'>('all');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [notificationsPanelOpen, setNotificationsPanelOpen] = useState(false);

  const filteredIncidents = useMemo(() => {
    return incidents.filter((incident) => {
      const matchesSearch =
        searchQuery === '' ||
        incident.location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        incident.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        incident.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = typeFilter === 'all' || incident.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || incident.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [incidents, searchQuery, typeFilter, statusFilter]);

  const activeIncidents = incidents.filter((i) => i.status !== 'resolved');

  const handleAssignClick = (incident: Incident) => {
    setSelectedIncident(incident);
    setAssignDialogOpen(true);
  };

  const handleResolveClick = (incident: Incident) => {
    resolveIncident(incident.id);
    toast.success('Incident resolved successfully');
  };

  const handleAssignVehicle = (incidentId: string, vehicleId: string) => {
    assignVehicleToIncident(incidentId, vehicleId);
    toast.success('Vehicle assigned successfully');
  };

  const handleNotificationClick = (id: string) => {
    markNotificationAsRead(id);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <header className="border-b bg-card px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary rounded-lg">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Emergency Dispatch System</h1>
            <p className="text-xs text-muted-foreground">Real-time incident management</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-sm">
            {activeIncidents.length} Active Incidents
          </Badge>

          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => setNotificationsPanelOpen(true)}
          >
            <Bell className="h-5 w-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-critical text-critical-foreground text-xs flex items-center justify-center">
                {unreadNotificationsCount}
              </span>
            )}
          </Button>

          {user?.role === 'admin' && (
            <Button variant="ghost" size="sm" onClick={() => navigate('/analytics')}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
          )}

          <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
            <User className="h-4 w-4" />
            <span className="text-sm font-medium">{user?.username}</span>
          </div>

          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-[400px] border-r bg-card flex flex-col">
          <div className="p-4 border-b space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search incidents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="flex gap-2">
              <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as IncidentType | 'all')}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="medical">Medical</SelectItem>
                  <SelectItem value="fire">Fire</SelectItem>
                  <SelectItem value="police">Police</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as IncidentStatus | 'all')}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="reported">Reported</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-3">
              {filteredIncidents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No incidents found</p>
                </div>
              ) : (
                filteredIncidents.map((incident) => (
                  <IncidentCard
                    key={incident.id}
                    incident={incident}
                    onAssign={handleAssignClick}
                    onResolve={handleResolveClick}
                    onClick={setSelectedIncident}
                  />
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        <div className="flex-1 relative">
          <DispatchMap
            incidents={activeIncidents}
            vehicles={vehicles}
            onIncidentClick={setSelectedIncident}
          />
        </div>
      </div>

      <AssignVehicleDialog
        incident={selectedIncident}
        vehicles={vehicles}
        open={assignDialogOpen}
        onClose={() => {
          setAssignDialogOpen(false);
          setSelectedIncident(null);
        }}
        onAssign={handleAssignVehicle}
      />

      <NotificationsPanel
        notifications={notifications}
        open={notificationsPanelOpen}
        onClose={() => setNotificationsPanelOpen(false)}
        onNotificationClick={handleNotificationClick}
      />
    </div>
  );
}
