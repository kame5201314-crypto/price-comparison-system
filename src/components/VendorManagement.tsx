import { useState, useEffect } from 'react';
import {
  Store,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  Star,
  Search,
  Filter,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

interface Vendor {
  id: string;
  name: string;
  platform: string;
  shopUrl: string;
  contactName?: string;
  phone?: string;
  email?: string;
  address?: string;
  rating: number;
  notes?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

const PLATFORMS = [
  { id: 'shopee', name: '蝦皮購物', icon: '🛍️' },
  { id: 'pchome', name: 'PChome 24h', icon: '📦' },
  { id: 'momo', name: 'momo購物網', icon: '🛒' },
  { id: '1688', name: '1688（阿里巴巴）', icon: '🏭' },
  { id: 'taobao', name: '淘寶', icon: '🛒' },
  { id: 'other', name: '其他', icon: '🏪' },
];

const STORAGE_KEY = 'price-comparison-vendors';

export function VendorManagement() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [newVendor, setNewVendor] = useState<Partial<Vendor>>({
    name: '',
    platform: 'shopee',
    shopUrl: '',
    contactName: '',
    phone: '',
    email: '',
    address: '',
    rating: 5,
    notes: '',
    tags: [],
  });

  // Load vendors from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setVendors(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load vendors:', e);
      }
    }
  }, []);

  // Save vendors to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vendors));
  }, [vendors]);

  const handleAddVendor = () => {
    if (!newVendor.name?.trim() || !newVendor.shopUrl?.trim()) {
      alert('請填寫廠商名稱和店鋪網址');
      return;
    }

    const vendor: Vendor = {
      id: Date.now().toString(),
      name: newVendor.name.trim(),
      platform: newVendor.platform || 'other',
      shopUrl: newVendor.shopUrl.trim(),
      contactName: newVendor.contactName?.trim(),
      phone: newVendor.phone?.trim(),
      email: newVendor.email?.trim(),
      address: newVendor.address?.trim(),
      rating: newVendor.rating || 5,
      notes: newVendor.notes?.trim(),
      tags: newVendor.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setVendors([vendor, ...vendors]);
    setNewVendor({
      name: '',
      platform: 'shopee',
      shopUrl: '',
      contactName: '',
      phone: '',
      email: '',
      address: '',
      rating: 5,
      notes: '',
      tags: [],
    });
    setIsAddingNew(false);
  };

  const handleUpdateVendor = (id: string, updates: Partial<Vendor>) => {
    setVendors(vendors.map(v =>
      v.id === id
        ? { ...v, ...updates, updatedAt: new Date().toISOString() }
        : v
    ));
    setEditingId(null);
  };

  const handleDeleteVendor = (id: string) => {
    if (confirm('確定要刪除這個廠商嗎？')) {
      setVendors(vendors.filter(v => v.id !== id));
    }
  };

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = filterPlatform === 'all' || vendor.platform === filterPlatform;
    return matchesSearch && matchesPlatform;
  });

  const getPlatformInfo = (platformId: string) => {
    return PLATFORMS.find(p => p.id === platformId) || PLATFORMS[PLATFORMS.length - 1];
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Store className="w-6 h-6 text-purple-600" />
                <span>廠商管理</span>
              </CardTitle>
              <CardDescription>
                記錄和管理優質廠商資訊，方便後續採購聯絡
              </CardDescription>
            </div>
            <Button onClick={() => setIsAddingNew(true)} disabled={isAddingNew}>
              <Plus className="w-4 h-4 mr-2" />
              新增廠商
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜尋廠商名稱或備註..."
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filterPlatform}
                onChange={(e) => setFilterPlatform(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">所有平台</option>
                {PLATFORMS.map(p => (
                  <option key={p.id} value={p.id}>{p.icon} {p.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Add New Vendor Form */}
          {isAddingNew && (
            <div className="border-2 border-dashed border-purple-300 rounded-lg p-6 bg-purple-50">
              <h3 className="font-semibold text-purple-800 mb-4">新增廠商</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    廠商名稱 *
                  </label>
                  <Input
                    value={newVendor.name}
                    onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                    placeholder="輸入廠商名稱"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    平台
                  </label>
                  <select
                    value={newVendor.platform}
                    onChange={(e) => setNewVendor({ ...newVendor, platform: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  >
                    {PLATFORMS.map(p => (
                      <option key={p.id} value={p.id}>{p.icon} {p.name}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    店鋪網址 *
                  </label>
                  <Input
                    value={newVendor.shopUrl}
                    onChange={(e) => setNewVendor({ ...newVendor, shopUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    聯絡人
                  </label>
                  <Input
                    value={newVendor.contactName}
                    onChange={(e) => setNewVendor({ ...newVendor, contactName: e.target.value })}
                    placeholder="聯絡人姓名"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    電話
                  </label>
                  <Input
                    value={newVendor.phone}
                    onChange={(e) => setNewVendor({ ...newVendor, phone: e.target.value })}
                    placeholder="電話號碼"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <Input
                    value={newVendor.email}
                    onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })}
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    評分
                  </label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setNewVendor({ ...newVendor, rating: star })}
                        className="p-1"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= (newVendor.rating || 5)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    地址
                  </label>
                  <Input
                    value={newVendor.address}
                    onChange={(e) => setNewVendor({ ...newVendor, address: e.target.value })}
                    placeholder="廠商地址"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    備註
                  </label>
                  <textarea
                    value={newVendor.notes}
                    onChange={(e) => setNewVendor({ ...newVendor, notes: e.target.value })}
                    placeholder="其他備註資訊..."
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 h-20"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setIsAddingNew(false)}>
                  <X className="w-4 h-4 mr-1" />
                  取消
                </Button>
                <Button onClick={handleAddVendor}>
                  <Save className="w-4 h-4 mr-1" />
                  儲存
                </Button>
              </div>
            </div>
          )}

          {/* Vendor List */}
          <div className="space-y-4">
            {filteredVendors.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                {vendors.length === 0 ? (
                  <>
                    <Store className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>還沒有添加任何廠商</p>
                    <p className="text-sm mt-1">點擊「新增廠商」開始添加</p>
                  </>
                ) : (
                  <p>沒有符合搜尋條件的廠商</p>
                )}
              </div>
            ) : (
              filteredVendors.map((vendor) => {
                const platformInfo = getPlatformInfo(vendor.platform);
                const isEditing = editingId === vendor.id;

                return (
                  <div
                    key={vendor.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    {isEditing ? (
                      <EditVendorForm
                        vendor={vendor}
                        onSave={(updates) => handleUpdateVendor(vendor.id, updates)}
                        onCancel={() => setEditingId(null)}
                      />
                    ) : (
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">{platformInfo.icon}</span>
                            <h3 className="font-semibold text-lg">{vendor.name}</h3>
                            <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                              {platformInfo.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 mb-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= vendor.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                            {vendor.shopUrl && (
                              <a
                                href={vendor.shopUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-blue-600 hover:underline"
                              >
                                <ExternalLink className="w-4 h-4" />
                                <span className="truncate">{vendor.shopUrl}</span>
                              </a>
                            )}
                            {vendor.contactName && (
                              <div className="flex items-center gap-1">
                                <span className="font-medium">聯絡人:</span>
                                {vendor.contactName}
                              </div>
                            )}
                            {vendor.phone && (
                              <a
                                href={`tel:${vendor.phone}`}
                                className="flex items-center gap-1 hover:text-blue-600"
                              >
                                <Phone className="w-4 h-4" />
                                {vendor.phone}
                              </a>
                            )}
                            {vendor.email && (
                              <a
                                href={`mailto:${vendor.email}`}
                                className="flex items-center gap-1 hover:text-blue-600"
                              >
                                <Mail className="w-4 h-4" />
                                {vendor.email}
                              </a>
                            )}
                            {vendor.address && (
                              <div className="flex items-center gap-1 md:col-span-2">
                                <MapPin className="w-4 h-4" />
                                {vendor.address}
                              </div>
                            )}
                          </div>

                          {vendor.notes && (
                            <p className="mt-2 text-sm text-gray-500 bg-gray-50 p-2 rounded">
                              {vendor.notes}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => setEditingId(vendor.id)}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            title="編輯"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteVendor(vendor.id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                            title="刪除"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Stats */}
          {vendors.length > 0 && (
            <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t">
              <span>共 {vendors.length} 個廠商</span>
              <span>顯示 {filteredVendors.length} 個結果</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Edit Vendor Form Component
function EditVendorForm({
  vendor,
  onSave,
  onCancel,
}: {
  vendor: Vendor;
  onSave: (updates: Partial<Vendor>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState(vendor);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="廠商名稱"
        />
        <select
          value={formData.platform}
          onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
          className="border rounded-lg px-3 py-2"
        >
          {PLATFORMS.map(p => (
            <option key={p.id} value={p.id}>{p.icon} {p.name}</option>
          ))}
        </select>
        <Input
          value={formData.shopUrl}
          onChange={(e) => setFormData({ ...formData, shopUrl: e.target.value })}
          placeholder="店鋪網址"
          className="md:col-span-2"
        />
        <Input
          value={formData.contactName || ''}
          onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
          placeholder="聯絡人"
        />
        <Input
          value={formData.phone || ''}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="電話"
        />
        <Input
          value={formData.email || ''}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Email"
        />
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setFormData({ ...formData, rating: star })}
            >
              <Star
                className={`w-6 h-6 ${
                  star <= formData.rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
        <textarea
          value={formData.notes || ''}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="備註"
          className="md:col-span-2 border rounded-lg px-3 py-2 h-20"
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-1" />
          取消
        </Button>
        <Button onClick={() => onSave(formData)}>
          <Save className="w-4 h-4 mr-1" />
          儲存
        </Button>
      </div>
    </div>
  );
}
