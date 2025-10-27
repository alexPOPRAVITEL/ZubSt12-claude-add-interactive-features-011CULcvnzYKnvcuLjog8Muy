import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Search, CreditCard as Edit, Trash2, Eye, Calendar, User, BookOpen, Save, X } from 'lucide-react';
import { supabase, BlogPost } from '../../utils/supabase';

interface BlogManagementProps {
  onBack: () => void;
}

export const BlogManagement: React.FC<BlogManagementProps> = ({ onBack }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const categories = [
    { id: 'tips', label: 'Полезные советы' },
    { id: 'doctor-opinion', label: 'Мнение врача' },
    { id: 'children', label: 'Детская стоматология' },
    { id: 'research', label: 'Исследования' }
  ];

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePost = async (postData: Partial<BlogPost>) => {
    try {
      // Валидация обязательных полей
      if (!postData.title || !postData.title.trim()) {
        alert('Заголовок статьи обязателен');
        return;
      }

      if (!postData.content || !postData.content.trim()) {
        alert('Содержание статьи обязательно');
        return;
      }

      const cleanData = {
        title: postData.title.trim(),
        content: postData.content.trim(),
        excerpt: postData.excerpt && postData.excerpt.trim() ? postData.excerpt.trim() : null,
        category: postData.category || null,
        author: postData.author && postData.author.trim() ? postData.author.trim() : null,
        is_published: postData.is_published || false,
        images: postData.images && postData.images.length > 0 ? postData.images : null,
        tags: postData.tags && postData.tags.length > 0 ? postData.tags : null,
        updated_at: new Date().toISOString()
      };

      if (editingPost?.id) {
        // Update existing post
        const { error } = await supabase
          .from('blog_posts')
          .update(cleanData)
          .eq('id', editingPost.id);

        if (error) throw error;
      } else {
        // Create new post
        const { error } = await supabase
          .from('blog_posts')
          .insert([cleanData]);

        if (error) throw error;
      }

      await loadPosts();
      setEditingPost(null);
      setIsCreating(false);
      alert('Статья сохранена!');
    } catch (error) {
      console.error('Error saving post:', error);
      alert(`Ошибка сохранения статьи: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm('Удалить статью?')) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadPosts();
      alert('Статья удалена!');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Ошибка удаления статьи');
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (editingPost || isCreating) {
    return <PostEditor 
      post={editingPost} 
      onSave={handleSavePost} 
      onCancel={() => {
        setEditingPost(null);
        setIsCreating(false);
      }}
      categories={categories}
    />;
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
            <h1 className="text-2xl font-semibold text-gray-900">Управление блогом</h1>
            <span className="text-sm text-gray-500">Создание и редактирование статей</span>
          </div>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Создать статью
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Поиск статей..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
          />
        </div>
      </div>

      {/* Posts List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-3">{post.content.substring(0, 150)}...</p>
                </div>
              </div>

              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Calendar className="w-4 h-4 mr-1" />
                <span className="mr-4">{new Date(post.created_at).toLocaleDateString('ru-RU')}</span>
                <User className="w-4 h-4 mr-1" />
                <span>{post.author || 'Команда'}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  post.is_published ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  {post.is_published ? 'Опубликована' : 'Черновик'}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingPost(post)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
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

// Post Editor Component
const PostEditor: React.FC<{
  post: BlogPost | null;
  onSave: (data: Partial<BlogPost>) => void;
  onCancel: () => void;
  categories: Array<{ id: string; label: string }>;
}> = ({ post, onSave, onCancel, categories }) => {
  const [formData, setFormData] = useState({
    title: post?.title || '',
    content: post?.content || '',
    excerpt: post?.excerpt || '',
    category: post?.category || 'tips',
    author: post?.author || 'Команда Зубной Станции',
    is_published: post?.is_published || false,
    images: post?.images || [],
    tags: post?.tags || []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={onCancel}
          className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-semibold text-gray-900">
          {post ? 'Редактировать статью' : 'Создать статью'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Заголовок *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Категория
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Краткое описание
          </label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
            placeholder="Краткое описание для превью..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Содержание статьи *
          </label>
          <textarea
            required
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={15}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
            placeholder="Содержание статьи..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Автор
          </label>
          <input
            type="text"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="published"
            checked={formData.is_published}
            onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
            className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
          />
          <label htmlFor="published" className="ml-2 text-sm text-gray-700">
            Опубликовать статью
          </label>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Отмена
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Сохранить
          </button>
        </div>
      </form>
    </div>
  );
};