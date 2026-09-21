import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Cpu, Plus, X } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import { getAssetById, getConfigurations, addConfiguration, deleteConfiguration } from '../../lib/supabase';
import { Asset, AssetConfiguration } from '../../types';
import { format as formatDate, parseISO } from 'date-fns';
import { toast } from 'react-hot-toast';

const AssetDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [configs, setConfigs] = useState<AssetConfiguration[]>([]);
  const [loading, setLoading] = useState(true);

  // New config form state
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [newConfig, setNewConfig] = useState({
    componentType: 'CPU' as 'CPU' | 'RAM' | 'Storage' | 'GPU' | 'OS' | 'Networking' | 'Other',
    componentName: '',
    specification: '',
    quantity: 1,
  });

  const fetchAssetAndConfigs = async () => {
    if (!id) return;
    
    try {
      const { data: assetData, error: assetError } = await getAssetById(id);
      if (assetError) throw assetError;
      if (assetData) setAsset(assetData);

      const { data: configData } = await getConfigurations(id);
      if (configData) setConfigs(configData);
    } catch (error) {
      console.error('Error fetching asset details:', error);
      toast.error('Failed to load asset details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssetAndConfigs();
  }, [id]);

  const handleAddConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !newConfig.componentName) return;

    try {
      await addConfiguration({
        assetId: id,
        componentType: newConfig.componentType,
        componentName: newConfig.componentName,
        specification: newConfig.specification,
        quantity: Number(newConfig.quantity) || 1,
      });
      toast.success('Hardware specification added');
      setShowConfigModal(false);
      setNewConfig({
        componentType: 'CPU',
        componentName: '',
        specification: '',
        quantity: 1,
      });
      fetchAssetAndConfigs();
    } catch (err) {
      toast.error('Failed to add configuration');
    }
  };

  const handleDeleteConfig = async (configId: string) => {
    try {
      await deleteConfiguration(configId);
      toast.success('Hardware spec removed');
      fetchAssetAndConfigs();
    } catch (err) {
      toast.error('Failed to delete hardware spec');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success" dot>Working</Badge>;
      case 'maintenance':
        return <Badge variant="warning" dot>Maintenance / Not Working</Badge>;
      case 'retired':
        return <Badge variant="default" dot>Retired</Badge>;
      case 'disposed':
        return <Badge variant="danger" dot>Disposed</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Asset Not Found</h2>
        <Button onClick={() => navigate('/assets')}>Back to Assets</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/assets')}
          >
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">{asset.name}</h1>
          {getStatusBadge(asset.status)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Main Info Card */}
          <Card>
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">General Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Model</h3>
                  <p className="text-gray-900">{asset.model}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Serial Number</h3>
                  <p className="text-gray-900">{asset.serialNumber}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Category</h3>
                  <p className="text-gray-900">{asset.category}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Department</h3>
                  <p className="text-gray-900">{asset.department || '—'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Assigned To</h3>
                  <p className="text-gray-900">{asset.assignedTo || '—'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Purchase Date</h3>
                  <p className="text-gray-900">{formatDate(parseISO(asset.purchaseDate), 'MMM d, yyyy')}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Purchase Price</h3>
                  <p className="text-gray-900">₱{asset.purchasePrice.toLocaleString()}</p>
                </div>
              </div>

              {asset.notes && (
                <div className="mt-6 border-t pt-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Notes</h3>
                  <p className="text-gray-900 whitespace-pre-wrap">{asset.notes}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Hardware Configurations Card (Ported from ASSETRACK) */}
          <Card>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <Cpu size={20} className="mr-2 text-indigo-600" />
                  Hardware Specifications & Components
                </h2>
                <Button size="sm" onClick={() => setShowConfigModal(true)}>
                  <Plus size={16} className="mr-1" />
                  Add Component
                </Button>
              </div>

              {configs.length > 0 ? (
                <div className="overflow-x-auto border rounded-lg divide-y divide-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Component Name</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Specification</th>
                        <th className="px-4 py-2 text-center text-xs font-semibold text-gray-600 uppercase">Qty</th>
                        <th className="px-4 py-2 text-right text-xs font-semibold text-gray-600 uppercase">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {configs.map((cfg) => (
                        <tr key={cfg.id}>
                          <td className="px-4 py-3 text-sm">
                            <span className="font-semibold text-xs px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                              {cfg.componentType}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{cfg.componentName}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{cfg.specification || '—'}</td>
                          <td className="px-4 py-3 text-sm text-center text-gray-900 font-mono">{cfg.quantity}</td>
                          <td className="px-4 py-3 text-sm text-right">
                            <button
                              onClick={() => handleDeleteConfig(cfg.id)}
                              className="text-red-500 hover:text-red-700 p-1"
                              title="Delete hardware spec"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic py-4 text-center border rounded-lg bg-gray-50">
                  No detailed hardware specs logged yet. Click "Add Component" to record CPU, RAM, Storage, OS, or GPU info.
                </p>
              )}
            </div>
          </Card>
        </div>

        <div>
          <Card>
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate(`/warranties/new?assetId=${asset.id}`)}
                >
                  Add Warranty
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate(`/maintenance/new?assetId=${asset.id}`)}
                >
                  Schedule Maintenance
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Modal for Adding Hardware Specification */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Cpu size={18} className="mr-2 text-indigo-600" />
                Add Hardware Specification
              </h3>
              <button onClick={() => setShowConfigModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddConfig} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Component Type</label>
                <select
                  value={newConfig.componentType}
                  onChange={(e: any) => setNewConfig({ ...newConfig, componentType: e.target.value })}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="CPU">CPU (Processor)</option>
                  <option value="RAM">RAM (Memory)</option>
                  <option value="Storage">Storage (SSD/NVMe/HDD)</option>
                  <option value="GPU">GPU (Graphics Card)</option>
                  <option value="OS">OS (Operating System)</option>
                  <option value="Networking">Networking</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <Input
                label="Component Name"
                placeholder="e.g. Intel Core i7-13700H or DDR5 SO-DIMM"
                value={newConfig.componentName}
                onChange={(e) => setNewConfig({ ...newConfig, componentName: e.target.value })}
                required
              />

              <Input
                label="Specification Detail"
                placeholder="e.g. 16-Core 2.4GHz or 32GB 5600MHz"
                value={newConfig.specification}
                onChange={(e) => setNewConfig({ ...newConfig, specification: e.target.value })}
              />

              <Input
                label="Quantity"
                type="number"
                value={newConfig.quantity}
                onChange={(e) => setNewConfig({ ...newConfig, quantity: Number(e.target.value) })}
                required
              />

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setShowConfigModal(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Save Component
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetDetails;