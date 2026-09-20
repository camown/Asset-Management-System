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
    id: 'ast-1',
    name: 'MacBook Pro 16" M3 Max',
    serialNumber: 'C02G3912MD6R',
    model: 'MacBook Pro 16 (2023)',
    category: 'Laptops',
    purchaseDate: '2023-11-15',
    purchasePrice: 3499,
    assignedTo: 'Alex Chen',
    department: 'Engineering',
    location: 'Building A - Floor 3',
    status: 'active',
    notes: 'Primary dev machine for Lead Architect',
    createdAt: new Date('2023-11-15').toISOString(),
    updatedAt: new Date('2024-01-10').toISOString(),
  },
  {
    id: 'ast-2',
    name: 'Dell PowerEdge R750 Server',
    serialNumber: 'PE750-SRV-8821',
    model: 'PowerEdge R750xs',
    category: 'Servers',
    purchaseDate: '2022-08-20',
    purchasePrice: 8950,
    assignedTo: 'SysAdmin Team',
    department: 'IT Infrastructure',
    location: 'Server Room 1 - Rack B4',
    status: 'active',
    notes: 'Virtualization host running VMware ESXi',
    createdAt: new Date('2022-08-20').toISOString(),
    updatedAt: new Date('2024-02-01').toISOString(),
  },
  {
    id: 'ast-3',
    name: 'ThinkPad P16 Gen 2',
    serialNumber: 'PF3X8921',
    model: 'ThinkPad P16 Gen 2',
    category: 'Laptops',
    purchaseDate: '2024-01-10',
    purchasePrice: 2650,
    assignedTo: 'Sarah Jenkins',
    department: 'Design',
    location: 'Remote - San Francisco',
    status: 'active',
    notes: 'CAD & 3D rendering workstation',
    createdAt: new Date('2024-01-10').toISOString(),
    updatedAt: new Date('2024-01-10').toISOString(),
  },
  {
    id: 'ast-4',
    name: 'Cisco Catalyst 9300 Switch',
    serialNumber: 'FCW2341L09M',
    model: 'C9300-48P',
    category: 'Networking',
    purchaseDate: '2021-04-12',
    purchasePrice: 4200,
    assignedTo: 'Network Operations',
    department: 'IT Infrastructure',
    location: 'IDF 2 - Floor 2',
    status: 'maintenance',
    notes: 'Port 12 intermittently flapping',
    createdAt: new Date('2021-04-12').toISOString(),
    updatedAt: new Date('2024-03-01').toISOString(),
  },
  {
    id: 'ast-5',
    name: 'HP LaserJet Enterprise M608',
    serialNumber: 'VNB3B09123',
    model: 'Enterprise M608dn',
    category: 'Printers',
    purchaseDate: '2023-03-05',
    purchasePrice: 1150,
    assignedTo: 'Office Administration',
    department: 'Operations',
    location: 'HQ 2nd Floor Print Station',
    status: 'active',
    notes: 'High volume monochrome network printer',
    createdAt: new Date('2023-03-05').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString(),
  },
];

const DEFAULT_WARRANTIES: Warranty[] = [
  {
    id: 'war-1',
    assetId: 'ast-1',
    provider: 'AppleCare+ for Enterprise',
    startDate: '2023-11-15',
    endDate: addDays(15), // Expiring soon!
    type: 'premium',
    coverageDetails: '24/7 priority support, on-site service, accidental damage coverage',
    documentUrl: null,
    contactInfo: 'enterprise-support@apple.com / 1-800-APL-CARE',
    createdAt: new Date('2023-11-15').toISOString(),
    updatedAt: new Date('2023-11-15').toISOString(),
  },
  {
    id: 'war-2',
    assetId: 'ast-2',
    provider: 'Dell ProSupport Plus',
    startDate: '2022-08-20',
    endDate: addDays(400),
    type: 'premium',
    coverageDetails: '4-hour mission critical on-site hardware diagnosis & parts replacement',
    documentUrl: null,
    contactInfo: 'prosupport@dell.com / 1-800-456-3355',
    createdAt: new Date('2022-08-20').toISOString(),
    updatedAt: new Date('2022-08-20').toISOString(),
  },
  {
    id: 'war-3',
    assetId: 'ast-4',
    provider: 'Cisco Smart Net Total Care',
    startDate: '2021-04-12',
    endDate: addDays(-20), // Expired!
    type: 'standard',
    coverageDetails: 'Next business day hardware replacement and TAC software support',
    documentUrl: null,
    contactInfo: 'smartnet@cisco.com',
    createdAt: new Date('2021-04-12').toISOString(),
    updatedAt: new Date('2021-04-12').toISOString(),
  },
];

const DEFAULT_MAINTENANCE: MaintenanceTask[] = [
  {
    id: 'maint-1',
    assetId: 'ast-2',
    title: 'Bi-annual BIOS & RAID Controller Firmware Update',
    description: 'Upgrade PERC firmware to latest patch and test controller battery backup.',
    type: 'preventive',
    priority: 'high',
    status: 'scheduled',
    scheduledDate: addDays(5),
    completedAt: null,
    assignedTo: 'David Miller',
    cost: 0,
    notes: 'Scheduled during maintenance window at 2:00 AM',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'maint-2',
    assetId: 'ast-4',
    title: 'Switch Port SFP Module Diagnostics & Replacement',
    description: 'Replace faulty 10G SFP+ transceiver on uplink port 12.',
    type: 'corrective',
    priority: 'critical',
    status: 'in-progress',
    scheduledDate: addDays(0),
    completedAt: null,
    assignedTo: 'Network Ops Team',
    cost: 180,
    notes: 'Replacement optics arrived from distributor',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'maint-3',
    assetId: 'ast-5',
    title: 'Roller & Fuser Cleaning Maintenance Kit',
    description: 'Installed 200k maintenance kit and recalibrated paper feeder.',
    type: 'routine',
    priority: 'medium',
    status: 'completed',
    scheduledDate: addDays(-14),
    completedAt: addDays(-14),
    assignedTo: 'Vendor Services',
    cost: 240,
    notes: 'Tested 50 sheet duplex run without jam',
    createdAt: addDays(-14),
    updatedAt: addDays(-14),
  },
];

const DEFAULT_NOTIFICATIONS = [
  {
    id: 'notif-1',
    user_id: 'demo-user-1',
    title: 'Warranty Expiring Soon',
    message: 'AppleCare+ warranty for MacBook Pro 16 (ast-1) expires in 15 days.',
    type: 'warranty',
    read: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'notif-2',
    user_id: 'demo-user-1',
    title: 'Scheduled Maintenance Due',
    message: 'BIOS & RAID Controller Firmware Update for Server ast-2 is scheduled in 5 days.',
    type: 'maintenance',
    read: false,
    created_at: new Date().toISOString(),
  },
];

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

// Initialise storage with rich demo defaults
if (typeof window !== 'undefined') {
  if (!localStorage.getItem('dawms_assets')) setStored('assets', DEFAULT_ASSETS);
  if (!localStorage.getItem('dawms_warranties')) setStored('warranties', DEFAULT_WARRANTIES);
  if (!localStorage.getItem('dawms_maintenance_tasks')) setStored('maintenance_tasks', DEFAULT_MAINTENANCE);
  if (!localStorage.getItem('dawms_profiles')) setStored('profiles', DEFAULT_PROFILES);
  if (!localStorage.getItem('dawms_notifications')) setStored('notifications', DEFAULT_NOTIFICATIONS);
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