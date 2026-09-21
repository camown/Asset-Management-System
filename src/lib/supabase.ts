import { User, Asset, Warranty, MaintenanceTask, ComplianceRecord, DepreciationRecord, AssetConfiguration } from '../types';

// ============================================================================
// Local Storage & In-Memory Mock Store for Zero-Setup Offline Demo
// ============================================================================

export const DEFAULT_USER = {
  id: 'demo-user-1',
  email: 'admin@company.com',
  role: 'admin' as const,
  firstName: 'IT',
  lastName: 'Administrator',
  department: 'Information Technology',
  createdAt: new Date('2024-01-01').toISOString(),
};

const addDays = (d: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + d);
  return dt.toISOString().split('T')[0];
};

const DEFAULT_ASSETS: Asset[] = [
  {
    id: 'RAM-001',
    name: 'RAM-001',
    serialNumber: 'S/N-EPMH0872222',
    model: 'RAM',
    category: 'Memory (RAM)',
    storage: '8GB',
    assignedTo: 'FREE',
    department: 'IT Hardware',
    location: 'Warehouse / Storage',
    status: 'active',
    purchaseDate: '2024-01-01',
    purchasePrice: 0,
    notes: 'Working',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'RAM-002',
    name: 'RAM-002',
    serialNumber: 'S/N-CMK16GX4M2A2400C14',
    model: 'RAM',
    category: 'Memory (RAM)',
    storage: '16GB',
    assignedTo: 'FREE',
    department: 'IT Hardware',
    location: 'Warehouse / Storage',
    status: 'maintenance',
    purchaseDate: '2024-01-01',
    purchasePrice: 0,
    notes: 'Not working',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'RAM-003',
    name: 'RAM-003',
    serialNumber: 'S/N-EPMH0862201',
    model: 'RAM',
    category: 'Memory (RAM)',
    storage: '8GB',
    assignedTo: 'FREE',
    department: 'IT Hardware',
    location: 'Warehouse / Storage',
    status: 'active',
    purchaseDate: '2024-01-01',
    purchasePrice: 0,
    notes: 'Working',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'RAM-004',
    name: 'RAM-004',
    serialNumber: 'S/N-25273729538',
    model: 'RAM',
    category: 'Memory (RAM)',
    storage: '16GB',
    assignedTo: 'FREE',
    department: 'IT Hardware',
    location: 'Warehouse / Storage',
    status: 'maintenance',
    purchaseDate: '2024-01-01',
    purchasePrice: 0,
    notes: 'Not working',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'RAM-005',
    name: 'RAM-005',
    serialNumber: 'S/N-25273729537',
    model: 'RAM',
    category: 'Memory (RAM)',
    storage: '16GB',
    assignedTo: 'FREE',
    department: 'IT Hardware',
    location: 'Warehouse / Storage',
    status: 'active',
    purchaseDate: '2024-01-01',
    purchasePrice: 0,
    notes: 'Working',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'RAM-006',
    name: 'RAM-006',
    serialNumber: 'S/N-56190710062',
    model: 'RAM',
    category: 'Memory (RAM)',
    storage: '16GB',
    assignedTo: 'FREE',
    department: 'IT Hardware',
    location: 'Warehouse / Storage',
    status: 'maintenance',
    purchaseDate: '2024-01-01',
    purchasePrice: 0,
    notes: 'Not working',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'SSD-001',
    name: 'SSD-001',
    serialNumber: 'S/N-M27LN250',
    model: 'SSD',
    category: 'Storage (SSD)',
    storage: '256 SSD',
    assignedTo: 'FREE',
    department: 'IT Hardware',
    location: 'Warehouse / Storage',
    status: 'active',
    purchaseDate: '2024-01-01',
    purchasePrice: 0,
    notes: 'Working',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'RAM-007',
    name: 'RAM-007',
    serialNumber: 'S/N-K002674',
    model: 'RAM',
    category: 'Memory (RAM)',
    storage: '16GB',
    assignedTo: 'FREE',
    department: 'IT Hardware',
    location: 'Warehouse / Storage',
    status: 'maintenance',
    purchaseDate: '2024-01-01',
    purchasePrice: 0,
    notes: 'Not working',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'RAM-008',
    name: 'RAM-008',
    serialNumber: 'S/N-K002862',
    model: 'RAM',
    category: 'Memory (RAM)',
    storage: '16GB',
    assignedTo: 'FREE',
    department: 'IT Hardware',
    location: 'Warehouse / Storage',
    status: 'maintenance',
    purchaseDate: '2024-01-01',
    purchasePrice: 0,
    notes: 'Not working',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'RAM-009',
    name: 'RAM-009',
    serialNumber: 'S/N-KVR24N1S8',
    model: 'RAM',
    category: 'Memory (RAM)',
    storage: '16GB',
    assignedTo: 'FREE',
    department: 'IT Hardware',
    location: 'Warehouse / Storage',
    status: 'maintenance',
    purchaseDate: '2024-01-01',
    purchasePrice: 0,
    notes: 'Not working',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'RAM-010',
    name: 'RAM-010',
    serialNumber: 'RAM-0018',
    model: 'RAM',
    category: 'Memory (RAM)',
    storage: '16GB',
    assignedTo: 'FREE',
    department: 'IT Hardware',
    location: 'Warehouse / Storage',
    status: 'maintenance',
    purchaseDate: '2024-01-01',
    purchasePrice: 0,
    notes: 'Not working',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'MOUSE-001',
    name: 'MOUSE-001',
    serialNumber: 'S/N-551230N500A1657',
    model: 'Mouse',
    category: 'Peripherals',
    storage: 'NA',
    assignedTo: 'FREE',
    department: 'IT Hardware',
    location: 'Warehouse / Storage',
    status: 'active',
    purchaseDate: '2024-01-01',
    purchasePrice: 0,
    notes: 'Working',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'MOUSE-002',
    name: 'MOUSE-002',
    serialNumber: 'S/N-551230N500A1655',
    model: 'Mouse',
    category: 'Peripherals',
    storage: 'NA',
    assignedTo: 'FREE',
    department: 'IT Hardware',
    location: 'Warehouse / Storage',
    status: 'active',
    purchaseDate: '2024-01-01',
    purchasePrice: 0,
    notes: 'Working',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'MOUSE-003',
    name: 'MOUSE-003',
    serialNumber: 'S/N-2516APPFEMX8',
    model: 'Mouse',
    category: 'Peripherals',
    storage: 'NA',
    assignedTo: 'FREE',
    department: 'IT Hardware',
    location: 'Warehouse / Storage',
    status: 'active',
    purchaseDate: '2024-01-01',
    purchasePrice: 0,
    notes: 'Working',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'MOUSE-004',
    name: 'MOUSE-004',
    serialNumber: 'S/N-551230N500A1658',
    model: 'Mouse',
    category: 'Peripherals',
    storage: 'NA',
    assignedTo: 'FREE',
    department: 'IT Hardware',
    location: 'Warehouse / Storage',
    status: 'active',
    purchaseDate: '2024-01-01',
    purchasePrice: 0,
    notes: 'Working',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'SSD-002',
    name: 'SSD-002',
    serialNumber: 'S/N-S3Y9NX0K656475X',
    model: 'SSD',
    category: 'Storage (SSD)',
    storage: '256 SSD',
    assignedTo: 'FREE',
    department: 'IT Hardware',
    location: 'Warehouse / Storage',
    status: 'active',
    purchaseDate: '2024-01-01',
    purchasePrice: 0,
    notes: 'Working',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'HDD-001',
    name: 'HDD-001',
    serialNumber: 'S/N-WK3032NB',
    model: 'HDD',
    category: 'Storage (HDD)',
    storage: '2TB HDD',
    assignedTo: 'FREE',
    department: 'IT Hardware',
    location: 'Warehouse / Storage',
    status: 'maintenance',
    purchaseDate: '2024-01-01',
    purchasePrice: 0,
    notes: 'Not working',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'HDD-002',
    name: 'HDD-002',
    serialNumber: 'S/N-WMC6NOP6W4V4',
    model: 'HDD',
    category: 'Storage (HDD)',
    storage: '2TB HDD',
    assignedTo: 'FREE',
    department: 'IT Hardware',
    location: 'Warehouse / Storage',
    status: 'maintenance',
    purchaseDate: '2024-01-01',
    purchasePrice: 0,
    notes: 'Not working',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'SSD-003',
    name: 'SSD-003',
    serialNumber: 'S/N-172344421488',
    model: 'SSD',
    category: 'Storage (SSD)',
    storage: '256 SSD',
    assignedTo: 'FREE',
    department: 'IT Hardware',
    location: 'Warehouse / Storage',
    status: 'active',
    purchaseDate: '2024-01-01',
    purchasePrice: 0,
    notes: 'Working',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'KB-001',
    name: 'KB-001',
    serialNumber: 'LOGITECH',
    model: 'Keyboard',
    category: 'Peripherals',
    storage: 'NA',
    assignedTo: 'FREE',
    department: 'IT Hardware',
    location: 'Warehouse / Storage',
    status: 'active',
    purchaseDate: '2024-01-01',
    purchasePrice: 0,
    notes: 'Working',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'KB-002',
    name: 'KB-002',
    serialNumber: 'LOGITECH',
    model: 'Keyboard',
    category: 'Peripherals',
    storage: 'NA',
    assignedTo: 'FREE',
    department: 'IT Hardware',
    location: 'Warehouse / Storage',
    status: 'active',
    purchaseDate: '2024-01-01',
    purchasePrice: 0,
    notes: 'Working',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'KB-003',
    name: 'KB-003',
    serialNumber: 'MSI',
    model: 'Keyboard',
    category: 'Peripherals',
    storage: 'NA',
    assignedTo: 'FREE',
    department: 'IT Hardware',
    location: 'Warehouse / Storage',
    status: 'active',
    purchaseDate: '2024-01-01',
    purchasePrice: 0,
    notes: 'Working',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'KB-004',
    name: 'KB-004',
    serialNumber: 'LOGITECH',
    model: 'Keyboard',
    category: 'Peripherals',
    storage: 'NA',
    assignedTo: 'FREE',
    department: 'IT Hardware',
    location: 'Warehouse / Storage',
    status: 'active',
    purchaseDate: '2024-01-01',
    purchasePrice: 0,
    notes: 'Working',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'KB-005',
    name: 'KB-005',
    serialNumber: 'LOGITECH',
    model: 'Keyboard',
    category: 'Peripherals',
    storage: 'NA',
    assignedTo: 'FREE',
    department: 'IT Hardware',
    location: 'Warehouse / Storage',
    status: 'active',
    purchaseDate: '2024-01-01',
    purchasePrice: 0,
    notes: 'Working',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'KB-006',
    name: 'KB-006',
    serialNumber: 'LOGITECH',
    model: 'Keyboard',
    category: 'Peripherals',
    storage: 'NA',
    assignedTo: 'FREE',
    department: 'IT Hardware',
    location: 'Warehouse / Storage',
    status: 'active',
    purchaseDate: '2024-01-01',
    purchasePrice: 0,
    notes: 'Working',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'KB-007',
    name: 'KB-007',
    serialNumber: 'LOGITECH',
    model: 'Keyboard',
    category: 'Peripherals',
    storage: 'NA',
    assignedTo: 'FREE',
    department: 'IT Hardware',
    location: 'Warehouse / Storage',
    status: 'active',
    purchaseDate: '2024-01-01',
    purchasePrice: 0,
    notes: 'Working',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // ==================== COMPUTER SPECIFICATION LIST (PC-01 to PC-32 + CONFERENCE) ====================
  {
    id: 'PC-01',
    name: 'PC-01',
    serialNumber: 'SN-PC01-WORKSTATION',
    model: 'Custom Workstation PC',
    category: 'Workstations',
    assignedTo: 'Mogu',
    gpu: '4060',
    cpu: 'i5-8400',
    ram: '32 GB',
    monitorQty: 2,
    monitorSize: '24" + 22"',
    keyboardStatus: 'GOOD',
    mouseStatus: 'GOOD',
    department: 'Design & Engineering',
    location: 'Office Floor 1',
    status: 'active',
    purchaseDate: '2024-01-01',
    purchasePrice: 0,
    notes: 'only has 233 GB SSD. CPU performance is bottlenecked by 25% in compatibility with the GPU',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'PC-02',
    name: 'PC-02',
    serialNumber: 'SN-PC02-WORKSTATION',
    model: 'Custom Workstation PC',
    category: 'Workstations',
    assignedTo: 'Iyeng',
    gpu: '4060 Ti',
    cpu: 'r5-7600x',
    ram: '64 GB',
    monitorQty: 1,
    monitorSize: '27"',
    keyboardStatus: 'GOOD',
    mouseStatus: 'GOOD',
    department: 'Design & Engineering',
    location: 'Office Floor 1',
    status: 'active',
    purchaseDate: '2024-01-01',
    purchasePrice: 0,
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'PC-03',
    name: 'PC-03',
    serialNumber: 'SN-PC03-WORKSTATION',
    model: 'Custom Workstation PC',
    category: 'Workstations',
    assignedTo: 'Gladyrn',
    gpu: '4060 Ti',
    cpu: 'i5-14600kf',
    ram: '32 GB',
    monitorQty: 2,
    monitorSize: '24" + 27"',
    keyboardStatus: 'GOOD',
    mouseStatus: 'GOOD',
    department: 'Design & Engineering',
    location: 'Office Floor 1',
    status: 'active',
    purchaseDate: '2024-01-01',
    purchasePrice: 0,
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'PC-04',
    name: 'PC-04',
    serialNumber: 'SN-PC04-WORKSTATION',
    model: 'Custom Workstation PC',
    category: 'Workstations',
    assignedTo: 'Reinier',
    gpu: '4060 Ti',
    cpu: 'i5-14600kf',
    ram: '32 GB',
    monitorQty: 2,
    monitorSize: '27" + 27"',
    keyboardStatus: 'GOOD',
    mouseStatus: 'GOOD',
    department: 'Design & Engineering',
    location: 'Office Floor 1',
    status: 'active',
    purchaseDate: '2024-01-01',
    purchasePrice: 0,
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'PC-05',
    name: 'PC-05',
    serialNumber: 'SN-PC05-WORKSTATION',
    model: 'Custom Workstation PC',
    category: 'Workstations',
    assignedTo: 'Mika',
    gpu: '1050 Ti',
    cpu: 'i5-8400',
    ram: '16 GB',
    monitorQty: 1,
    monitorSize: '34"',
    keyboardStatus: 'GOOD',
    mouseStatus: 'GOOD',
    department: 'Design & Engineering',
    location: 'Office Floor 1',
    status: 'active',
    purchaseDate: '2024-01-01',
    purchasePrice: 0,
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'PC-06',
    name: 'PC-06',
    serialNumber: 'SN-PC06-WORKSTATION',
    model: 'Custom Workstation PC',
    category: 'Workstations',
    assignedTo: 'Emilio',
    gpu: '5070 Ti',
    cpu: 'r9-5900x',
    ram: '64 GB',
    monitorQty: 1,
    monitorSize: '34"',
    keyboardStatus: 'GOOD',
    mouseStatus: 'GOOD',
    department: 'Design & Engineering',
    location: 'Office Floor 1',
    status: 'active',
    purchaseDate: '2024-01-01',
    purchasePrice: 0,
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'PC-07',
    name: 'PC-07',
    serialNumber: 'SN-PC07-WORKSTATION',
    model: 'Custom Workstation PC',
    category: 'Workstations',
    assignedTo: 'Einstein',
    gpu: '1650',
    cpu: 'r5-3600x',
    ram: '16 GB',
    monitorQty: 1,
    monitorSize: '27"',
    keyboardStatus: 'GOOD',
    mouseStatus: 'GOOD',
    department: 'Design & Engineering',
    location: 'Office Floor 1',
    status: 'active',
    purchaseDate: '2024-01-01',
    purchasePrice: 0,
    notes: 'all parts',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'PC-08',
    name: 'PC-08',
    serialNumber: 'SN-PC08-WORKSTATION',
    model: 'Custom Workstation PC',
    category: 'Workstations',
    assignedTo: 'Lib',
    gpu: '4060 Ti',
    cpu: 'r5-7600',
    ram: '32 GB',
    monitorQty: 1,
    monitorSize: '24"',
    keyboardStatus: 'GOOD',
    mouseStatus: 'GOOD',
    department: 'Design & Engineering',
    location: 'Office Floor 1',
    status: 'active',
    purchaseDate: '2024-01-01',
    purchasePrice: 0,
    notes: 'Pls upgrade monitor & GPU, cannot keep Revit & Enscape simultaneously open (either app crashes)',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'PC-09',
    name: 'PC-09',
    serialNumber: 'SN-PC09-WORKSTATION',
    model: 'Custom Workstation PC',
    category: 'Workstations',
    assignedTo: 'Frances',
    gpu: '3060 Ti',
    cpu: 'r5-5600',
    ram: '64 GB',
    monitorQty: 1,
    monitorSize: '24"',
    keyboardStatus: 'GOOD',
    mouseStatus: 'GOOD',
    department: 'Design & Engineering',
    location: 'Office Floor 1',
    status: 'active',
    purchaseDate: '2024-01-01',
    purchasePrice: 0,
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'PC-10',
    name: 'PC-10',
    serialNumber: 'SN-PC10-WORKSTATION',
    model: 'Custom Workstation PC',
    category: 'Workstations',
    assignedTo: 'Rico',
    gpu: '3080',
    cpu: 'i7-7700k',
    ram: '16 GB',
    monitorQty: 2,
    monitorSize: '24" + 27"',
    keyboardStatus: 'GOOD',
    mouseStatus: 'GOOD',
    department: 'Design & Engineering',
    location: 'Office Floor 1',
    status: 'active',
    purchaseDate: '2024-01-01',
    purchasePrice: 0,
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'PC-11',
    name: 'PC-11',
    serialNumber: 'SN-PC11-WORKSTATION',
    model: 'Custom Workstation PC',
    category: 'Workstations',
    assignedTo: 'Carlo',
    gpu: '1080 Ti',
    cpu: 'i7-7700k',
    ram: '16 GB',
    monitorQty: 1,
    monitorSize: '27"',
    keyboardStatus: 'GOOD',
    mouseStatus: 'GOOD',
    department: 'Design & Engineering',
    location: 'Office Floor 1',
    status: 'active',
    purchaseDate: '2024-01-01',
    purchasePrice: 0,
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'PC-12',
    name: 'PC-12',
    serialNumber: 'SN-PC12-WORKSTATION',
    model: 'Custom Workstation PC',
    category: 'Workstations',
    assignedTo: 'Gab Boy',
    gpu: '4060 Ti',
    cpu: 'r5-7600',
    ram: '32 GB',
    monitorQty: 1,
    monitorSize: '27"',
    keyboardStatus: 'REPLACE',
    mouseStatus: 'GOOD',
    department: 'Design & Engineering',
    location: 'Office Floor 1',
    status: 'maintenance',
    purchaseDate: '2024-01-01',
    purchasePrice: 0,
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'PC-13',
    name: 'PC-13',
    serialNumber: 'SN-PC13-WORKSTATION',
    model: 'Custom Workstation PC',
    category: 'Workstations',
    assignedTo: 'Dustin',
    gpu: '4060 Ti',
    cpu: 'r5-7600',
    ram: '32 GB',
    monitorQty: 1,
    monitorSize: '27"',
    keyboardStatus: 'GOOD',
    mouseStatus: 'GOOD',
    department: 'Design & Engineering',
    location: 'Office Floor 1',
    status: 'active',
    purchaseDate: '2024-01-01',
    purchasePrice: 0,
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'PC-14',
    name: 'PC-14',
    serialNumber: 'SN-PC14-WORKSTATION',
    model: 'Custom Workstation PC',
    category: 'Workstations',
    assignedTo: 'Donna',
    gpu: '3060 Ti',
    cpu: 'r5-5600x',
    ram: '32 GB',
    monitorQty: 1,
    monitorSize: '32"',
    keyboardStatus: 'GOOD',
    mouseStatus: 'REPLACE',
    department: 'Design & Engineering',
    location: 'Office Floor 1',
    status: 'maintenance',
    purchaseDate: '2024-01-01',
    purchasePrice: 0,
    notes: 'Pls upgrade :( SKP keeps on lagging !!!! (no matter how small or big the file is HAHAHA)',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'PC-15',
    name: 'PC-15',
    serialNumber: 'SN-PC15-WORKSTATION',
    model: 'Custom Workstation PC',
    category: 'Workstations',
    assignedTo: 'Ielle',
    gpu: '2080 S',
    cpu: 'r7-3700x',
    ram: '32 GB',
    monitorQty: 1,
    monitorSize: '27"',
    keyboardStatus: 'GOOD',
    mouseStatus: 'GOOD',
    department: 'Design & Engineering',
    location: 'Office Floor 1',
    status: 'active',
    purchaseDate: '2024-01-01',
    purchasePrice: 0,
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'PC-16',
    name: 'PC-16',
    serialNumber: 'SN-PC16-WORKSTATION',
    model: 'Custom Workstation PC',
    category: 'Workstations',
    assignedTo: 'Lester',
    gpu: '4060 Ti',
    cpu: 'r5-7600x',
    ram: '32 GB',
    monitorQty: 1,
    monitorSize: '34"',
    keyboardStatus: 'GOOD',
    mouseStatus: 'GOOD',
    department: 'Design & Engineering',
    location: 'Office Floor 1',
    status: 'active',
    purchaseDate: '2024-01-01',
    purchasePrice: 0,
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'PC-17',
    name: 'PC-17',
    serialNumber: 'SN-PC17-WORKSTATION',
    model: 'Custom Workstation PC',
    category: 'Workstations',
    assignedTo: 'Anj',
    gpu: '3060 Ti',
    cpu: 'r5-5600x',
    ram: '32 GB',
    monitorQty: 1,
    monitorSize: '34"',
    keyboardStatus: 'GOOD',
    mouseStatus: 'GOOD',
    department: 'Design & Engineering',
    location: 'Office Floor 1',
    status: 'active',
    purchaseDate: '2024-01-01',
    purchasePrice: 0,
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'PC-18',
    name: 'PC-18',
    serialNumber: 'SN-PC18-WORKSTATION',
    model: 'Custom Workstation PC',
    category: 'Workstations',
    assignedTo: 'Neos',
    gpu: '3060 Ti',
    cpu: 'r5-3600',
    ram: '32 GB',
    monitorQty: 1,
    monitorSize: '34"',
    keyboardStatus: 'GOOD',
    mouseStatus: 'GOOD',
    department: 'Design & Engineering',
    location: 'Office Floor 1',
    status: 'active',
    purchaseDate: '2024-01-01',
    purchasePrice: 0,
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'PC-19',
    name: 'PC-19',
    serialNumber: 'SN-PC19-WORKSTATION',
    model: 'Custom Workstation PC',
    category: 'Workstations',
    assignedTo: 'X',
    gpu: '5060 Ti',
    cpu: 'r7-7900x',
    ram: '16 GB',
    monitorQty: 1,
    monitorSize: '27"',
    keyboardStatus: 'GOOD',
    mouseStatus: 'GOOD',
    department: 'Design & Engineering',
    location: 'Office Floor 1',
    status: 'active',
    purchaseDate: '2024-01-01',
    purchasePrice: 0,
    notes: 'Ram upgrade',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'PC-20',
    name: 'PC-20',
    serialNumber: 'SN-PC20-WORKSTATION',
    model: 'Custom Workstation PC',
    category: 'Workstations',
    assignedTo: 'Anton',
    gpu: '3060 Ti',
    cpu: 'r5-5600x',
    ram: '16 GB',
    monitorQty: 1,
    monitorSize: '24"',
    keyboardStatus: 'GOOD',
    mouseStatus: 'GOOD',
    department: 'Design & Engineering',
    location: 'Office Floor 1',
    status: 'active',
    purchaseDate: '2024-01-01',
    purchasePrice: 0,
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'PC-21',
    name: 'PC-21',
    serialNumber: 'SN-PC21-WORKSTATION',
    model: 'Custom Workstation PC',
    category: 'Workstations',
    assignedTo: 'Poliban',
    gpu: '3060 Ti',
    cpu: 'r5-5600x',
    ram: '32 GB',
    monitorQty: 2,
    monitorSize: '24" + 27"',
    keyboardStatus: 'GOOD',
    mouseStatus: 'GOOD',
    department: 'Design & Engineering',
    location: 'Office Floor 1',
    status: 'active',
    purchaseDate: '2024-01-01',
    purchasePrice: 0,
    notes: 'graphics card upgrade',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'PC-22',
    name: 'PC-22',
    serialNumber: 'SN-PC22-WORKSTATION',
    model: 'Custom Workstation PC',
    category: 'Workstations',
    assignedTo: 'Dani',
    gpu: '5060 Ti',
    cpu: 'r7-9700x',
    ram: '32 GB',
    monitorQty: 2,
    monitorSize: '24" + 27"',
    keyboardStatus: 'GOOD',
    mouseStatus: 'GOOD',
    department: 'Design & Engineering',
    location: 'Office Floor 1',
    status: 'active',
    purchaseDate: '2024-01-01',
    purchasePrice: 0,
    notes: 'hindi po kinakaya i-load ang LON SKP masterfile',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'PC-23',
    name: 'PC-23',
    serialNumber: 'SN-PC23-WORKSTATION',
    model: 'Custom Workstation PC',
    category: 'Workstations',
    assignedTo: 'Je',
    gpu: '2080 S',
    cpu: 'r7-3700x',
    ram: '64 GB',
    monitorQty: 2,
    monitorSize: '24" + 27"',
    keyboardStatus: 'GOOD',
    mouseStatus: 'GOOD',
    department: 'Design & Engineering',
    location: 'Office Floor 1',
    status: 'active',
    purchaseDate: '2024-01-01',
    purchasePrice: 0,
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'PC-24',
    name: 'PC-24',
    serialNumber: 'SN-PC24-WORKSTATION',
    model: 'Custom Workstation PC',
    category: 'Workstations',
    assignedTo: 'Vy',
    gpu: '1070',
    cpu: 'i7-8700',
    ram: '16 GB',
    monitorQty: 2,
    monitorSize: '26" + 26"',
    keyboardStatus: 'GOOD',
    mouseStatus: 'GOOD',
    department: 'Design & Engineering',
    location: 'Office Floor 1',
    status: 'active',
    purchaseDate: '2024-01-01',
    purchasePrice: 0,
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'PC-25',
    name: 'PC-25',
    serialNumber: 'SN-PC25-WORKSTATION',
    model: 'Custom Workstation PC',
    category: 'Workstations',
    assignedTo: 'Telle',
    gpu: '1660',
    cpu: 'i5-10400f',
    ram: '16 GB',
    monitorQty: 1,
    monitorSize: '24"',
    keyboardStatus: 'GOOD',
    mouseStatus: 'GOOD',
    department: 'Design & Engineering',
    location: 'Office Floor 1',
    status: 'active',
    purchaseDate: '2024-01-01',
    purchasePrice: 0,
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'PC-26',
    name: 'PC-26',
    serialNumber: 'SN-PC26-WORKSTATION',
    model: 'Custom Workstation PC',
    category: 'Workstations',
    assignedTo: 'Wendell',
    gpu: '3060 Ti',
    cpu: 'r5-5600x',
    ram: '16 GB',
    monitorQty: 1,
    monitorSize: '27"',
    keyboardStatus: 'GOOD',
    mouseStatus: 'GOOD',
    department: 'Design & Engineering',
    location: 'Office Floor 1',
    status: 'active',
    purchaseDate: '2024-01-01',
    purchasePrice: 0,
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'PC-27',
    name: 'PC-27',
    serialNumber: 'SN-PC27-WORKSTATION',
    model: 'Custom Workstation PC',
    category: 'Workstations',
    assignedTo: 'Sophia 2',
    gpu: '4060 Ti',
    cpu: 'r5-7600x',
    ram: '16 GB',
    monitorQty: 2,
    monitorSize: '24" + 27"',
    keyboardStatus: 'GOOD',
    mouseStatus: 'GOOD',
    department: 'Design & Engineering',
    location: 'Office Floor 1',
    status: 'active',
    purchaseDate: '2024-01-01',
    purchasePrice: 0,
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'PC-28',
    name: 'PC-28',
    serialNumber: 'SN-PC28-WORKSTATION',
    model: 'Custom Workstation PC',
    category: 'Workstations',
    assignedTo: 'Neal',
    gpu: '5060 Ti',
    cpu: 'i5-14600kf',
    ram: '32 GB',
    monitorQty: 2,
    monitorSize: '24" + 4K 27"',
    keyboardStatus: 'GOOD',
    mouseStatus: 'GOOD',
    department: 'Design & Engineering',
    location: 'Office Floor 1',
    status: 'active',
    purchaseDate: '2024-01-01',
    purchasePrice: 0,
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'PC-29',
    name: 'PC-29',
    serialNumber: 'SN-PC29-WORKSTATION',
    model: 'Custom Workstation PC',
    category: 'Workstations',
    assignedTo: 'Chloe',
    gpu: '4060 Ti',
    cpu: 'r5-7600x',
    ram: '32 GB',
    monitorQty: 1,
    monitorSize: '27"',
    keyboardStatus: 'GOOD',
    mouseStatus: 'GOOD',
    department: 'Design & Engineering',
    location: 'Office Floor 1',
    status: 'active',
    purchaseDate: '2024-01-01',
    purchasePrice: 0,
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'PC-30',
    name: 'PC-30',
    serialNumber: 'SN-PC30-WORKSTATION',
    model: 'Custom Workstation PC',
    category: 'Workstations',
    assignedTo: 'Iza',
    gpu: '4060 Ti',
    cpu: 'i5-14600kf',
    ram: '32 GB',
    monitorQty: 1,
    monitorSize: '27"',
    keyboardStatus: 'GOOD',
    mouseStatus: 'GOOD',
    department: 'Design & Engineering',
    location: 'Office Floor 1',
    status: 'active',
    purchaseDate: '2024-01-01',
    purchasePrice: 0,
    notes: 'additional monitor puhleassee',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'PC-31',
    name: 'PC-31',
    serialNumber: 'SN-PC31-WORKSTATION',
    model: 'Custom Workstation PC',
    category: 'Workstations',
    assignedTo: 'Kat',
    gpu: '2080 S',
    cpu: 'r7-3700x',
    ram: '32 GB',
    monitorQty: 1,
    monitorSize: '27"',
    keyboardStatus: 'GOOD',
    mouseStatus: 'GOOD',
    department: 'Design & Engineering',
    location: 'Office Floor 1',
    status: 'active',
    purchaseDate: '2024-01-01',
    purchasePrice: 0,
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'PC-32',
    name: 'PC-32',
    serialNumber: 'SN-PC32-WORKSTATION',
    model: 'Custom Workstation PC',
    category: 'Workstations',
    assignedTo: 'Colleen',
    gpu: '4060',
    cpu: 'r5-2600',
    ram: '16 GB',
    monitorQty: 1,
    monitorSize: '',
    keyboardStatus: 'GOOD',
    mouseStatus: 'GOOD',
    department: 'Design & Engineering',
    location: 'Office Floor 1',
    status: 'active',
    purchaseDate: '2024-01-01',
    purchasePrice: 0,
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'PC-CONFERENCE',
    name: 'CONFERENCE',
    serialNumber: 'SN-CONF-WORKSTATION',
    model: 'Conference Room PC',
    category: 'Workstations',
    assignedTo: 'CONFERENCE',
    gpu: '2070 S',
    cpu: 'i7-7700',
    ram: '32 GB',
    monitorQty: 0,
    monitorSize: 'NA',
    keyboardStatus: 'GOOD',
    mouseStatus: 'GOOD',
    department: 'Operations / Conference',
    location: 'Conference Room',
    status: 'active',
    purchaseDate: '2024-01-01',
    purchasePrice: 0,
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
const DEFAULT_WARRANTIES: Warranty[] = [];
const DEFAULT_MAINTENANCE: MaintenanceTask[] = [];
const DEFAULT_NOTIFICATIONS: any[] = [];

const DEFAULT_PROFILES = [
  {
    id: 'demo-user-1',
    role: 'admin',
    first_name: 'IT',
    last_name: 'Administrator',
    department: 'IT',
    created_at: new Date('2024-01-01').toISOString(),
    updated_at: new Date('2024-01-01').toISOString(),
  },
];

function getStored<T>(key: string, defaultVal: T): T {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(`dawms_${key}`) : null;
    return raw ? JSON.parse(raw) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function setStored<T>(key: string, val: T): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`dawms_${key}`, JSON.stringify(val));
    }
  } catch {}
}

