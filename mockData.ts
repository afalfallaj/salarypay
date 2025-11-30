import { Role, User, Employer, Business, Employee, Commitment, Settlement } from './types';

export const MOCK_EMPLOYERS: Employer[] = [
  { id: 'emp1', name: 'TechCorp Solutions', maxDeductionPercent: 30, employeeCount: 150 },
  { id: 'emp2', name: 'Global Logistics', maxDeductionPercent: 20, employeeCount: 400 },
];

export const MOCK_BUSINESSES: Business[] = [
  { id: 'biz1', name: 'FitLife Gym', category: 'Health & Fitness', status: 'Active', revenue: 15000 },
  { id: 'biz2', name: 'City Electronics', category: 'Retail', status: 'Active', revenue: 42000 },
  { id: 'biz3', name: 'Fresh Market', category: 'Groceries', status: 'Suspended', revenue: 0 },
];

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'John Doe', email: 'john@techcorp.com', role: Role.CONSUMER, employerId: 'emp1' },
  { id: 'u2', name: 'Jane Smith', email: 'jane@globallogistics.com', role: Role.CONSUMER, employerId: 'emp2' },
  { id: 'u3', name: 'Sarah HR', email: 'hr@techcorp.com', role: Role.EMPLOYER, employerId: 'emp1' },
  { id: 'u4', name: 'Mike Biz', email: 'owner@fitlifegym.com', role: Role.BUSINESS, businessId: 'biz1' },
  { id: 'u5', name: 'Admin User', email: 'admin@salarypay.com', role: Role.ADMIN },
];

export const MOCK_EMPLOYEES: Employee[] = [
  { id: 'u1', employerId: 'emp1', name: 'John Doe', email: 'john@techcorp.com', salary: 5000, status: 'Enabled', joinedDate: '2023-01-15' },
  { id: 'u2', employerId: 'emp2', name: 'Jane Smith', email: 'jane@globallogistics.com', salary: 4500, status: 'Enabled', joinedDate: '2023-03-10' },
  { id: 'e3', employerId: 'emp1', name: 'Bob Wilson', email: 'bob@techcorp.com', salary: 6000, status: 'Disabled', joinedDate: '2022-11-01' },
];

export const MOCK_COMMITMENTS: Commitment[] = [
  {
    id: 'c1',
    consumerId: 'u1',
    businessId: 'biz1',
    businessName: 'FitLife Gym',
    amount: 50,
    startDate: '2023-06-01',
    nextDeductionDate: '2023-11-01',
    status: 'Active',
    history: [
      { id: 'p1', date: '2023-10-01', amount: 50, status: 'Paid' },
      { id: 'p2', date: '2023-09-01', amount: 50, status: 'Paid' },
    ]
  },
  {
    id: 'c2',
    consumerId: 'u1',
    businessId: 'biz2',
    businessName: 'City Electronics',
    amount: 200,
    startDate: '2023-08-15',
    nextDeductionDate: '2023-11-15',
    status: 'Active',
    history: [
      { id: 'p3', date: '2023-10-15', amount: 200, status: 'Paid' },
    ]
  }
];

export const MOCK_SETTLEMENTS: Settlement[] = [
  { id: 's1', businessId: 'biz1', date: '2023-10-07', amount: 1250, status: 'Paid', itemsCount: 25 },
  { id: 's2', businessId: 'biz1', date: '2023-10-14', amount: 1400, status: 'Pending', itemsCount: 28 },
];
