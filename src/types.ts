export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  imageUrl: string;
  experience: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  date: Date;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

export interface Subscription {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  features: string[];
}

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}