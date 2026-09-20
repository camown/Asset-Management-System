export type UserRole = 'admin' | 'finance' | 'technician' | 'employee';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  department: string;
  createdAt: string;
}

export interface Asset {
  id: string;
  name: string;
  serialNumber: string;
  model: string;
  category: string;
  purchaseDate: string;
  purchasePrice: number;
  assignedTo: string | null;
  department: string | null;
  location: string;
  status: 'active' | 'maintenance' | 'retired' | 'disposed';
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Warranty {
  id: string;
  assetId: string;
  provider: string;
  startDate: string;
  endDate: string;
  type: 'standard' | 'extended' | 'premium';
  coverageDetails: string;
  documentUrl: string | null;
  contactInfo: string;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceTask {
  id: string;
  assetId: string;
  title: string;
  description: string;
  type: 'routine' | 'preventive' | 'corrective' | 'emergency';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  scheduledDate: string;
  completedAt: string | null;
  assignedTo: string | null;
  cost: number | null;
  notes: string | null;
  frequencyDays?: number; // Optional recurring maintenance frequency (e.g. 30, 90, 180, 365)
  createdAt: string;
  updatedAt: string;
}

export interface AssetConfiguration {
  id: string;
  assetId: string;
  componentType: 'CPU' | 'RAM' | 'Storage' | 'GPU' | 'OS' | 'Networking' | 'Other';
  componentName: string;
  specification: string;
  quantity: number;
  createdAt: string;
}

export interface DepreciationRecord {
  id: string;
  assetId: string;
  year: number;
  month: number;
  value: number;
  depreciationAmount: number;
  method: 'straight-line' | 'reducing-balance';
  createdAt: string;
}

export interface ComplianceRecord {
  id: string;
  assetId: string;
  type: 'safety' | 'insurance' | 'legal' | 'regulatory';
  status: 'compliant' | 'non-compliant' | 'pending';
  dueDate: string;
  completedDate: string | null;
  notes: string;
  documentUrl: string | null;
  createdAt: string;
  updatedAt: string;
}