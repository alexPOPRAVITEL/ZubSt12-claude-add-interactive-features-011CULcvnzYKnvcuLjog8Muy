import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Star, 
  MessageSquare, 
  User, 
  Calendar, 
  Edit, 
  Trash2, 
  Plus,
  Save,
  X,
  Loader2,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { supabase } from '../../utils/supabase';

interface Review {
  id: string;
  client_name: string;
  content: string;
  rating: number;
  project_id?: string;
  created_at: string;
}

interface ReviewsManagementProps {
  onBack: () => void;
}

export const ReviewsManagement: React.FC<ReviewsManagementProps> = ({ onBack }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    client_name: '',
    content: '',
    rating: 5,
    project_id: ''
  });

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error loading reviews:', error);
      setError('Ошибка загрузки отзывов');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const reviewData = {
        client_name: formData.client_name,
        content: formData.content,
        rating: formData.rating,
        project_id: formData.project_id || null
      };

      if (editingReview?.id) {
        // Update existing review
        const { error } = await supabase
          .from('testimonials')
          .update(reviewData)
          .eq('id', editingReview.id);
        
        if (error) throw error;
        alert('Отзыв обновлен!');
      } else {
        // Create new review
        const { error } = await supabase
          .from('testimonials')
          .insert([reviewData]);
        
        if (error) throw error;
        alert('Отзыв создан!');
      }

      await loadReviews();
      resetForm();
    } catch (error) {
      console.error('Error saving review:', error);
      setError('Ошибка сохранения отзыва');
    } finally {
      setSaving(false);
    }
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setFormData({
      client_name: review.client_name,
      content: review.content,
      rating: review.rating,
      project_id: review.project_id || ''
    });
  };

  const handleDeleteReview = async (id: string, clientName: string) => {
    if (!confirm(`Удалить отзыв от "${clientName}"?`)) return;

    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadReviews();
      alert('Отзыв удален!');
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Ошибка удаления отзыва');
    }
  };

  const resetForm = () => {
    setEditingReview(null);
    setIsCreating(false);
    setFormData({
      client_name: '',
      content: '',
      rating: 5,
      project_id: ''
    });
    setError(null);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredReviews = reviews.filter(review =>
    review.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate statistics
  const totalReviews = reviews.length;
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : '0.0';
  const fiveStarReviews = reviews.filter(review => review.rating === 5).length;
  const thisMonthReviews = reviews.filter(review => {
    const reviewDate = new Date(review.created_at);
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    return reviewDate > monthAgo;
  }).length;

  // Show form if creating or editing
  if (isCreating || editingReview) {
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
            {editingReview ? 'Редактировать отзыв' : 'Создать отзыв'}
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

        <form onSubmit={handleSaveReview} className="max-w-2xl space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Имя клиента *
            </label>
            <input
              type="text"
              required
              value={formData.client_name}
              onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              placeholder="Введите имя клиента"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Рейтинг *
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= formData.rating 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300 hover:text-yellow-300'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-4 text-sm text-gray-600">
                {formData.rating} из 5 звезд
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Текст отзыва *
            </label>
            <textarea
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              placeholder="Введите текст отзыва..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID проекта (необязательно)
            </label>
            <input
              type="text"
              value={formData.project_id}
              onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              placeholder="Связать с конкретным проектом"
            />
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
            <h1 className="text-2xl font-semibold text-gray-900">Управление отзывами</h1>
            <span className="text-sm text-gray-500">Модерация и управление отзывами клиентов</span>
          </div>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Добавить отзыв
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Всего отзывов</p>
              <p className="text-2xl font-bold text-gray-900">{totalReviews}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Средний рейтинг</p>
              <p className="text-2xl font-bold text-gray-900">{averageRating}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">5-звездочных</p>
              <p className="text-2xl font-bold text-gray-900">{fiveStarReviews}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">За месяц</p>
              <p className="text-2xl font-bold text-gray-900">{thisMonthReviews}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
        <div className="relative">
          <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Поиск отзывов по имени или тексту..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
          />
        </div>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">💬</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery ? 'Отзывы не найдены' : 'Нет отзывов'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchQuery ? 'Попробуйте изменить поисковый запрос' : 'Создайте первый отзыв'}
          </p>
          {!searchQuery && (
            <button
              onClick={() => setIsCreating(true)}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
            >
              Создать отзыв
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center">
                      <User className="w-5 h-5 text-gray-400 mr-2" />
                      <h3 className="text-lg font-semibold text-gray-900">{review.client_name}</h3>
                    </div>
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                      <span className="ml-2 text-sm text-gray-600">({review.rating}/5)</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{formatDate(review.created_at)}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-3 leading-relaxed">{review.content}</p>
                  
                  {review.project_id && (
                    <div className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                      Проект: {review.project_id}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => handleEditReview(review)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Редактировать"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteReview(review.id, review.client_name)}
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