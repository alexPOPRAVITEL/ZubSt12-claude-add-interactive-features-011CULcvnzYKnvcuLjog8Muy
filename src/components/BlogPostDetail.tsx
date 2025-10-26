import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, User, Share2, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { supabase, BlogPost } from '../utils/supabase';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export const BlogPostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('id', id)
          .eq('is_published', true)
          .single();

        if (error) throw error;
        setPost(data);

        // Fetch related posts
        if (data?.category) {
          const { data: related } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('category', data.category)
            .eq('is_published', true)
            .neq('id', id)
            .limit(3);
          
          setRelatedPosts(related || []);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

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

  const formatContent = (content: string) => {
    // Convert markdown-like content to HTML
    return content
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mb-6 text-gray-900">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-semibold mb-4 mt-8 text-gray-800">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold mb-3 mt-6 text-gray-800">$1</h3>')
      .replace(/^#### (.*$)/gm, '<h4 class="text-lg font-semibold mb-2 mt-4 text-gray-800">$1</h4>')
      .replace(/^\*\*(.*?)\*\*/gm, '<strong class="font-semibold text-gray-900">$1</strong>')
      .replace(/^\*(.*?)\*/gm, '<em class="italic">$1</em>')
      .replace(/^- (.*$)/gm, '<li class="mb-2">$1</li>')
      .replace(/(<li.*<\/li>)/gs, '<ul class="list-disc list-inside mb-4 space-y-2 text-gray-700">$1</ul>')
      .replace(/^\d+\. (.*$)/gm, '<li class="mb-2">$1</li>')
      .replace(/^([^<\n].*)$/gm, '<p class="mb-4 text-gray-700 leading-relaxed">$1</p>')
      .replace(/\n\n/g, '\n');
  };

  const handleShare = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt || 'Интересная статья от Зубной Станции',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Ссылка скопирована в буфер обмена!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Статья не найдена</h1>
          <Link to="/blog" className="text-primary hover:underline">
            Вернуться к блогу
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        {post.images && post.images.length > 0 ? (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000 }}
            className="h-full"
          >
            {post.images.map((image, index) => (
              <SwiperSlide key={index}>
                <div className="relative h-full">
                  <img
                    src={image}
                    alt={`${post.title} - изображение ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="h-full bg-gradient-to-r from-primary to-primary-dark" />
        )}
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl px-4">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold mb-4 leading-tight"
            >
              {post.title}
            </motion.h1>
            {post.excerpt && (
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl opacity-90"
              >
                {post.excerpt}
              </motion.p>
            )}
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            to="/blog"
            className="inline-flex items-center text-primary hover:text-primary-dark transition-colors duration-300"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Вернуться к блогу
          </Link>
        </motion.div>

        {/* Article Meta */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-8 shadow-lg mb-8"
        >
          <div className="flex flex-wrap items-center justify-between mb-6">
            <div className="flex items-center space-x-6 text-gray-600">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                <span>{formatDate(post.created_at)}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                <span>{post.read_time || '5 мин чтения'}</span>
              </div>
              <div className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                <span>{post.author || 'Команда Зубной Станции'}</span>
              </div>
            </div>
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-xl hover:bg-primary-dark transition-colors duration-300"
            >
              <Share2 className="w-4 h-4" />
              <span>Поделиться</span>
            </button>
          </div>

          {/* Article Content */}
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
          />
        </motion.div>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16"
          >
            <h2 className="text-3xl font-bold text-center mb-12">Похожие статьи</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost, index) => (
                <motion.article
                  key={relatedPost.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <Link to={`/blog/${relatedPost.id}`}>
                    <div className="relative h-48">
                      <img
                        src={relatedPost.images?.[0] || "https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=600"}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-semibold mb-2 hover:text-primary transition-colors duration-300">
                        {relatedPost.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        {relatedPost.excerpt || relatedPost.content.substring(0, 100) + '...'}
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <BookOpen className="w-4 h-4 mr-1" />
                        <span>{relatedPost.read_time || '5 мин чтения'}</span>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </motion.section>
        )}

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-8 text-white text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Есть вопросы?</h2>
          <p className="text-xl mb-8 opacity-90">
            Запишитесь на консультацию к нашим специалистам
          </p>
          <Link
            to="/contacts"
            className="inline-block bg-white text-primary px-8 py-4 rounded-xl font-medium hover:bg-gray-100 transition-colors duration-300"
          >
            Записаться на приём
          </Link>
        </motion.section>
      </div>
    </div>
  );
};