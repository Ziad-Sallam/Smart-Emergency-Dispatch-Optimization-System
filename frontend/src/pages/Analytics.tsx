import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch } from '@/contexts/DispatchContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, TrendingUp, Clock, CheckCircle, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = {
  medical: 'hsl(var(--chart-1))',
  fire: 'hsl(var(--chart-2))',
  police: 'hsl(var(--chart-4))',
};

export default function Analytics() {
  const navigate = useNavigate();
  const { incidents, vehicles, assignments } = useDispatch();

  const analytics = useMemo(() => {
    const completedAssignments = assignments.filter((a) => a.completed_at && a.response_time);
    const responseTimes = completedAssignments.map((a) => a.response_time || 0);

    const avgResponseTime =
      responseTimes.length > 0
        ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
        : 0;
    const minResponseTime = responseTimes.length > 0 ? Math.min(...responseTimes) : 0;
    const maxResponseTime = responseTimes.length > 0 ? Math.max(...responseTimes) : 0;

    const totalIncidents = incidents.length;
    const resolvedIncidents = incidents.filter((i) => i.status === 'resolved').length;
    const activeIncidents = incidents.filter((i) => i.status !== 'resolved').length;

    const busyVehicles = vehicles.filter((v) => v.status !== 'available' && v.status !== 'maintenance').length;
    const vehicleUtilization = vehicles.length > 0 ? (busyVehicles / vehicles.length) * 100 : 0;

    const incidentsByType = {
      medical: incidents.filter((i) => i.type === 'medical').length,
      fire: incidents.filter((i) => i.type === 'fire').length,
      police: incidents.filter((i) => i.type === 'police').length,
    };

    const responseTimesByType = {
      medical: 0,
      fire: 0,
      police: 0,
    };

    completedAssignments.forEach((assignment) => {
      const incident = incidents.find((i) => i.id === assignment.incident_id);
      if (incident && assignment.response_time) {
        responseTimesByType[incident.type] += assignment.response_time;
      }
    });

    Object.keys(responseTimesByType).forEach((type) => {
      const count = completedAssignments.filter((a) => {
        const incident = incidents.find((i) => i.id === a.incident_id);
        return incident?.type === type;
      }).length;
      if (count > 0) {
        responseTimesByType[type as keyof typeof responseTimesByType] /= count;
      }
    });

    return {
      avgResponseTime,
      minResponseTime,
      maxResponseTime,
      totalIncidents,
      resolvedIncidents,
      activeIncidents,
      vehicleUtilization,
      incidentsByType,
      responseTimesByType,
    };
  }, [incidents, vehicles, assignments]);

  const incidentTypeData = [
    { name: 'Medical', value: analytics.incidentsByType.medical, color: COLORS.medical },
    { name: 'Fire', value: analytics.incidentsByType.fire, color: COLORS.fire },
    { name: 'Police', value: analytics.incidentsByType.police, color: COLORS.police },
  ];

  const responseTimeData = [
    { name: 'Medical', time: Math.round(analytics.responseTimesByType.medical) },
    { name: 'Fire', time: Math.round(analytics.responseTimesByType.fire) },
    { name: 'Police', time: Math.round(analytics.responseTimesByType.police) },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
              <p className="text-sm text-muted-foreground">Performance metrics and insights</p>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(analytics.avgResponseTime)} min</div>
              <p className="text-xs text-muted-foreground">
                Min: {analytics.minResponseTime} | Max: {analytics.maxResponseTime}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Incidents</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalIncidents}</div>
              <p className="text-xs text-muted-foreground">
                {analytics.activeIncidents} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved Incidents</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.resolvedIncidents}</div>
              <p className="text-xs text-muted-foreground">
                {analytics.totalIncidents > 0
                  ? Math.round((analytics.resolvedIncidents / analytics.totalIncidents) * 100)
                  : 0}
                % resolution rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vehicle Utilization</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(analytics.vehicleUtilization)}%</div>
              <p className="text-xs text-muted-foreground">
                {vehicles.length} total vehicles
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Incidents by Type</CardTitle>
              <CardDescription>Distribution of emergency types</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={incidentTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {incidentTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Average Response Time by Type</CardTitle>
              <CardDescription>Response time in minutes</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={responseTimeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="time" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Vehicle Status Overview</CardTitle>
            <CardDescription>Current status of all emergency vehicles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['available', 'on_route', 'busy', 'maintenance'].map((status) => {
                const count = vehicles.filter((v) => v.status === status).length;
                return (
                  <div key={status} className="p-4 border rounded-lg">
                    <p className="text-sm font-medium capitalize mb-1">{status.replace('_', ' ')}</p>
                    <p className="text-2xl font-bold">{count}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
