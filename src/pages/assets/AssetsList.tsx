import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, Download, MoreHorizontal, QrCode, FileDown } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import { getAssets } from '../../lib/supabase';
import { Asset } from '../../types';
import { format as formatDate, parseISO } from 'date-fns';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { exportToExcel, exportToPDF } from '../../utils/exportUtils';
import QRCodeModal from '../../components/modals/QRCodeModal';

const AssetsList: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFilter, setCurrentFilter] = useState<string | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const { data, error } = await getAssets();
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setAssets(data);
          setFilteredAssets(data);
        }
      } catch (error) {
        console.error('Error fetching assets:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAssets();
  }, []);
  
  const [viewMode, setViewMode] = useState<'parts' | 'workstations'>('workstations');

  useEffect(() => {
    // Filter and search assets
    let result = [...assets];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(asset => 
        asset.name.toLowerCase().includes(query) ||
        asset.model.toLowerCase().includes(query) ||
        asset.serialNumber.toLowerCase().includes(query) ||
        asset.category.toLowerCase().includes(query) ||
        (asset.assignedTo && asset.assignedTo.toLowerCase().includes(query)) ||
        (asset.gpu && asset.gpu.toLowerCase().includes(query)) ||
        (asset.cpu && asset.cpu.toLowerCase().includes(query))
      );
    }
    
    if (currentFilter) {
      result = result.filter(asset => asset.status === currentFilter);
    }
    
    if (viewMode === 'workstations') {
      result = result.filter(asset => asset.category === 'Workstations');
    } else if (viewMode === 'parts') {
      result = result.filter(asset => asset.category !== 'Workstations');
    }
    
    setFilteredAssets(result);
  }, [assets, searchQuery, currentFilter, viewMode]);
  
  useEffect(() => {
    // Add click outside handler for export menu
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleFilterChange = (filter: string | null) => {
    setCurrentFilter(currentFilter === filter ? null : filter);
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
  
  const handleExport = async (format: 'excel' | 'pdf') => {
    try {
      if (filteredAssets.length === 0) {
        toast.error('No assets to export');
        return;
      }

      // Format the data for export based on viewMode
      const exportData = viewMode === 'workstations' 
        ? filteredAssets.map(asset => ({
            'PC NUMBER': asset.name || asset.id || '',
            'CURRENT USER': asset.assignedTo || '',
            GPU: asset.gpu || '—',
            CPU: asset.cpu || '—',
            RAM: asset.ram || '—',
            'MONITOR QTY': asset.monitorQty || 1,
            'MONITOR SIZE': asset.monitorSize || '—',
            KEYBOARD: asset.keyboardStatus || 'GOOD',
            MOUSE: asset.mouseStatus || 'GOOD',
            'REMARKS / COMMENTS': asset.notes || ''
          }))
        : filteredAssets.map(asset => ({
            'Asset ID': asset.id || asset.name || '',
            'Serial Number / Service Tag': asset.serialNumber || '',
            Category: asset.category || '',
            'Storage (Size)': asset.storage || 'NA',
            'Assigned User': asset.assignedTo || 'FREE',
            Status: asset.status || '',
            Notes: asset.notes || ''
          }));

      const filename = `${viewMode === 'workstations' ? 'computer-specification-list' : 'hardware-parts-inventory'}-${new Date().toISOString().split('T')[0]}`;
      
      switch (format) {
        case 'excel':
          await exportToExcel(exportData, filename);
          break;
        case 'pdf':
          await exportToPDF(exportData, filename);
          break;
      }
      
      toast.success(`Assets exported to ${format.toUpperCase()} successfully`);
    } catch (error) {
      console.error('Error exporting assets:', error);
      toast.error('Failed to export assets. Please try again.');
    }
  };
  
  const handleGenerateQR = (asset: Asset) => {
    setSelectedAsset(asset);
    setShowQRModal(true);
  };

  const handleDeleteAsset = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      const { error } = await supabase.from('assets').delete().eq('id', id);
      if (error) throw error;
      toast.success(`${name} deleted successfully`);
      setAssets(prev => prev.filter(a => a.id !== id));
    } catch (err: any) {
      console.error('Delete error:', err);
      toast.error('Failed to delete item');
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {viewMode === 'workstations' ? 'Computer Specification List' : 'Hardware Parts Inventory'}
          </h1>
          <p className="text-gray-600">
            {viewMode === 'workstations' 
              ? 'Complete workstation PC specifications, user assignments, and peripheral status.'
              : 'Track and manage company hardware components and spare parts inventory.'}
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="flex space-x-3">
            <div className="relative" ref={exportMenuRef}>
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FileDown className="h-5 w-5 mr-2" />
                Export
              </button>
              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1" role="menu">
                    <button
                      onClick={() => {
                        handleExport('excel');
                        setShowExportMenu(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Export to Excel
                    </button>
                    <button
                      onClick={() => {
                        handleExport('pdf');
                        setShowExportMenu(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Export to PDF
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <Link to="/assets/new">
              <Button leftIcon={<Plus size={16} />}>
                Add Item
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <Card className="mb-6">
        <div className="p-4 flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 md:space-x-4">
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <div className="inline-flex rounded-md shadow-sm p-1 bg-gray-100">
              <button
                onClick={() => setViewMode('workstations')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  viewMode === 'workstations'
                    ? 'bg-white text-blue-700 shadow'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Computer Specification List ({assets.filter(a => a.category === 'Workstations').length})
              </button>
              <button
                onClick={() => setViewMode('parts')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  viewMode === 'parts'
                    ? 'bg-white text-blue-700 shadow'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Hardware Parts Inventory ({assets.filter(a => a.category !== 'Workstations').length})
              </button>
            </div>
            
            <div className="w-full md:w-64">
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearch}
                leftIcon={<Search size={18} />}
              />
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-sm text-gray-500 flex items-center mr-2">
              <Filter size={16} className="mr-1" />
              Filter:
            </div>
            <button
              onClick={() => handleFilterChange(null)}
              className={`px-3 py-1 text-xs font-medium rounded-full ${
                currentFilter === null
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleFilterChange('active')}
              className={`px-3 py-1 text-xs font-medium rounded-full ${
                currentFilter === 'active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Working
            </button>
            <button
              onClick={() => handleFilterChange('maintenance')}
              className={`px-3 py-1 text-xs font-medium rounded-full ${
                currentFilter === 'maintenance'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Needs Replacement / Maint
            </button>
          </div>
        </div>
      </Card>
      
      <Card>
        <div className="overflow-x-auto">
          {viewMode === 'workstations' ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">PC NUMBER</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">CURRENT USER</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">GPU</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">CPU</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">RAM</th>
                  <th scope="col" className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">MONITOR (QTY / SIZE)</th>
                  <th scope="col" className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">KEYBOARD</th>
                  <th scope="col" className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">MOUSE</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">REMARKS / COMMENTS</th>
                  <th scope="col" className="relative px-4 py-3 text-right"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAssets.length > 0 ? (
                  filteredAssets.map((asset) => (
                    <tr key={asset.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-900">{asset.name || asset.id}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-blue-700">{asset.assignedTo || '—'}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 font-mono">{asset.gpu || '—'}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 font-mono">{asset.cpu || '—'}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-medium">{asset.ram || '—'}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-700">
                        <span className="font-semibold text-gray-900">{asset.monitorQty}</span> <span className="text-gray-500">({asset.monitorSize})</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <span className={`px-2 py-0.5 text-xs font-bold rounded ${asset.keyboardStatus === 'REPLACE' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-green-100 text-green-700'}`}>
                          {asset.keyboardStatus || 'GOOD'}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <span className={`px-2 py-0.5 text-xs font-bold rounded ${asset.mouseStatus === 'REPLACE' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-green-100 text-green-700'}`}>
                          {asset.mouseStatus || 'GOOD'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-xs">
                        {asset.notes && (
                          <span className={`${asset.notes.toLowerCase().includes('replace') || asset.notes.toLowerCase().includes('upgrade') || asset.notes.toLowerCase().includes('lagging') ? 'text-red-600 font-medium' : ''}`}>
                            {asset.notes}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-3 justify-end">
                          <button onClick={() => handleGenerateQR(asset)} title="Generate QR Code" className="text-blue-600 hover:text-blue-900">
                            <QrCode size={16} />
                          </button>
                          <Link to={`/assets/${asset.id}`} className="text-gray-600 hover:text-gray-900">
                            View
                          </Link>
                          <Link to={`/assets/${asset.id}/edit`} className="text-blue-600 hover:text-blue-900 font-semibold">
                            Edit
                          </Link>
                          <button onClick={() => handleDeleteAsset(asset.id, asset.name || asset.id)} className="text-red-600 hover:text-red-900 font-semibold">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="px-6 py-4 text-center text-gray-500">
                      No computer specifications found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial Number / Service Tag</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Storage (Size)</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned User</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status / Notes</th>
                  <th scope="col" className="relative px-6 py-3 text-right"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAssets.length > 0 ? (
                  filteredAssets.map((asset) => (
                    <tr key={asset.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">{asset.name || asset.id}</div>
                        <div className="text-xs text-gray-500">{asset.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-700">{asset.serialNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{asset.storage || 'NA'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${asset.assignedTo === 'FREE' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-gray-100 text-gray-800'}`}>
                          {asset.assignedTo || 'FREE'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(asset.status)}
                          <span className="text-sm text-gray-500">{asset.notes}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-3 justify-end">
                          <button onClick={() => handleGenerateQR(asset)} title="Generate QR Code" className="text-blue-600 hover:text-blue-900">
                            <QrCode size={16} />
                          </button>
                          <Link to={`/assets/${asset.id}`} className="text-gray-600 hover:text-gray-900">
                            View
                          </Link>
                          <Link to={`/assets/${asset.id}/edit`} className="text-blue-600 hover:text-blue-900 font-semibold">
                            Edit
                          </Link>
                          <button onClick={() => handleDeleteAsset(asset.id, asset.name || asset.id)} className="text-red-600 hover:text-red-900 font-semibold">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      No hardware parts found in inventory.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        <div className="bg-gray-50 px-6 py-3 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {filteredAssets.length} of {assets.length} assets
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              rightIcon={<Download size={16} />}
            >
              Export
            </Button>
          </div>
        </div>
      </Card>

      {/* QR Code Modal */}
      {selectedAsset && (
        <QRCodeModal
          isOpen={showQRModal}
          onClose={() => {
            setShowQRModal(false);
            setSelectedAsset(null);
          }}
          assetData={{
            name: selectedAsset.name,
            serialNumber: selectedAsset.serialNumber,
            model: selectedAsset.model,
            category: selectedAsset.category,
            status: selectedAsset.status,
            location: selectedAsset.location,
            department: selectedAsset.department || '',
            assignedTo: selectedAsset.assignedTo || '',
            purchaseDate: selectedAsset.purchaseDate,
            purchasePrice: selectedAsset.purchasePrice
          }}
        />
      )}
    </div>
  );
};

export default AssetsList;