/**
 * Calendar Utilities
 * Helper functions for calendar operations
 */

// Get days in month
export const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

// Get first day of month (0 = Sunday, 1 = Monday, etc.)
export const getFirstDayOfMonth = (year, month) => {
  return new Date(year, month, 1).getDay();
};

// Check if date is today
export const isToday = (date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

// Check if date is in the past
export const isPastDate = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  return date < today;
};

// Format date to string
export const formatDate = (date, options = {}) => {
  const defaultOptions = { month: 'short', day: 'numeric' };
  const mergedOptions = { ...defaultOptions, ...options };
  return date.toLocaleDateString(undefined, mergedOptions);
};

// Format time to string
export const formatTime = (date, options = {}) => {
  const defaultOptions = { hour: 'numeric', minute: '2-digit', hour12: true };
  const mergedOptions = { ...defaultOptions, ...options };
  return date.toLocaleTimeString(undefined, mergedOptions);
};

// Format date range
export const formatDateRange = (startDate, endDate, options = {}) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // If same day
  if (
    start.getDate() === end.getDate() &&
    start.getMonth() === end.getMonth() &&
    start.getFullYear() === end.getFullYear()
  ) {
    return `${formatDate(start)} ${formatTime(start)} - ${formatTime(end)}`;
  }
  
  // Different days
  return `${formatDate(start)} - ${formatDate(end)}`;
};

// Get event color based on event type
export const getEventColor = (eventType) => {
  switch (eventType) {
    case 'milestone':
      return '#9c27b0'; // Purple
    case 'task':
      return '#4caf50'; // Green
    case 'deadline':
      return '#f44336'; // Red
    case 'appointment':
      return '#2196f3'; // Blue
    case 'reminder':
      return '#ff9800'; // Orange
    default:
      return '#757575'; // Grey
  }
};

// Get event icon based on event type
export const getEventIcon = (eventType) => {
  switch (eventType) {
    case 'milestone':
      return 'flag';
    case 'task':
      return 'assignment';
    case 'deadline':
      return 'alarm';
    case 'appointment':
      return 'event';
    case 'reminder':
      return 'notifications';
    default:
      return 'event_note';
  }
};

// Get events for a specific day
export const getEventsForDay = (events, date) => {
  if (!events || !Array.isArray(events)) return [];
  
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);
  
  return events.filter(event => {
    if (!event.startDate) return false;
    
    const eventDate = new Date(event.startDate);
    eventDate.setHours(0, 0, 0, 0);
    
    return eventDate.getTime() === targetDate.getTime();
  });
};

// Get events for a specific month
export const getEventsForMonth = (events, year, month) => {
  if (!events || !Array.isArray(events)) return [];
  
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);
  
  return events.filter(event => {
    if (!event.startDate) return false;
    
    const eventDate = new Date(event.startDate);
    return eventDate >= startDate && eventDate <= endDate;
  });
};

// Get upcoming events
export const getUpcomingEvents = (events, days = 30, maxEvents = 5) => {
  if (!events || !Array.isArray(events)) return [];
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + days);
  futureDate.setHours(23, 59, 59, 999);
  
  return events
    .filter(event => {
      if (!event.startDate || event.status === 'completed' || event.status === 'cancelled') return false;
      
      const eventDate = new Date(event.startDate);
      return eventDate >= today && eventDate <= futureDate;
    })
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    .slice(0, maxEvents);
};

// Generate calendar grid for month view
export const generateCalendarGrid = (year, month, events) => {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);
  const grid = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    grid.push({ day: null, events: [] });
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dayEvents = getEventsForDay(events, date);
    grid.push({ day, date, events: dayEvents });
  }
  
  return grid;
};

// Group events by date
export const groupEventsByDate = (events) => {
  if (!events || !Array.isArray(events)) return {};
  
  const grouped = {};
  
  events.forEach(event => {
    if (!event.startDate) return;
    
    const date = new Date(event.startDate);
    const dateKey = date.toISOString().split('T')[0];
    
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    
    grouped[dateKey].push(event);
  });
  
  return grouped;
};

// Sort events by time
export const sortEventsByTime = (events) => {
  if (!events || !Array.isArray(events)) return [];
  
  return [...events].sort((a, b) => {
    if (!a.startDate) return 1;
    if (!b.startDate) return -1;
    
    const aDate = new Date(a.startDate);
    const bDate = new Date(b.startDate);
    
    return aDate - bDate;
  });
};

// Filter events by type
export const filterEventsByType = (events, types) => {
  if (!events || !Array.isArray(events)) return [];
  if (!types || !Array.isArray(types) || types.length === 0) return events;
  
  return events.filter(event => types.includes(event.eventType));
};

// Filter events by priority
export const filterEventsByPriority = (events, priorities) => {
  if (!events || !Array.isArray(events)) return [];
  if (!priorities || !Array.isArray(priorities) || priorities.length === 0) return events;
  
  return events.filter(event => priorities.includes(event.priority));
};

// Filter events by status
export const filterEventsByStatus = (events, statuses) => {
  if (!events || !Array.isArray(events)) return [];
  if (!statuses || !Array.isArray(statuses) || statuses.length === 0) return events;
  
  return events.filter(event => statuses.includes(event.status));
};

// Apply all filters to events
export const applyFilters = (events, filters) => {
  if (!events || !Array.isArray(events)) return [];
  if (!filters) return events;
  
  let filteredEvents = [...events];
  
  if (filters.eventTypes && Array.isArray(filters.eventTypes) && filters.eventTypes.length > 0) {
    filteredEvents = filterEventsByType(filteredEvents, filters.eventTypes);
  }
  
  if (filters.priorities && Array.isArray(filters.priorities) && filters.priorities.length > 0) {
    filteredEvents = filterEventsByPriority(filteredEvents, filters.priorities);
  }
  
  if (filters.statuses && Array.isArray(filters.statuses) && filters.statuses.length > 0) {
    filteredEvents = filterEventsByStatus(filteredEvents, filters.statuses);
  }
  
  return filteredEvents;
};

// Generate ICS file content
export const generateICSContent = (events) => {
  if (!events || !Array.isArray(events)) return '';
  
  const formatICSDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/g, '');
  };
  
  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Visafy//Calendar//EN'
  ];
  
  events.forEach(event => {
    if (!event.startDate) return;
    
    const startDate = formatICSDate(event.startDate);
    const endDate = event.endDate ? formatICSDate(event.endDate) : startDate;
    
    icsContent = icsContent.concat([
      'BEGIN:VEVENT',
      `UID:${event.id}@visafy.com`,
      `DTSTAMP:${formatICSDate(new Date())}`,
      `DTSTART:${startDate}`,
      `DTEND:${endDate}`,
      `SUMMARY:${event.title}`,
      event.description ? `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}` : '',
      event.location ? `LOCATION:${event.location}` : '',
      'END:VEVENT'
    ]);
  });
  
  icsContent.push('END:VCALENDAR');
  
  return icsContent.filter(line => line).join('\r\n');
};

// Download ICS file
export const downloadICSFile = (events, filename = 'visafy-calendar.ics') => {
  const icsContent = generateICSContent(events);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
