import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Save,
  X,
  Stethoscope,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  DollarSign,
  Clock
} from 'lucide-react';
import { supabase, AppointmentServiceCategory, AppointmentService } from '../../utils/supabase';

interface AppointmentServicesManagementProps {
  onBack: () => void;
}

export const AppointmentServicesManagement: React.FC<AppointmentServicesManagementProps> = ({ onBack }) => {
  const [categories, setCategories] = useState<AppointmentServiceCategory[]>([]);
  const [services, setServices] = useState<AppointmentService[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingService, setEditingService] = useState<AppointmentService | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    category_id: '',
    name: '',
    duration: '',
    price: 0,
    description: '',
    order_index: 0,
    is_active: true
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Load categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('appointment_service_categories')
        .select('*')
        .order('order_index', { ascending: true });

      if (categoriesError) throw categoriesError;
      setCategories(categoriesData || []);

      // Load services
      const { data: servicesData, error: servicesError } = await supabase
        .from('appointment_services')
        .select('*')
        .order('order_index', { ascending: true });

      if (servicesError) throw servicesError;
      setServices(servicesData || []);
    } catch (error) {
      console.error('Error loading appointment services data:', error);
      setError('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const serviceData = {
        ...formData,
        price: formData.price || null,
        duration: formData.duration || null,
        description: formData.description || null,
        updated_at: new Date().toISOString()
      };

      if (editingService?.id) {
        // Update existing service
        const { error } = await supabase
          .from('appointment_services')
          .update(serviceData)
          .eq('id', editingService.id);
        
        if (error) throw error;
        alert('Услуга обновлена!');
      } else {
        // Create new service
        const { error } = await supabase
          .from('appointment_services')
          .insert([serviceData]);
        
        if (error) throw error;
        alert('Услуга создана!');
      }

      await loadData();
      resetForm();
    } catch (error) {
      console.error('Error saving service:', error);
      setError('Ошибка сохранения услуги');
    } finally {
      setSaving(false);
    }
  };

  const handleEditService = (service: AppointmentService) => {
    setEditingService(service);
    setFormData({
      category_id: service.category_id,
      name: service.name,
      duration: service.duration || '',
      price: service.price || 0,
      description: service.description || '',
      order_index: service.order_index,
      is_active: service.is_active
    });
  };

  const handleDeleteService = async (id: string, name: string) => {
    if (!confirm(`Удалить услугу "${name}"?`)) return;

    try {
      const { error } = await supabase
        .from('appointment_services')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadData();
      alert('Услуга удалена!');
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Ошибка удаления услуги');
    }
  };

  const toggleServiceStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('appointment_services')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      await loadData();
    } catch (error) {
      console.error('Error updating service status:', error);
      alert('Ошибка обновления статуса');
    }
  };

  const resetForm = () => {
    setEditingService(null);
    setIsCreating(false);
    setFormData({
      category_id: '',
      name: '',
      duration: '',
      price: 0,
      description: '',
      order_index: 0,
      is_active: true
    });
    setError(null);
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || 'Неизвестная категория';
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || service.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate statistics
  const totalServices = services.length;
  const activeServices = services.filter(s => s.is_active).length;
  const avgPrice = services.length > 0 
    ? Math.round(services.filter(s => s.price).reduce((sum, s) => sum + (s.price || 0), 0) / services.filter(s => s.price).length)
    : 0;

  // Show form if creating or editing
  if (isCreating || editingService) {
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={resetForm}
            className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">
            {editingService ? 'Редактировать услугу' : 'Создать услугу'}
          </h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <AlertTriangle className="w-5 h-5 text-red-500 mr-3 mt-0.5" />
            <div>
              <h3 className="text-red-800 font-medium">Ошибка</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSaveService} className="max-w-2xl space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Категория *
            </label>
            <select
              required
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
            >
              <option value="">Выберите категорию</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Название услуги *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              placeholder="Например: Лечение кариеса"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Длительность
              </label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                placeholder="30 мин"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Цена (₽)
              </label>
              <input
                type="number"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Описание
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              placeholder="Краткое описание услуги..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Порядок отображения
            </label>
            <input
              type="number"
              min="0"
              value={formData.order_index}
              onChange={(e) => setFormData({ ...formData, order_index: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
              Активная услуга (доступна для записи)
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Сохранение...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Сохранить
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Услуги для записи</h1>
            <span className="text-sm text-gray-500">Управление услугами для модального окна записи</span>
          </div>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Добавить услугу
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
          <AlertTriangle className="w-5 h-5 text-red-500 mr-3 mt-0.5" />
          <div>
            <h3 className="text-red-800 font-medium">Ошибка</h3>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Всего услуг</p>
              <p className="text-2xl font-bold text-gray-900">{totalServices}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Stethoscope className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Активных</p>
              <p className="text-2xl font-bold text-gray-900">{activeServices}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Средняя цена</p>
              <p className="text-2xl font-bold text-gray-900">{avgPrice.toLocaleString()}₽</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Поиск услуг..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
          >
            <option value="all">Все категории</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Services List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🦷</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery || selectedCategory !== 'all' ? 'Услуги не найдены' : 'Нет услуг'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchQuery || selectedCategory !== 'all' 
              ? 'Попробуйте изменить фильтры или поисковый запрос' 
              : 'Создайте первую услугу для записи'}
          </p>
          {!searchQuery && selectedCategory === 'all' && (
            <button
              onClick={() => setIsCreating(true)}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
            >
              Создать первую услугу
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {getCategoryName(service.category_id)}
                    </span>
                  </div>

                  {service.description && (
                    <p className="text-gray-600 mb-3">{service.description}</p>
                  )}

                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    {service.duration && (
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{service.duration}</span>
                      </div>
                    )}
                    {service.price && (
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        <span>{service.price.toLocaleString()} ₽</span>
                      </div>
                    )}
                    <span>Порядок: {service.order_index}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => toggleServiceStatus(service.id, service.is_active)}
                    className={`p-2 transition-colors ${
                      service.is_active 
                        ? 'text-green-600 hover:text-green-700' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                    title={service.is_active ? 'Деактивировать' : 'Активировать'}
                  >
                    {service.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleEditService(service)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Редактировать"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteService(service.id, service.name)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Удалить"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};