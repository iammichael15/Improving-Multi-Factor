export interface User {
  id: string;
  email: string;
  technical_proficiency: 'beginner' | 'intermediate' | 'advanced';
  age_group: '18-25' | '26-40' | '41+';
}

export interface KeystrokeData {
  sessionId: string;
  timestamp: number;
  key: string;
  eventType: 'keydown' | 'keyup';
  dwellTime?: number;
  flightTime?: number;
  taskType: 'login' | 'form' | 'interactive' | 'browsing';
}

export interface MouseData {
  sessionId: string;
  timestamp: number;
  x: number;
  y: number;
  eventType: 'move' | 'click';
  speed?: number;
  acceleration?: number;
  taskType: 'login' | 'form' | 'interactive' | 'browsing';
}

export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  occupation: string;
}

export interface TaskCompletion {
  taskType: 'login' | 'form' | 'interactive' | 'browsing';
  completionTime: number;
  sessionId: string;
}