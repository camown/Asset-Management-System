import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Clock, Shield, AlertTriangle } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import { getWarranties, getAssets } from '../../lib/supabase';
import { Warranty, Asset } from '../../types';
import { format, parseISO, isBefore, differenceInDays } from 'date-fns';

const WarrantyList: React.FC = () => {
  const [warranties, setWarranties] = useState<Warranty[]>([]);
  const [assets, setAssets] = useState<Record<string, Asset>>({});
  const [filteredWarranties, setFilteredWarranties] = useState<Warranty[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch warranties
        const { data: warrantiesData, error: warrantiesError } = await getWarranties();
        
        if (warrantiesError) {
          throw warrantiesError;
        }
        
        if (warrantiesData) {
          setWarranties(warrantiesData);
          setFilteredWarranties(warrantiesData);
        }
        
        // Fetch assets for reference
        const { data: assetsData, error: assetsError } = await getAssets();
        
        if (assetsError) {
          throw assetsError;
        }
        
        if (assetsData) {
          // Create a map of asset ID to asset for quick lookup
          const assetsMap = assetsData.reduce((acc, asset) => {
            acc[asset.id] = asset;
            return acc;
          }, {} as Record<string, Asset>);
          
          setAssets(assetsMap);
        }
      } catch (error) {
        console.error('Error fetching warranties data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  useEffect(() => {
    // Filter and search warranties
    let result = [...warranties];
    const today = new Date();
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(warranty => {
        const asset = assets[warranty.assetId];
        return (
          (asset && asset.name.toLowerCase().includes(query)) ||
          warranty.provider.toLowerCase().includes(query) ||
          warranty.type.toLowerCase().includes(query)
        );
      });
    }
    
    // Apply filter
    if (activeFilter) {
      if (activeFilter === 'active') {
        result = result.filter(warranty => 
          isBefore(today, parseISO(warranty.endDate))
        );
      } else if (activeFilter === 'expired') {
        result = result.filter(warranty => 
          isBefore(parseISO(warranty.endDate), today)
        );
      } else if (activeFilter === 'expiring-soon') {
        result = result.filter(warranty => {
          const endDate = parseISO(warranty.endDate);
          return (
            isBefore(today, endDate) && 
            differenceInDays(endDate, today) <= 30
          );
        });
      }
    }
    
    setFilteredWarranties(result);
  }, [warranties, assets, searchQuery, activeFilter]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleFilterChange = (filter: string) => {
    setActiveFilter(activeFilter === filter ? null : filter);
  };
  
  const getStatusBadge = (warranty: Warranty) => {
    const today = new Date();
    const endDate = parseISO(warranty.endDate);
    
    if (isBefore(endDate, today)) {
      return <Badge variant="danger" dot>Expired</Badge>;
    }
    
    const daysRemaining = differenceInDays(endDate, today);
    
    if (daysRemaining <= 30) {
      return <Badge variant="warning" dot>Expiring Soon</Badge>;
    }
    
    return <Badge variant="success" dot>Active</Badge>;
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
          <h1 className="text-2xl font-bold text-gray-900">Warranties</h1>
          <p className="text-gray-600">Manage and track warranty information for your assets.</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link to="/warranties/new">
            <Button rightIcon={<Plus size={16} />}>
              Add Warranty
            </Button>
          </Link>
        </div>
      </div>
      
      <Card className="mb-6">
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Search warranties by asset, provider..."
                value={searchQuery}
                onChange={handleSearch}
                leftIcon={<Search size={16} />}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={activeFilter === 'active' ? 'primary' : 'outline'}
                size="sm"
                leftIcon={<Shield size={16} />}
                onClick={() => handleFilterChange('active')}
              >
                Active
              </Button>
              <Button
                variant={activeFilter === 'expiring-soon' ? 'primary' : 'outline'}
                size="sm"
                leftIcon={<Clock size={16} />}
                onClick={() => handleFilterChange('expiring-soon')}
              >
                Expiring Soon
              </Button>
              <Button
                variant={activeFilter === 'expired' ? 'primary' : 'outline'}
                size="sm"
                leftIcon={<AlertTriangle size={16} />}
                onClick={() => handleFilterChange('expired')}
              >
                Expired
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
                  Provider
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  End Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Documents
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredWarranties.length > 0 ? (
                filteredWarranties.map((warranty) => {
                  const asset = assets[warranty.assetId];
                  
                  return (
                    <tr key={warranty.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {asset ? asset.name : 'Unknown Asset'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {asset ? asset.serialNumber : 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{warranty.provider}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          variant={
                            warranty.type === 'premium' ? 'primary' :
                            warranty.type === 'extended' ? 'info' :
                            'default'
                          }
                        >
                          {warranty.type}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(warranty)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(parseISO(warranty.startDate), 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(parseISO(warranty.endDate), 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {warranty.documentUrl ? (
                          <a 
                            href={warranty.documentUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View Document
                          </a>
                        ) : (
                          'No documents'
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link to={`/warranties/${warranty.id}`} className="text-blue-600 hover:text-blue-900">
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    {searchQuery || activeFilter ? 'No warranties match your search or filter criteria.' : 'No warranties found. Start by adding some warranties.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-50 px-6 py-3 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {filteredWarranties.length} of {warranties.length} warranties
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WarrantyList;