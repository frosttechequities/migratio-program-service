import axios from 'axios';
import { getTokenFromLocalStorage } from '../../utils/authUtils';

const ROADMAP_SERVICE_API_URL = process.env.REACT_APP_ROADMAP_SERVICE_URL || 'http://localhost:3006/api';
const USER_SERVICE_API_URL = process.env.REACT_APP_USER_SERVICE_URL || 'http://localhost:3001/api';

const getAuthHeaders = (contentType = 'application/json') => {
  const token = getTokenFromLocalStorage();
  const headers = {
    'Content-Type': contentType,
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

// Get calendar events from roadmap tasks and milestones
const getCalendarEvents = async () => {
  const response = await axios.get(`${ROADMAP_SERVICE_API_URL}/roadmaps/events`, { headers: getAuthHeaders() });
  return response.data;
};

// Export calendar events to iCalendar format
const exportToICalendar = async (options = {}) => {
  const response = await axios.post(`${ROADMAP_SERVICE_API_URL}/roadmaps/export/ical`, options, { 
    headers: getAuthHeaders(), 
    responseType: 'blob' 
  });
  return response.data;
};

// Export calendar events to Google Calendar (MOCK)
const exportToGoogleCalendar = async (events, options = {}) => {
  console.log('Exporting to Google Calendar:', events, options);
  return { success: true, message: 'Events exported to Google Calendar (Mock)', exportedEvents: events.length };
};

// Export calendar events to Outlook Calendar (MOCK)
const exportToOutlookCalendar = async (events, options = {}) => {
  console.log('Exporting to Outlook Calendar:', events, options);
  return { success: true, message: 'Events exported to Outlook Calendar (Mock)', exportedEvents: events.length };
};

// Export calendar events to Apple Calendar
const exportToAppleCalendar = async (options = {}) => {
  const icalData = await exportToICalendar(options); // Uses updated exportToICalendar which handles auth
  const url = window.URL.createObjectURL(new Blob([icalData]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'visafy-calendar.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  return { success: true, message: 'Events exported to Apple Calendar' };
};

// Create a calendar event
const createCalendarEvent = async (eventData) => {
  const response = await axios.post(`${ROADMAP_SERVICE_API_URL}/roadmaps/events`, eventData, { headers: getAuthHeaders() });
  return response.data;
};

// Update a calendar event
const updateCalendarEvent = async (eventId, eventData) => {
  const response = await axios.put(`${ROADMAP_SERVICE_API_URL}/roadmaps/events/${eventId}`, eventData, { headers: getAuthHeaders() });
  return response.data;
};

// Delete a calendar event
const deleteCalendarEvent = async (eventId) => {
  const response = await axios.delete(`${ROADMAP_SERVICE_API_URL}/roadmaps/events/${eventId}`, { headers: getAuthHeaders() });
  return response.data;
};

// Get calendar integrations
const getCalendarIntegrations = async () => {
  const response = await axios.get(`${USER_SERVICE_API_URL}/users/calendar-integrations`, { headers: getAuthHeaders() });
  return response.data;
};

// Add calendar integration
const addCalendarIntegration = async (integrationData) => {
  const response = await axios.post(`${USER_SERVICE_API_URL}/users/calendar-integrations`, integrationData, { headers: getAuthHeaders() });
  return response.data;
};

// Remove calendar integration
const removeCalendarIntegration = async (integrationId) => {
  const response = await axios.delete(`${USER_SERVICE_API_URL}/users/calendar-integrations/${integrationId}`, { headers: getAuthHeaders() });
  return response.data;
};

// Mock data functions remain for now, but thunks will call the actual API functions
const getMockCalendarEvents = () => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  return [
    { id: 'event1', title: 'Submit Language Test Results', eventType: 'deadline', startDate: new Date(currentYear, currentMonth, today.getDate() + 2).toISOString(), endDate: new Date(currentYear, currentMonth, today.getDate() + 2).toISOString(), allDay: true, status: 'scheduled', priority: 'high', color: '#f44336' },
    { id: 'event2', title: 'Medical Examination Appointment', eventType: 'appointment', startDate: new Date(currentYear, currentMonth, today.getDate() + 5, 10, 0).toISOString(), endDate: new Date(currentYear, currentMonth, today.getDate() + 5, 11, 30).toISOString(), allDay: false, status: 'scheduled', priority: 'high', color: '#2196f3' },
  ];
};
const getMockCalendarIntegrations = () => {
  return [{ id: 'integration1', calendarType: 'google', syncEnabled: true }];
};

const calendarService = {
  getCalendarEvents,
  exportToICalendar,
  exportToGoogleCalendar,
  exportToOutlookCalendar,
  exportToAppleCalendar,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
  getCalendarIntegrations,
  addCalendarIntegration,
  removeCalendarIntegration,
  getMockCalendarEvents, // Kept for potential fallback or testing
  getMockCalendarIntegrations // Kept for potential fallback or testing
};

export default calendarService;
