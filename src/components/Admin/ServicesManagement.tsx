import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Search, CreditCard as Edit, Trash2, Eye, Star, TrendingUp, Users, Calendar, DollarSign, Save, X, Loader2 } from 'lucide-react';
import { supabase } from '../../utils/supabase';

interface Service {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  category: 'services' | 'products';
  image: string;
  description: string;
  duration?: string;
  rating: number;
  popular: boolean;
  free: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

interface ServicesManagementProps {
  onBack: () => void;
}

export const ServicesManagement: React.FC<ServicesManagementProps> = ({ onBack }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  const categories = [
    { id: 'all', label: 'Все услуги', icon: '🦷' },
    { id: 'services', label: 'Услуги', icon: '🩺' },
    { id: 'products', label: 'Товары', icon: '🛒' }
  ];

  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    original_price: 0,
    category: 'services' as 'services' | 'products',
    image: '',
    description: '',
    duration: '',
    rating: 5.0,
    popular: false,
    free: false,
    is_published: true
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('marketplace_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error loading services:', error);
      alert('Ошибка загрузки услуг');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Валидация обязательных полей
      if (!formData.name || !formData.name.trim()) {
        alert('Название услуги обязательно');
        setSaving(false);
        return;
      }

      if (!formData.description || !formData.description.trim()) {
        alert('Описание услуги обязательно');
        setSaving(false);
        return;
      }

      if (!formData.image || !formData.image.trim()) {
        alert('Изображение (emoji или URL) обязательно');
        setSaving(false);
        return;
      }

      if (formData.price <= 0) {
        alert('Цена должна быть больше 0');
        setSaving(false);
        return;
      }

      const serviceData = {
        name: formData.name.trim(),
        price: formData.price,
        original_price: formData.original_price > 0 ? formData.original_price : null,
        category: formData.category,
        image: formData.image.trim(),
        description: formData.description.trim(),
        duration: formData.duration && formData.duration.trim() ? formData.duration.trim() : null,
        rating: formData.rating,
        popular: formData.popular,
        free: formData.free,
        is_published: formData.is_published,
        updated_at: new Date().toISOString()
      };

      if (editingService?.id) {
        // Update existing service
        const { error } = await supabase
          .from('marketplace_items')
          .update(serviceData)
          .eq('id', editingService.id);

        if (error) throw error;
        alert('Услуга обновлена!');
      } else {
        // Create new service
        const { error } = await supabase
          .from('marketplace_items')
          .insert([serviceData]);

        if (error) throw error;
        alert('Услуга создана!');
      }

      await loadServices();
      resetForm();
    } catch (error) {
      console.error('Error saving service:', error);
      alert(`Ошибка сохранения услуги: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      price: service.price,
      original_price: service.original_price || 0,
      category: service.category,
      image: service.image,
      description: service.description,
      duration: service.duration || '',
      rating: service.rating,
      popular: service.popular,
      free: service.free,
      is_published: service.is_published
    });
  };

  const handleDeleteService = async (id: string, name: string) => {
    if (!confirm(`Удалить услугу "${name}"?`)) return;

    try {
      const { error } = await supabase
        .from('marketplace_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadServices();
      alert('Услуга удалена!');
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Ошибка удаления услуги');
    }
  };

  const toggleServiceStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('marketplace_items')
        .update({ is_published: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      await loadServices();
    } catch (error) {
      console.error('Error updating service status:', error);
      alert('Ошибка обновления статуса');
    }
  };

  const resetForm = () => {
    setEditingService(null);
    setIsCreating(false);
    setFormData({
      name: '',
      price: 0,
      original_price: 0,
      category: 'services',
      image: '',
      description: '',
      duration: '',
      rating: 5.0,
      popular: false,
      free: false,
      is_published: true
    });
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalServices = services.length;
  const activeServices = services.filter(s => s.is_published).length;
  const avgPrice = services.length > 0 ? Math.round(services.reduce((sum, s) => sum + s.price, 0) / services.length) : 0;
  const popularServices = services.filter(s => s.popular).length;

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

        <form onSubmit={handleSaveService} className="max-w-2xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Категория *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as 'services' | 'products' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              >
                <option value="services">Услуги</option>
                <option value="products">Товары</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Описание *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              placeholder="Подробное описание услуги..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Цена (₽) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Старая цена (₽)
              </label>
              <input
                type="number"
                min="0"
                value={formData.original_price}
                onChange={(e) => setFormData({ ...formData, original_price: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                placeholder="Для показа скидки"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Рейтинг
              </label>
              <input
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Изображение (emoji или URL)
              </label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                placeholder="🦷 или https://example.com/image.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Длительность
              </label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                placeholder="30-60 мин"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.popular}
                onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <span className="ml-2 text-sm text-gray-700">Популярная услуга</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.free}
                onChange={(e) => setFormData({ ...formData, free: e.target.checked })}
                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <span className="ml-2 text-sm text-gray-700">Бесплатная</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_published}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <span className="ml-2 text-sm text-gray-700">Опубликовать</span>
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={onBack}
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Управление услугами</h1>
                <span className="text-sm text-gray-500">Каталог, цены, акции</span>
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
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Всего услуг</p>
                <p className="text-2xl font-bold text-gray-900">{totalServices}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Star className="w-6 h-6 text-blue-600" />
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
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Популярных</p>
                <p className="text-2xl font-bold text-gray-900">{popularServices}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Users className="w-6 h-6 text-purple-600" />
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
            <div className="flex gap-2 overflow-x-auto">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.icon} {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🦷</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Нет услуг</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery ? 'По вашему запросу ничего не найдено' : 'Создайте первую услугу'}
            </p>
            <button
              onClick={() => setIsCreating(true)}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
            >
              Создать услугу
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{service.image}</span>
                      <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{service.description}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Цена:</span>
                    <div className="flex items-center gap-2">
                      {service.original_price && service.original_price > service.price && (
                        <span className="text-sm text-gray-400 line-through">
                          {service.original_price.toLocaleString()}₽
                        </span>
                      )}
                      <span className="text-lg font-bold text-primary">
                        {service.free ? 'Бесплатно' : `${service.price.toLocaleString()}₽`}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Категория:</span>
                    <span className="text-sm font-medium">
                      {service.category === 'services' ? 'Услуги' : 'Товары'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Рейтинг:</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm font-medium">{service.rating}</span>
                    </div>
                  </div>

                  {service.duration && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Длительность:</span>
                      <span className="text-sm font-medium">{service.duration}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {service.popular && (
                    <span className="px-2 py-1 bg-orange-100 text-orange-600 text-xs font-medium rounded-full">
                      Популярная
                    </span>
                  )}
                  {service.free && (
                    <span className="px-2 py-1 bg-green-100 text-green-600 text-xs font-medium rounded-full">
                      Бесплатная
                    </span>
                  )}
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    service.is_published ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {service.is_published ? 'Опубликована' : 'Черновик'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <button
                    onClick={() => toggleServiceStatus(service.id, service.is_published)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      service.is_published 
                        ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                        : 'bg-green-100 text-green-600 hover:bg-green-200'
                    }`}
                  >
                    {service.is_published ? 'Скрыть' : 'Опубликовать'}
                  </button>
                  <div className="flex gap-1">
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
    </div>
  );
};