// Initialise storage with audited hardware parts inventory defaults
if (typeof window !== 'undefined') {
  setStored('assets', DEFAULT_ASSETS);
  setStored('warranties', []);
  setStored('maintenance_tasks', []);
  setStored('notifications', []);
  if (!localStorage.getItem('dawms_profiles')) setStored('profiles', DEFAULT_PROFILES);
}

// ============================================================================
// Chainable Mock Supabase Query Builder
// ============================================================================

class MockQueryBuilder {
  private tableName: string;
  private filters: Array<(item: any) => boolean> = [];
  private orderFn: ((a: any, b: any) => number) | null = null;
  private isSingle = false;
  private limitNum: number | null = null;
  private pendingInsert: any[] | null = null;
  private pendingUpdate: any = null;
  private pendingDelete = false;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  select(_columns = '*') {
    return this;
  }

  order(field: string, options: { ascending?: boolean } = {}) {
    const asc = options.ascending ?? true;
    this.orderFn = (a, b) => {
      if ((a[field] ?? '') < (b[field] ?? '')) return asc ? -1 : 1;
      if ((a[field] ?? '') > (b[field] ?? '')) return asc ? 1 : -1;
      return 0;
    };
    return this;
  }

  eq(field: string, value: any) {
    this.filters.push(item => item[field] === value || String(item[field]) === String(value));
    return this;
  }

