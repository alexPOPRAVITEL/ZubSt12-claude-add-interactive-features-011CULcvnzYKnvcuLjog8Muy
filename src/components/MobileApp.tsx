import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Smartphone, 
  Calendar, 
  CreditCard, 
  MessageCircle, 
  Bell, 
  Download,
  Star,
  Clock,
  Users,
  Shield,
  Heart,
  Camera
} from 'lucide-react';

export const MobileApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState('features');

  const features = [
    {
      icon: <Calendar className="w-8 h-8 text-primary" />,
      title: 'Запись и управление',
      description: 'Записывайтесь к врачу в 2 клика',
      details: [
        'Онлайн-запись к любому врачу',
        'Напоминания о визитах',
        'История всех посещений',
        'Загрузка анализов и снимков'
      ]
    },
    {
      icon: <CreditCard className="w-8 h-8 text-primary" />,
      title: 'Финансы и бонусы',
      description: 'Контролируйте расходы и экономьте',
      details: [
        'Баланс бонусного счёта',
        'История всех платежей',
        'Активные рассрочки',
        'Персональные скидки и акции'
      ]
    },
    {
      icon: <MessageCircle className="w-8 h-8 text-primary" />,
      title: 'Быстрая связь',
      description: 'Мгновенная связь с клиникой',
      details: [
        'Чат с администратором',
        'Экстренная кнопка SOS',
        'Отмена/перенос записи',
        'Заказ справок и выписок'
      ]
    },
    {
      icon: <Bell className="w-8 h-8 text-primary" />,
      title: 'Персонализация',
      description: 'Индивидуальный подход к здоровью',
      details: [
        'Рекомендации по уходу',
        'Календарь профосмотров',
        'Push-уведомления',
        'Программа лояльности'
      ]
    }
  ];

  const screenshots = [
    {
      title: 'Главный экран',
      description: 'Быстрый доступ ко всем функциям',
      image: 'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      title: 'Запись к врачу',
      description: 'Выберите врача, дату и время',
      image: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      title: 'История лечения',
      description: 'Все ваши визиты в одном месте',
      image: 'https://images.pexels.com/photos/3845623/pexels-photo-3845623.jpeg?auto=compress&cs=tinysrgb&w=300'
    }
  ];

  const benefits = [
    {
      icon: <Clock className="w-6 h-6 text-green-500" />,
      title: 'Экономия времени',
      description: 'Запись за 30 секунд вместо звонка'
    },
    {
      icon: <Star className="w-6 h-6 text-yellow-500" />,
      title: 'Персональный сервис',
      description: 'Индивидуальные рекомендации и напоминания'
    },
    {
      icon: <Shield className="w-6 h-6 text-blue-500" />,
      title: 'Безопасность данных',
      description: 'Все данные защищены и зашифрованы'
    },
    {
      icon: <Heart className="w-6 h-6 text-red-500" />,
      title: 'Забота о здоровье',
      description: 'Напоминания о профосмотрах и гигиене'
    }
  ];

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-8">
              Мобильное приложение "Зубная Станция"
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
              Управляйте своим здоровьем зубов прямо с телефона. 
              Записывайтесь, отслеживайте лечение и экономьте время.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://apps.apple.com/us/app/dentalpro/id1633446262"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black text-white px-6 py-3 rounded-xl flex items-center space-x-2 hover:bg-gray-800 transition-all duration-300 transform hover:scale-105"
              >
                <Download className="w-5 h-5" />
                <span>App Store</span>
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=ru.dentalpro.beta&hl=ru"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 text-white px-6 py-3 rounded-xl flex items-center space-x-2 hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
              >
                <Download className="w-5 h-5" />
                <span>Google Play</span>
              </a>
              <a
                href="https://apps.rustore.ru/app/ru.dentalpro.beta"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center space-x-2 hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
              >
                <Download className="w-5 h-5" />
                <span>RuStore</span>
              </a>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-12">
            <div className="bg-gray-100 rounded-xl p-1 flex">
              <button
                onClick={() => setActiveTab('features')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === 'features' 
                    ? 'bg-white text-primary shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Возможности
              </button>
              <button
                onClick={() => setActiveTab('screenshots')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === 'screenshots' 
                    ? 'bg-white text-primary shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Скриншоты
              </button>
              <button
                onClick={() => setActiveTab('benefits')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === 'benefits' 
                    ? 'bg-white text-primary shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Преимущества
              </button>
            </div>
          </div>

          {/* Content */}
          {activeTab === 'features' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {features.map((feature, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-md">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600 mb-6">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.details.map((detail, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-primary mr-2">✓</span>
                        <span className="text-gray-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'screenshots' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {screenshots.map((screenshot, index) => (
                <div key={index} className="text-center">
                  <div className="bg-gray-100 rounded-2xl p-4 mb-4">
                    <img
                      src={screenshot.image}
                      alt={screenshot.title}
                      className="w-full h-64 object-cover rounded-xl"
                    />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{screenshot.title}</h3>
                  <p className="text-gray-600">{screenshot.description}</p>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'benefits' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center">
                  <div className="mb-4 flex justify-center">{benefit.icon}</div>
                  <h3 className="text-lg font-semibold mb-3">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </motion.div>
          )}

          {/* CTA Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-8 text-white text-center mt-16"
          >
            <Smartphone className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Скачайте приложение уже сегодня!</h2>
            <p className="text-xl mb-8 opacity-90">
              Более 5000 пациентов уже используют наше приложение
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://apps.apple.com/us/app/dentalpro/id1633446262"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-primary px-8 py-4 rounded-xl font-medium hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Скачать для iOS
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=ru.dentalpro.beta&hl=ru"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 border-2 border-white text-white px-8 py-4 rounded-xl font-medium hover:bg-white/20 transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Скачать для Android
              </a>
              <a
                href="https://apps.rustore.ru/app/ru.dentalpro.beta"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 border-2 border-white text-white px-8 py-4 rounded-xl font-medium hover:bg-white/20 transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                RuStore
              </a>
            </div>
          </motion.section>
        </motion.div>
      </div>
    </div>
  );
};