import type { Incident, Vehicle, Assignment, User, Notification } from '@/types';
import { INITIAL_INCIDENTS, INITIAL_VEHICLES, MOCK_USERS } from './mockData';

const STORAGE_KEYS = {
  INCIDENTS: 'dispatch_incidents',
  VEHICLES: 'dispatch_vehicles',
  ASSIGNMENTS: 'dispatch_assignments',
  USERS: 'dispatch_users',
  CURRENT_USER: 'dispatch_current_user',
  NOTIFICATIONS: 'dispatch_notifications',
};

export const localStorageService = {
  initializeData() {
    if (!localStorage.getItem(STORAGE_KEYS.INCIDENTS)) {
      localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(INITIAL_INCIDENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.VEHICLES)) {
      localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(INITIAL_VEHICLES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS)) {
      localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(MOCK_USERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]));
    }
  },

  getIncidents(): Incident[] {
    const data = localStorage.getItem(STORAGE_KEYS.INCIDENTS);
    return data ? JSON.parse(data) : [];
  },

  saveIncidents(incidents: Incident[]) {
    localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(incidents));
  },

  addIncident(incident: Incident) {
    const incidents = this.getIncidents();
    incidents.push(incident);
    this.saveIncidents(incidents);
  },

  updateIncident(id: string, updates: Partial<Incident>) {
    const incidents = this.getIncidents();
    const index = incidents.findIndex((i) => i.id === id);
    if (index !== -1) {
      incidents[index] = { ...incidents[index], ...updates };
      this.saveIncidents(incidents);
    }
  },

  getVehicles(): Vehicle[] {
    const data = localStorage.getItem(STORAGE_KEYS.VEHICLES);
    return data ? JSON.parse(data) : [];
  },

  saveVehicles(vehicles: Vehicle[]) {
    localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles));
  },

  updateVehicle(id: string, updates: Partial<Vehicle>) {
    const vehicles = this.getVehicles();
    const index = vehicles.findIndex((v) => v.id === id);
    if (index !== -1) {
      vehicles[index] = { ...vehicles[index], ...updates };
      this.saveVehicles(vehicles);
    }
  },

  getAssignments(): Assignment[] {
    const data = localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
    return data ? JSON.parse(data) : [];
  },

  saveAssignments(assignments: Assignment[]) {
    localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments));
  },

  addAssignment(assignment: Assignment) {
    const assignments = this.getAssignments();
    assignments.push(assignment);
    this.saveAssignments(assignments);
  },

  updateAssignment(id: string, updates: Partial<Assignment>) {
    const assignments = this.getAssignments();
    const index = assignments.findIndex((a) => a.id === id);
    if (index !== -1) {
      assignments[index] = { ...assignments[index], ...updates };
      this.saveAssignments(assignments);
    }
  },

  getUsers(): User[] {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : [];
  },

  getCurrentUser(): User | null {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  },

  setCurrentUser(user: User | null) {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  getNotifications(): Notification[] {
    const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return data ? JSON.parse(data) : [];
  },

  saveNotifications(notifications: Notification[]) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  },

  addNotification(notification: Notification) {
    const notifications = this.getNotifications();
    notifications.unshift(notification);
    if (notifications.length > 50) {
      notifications.pop();
    }
    this.saveNotifications(notifications);
  },

  markNotificationAsRead(id: string) {
    const notifications = this.getNotifications();
    const index = notifications.findIndex((n) => n.id === id);
    if (index !== -1) {
      notifications[index].read = true;
      this.saveNotifications(notifications);
    }
  },

  clearAllData() {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  },
};