  neq(field: string, value: any) {
    this.filters.push(item => item[field] !== value && String(item[field]) !== String(value));
    return this;
  }

  in(field: string, values: any[]) {
    this.filters.push(item => values.includes(item[field]));
    return this;
  }

  limit(n: number) {
    this.limitNum = n;
    return this;
  }

  single() {
    this.isSingle = true;
    return this;
  }

  insert(records: any[]) {
    this.pendingInsert = Array.isArray(records) ? records : [records];
    return this;
  }

  update(patch: any) {
    this.pendingUpdate = patch;
    return this;
  }

  delete() {
    this.pendingDelete = true;
    return this;
  }

  // Chainable promise execution
  then(resolve: (result: { data: any; error: any }) => void, reject?: (err: any) => void) {
    try {
      let items = getStored<any[]>(this.tableName, []);

      // Handle Insert
      if (this.pendingInsert) {
        const createdItems = this.pendingInsert.map(r => ({
          id: r.id || `rec-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          createdAt: r.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...r,
        }));
        items = [...createdItems, ...items];
        setStored(this.tableName, items);
        const resData = this.isSingle ? createdItems[0] : createdItems;
        resolve({ data: resData, error: null });
        return;
      }

      // Handle Update
      if (this.pendingUpdate) {
        items = items.map(item => {
          const match = this.filters.length === 0 || this.filters.every(f => f(item));
          return match ? { ...item, ...this.pendingUpdate, updatedAt: new Date().toISOString() } : item;
        });
        setStored(this.tableName, items);
        resolve({ data: items, error: null });
        return;
      }

      // Handle Delete
      if (this.pendingDelete) {
        items = items.filter(item => !this.filters.every(f => f(item)));
        setStored(this.tableName, items);
        resolve({ data: null, error: null });
        return;
      }

      // Handle Select / Filter
      for (const f of this.filters) {
        items = items.filter(f);
      }

      if (this.orderFn) {
        items.sort(this.orderFn);
      }

      if (this.limitNum !== null) {
        items = items.slice(0, this.limitNum);
      }

      if (this.isSingle) {
        resolve({ data: items[0] || null, error: null });
      } else {
        resolve({ data: items, error: null });
      }
    } catch (err) {
      if (reject) reject(err);
      else resolve({ data: null, error: err });
    }
  }
}

// ============================================================================
// Mock Supabase Client
// ============================================================================

export const supabase: any = {
  auth: {
    async signInWithPassword({ email }: { email: string }) {
      const user = { ...DEFAULT_USER, email: email || DEFAULT_USER.email };
      return { data: { user, session: { access_token: 'mock-token', user } }, error: null };
    },
    async signUp({ email }: { email: string }) {
      const user = { ...DEFAULT_USER, email: email || DEFAULT_USER.email };
      return { data: { user, session: { access_token: 'mock-token', user } }, error: null };
    },
    async signOut() {
      return { error: null };
    },
    async getUser() {
      return { data: { user: DEFAULT_USER }, error: null };
    },
    onAuthStateChange(callback: any) {
      // Notify authenticated state immediately
      setTimeout(() => {
        callback('SIGNED_IN', { user: DEFAULT_USER });
      }, 20);
      return {
        data: {
          subscription: {
            unsubscribe: () => {},
          },
        },
      };
    },
  },
  from(table: string) {
    return new MockQueryBuilder(table);
  },
  channel() {
    return {
      on() {
        return this;
      },
      subscribe() {
        return this;
      },
      unsubscribe() {},
    };
  },
  removeChannel(_channel: any) {
    return true;
  },
};

// ============================================================================
// Helper Data Fetchers
// ============================================================================

export async function signIn(email: string, _password?: string) {
  return supabase.auth.signInWithPassword({ email });
}

export async function signUp(email: string, _password?: string, _userData?: any) {
  return supabase.auth.signUp({ email });
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getAssets(): Promise<{ data: Asset[]; error: null }> {
  const items = getStored<Asset[]>('assets', DEFAULT_ASSETS);
  return { data: items, error: null };
}

export async function getAssetById(id: string): Promise<{ data: Asset | null; error: null }> {
  const items = getStored<Asset[]>('assets', DEFAULT_ASSETS);
  return { data: items.find(a => a.id === id) || null, error: null };
}

export async function getWarranties(assetId?: string): Promise<{ data: Warranty[]; error: null }> {
  let items = getStored<Warranty[]>('warranties', DEFAULT_WARRANTIES);
  if (assetId) {
    items = items.filter(w => w.assetId === assetId);
  }
  return { data: items, error: null };
}

export async function getMaintenanceTasks(assetId?: string): Promise<{ data: MaintenanceTask[]; error: null }> {
  let items = getStored<MaintenanceTask[]>('maintenance_tasks', DEFAULT_MAINTENANCE);
  if (assetId) {
    items = items.filter(m => m.assetId === assetId);
  }
  return { data: items, error: null };
}

export async function getComplianceRecords(assetId?: string): Promise<{ data: ComplianceRecord[]; error: null }> {
  const defaultCompliance: ComplianceRecord[] = [
    {
      id: 'comp-1',
      assetId: 'ast-2',
      type: 'safety',
      status: 'compliant',
      dueDate: addDays(60),
      completedDate: addDays(-30),
      notes: 'Electrical safety & surge test certified',
      documentUrl: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
  let items = getStored<ComplianceRecord[]>('compliance_records', defaultCompliance);
  if (assetId) items = items.filter(c => c.assetId === assetId);
  return { data: items, error: null };
}

export const getDepreciationRecords = async (assetId: string): Promise<{ data: DepreciationRecord[]; error: null }> => {
  const records: DepreciationRecord[] = [
    { id: 'dep-1', assetId, year: 2023, month: 12, value: 3200, depreciationAmount: 299, method: 'straight-line', createdAt: new Date().toISOString() },
    { id: 'dep-2', assetId, year: 2024, month: 6, value: 2900, depreciationAmount: 300, method: 'straight-line', createdAt: new Date().toISOString() },
  ];
  return { data: records, error: null };
};

const DEFAULT_CONFIGURATIONS: AssetConfiguration[] = [
  { id: 'cfg-1', assetId: 'ast-1', componentType: 'CPU', componentName: 'Apple M3 Max', specification: '16-core CPU, 40-core GPU', quantity: 1, createdAt: new Date().toISOString() },
  { id: 'cfg-2', assetId: 'ast-1', componentType: 'RAM', componentName: 'Unified Memory', specification: '36GB Unified LPDDR5', quantity: 1, createdAt: new Date().toISOString() },
  { id: 'cfg-3', assetId: 'ast-1', componentType: 'Storage', componentName: 'Apple NVMe SSD', specification: '1TB PCIe Gen4 SSD', quantity: 1, createdAt: new Date().toISOString() },
  { id: 'cfg-4', assetId: 'ast-1', componentType: 'OS', componentName: 'macOS Sonoma', specification: 'v14.4.1 Enterprise Profile', quantity: 1, createdAt: new Date().toISOString() },
  
  { id: 'cfg-5', assetId: 'ast-2', componentType: 'CPU', componentName: 'Intel Xeon Silver 4410Y', specification: '12-core, 2.0GHz, 30MB Cache', quantity: 2, createdAt: new Date().toISOString() },
  { id: 'cfg-6', assetId: 'ast-2', componentType: 'RAM', componentName: 'DDR5 ECC Registered RDIMM', specification: '64GB (4x16GB) 4800MHz', quantity: 4, createdAt: new Date().toISOString() },
  { id: 'cfg-7', assetId: 'ast-2', componentType: 'Storage', componentName: 'Enterprise NVMe SSD RAID-10', specification: '1.92TB U.2 NVMe SSD', quantity: 4, createdAt: new Date().toISOString() },
  { id: 'cfg-8', assetId: 'ast-2', componentType: 'OS', componentName: 'VMware ESXi', specification: 'v8.0 U2 Hypervisor', quantity: 1, createdAt: new Date().toISOString() },
];

export async function getConfigurations(assetId: string): Promise<{ data: AssetConfiguration[]; error: null }> {
  const items = getStored<AssetConfiguration[]>('configurations', DEFAULT_CONFIGURATIONS);
  return { data: items.filter(c => c.assetId === assetId), error: null };
}

export async function addConfiguration(config: Partial<AssetConfiguration>): Promise<{ data: AssetConfiguration; error: null }> {
  const items = getStored<AssetConfiguration[]>('configurations', DEFAULT_CONFIGURATIONS);
  const newCfg: AssetConfiguration = {
    id: `cfg-${Date.now()}`,
    assetId: config.assetId || '',
    componentType: (config.componentType as any) || 'Other',
    componentName: config.componentName || 'Generic Component',
    specification: config.specification || '',
    quantity: config.quantity || 1,
    createdAt: new Date().toISOString(),
  };
  items.unshift(newCfg);
  setStored('configurations', items);
  return { data: newCfg, error: null };
}

export async function deleteConfiguration(id: string): Promise<{ error: null }> {
  let items = getStored<AssetConfiguration[]>('configurations', DEFAULT_CONFIGURATIONS);
  items = items.filter(c => c.id !== id);
  setStored('configurations', items);
  return { error: null };
}