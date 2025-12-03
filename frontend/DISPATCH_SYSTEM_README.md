# Smart Emergency Dispatch System

A comprehensive web-based dispatcher interface for managing real-time emergency incidents in urban areas. The system enables dispatchers to monitor incoming emergencies, assign emergency vehicles dynamically, track vehicle locations on a live map, and coordinate responses across medical, fire, and police departments.

## Features

### 🚨 Real-Time Incident Dashboard
- Display all active incidents with complete details
- Incident lifecycle tracking: reported → assigned → resolved
- Dynamic prioritization based on severity and waiting time
- Advanced filtering by type, status, location, and time range
- Color-coded severity indicators (Critical, High, Medium, Low)

### 🚑 Vehicle Management Interface
- Real-time tracking of all emergency vehicles
- Vehicle status monitoring: available, on route, busy, maintenance
- GPS location tracking with live map updates
- Automatic nearest-vehicle recommendations for assignments
- Vehicle type matching (ambulance, fire truck, police car)

### 🗺️ Interactive Visual Map
- Static city map with overlay markers for testing
- Color-coded incident markers by type and severity
- Real-time vehicle position indicators
- Interactive markers with detailed information
- Map legend and active status counter

### 📋 Assignment Workflow
- Automated assignment recommendations based on:
  - Proximity to incident location
  - Vehicle type matching
  - Current availability status
- Manual override capability for dispatcher approval
- Distance calculation for optimal response
- Transaction-based assignment to prevent conflicts

### 🔔 Real-Time Notifications
- Alert panel for new incidents
- Unassigned emergency notifications
- Status change updates
- System alerts and warnings
- Unread notification counter

### 📊 Analytics Dashboard
- Key Performance Indicators:
  - Average/Min/Max response times
  - Vehicle utilization rates
  - Incident distribution by type
  - Resolution rates
- Interactive charts and visualizations
- Response time analysis by emergency type
- Vehicle status overview

### 🔐 User Authentication
- Role-based access control
- Dispatcher and Admin roles
- Secure session management
- Protected routes
- User registration (Sign Up)

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom emergency theme
- **UI Components**: shadcn/ui component library
- **Map Visualization**: Static map with emoji markers for testing
- **Charts**: Recharts for data visualization
- **State Management**: React Context API
- **Data Persistence**: Browser LocalStorage
- **Routing**: React Router v7
- **Form Handling**: React Hook Form with Zod validation
- **Notifications**: Sonner toast notifications

## Getting Started

### Creating a New Account

1. Click "Sign up" on the login page
2. Choose a username (letters, numbers, and underscores only)
3. Create a password (minimum 6 characters)
4. Confirm your password
5. Click "Sign Up" to create your account
6. You'll be redirected to the login page

### Login Credentials

**Demo Accounts:**

**Dispatcher Account:**
- Username: `dispatcher1`
- Password: `password123`

**Admin Account:**
- Username: `admin`
- Password: `password123`

**Or create your own account using the Sign Up page!**

### Initial Data

The system is pre-loaded with:
- 5 sample incidents (various types and severities)
- 8 emergency vehicles (ambulances, fire trucks, police cars)
- Real-time simulation of new incidents (every 30 seconds)
- Automatic vehicle location updates

## User Guide

### Dashboard Overview

The main dashboard features a split-screen layout:

**Left Panel (Incident List):**
- Search bar for filtering incidents
- Type filter (Medical, Fire, Police)
- Status filter (Reported, Assigned, Resolved)
- Scrollable list of incident cards
- Quick action buttons (Assign, Resolve)

**Right Panel (Map View):**
- Static city map showing all active incidents and vehicles
- Emoji markers for incidents and vehicles
- Click on markers for detailed information
- Map legend in bottom-left corner
- Active incidents counter in top-right corner

**Top Header:**
- Active incidents counter
- Notifications bell with unread count
- Analytics button (admin only)
- User profile and logout

### Managing Incidents

1. **View Incident Details**: Click on any incident card to see full information
2. **Assign Vehicle**: 
   - Click "Assign" button on reported incidents
   - System recommends nearest available vehicles
   - Select vehicle and confirm assignment
3. **Resolve Incident**: Click "Resolve" button on assigned incidents
4. **Filter Incidents**: Use search and filter controls to find specific incidents

### Vehicle Assignment

The system automatically:
- Matches vehicle type to incident type (ambulance for medical, etc.)
- Calculates distance from vehicle to incident
- Sorts vehicles by proximity
- Shows only available vehicles
- Prevents double-booking

### Notifications

- New incident alerts appear automatically
- Click notification bell to view all alerts
- Click individual notifications to mark as read
- Unread count displayed on bell icon

### Analytics (Admin Only)

Access comprehensive performance metrics:
- Response time statistics
- Incident distribution charts
- Vehicle utilization rates
- Resolution rates
- Historical data analysis

## Color Coding

The system uses an intuitive color scheme:

**Incident Severity:**
- 🔴 Critical: Red (#D32F2F)
- 🟠 High: Orange (Destructive)
- 🟡 Medium: Orange (#FF9800)
- ⚪ Low: Gray (Muted)

**Incident Status:**
- 🟡 Reported: Warning (Orange)
- 🔵 Assigned: Primary (Blue)
- 🟢 Resolved: Success (Green)

**Vehicle Status:**
- 🟢 Available: Success (Green)
- 🔵 On Route: Primary (Blue)
- 🟡 Busy: Warning (Orange)
- ⚪ Maintenance: Muted (Gray)

## Map Markers

**Incident Icons:**
- Medical: 🚨 (critical), 🏥 (high), ⚕️ (medium), 🩹 (low)
- Fire: 🔥 (critical/high), 🧯 (medium), 💨 (low)
- Police: 🚔 (critical), 🚓 (high), 👮 (medium), 🚦 (low)

**Vehicle Icons:**
- Ambulance: 🚑
- Fire Truck: 🚒
- Police Car: 🚓

## Real-Time Features

The system simulates real-time updates:
- New incidents generated every 30 seconds (70% probability)
- Vehicle locations update automatically when on route
- Notifications appear instantly for new events
- Map markers update in real-time

## Data Persistence

All data is stored in browser LocalStorage:
- Incidents
- Vehicles
- Assignments
- Notifications
- User sessions
- User accounts

Data persists across browser sessions until cleared.

## Browser Compatibility

Tested and optimized for:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Responsive Design

- Desktop-first design optimized for 1920x1080 and 1366x768
- Tablet support with responsive breakpoints
- Mobile-friendly layouts for smaller screens

## Important Notes

⚠️ **Static Map**: This version uses a static city map image with overlay markers for testing purposes. For production deployment with interactive maps (Leaflet, Mapbox, Google Maps), please contact Miaoda official support.

⚠️ **Supabase Backend**: This implementation uses LocalStorage instead of Supabase due to service unavailability. For production deployment with real backend integration, please contact Miaoda official support.

## Support

For technical support or questions about backend integration, please contact Miaoda official support team.

---

**System Version**: 1.0.0  
**Last Updated**: December 2025  
**License**: Proprietary
