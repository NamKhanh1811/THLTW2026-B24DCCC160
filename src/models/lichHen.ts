export interface Employee {
  id: number;
  name: string;
  maxPerDay: number;
  workTime: string;
}

export interface Service {
  id: number;
  name: string;
  price: number;
  duration: number;
}

export interface Appointment {
  id: number;
  customer: string;
  employeeId: number;
  serviceId: number;
  date: string;
  time: string;
  status: string;
}

export interface Review {
  id: number;
  employeeId: number;
  rating: number;
  comment: string;
}