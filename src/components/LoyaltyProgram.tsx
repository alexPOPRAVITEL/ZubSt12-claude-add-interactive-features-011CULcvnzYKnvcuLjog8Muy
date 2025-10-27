import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Gift, Users, CreditCard, Trophy, Heart, Percent, Calendar } from 'lucide-react';
import { LoyaltyForm } from './LoyaltyForm';

export const LoyaltyProgram: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState('');

  const loyaltyCards = [
    {
      id: 'bronze',
      title: 'Бронзовая карта',
      subtitle: 'Первые шаги к здоровью',
      discount: 5,
      color: 'from-amber-600 to-amber-800',
      icon: <CreditCard className="w-8 h-8 text-white" />,
      requirements: 'От 5 000₽ потрачено',
      benefits: [
        'Скидка 5% на все услуги',
        'Приоритетная запись',
        'SMS-напоминания',
        'Бесплатная консультация раз в год'
      ]
    },
    {
      id: 'silver',
      title: 'Серебряная карта',
      subtitle: 'Постоянный пациент',
      discount: 10,
      color: 'from-gray-400 to-gray-600',
      icon: <Star className="w-8 h-8 text-white" />,
      requirements: 'От 15 000₽ потрачено',
      benefits: [
        'Скидка 10% на все услуги',
        'Бесплатная профчистка раз в год',
        'Персональный менеджер',
        'Скидка на семью 5%'
      ],
      popular: true
    },
    {
      id: 'gold',
      title: 'Золотая карта',
      subtitle: 'VIP-пациент',
      discount: 15,
      color: 'from-yellow-400 to-yellow-600',
      icon: <Trophy className="w-8 h-8 text-white" />,
      requirements: 'От 50 000₽ потрачено',
      benefits: [
        'Скидка 15% на все услуги',
        'Бесплатная профчистка 2 раза в год',
        'VIP-кабинет',
        'Скидка на семью 10%',
        'Консьерж-сервис'
      ]
    },
    {
      id: 'family',
      title: 'Семейная карта',
      subtitle: 'Для всей семьи',
      discount: 20,
      color: 'from-green-500 to-green-700',
      icon: <Users className="w-8 h-8 text-white" />,
      requirements: 'От 3 членов семьи',
      benefits: [
        'Скидка 20% для всей семьи',
        'Семейный календарь осмотров',
        'Детские подарки',
        'Семейные консультации',
        'Накопительная система'
      ],
      featured: true
    }
  ];

  const bonusProgram = [
    {
      icon: <Gift className="w-6 h-6 text-primary" />,
      title: 'Накопительные бонусы',
      description: '1₽ потрачено = 1 бонус. 100 бонусов = 100₽ скидка'
    },
    {
      icon: <Calendar className="w-6 h-6 text-primary" />,
      title: 'Скидка в день рождения',
      description: 'Дополнительная скидка 15% в месяц вашего дня рождения'
    },
    {
      icon: <Heart className="w-6 h-6 text-primary" />,
      title: 'Приведи друга',
      description: 'Скидка 500₽ вам и вашему другу при первом посещении'
    },
    {
      icon: <Percent className="w-6 h-6 text-primary" />,
      title: 'Сезонные акции',
      description: 'Эксклюзивные предложения только для держателей карт'
    }
  ];

  const handleCardSelect = (cardId: string) => {
    setSelectedCard(cardId);
    setIsFormOpen(true);
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
            Программа лояльности "Здоровая улыбка"
          </h1>
          
          <p className="text-xl text-gray-700 text-center mb-12 max-w-3xl mx-auto">
            Чем больше заботитесь о зубах, тем больше экономите! 
            Накапливайте бонусы и получайте скидки до 20%
          </p>

          {/* Loyalty Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {loyaltyCards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative bg-gradient-to-br ${card.color} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow duration-300 ${
                  card.featured ? 'ring-4 ring-green-300' : ''
                } ${card.popular ? 'ring-4 ring-gray-300' : ''}`}
              >
                {card.featured && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                      РЕКОМЕНДУЕМ
                    </span>
                  </div>
                )}
                
                {card.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                      ПОПУЛЯРНАЯ
                    </span>
                  </div>
                )}

                <div className="mb-4">{card.icon}</div>
                <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                <p className="text-white/80 mb-4">{card.subtitle}</p>
                
                <div className="text-3xl font-bold mb-4">
                  {card.discount}% скидка
                </div>
                
                <div className="text-sm text-white/80 mb-6">
                  {card.requirements}
                </div>

                <ul className="space-y-2 mb-6">
                  {card.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start text-sm">
                      <span className="text-white mr-2">✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleCardSelect(card.id)}
                  className="w-full bg-white/20 text-white py-2 px-4 rounded-xl hover:bg-white/30 transition-colors duration-300 backdrop-blur-sm"
                >
                  Получить карту
                </button>
              </motion.div>
            ))}
          </div>

          {/* Bonus Program */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8 mb-16"
          >
            <h2 className="text-3xl font-bold text-center mb-12">Дополнительные бонусы</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {bonusProgram.map((bonus, index) => (
                <div key={index} className="text-center">
                  <div className="mb-4 flex justify-center">{bonus.icon}</div>
                  <h3 className="text-lg font-semibold mb-3">{bonus.title}</h3>
                  <p className="text-gray-600">{bonus.description}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* How it works */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 shadow-md"
          >
            <h2 className="text-3xl font-bold text-center mb-12">Как это работает</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-3">Оформите карту</h3>
                <p className="text-gray-600">
                  Заполните простую форму и получите карту лояльности
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-3">Лечитесь и копите</h3>
                <p className="text-gray-600">
                  За каждый рубль получайте бонусы и повышайте статус карты
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-3">Экономьте больше</h3>
                <p className="text-gray-600">
                  Используйте накопленные бонусы и получайте скидки до 20%
                </p>
              </div>
            </div>
          </motion.section>
        </motion.div>
      </div>

      <LoyaltyForm 
        isOpen={isFormOpen} 
        onClose={() => {
          setIsFormOpen(false);
          setSelectedCard('');
        }}
      />
    </div>
  );
};