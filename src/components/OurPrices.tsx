import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Users, Percent, Shield } from 'lucide-react';
import { PricesTabs } from './Prices/PricesTabs';
import { SearchBar } from './Prices/SearchBar';
import { PriceList } from './Prices/PriceList';
import { Subscriptions } from './Prices/Subscriptions';
import { Whitening } from './Prices/Whitening';
import { PriceCalculator } from './Prices/PriceCalculator';

export const OurPrices: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('price');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tab = urlParams.get('tab');
    if (tab === 'subscriptions') {
      setActiveTab('subscriptions');
    }
  }, [location]);

  const [searchQuery, setSearchQuery] = useState('');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'subscriptions':
        return <Subscriptions />;
      case 'whitening':
        return <Whitening />;
      default:
        return (
          <>
            <PriceCalculator />
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <PriceList searchQuery={searchQuery} />
          </>
        );
    }
  };

  const priceCategories = [
    {
      title: 'Терапевтическая стоматология',
      services: [
        { name: 'Консультация врача-стоматолога', price: 500 },
        { name: 'Лечение кариеса (1 поверхность)', price: 2500, priceFrom: true },
        { name: 'Лечение кариеса (2 поверхности)', price: 3200, priceFrom: true },
        { name: 'Лечение пульпита (1-канальный зуб)', price: 5500, priceFrom: true },
        { name: 'Лечение пульпита (2-канальный зуб)', price: 7500, priceFrom: true },
        { name: 'Лечение пульпита (3-канальный зуб)', price: 9500, priceFrom: true },
        { name: 'Художественная реставрация', price: 4500, priceFrom: true }
      ]
    },
    {
      title: 'Ортодонтия',
      services: [
        { name: 'Консультация ортодонта', price: 800 },
        { name: 'Брекет-система металлическая (1 челюсть)', price: 35000, priceFrom: true },
        { name: 'Брекет-система керамическая (1 челюсть)', price: 45000, priceFrom: true },
        { name: 'Элайнеры (курс лечения)', price: 120000, priceFrom: true },
        { name: 'Коррекция брекет-системы', price: 2500 },
        { name: 'Снятие брекет-системы', price: 8000 }
      ]
    },
    {
      title: 'Имплантология',
      services: [
        { name: 'Консультация имплантолога', price: 1000 },
        { name: 'Установка импланта (без коронки)', price: 25000, priceFrom: true },
        { name: 'Коронка на имплант (металлокерамика)', price: 18000, priceFrom: true },
        { name: 'Коронка на имплант (цирконий)', price: 28000, priceFrom: true },
        { name: 'Синус-лифтинг', price: 15000, priceFrom: true },
        { name: 'Костная пластика', price: 12000, priceFrom: true }
      ]
    },
    {
      title: 'Хирургическая стоматология',
      services: [
        { name: 'Удаление зуба простое', price: 1500, priceFrom: true },
        { name: 'Удаление зуба сложное', price: 3500, priceFrom: true },
        { name: 'Удаление зуба мудрости', price: 5000, priceFrom: true },
        { name: 'Резекция верхушки корня', price: 8000, priceFrom: true },
        { name: 'Пластика уздечки', price: 4000, priceFrom: true }
      ]
    },
    {
      title: 'Ортопедия',
      services: [
        { name: 'Коронка металлокерамическая', price: 8000, priceFrom: true },
        { name: 'Коронка циркониевая', price: 18000, priceFrom: true },
        { name: 'Винир керамический', price: 25000, priceFrom: true },
        { name: 'Частичный съемный протез', price: 15000, priceFrom: true },
        { name: 'Полный съемный протез', price: 25000, priceFrom: true }
      ]
    },
    {
      title: 'Детская стоматология',
      services: [
        { name: 'Консультация детского стоматолога', price: 400 },
        { name: 'Лечение кариеса молочного зуба', price: 1800, priceFrom: true },
        { name: 'Лечение пульпита молочного зуба', price: 3500, priceFrom: true },
        { name: 'Герметизация фиссур', price: 1200, priceFrom: true },
        { name: 'Серебрение зубов', price: 500, priceFrom: true },
        { name: 'Удаление молочного зуба', price: 800, priceFrom: true }
      ]
    },
    {
      title: 'Профилактика и гигиена',
      services: [
        { name: 'Профессиональная гигиена полости рта', price: 3000, priceFrom: true },
        { name: 'Снятие зубного камня (ультразвук)', price: 2000, priceFrom: true },
        { name: 'Air Flow чистка', price: 2500, priceFrom: true },
        { name: 'Фторирование зубов', price: 1500, priceFrom: true }
      ]
    },
    {
      title: 'Диагностика',
      services: [
        { name: 'Прицельный рентгеновский снимок', price: 500 },
        { name: 'Панорамный снимок (ОПТГ)', price: 1200 },
        { name: '3D диагностика (КТ)', price: 2500 }
      ]
    }
  ];

  const paymentOptions = [
    {
      icon: <CreditCard className="w-8 h-8 text-primary" />,
      title: 'Наличный и безналичный расчет',
      description: 'Оплата наличными в кассе клиники или банковской картой'
    },
    {
      icon: <Shield className="w-8 h-8 text-primary" />,
      title: 'Рассрочка от клиники',
      description: 'Беспроцентная рассрочка до 12 месяцев',
      details: [
        '✓ Сумма от 15 000 рублей',
        '✓ Без первоначального взноса',
        '✓ Оформление за 5 минут'
      ],
      featured: true
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: 'Семейные программы',
      description: 'Скидка 15% при лечении всей семьи'
    },
    {
      icon: <Percent className="w-8 h-8 text-primary" />,
      title: 'Социальные скидки',
      description: 'Скидки для пенсионеров, студентов и многодетных семей'
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
          <h1 className="text-4xl font-bold text-center mb-8">
            Цены на услуги
          </h1>
          
          <p className="text-xl text-gray-700 text-center mb-12 max-w-3xl mx-auto">
            Честные цены без скрытых доплат
          </p>

          <PricesTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {renderTabContent()}

          {/* Price Policy */}
          {activeTab === 'price' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 mt-8">
              <div className="bg-white rounded-2xl p-6 shadow-md text-center">
                <h3 className="text-lg font-semibold mb-3">Прозрачность</h3>
                <p className="text-gray-600">Все цены фиксируются в договоре. Никаких скрытых доплат в процессе лечения</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-md text-center">
                <h3 className="text-lg font-semibold mb-3">Доступность</h3>
                <p className="text-gray-600">Демократичные цены для жителей Барнаула. Возможность рассрочки</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-md text-center">
                <h3 className="text-lg font-semibold mb-3">Качество</h3>
                <p className="text-gray-600">Оптимальное соотношение цена-качество. Используем материалы премиум-класса</p>
              </div>
            </div>
          )}

          {/* Payment Options - показываем только на вкладке "Прайс" */}
          {activeTab === 'price' && (
            <div className="space-y-8 mb-16">
              {priceCategories.map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-6 shadow-md"
                >
                  <h2 className="text-2xl font-semibold text-secondary mb-6">{category.title}</h2>
                  <div className="space-y-3">
                    {category.services.map((service, i) => (
                      <div key={i} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                        <span className="text-secondary">{service.name}</span>
                        <span className="text-primary font-medium whitespace-nowrap">
                          {service.priceFrom ? 'от ' : ''}{service.price.toLocaleString()}₽
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Payment Options */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8"
          >
            <h2 className="text-3xl font-bold text-center mb-12">Удобные способы оплаты</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {paymentOptions.map((option, index) => (
                <div 
                  key={index} 
                  className={`bg-white rounded-2xl p-6 shadow-md ${option.featured ? 'ring-2 ring-primary' : ''}`}
                >
                  <div className="mb-4">{option.icon}</div>
                  <h3 className="text-lg font-semibold mb-3">{option.title}</h3>
                  <p className="text-gray-600 mb-4">{option.description}</p>
                  {option.details && (
                    <div className="space-y-1">
                      {option.details.map((detail, i) => (
                        <p key={i} className="text-sm text-gray-600">{detail}</p>
                      ))}
                    </div>
                  )}
                  {option.featured && (
                    <button className="w-full mt-4 bg-primary text-white py-2 px-4 rounded-xl hover:bg-primary-dark transition-colors duration-300">
                      Узнать условия
                    </button>
                  )}
                </div>
              ))}
            </div>
          </motion.section>
        </motion.div>
      </div>
    </div>
  );
};