import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Clock, CheckCircle, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import './Analytics.css';

const COLORS = {
  medical: '#3b82f6',
  fire: '#ef4444',
  police: '#8b5cf6',
};

export default function Analytics() {
  const navigate = useNavigate();
  
  // Mock data - replace with your actual data fetching logic
  const [incidents, setIncidents] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    // Fetch your data here
    // For now using empty arrays
  }, []);

  const analytics = useMemo(() => {
    const safeIncidents = incidents || [];
    const safeVehicles = vehicles || [];
    const safeAssignments = assignments || [];

    const completedAssignments = safeAssignments.filter((a) => a.completed_at && a.response_time);
    const responseTimes = completedAssignments.map((a) => a.response_time || 0);

    const avgResponseTime =
      responseTimes.length > 0
        ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
        : 0;
    const minResponseTime = responseTimes.length > 0 ? Math.min(...responseTimes) : 0;
    const maxResponseTime = responseTimes.length > 0 ? Math.max(...responseTimes) : 0;

    const totalIncidents = safeIncidents.length;
    const resolvedIncidents = safeIncidents.filter((i) => i.status === 'resolved').length;
    const activeIncidents = safeIncidents.filter((i) => i.status !== 'resolved').length;

    const busyVehicles = safeVehicles.filter((v) => v.status !== 'available' && v.status !== 'maintenance').length;
    const vehicleUtilization = safeVehicles.length > 0 ? (busyVehicles / safeVehicles.length) * 100 : 0;

    const incidentsByType = {
      medical: safeIncidents.filter((i) => i.type === 'medical').length,
      fire: safeIncidents.filter((i) => i.type === 'fire').length,
      police: safeIncidents.filter((i) => i.type === 'police').length,
    };

    const responseTimesByType = {
      medical: 0,
      fire: 0,
      police: 0,
    };

    const countByType = {
      medical: 0,
      fire: 0,
      police: 0,
    };

    completedAssignments.forEach((assignment) => {
      const incident = safeIncidents.find((i) => i.id === assignment.incident_id);
      if (incident && assignment.response_time) {
        const type = incident.type;
        if (type === 'medical' || type === 'fire' || type === 'police') {
          responseTimesByType[type] += assignment.response_time;
          countByType[type] += 1;
        }
      }
    });

    Object.keys(responseTimesByType).forEach((type) => {
      const key = type;
      if (countByType[key] > 0) {
        responseTimesByType[key] = responseTimesByType[key] / countByType[key];
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

  // Custom label for pie chart that's responsive
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    if (percent === 0) return null;

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="analytics-container">
      <header className="analytics-header">
        <div className="header-content">
          <div className="header-left">
            <button className="back-button" onClick={() => navigate('/')} aria-label="Go back">
              <ArrowLeft className="icon" />
            </button>
            <div>
              <h1 className="header-title">Analytics Dashboard</h1>
              <p className="header-subtitle">Performance metrics and insights</p>
            </div>
          </div>
        </div>
      </header>

      <div className="analytics-content">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="card-header">
              <span className="card-title">Avg Response Time</span>
              <Clock className="card-icon" />
            </div>
            <div className="card-content">
              <div className="stat-value">{Math.round(analytics.avgResponseTime)} min</div>
              <p className="stat-description">
                Min: {analytics.minResponseTime} | Max: {analytics.maxResponseTime}
              </p>
            </div>
          </div>

          <div className="stat-card">
            <div className="card-header">
              <span className="card-title">Total Incidents</span>
              <TrendingUp className="card-icon" />
            </div>
            <div className="card-content">
              <div className="stat-value">{analytics.totalIncidents}</div>
              <p className="stat-description">
                {analytics.activeIncidents} active
              </p>
            </div>
          </div>

          <div className="stat-card">
            <div className="card-header">
              <span className="card-title">Resolved Incidents</span>
              <CheckCircle className="card-icon" />
            </div>
            <div className="card-content">
              <div className="stat-value">{analytics.resolvedIncidents}</div>
              <p className="stat-description">
                {analytics.totalIncidents > 0
                  ? Math.round((analytics.resolvedIncidents / analytics.totalIncidents) * 100)
                  : 0}
                % resolution rate
              </p>
            </div>
          </div>

          <div className="stat-card">
            <div className="card-header">
              <span className="card-title">Vehicle Utilization</span>
              <Activity className="card-icon" />
            </div>
            <div className="card-content">
              <div className="stat-value">{Math.round(analytics.vehicleUtilization)}%</div>
              <p className="stat-description">
                {vehicles?.length || 0} total vehicles
              </p>
            </div>
          </div>
        </div>

        <div className="charts-grid">
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Incidents by Type</h3>
              <p className="chart-description">Distribution of emergency types</p>
            </div>
            <div className="chart-content">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={incidentTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomLabel}
                    outerRadius="70%"
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {incidentTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend 
                    wrapperStyle={{ fontSize: '12px' }}
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Average Response Time by Type</h3>
              <p className="chart-description">Response time in minutes</p>
            </div>
            <div className="chart-content">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={responseTimeData}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    stroke="#666"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    stroke="#666"
                    label={{ value: 'Minutes', angle: -90, position: 'insideLeft', fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ fontSize: '12px' }}
                    cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                  />
                  <Bar 
                    dataKey="time" 
                    fill="#222222"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="vehicle-card">
          <div className="chart-header">
            <h3 className="chart-title">Vehicle Status Overview</h3>
            <p className="chart-description">Current status of all emergency vehicles</p>
          </div>
          <div className="vehicle-grid">
            {['available', 'on_route', 'busy', 'maintenance'].map((status) => {
              const count = (vehicles || []).filter((v) => v.status === status).length;
              return (
                <div key={status} className="vehicle-status-box">
                  <p className="status-label">{status.replace('_', ' ')}</p>
                  <p className="status-count">{count}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}