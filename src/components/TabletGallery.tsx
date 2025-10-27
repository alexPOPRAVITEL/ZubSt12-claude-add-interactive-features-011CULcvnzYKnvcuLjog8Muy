import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn, Download, Share2, Heart } from 'lucide-react';
import { supabase } from '../utils/supabase';

interface GalleryImage {
  id: string;
  url: string;
  title: string;
  description: string;
  date: string;
  category: string;
  metadata?: {
    width?: number;
    height?: number;
    photographer?: string;
  };
}

export const TabletGallery: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const categories = [
    { id: 'all', label: 'Все фото' },
    { id: 'clinic', label: 'Клиника' },
    { id: 'team', label: 'Команда' },
    { id: 'equipment', label: 'Оборудование' },
    { id: 'results', label: 'Результаты' },
    { id: 'events', label: 'События' }
  ];

  useEffect(() => {
    loadImages();
  }, [filter]);

  const loadImages = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('category', filter);
      }

      const { data, error } = await query;

      if (error) throw error;

      if (data) {
        setImages(data.map(img => ({
          id: img.id,
          url: img.image_url,
          title: img.title,
          description: img.description || '',
          date: new Date(img.created_at).toLocaleDateString('ru-RU'),
          category: img.category,
          metadata: img.metadata || {}
        })));
      }
    } catch (error) {
      console.error('Error loading gallery images:', error);
      loadFallbackImages();
    } finally {
      setLoading(false);
    }
  };

  const loadFallbackImages = () => {
    const fallbackImages: GalleryImage[] = [
      {
        id: '1',
        url: 'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=1200',
        title: 'Современный кабинет',
        description: 'Наш полностью оборудованный стоматологический кабинет с новейшим оборудованием',
        date: new Date().toLocaleDateString('ru-RU'),
        category: 'clinic'
      },
      {
        id: '2',
        url: 'https://images.pexels.com/photos/3845622/pexels-photo-3845622.jpeg?auto=compress&cs=tinysrgb&w=1200',
        title: 'Команда профессионалов',
        description: 'Наши опытные стоматологи готовы помочь вам',
        date: new Date().toLocaleDateString('ru-RU'),
        category: 'team'
      },
      {
        id: '3',
        url: 'https://images.pexels.com/photos/3845623/pexels-photo-3845623.jpeg?auto=compress&cs=tinysrgb&w=1200',
        title: 'Инновационное оборудование',
        description: 'Передовые технологии для точной диагностики',
        date: new Date().toLocaleDateString('ru-RU'),
        category: 'equipment'
      },
      {
        id: '4',
        url: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=1200',
        title: 'До и после лечения',
        description: 'Примеры успешного восстановления улыбки',
        date: new Date().toLocaleDateString('ru-RU'),
        category: 'results'
      },
      {
        id: '5',
        url: 'https://images.pexels.com/photos/6627374/pexels-photo-6627374.jpeg?auto=compress&cs=tinysrgb&w=1200',
        title: 'Консультация пациента',
        description: 'Индивидуальный подход к каждому пациенту',
        date: new Date().toLocaleDateString('ru-RU'),
        category: 'clinic'
      },
      {
        id: '6',
        url: 'https://images.pexels.com/photos/3845468/pexels-photo-3845468.jpeg?auto=compress&cs=tinysrgb&w=1200',
        title: 'Рабочий процесс',
        description: 'Точность и внимание к деталям',
        date: new Date().toLocaleDateString('ru-RU'),
        category: 'team'
      }
    ];
    setImages(filter === 'all' ? fallbackImages : fallbackImages.filter(img => img.category === filter));
  };

  const openLightbox = (image: GalleryImage, index: number) => {
    setSelectedImage(image);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    const newIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  const prevImage = () => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (!selectedImage) return;
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'Escape') closeLightbox();
  };

  return (
    <div
      className="w-full h-full p-6"
      onKeyDown={handleKeyPress}
      tabIndex={0}
    >
      <div className="flex justify-center mb-8 overflow-x-auto pb-4 stylus-scroll">
        <div className="flex gap-3">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setFilter(category.id)}
              className={`px-6 py-3 rounded-2xl font-medium transition-all duration-300 whitespace-nowrap stylus-target ${
                filter === category.id
                  ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-primary"></div>
            <div className="absolute inset-0 animate-ping rounded-full border-4 border-primary opacity-20"></div>
          </div>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-2 md:grid-cols-3 gap-6"
        >
          {images.map((image, index) => (
            <motion.div
              key={image.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="relative group cursor-pointer stylus-target"
              onClick={() => openLightbox(image, index)}
            >
              <div className="relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-80 object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-xl font-bold mb-2">{image.title}</h3>
                    <p className="text-sm opacity-90">{image.description}</p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xs bg-white/20 px-3 py-1 rounded-full">
                        {image.date}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(image.id);
                        }}
                        className="stylus-target"
                      >
                        <Heart
                          className={`w-6 h-6 transition-colors ${
                            favorites.has(image.id) ? 'fill-red-500 text-red-500' : 'text-white'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-8 h-8 text-white drop-shadow-lg" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors z-10 stylus-target"
            >
              <X className="w-10 h-10" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-6 text-white hover:text-gray-300 transition-colors stylus-target"
            >
              <ChevronLeft className="w-12 h-12" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-6 text-white hover:text-gray-300 transition-colors stylus-target"
            >
              <ChevronRight className="w-12 h-12" />
            </button>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-6xl max-h-[85vh] mx-auto"
            >
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                className="max-w-full max-h-[70vh] object-contain rounded-2xl shadow-2xl"
              />
              <div className="mt-6 text-center text-white px-8">
                <h2 className="text-3xl font-bold mb-3">{selectedImage.title}</h2>
                <p className="text-lg opacity-90 mb-4">{selectedImage.description}</p>
                <div className="flex justify-center gap-4 mt-6">
                  <button className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors stylus-target">
                    <Download className="w-5 h-5" />
                    <span>Скачать</span>
                  </button>
                  <button className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors stylus-target">
                    <Share2 className="w-5 h-5" />
                    <span>Поделиться</span>
                  </button>
                  <button
                    onClick={() => toggleFavorite(selectedImage.id)}
                    className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors stylus-target"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        favorites.has(selectedImage.id) ? 'fill-red-500 text-red-500' : ''
                      }`}
                    />
                    <span>В избранное</span>
                  </button>
                </div>
              </div>
            </motion.div>

            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white text-lg">
              {currentIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
