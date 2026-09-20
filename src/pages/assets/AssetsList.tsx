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
  
  useEffect(() => {
    // Filter and search assets
    let result = [...assets];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(asset => 
        asset.name.toLowerCase().includes(query) ||
        asset.model.toLowerCase().includes(query) ||
        asset.serialNumber.toLowerCase().includes(query) ||
        asset.category.toLowerCase().includes(query)
      );
    }
    
    if (currentFilter) {
      result = result.filter(asset => asset.status === currentFilter);
    }
    
    setFilteredAssets(result);
  }, [assets, searchQuery, currentFilter]);
  
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
        return <Badge variant="success" dot>Active</Badge>;
      case 'maintenance':
        return <Badge variant="warning" dot>Maintenance</Badge>;
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

      // Format the data for export
      const exportData = filteredAssets.map(asset => ({
        Name: asset.name || '',
        'Serial Number': asset.serialNumber || '',
        Model: asset.model || '',
        Category: asset.category || '',
        Status: asset.status || '',
        Location: asset.location || '',
        Department: asset.department || '',
        'Assigned To': asset.assignedTo || '',
        'Purchase Date': asset.purchaseDate ? formatDate(parseISO(asset.purchaseDate), 'MMM d, yyyy') : '',
        'Purchase Price': asset.purchasePrice ? Number(asset.purchasePrice) : 0,
        Notes: asset.notes || ''
      }));

      const filename = `assets-report-${new Date().toISOString().split('T')[0]}`;
      
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
          <h1 className="text-2xl font-bold text-gray-900">Assets</h1>
          <p className="text-gray-600">Manage your company's hardware and equipment.</p>
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
            <Link
              to="/assets/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add New Asset
            </Link>
          </div>
        </div>
      </div>
      
      <Card className="mb-6">
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Search assets..."
                value={searchQuery}
                onChange={handleSearch}
                leftIcon={<Search size={16} />}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={currentFilter === 'active' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handleFilterChange('active')}
              >
                Active
              </Button>
              <Button
                variant={currentFilter === 'maintenance' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handleFilterChange('maintenance')}
              >
                Maintenance
              </Button>
              <Button
                variant="outline"
                size="sm"
                rightIcon={<Filter size={16} />}
              >
                More
              </Button>
            </div>
          </div>
        </div>
      </Card>
      
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asset
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Purchase Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned To
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAssets.length > 0 ? (
                filteredAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{asset.name}</div>
                          <div className="text-sm text-gray-500">{asset.serialNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{asset.category}</div>
                      <div className="text-sm text-gray-500">{asset.model}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(asset.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {asset.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(parseISO(asset.purchaseDate), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₱{asset.purchasePrice.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {asset.assignedTo || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleGenerateQR(asset)}
                          title="Generate QR Code" 
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <QrCode size={16} />
                        </button>
                        <Link to={`/assets/${asset.id}`} className="text-blue-600 hover:text-blue-900">
                          View
                        </Link>
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    {searchQuery || currentFilter ? 'No assets match your search or filter criteria.' : 'No assets found. Start by adding some assets.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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