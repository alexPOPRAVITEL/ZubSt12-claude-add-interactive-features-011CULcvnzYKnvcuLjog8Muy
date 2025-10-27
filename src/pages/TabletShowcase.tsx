import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TabletGallery } from '../components/TabletGallery';
import { QRCodeDisplay } from '../components/QRCodeDisplay';
import { StylusInput } from '../components/StylusInput';
import { AnimatedCursor } from '../components/AnimatedCursor';
import {
  Camera,
  QrCode,
  PenTool,
  Clock,
  MapPin,
  Phone,
  Mail,
  Star,
  Heart,
  Award,
  Users,
  Calendar,
  Sparkles
} from 'lucide-react';

export const TabletShowcase: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'welcome' | 'gallery' | 'qr' | 'feedback'>('welcome');
  const [stats, setStats] = useState({
    patients: 5000,
    reviews: 1200,
    experience: 15,
    doctors: 8
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeSection === 'welcome') {
        setActiveSection('gallery');
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [activeSection]);

  const handleFeedbackSubmit = (imageData: string, text: string) => {
    console.log('Feedback submitted:', { imageData, text });
  };

  const quickActions = [
    {
      icon: <Camera className="w-8 h-8" />,
      label: 'Галерея',
      action: () => setActiveSection('gallery'),
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: <QrCode className="w-8 h-8" />,
      label: 'Скачать приложение',
      action: () => setActiveSection('qr'),
      color: 'from-green-500 to-green-600'
    },
    {
      icon: <PenTool className="w-8 h-8" />,
      label: 'Оставить отзыв',
      action: () => setActiveSection('feedback'),
      color: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-white to-primary/5">
      <AnimatedCursor />

      <nav className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-30 border-b-2 border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <img
                src="https://files.salebot.pro/uploads/file_item/file/575843/ЗУБНАЯ_СТАНЦИЯ__6_.png"
                alt="Зубная Станция"
                className="h-16 w-auto"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Зубная Станция</h1>
                <p className="text-sm text-gray-600">Семейная стоматология</p>
              </div>
            </motion.div>

            <div className="flex gap-4">
              {quickActions.map((action, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={action.action}
                  className={`px-6 py-3 bg-gradient-to-r ${action.color} text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all stylus-target flex items-center gap-2`}
                >
                  {action.icon}
                  <span className="hidden md:inline">{action.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {activeSection === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 bg-primary/10 px-6 py-3 rounded-full mb-6"
                >
                  <Sparkles className="w-5 h-5 text-primary" />
                  <span className="text-primary font-semibold">Добро пожаловать!</span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary-dark bg-clip-text text-transparent"
                >
                  Ваша улыбка - наша работа
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl text-gray-700 max-w-3xl mx-auto"
                >
                  Современная стоматология с заботой о каждом пациенте
                </motion.p>
              </div>

              <div className="grid md:grid-cols-4 gap-6 mb-12">
                {[
                  { icon: <Users className="w-8 h-8" />, value: `${stats.patients.toLocaleString()}+`, label: 'Довольных пациентов', color: 'from-blue-500 to-blue-600' },
                  { icon: <Star className="w-8 h-8" />, value: `${stats.reviews.toLocaleString()}+`, label: 'Положительных отзывов', color: 'from-yellow-500 to-yellow-600' },
                  { icon: <Award className="w-8 h-8" />, value: `${stats.experience}+`, label: 'Лет опыта', color: 'from-purple-500 to-purple-600' },
                  { icon: <Heart className="w-8 h-8" />, value: `${stats.doctors}`, label: 'Врачей-специалистов', color: 'from-red-500 to-red-600' }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all stylus-target"
                  >
                    <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center text-white mb-4 mx-auto`}>
                      {stat.icon}
                    </div>
                    <div className="text-4xl font-bold text-gray-800 mb-2">{stat.value}</div>
                    <div className="text-gray-600">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-gradient-to-r from-primary to-primary-dark rounded-3xl p-12 text-white text-center shadow-2xl"
              >
                <h2 className="text-4xl font-bold mb-6">Изучите наши возможности</h2>
                <p className="text-xl mb-8 opacity-90">
                  Используйте сенсорный экран для навигации по разделам
                </p>
                <div className="grid md:grid-cols-3 gap-6">
                  {quickActions.map((action, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={action.action}
                      className="bg-white/20 backdrop-blur-sm hover:bg-white/30 p-8 rounded-2xl transition-all stylus-target"
                    >
                      <div className="mb-4">{action.icon}</div>
                      <div className="font-semibold text-lg">{action.label}</div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="bg-white rounded-3xl p-8 shadow-xl"
              >
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="flex items-start gap-4 stylus-target p-4 rounded-2xl hover:bg-gray-50 transition-colors">
                    <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Адрес</h3>
                      <p className="text-gray-600">ул. Панфиловцев, 14, Барнаул</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 stylus-target p-4 rounded-2xl hover:bg-gray-50 transition-colors">
                    <Phone className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Телефон</h3>
                      <p className="text-gray-600">+7 (961) 978-54-54</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 stylus-target p-4 rounded-2xl hover:bg-gray-50 transition-colors">
                    <Clock className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Режим работы</h3>
                      <p className="text-gray-600">Пн-Пт: 09:00-20:00</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeSection === 'gallery' && (
            <motion.div
              key="gallery"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
            >
              <div className="mb-8">
                <button
                  onClick={() => setActiveSection('welcome')}
                  className="px-6 py-3 bg-white text-primary rounded-xl font-semibold hover:bg-gray-50 transition-colors stylus-target"
                >
                  ← Назад
                </button>
              </div>
              <TabletGallery />
            </motion.div>
          )}

          {activeSection === 'qr' && (
            <motion.div
              key="qr"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
            >
              <div className="mb-8">
                <button
                  onClick={() => setActiveSection('welcome')}
                  className="px-6 py-3 bg-white text-primary rounded-xl font-semibold hover:bg-gray-50 transition-colors stylus-target"
                >
                  ← Назад
                </button>
              </div>
              <QRCodeDisplay size="large" showInstructions={true} />
            </motion.div>
          )}

          {activeSection === 'feedback' && (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
            >
              <div className="mb-8">
                <button
                  onClick={() => setActiveSection('welcome')}
                  className="px-6 py-3 bg-white text-primary rounded-xl font-semibold hover:bg-gray-50 transition-colors stylus-target"
                >
                  ← Назад
                </button>
              </div>
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold mb-4">Поделитесь своим мнением</h2>
                <p className="text-xl text-gray-700">
                  Напишите отзыв или нарисуйте что-нибудь для нас
                </p>
              </div>
              <StylusInput onSubmit={handleFeedbackSubmit} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <QRCodeDisplay variant="floating" size="small" showInstructions={false} />

      <footer className="mt-16 bg-white/80 backdrop-blur-md border-t-2 border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-600">
          <p className="text-lg">
            © 2024 Зубная Станция. Все права защищены.
          </p>
          <p className="mt-2">
            Сделано с ❤️ для наших пациентов
          </p>
        </div>
      </footer>
    </div>
  );
};
