export enum Role {
  CONSUMER = 'CONSUMER',
  EMPLOYER = 'EMPLOYER',
  BUSINESS = 'BUSINESS',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  employerId?: string; // For consumers
  businessId?: string; // For business users
}

export interface Employer {
  id: string;
  name: string;
  maxDeductionPercent: number;
  employeeCount: number;
  logo?: string;
}

export interface Business {
  id: string;
  name: string;
  category: string;
  status: 'Active' | 'Suspended' | 'Pending';
  revenue: number;
}

export interface Employee {
  id: string;
  employerId: string;
  name: string;
  email: string;
  salary: number;
  status: 'Enabled' | 'Disabled';
  joinedDate: string;
}

export interface Commitment {
  id: string;
  consumerId: string;
  businessId: string;
  businessName: string;
  amount: number;
  startDate: string;
  nextDeductionDate: string;
  status: 'Active' | 'Cancelled' | 'Completed';
  history: PaymentRecord[];
}

export interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  status: 'Paid' | 'Failed' | 'Pending';
}

export interface Settlement {
  id: string;
  businessId: string;
  date: string;
  amount: number;
  status: 'Paid' | 'Pending';
  itemsCount: number;
}
