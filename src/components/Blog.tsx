import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, User } from 'lucide-react';
import { fetchBlogPosts, BlogPost } from '../utils/supabase';

export const Blog: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [email, setEmail] = useState('');
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', label: 'Все статьи' },
    { id: 'tips', label: '💡 Полезные советы' },
    { id: 'doctor-opinion', label: '👨‍⚕️ Мнение врача' },
    { id: 'children', label: '👶 Детская стоматология' },
    { id: 'research', label: '📊 Исследования' }
  ];

  // Fallback data in case the API call fails
  const fallbackArticles = [
    // ... existing articles array content
  ];

  useEffect(() => {
    const loadBlogPosts = async () => {
      setLoading(true);
      try {
        const posts = await fetchBlogPosts(activeCategory === 'all' ? undefined : activeCategory);
        if (posts.length > 0) {
          setBlogPosts(posts);
        } else {
          // Use fallback data if no posts are returned
          console.log('No blog posts found, using fallback data');
          setBlogPosts([]);
        }
      } catch (error) {
        console.error('Error loading blog posts:', error);
        setBlogPosts([]);
      } finally {
        setLoading(false);
      }
    };

    loadBlogPosts();
  }, [activeCategory]);

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  // Determine read time based on content length
  const getReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} мин чтения`;
  };

  const handleSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle subscription logic here
    console.log('Subscription email:', email);
    setEmail('');
    alert('Спасибо за подписку! Мы будем присылать вам полезные статьи.');
  };

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-bold text-center mb-8">
            Здоровые зубы — полезные советы
          </h1>
          
          <p className="text-xl text-gray-700 text-center mb-12 max-w-3xl mx-auto">
            Простые советы от наших врачей для здоровья ваших зубов
          </p>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Articles Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : blogPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {blogPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="relative">
                    <img
                      src={post.images && post.images.length > 0 ? post.images[0] : "https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=600"}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                        {post.category ? categories.find(cat => cat.id === post.category)?.label || post.category : 'Общее'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span className="mr-4">{formatDate(post.created_at)}</span>
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{post.read_time || getReadTime(post.content)}</span>
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-3 hover:text-primary transition-colors duration-300 cursor-pointer">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4">{post.excerpt || post.content.substring(0, 150) + '...'}</p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="w-4 h-4 mr-1" />
                        <span>{post.author || 'Команда Зубной Станции'}</span>
                      </div>
                      <Link 
                        to={`/blog/${post.id}`}
                        className="text-primary font-medium hover:text-primary-dark transition-colors duration-300"
                      >
                        Читать далее
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-2xl font-semibold mb-4">Статьи скоро появятся</h3>
              <p className="text-gray-600 mb-8">
                Мы работаем над наполнением блога полезной информацией о стоматологии
              </p>
              <Link
                to="/contacts"
                className="inline-block bg-primary text-white px-8 py-4 rounded-xl font-medium hover:bg-primary-dark transition-colors duration-300"
              >
                Задать вопрос специалисту
              </Link>
            </div>
          )}

          {/* Subscription Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8 text-center"
          >
            <h2 className="text-3xl font-bold mb-4">Подпишитесь на наши статьи</h2>
            <p className="text-xl text-gray-600 mb-8">
              Получайте полезные советы о здоровье зубов прямо на почту
            </p>
            
            <form onSubmit={handleSubscription} className="max-w-md mx-auto flex gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ваш email"
                required
                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-primary focus:border-primary"
              />
              <button
                type="submit"
                className="bg-primary text-white px-6 py-3 rounded-xl hover:bg-primary-dark transition-colors duration-300 font-medium"
              >
                Подписаться
              </button>
            </form>
          </motion.section>
        </motion.div>
      </div>
    </div>
  );
};