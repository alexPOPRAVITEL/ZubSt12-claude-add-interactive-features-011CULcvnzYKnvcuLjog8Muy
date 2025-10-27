import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Plus, Minus, Phone, Star, Users, Heart, Shield, Calendar, Gift } from 'lucide-react';
import { SubscriptionForm } from '../components/SubscriptionForm';

interface Subscription {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  currentPrice: number;
  oldPrice: number;
  installmentPrice: number;
  features: string[];
  validity: string;
  featured?: boolean;
  buttonVariant?: 'primary' | 'secondary';
}

interface FAQItem {
  question: string;
  answer: string;
}

export const SubscriptionsPage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<string>('');
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const subscriptions: Subscription[] = [
    {
      id: 'preventive',
      title: 'Профилактический',
      subtitle: 'Комплексная профилактика на год',
      icon: <Heart className="w-8 h-8 text-white" />,
      currentPrice: 15900,
      oldPrice: 22800,
      installmentPrice: 1325,
      features: [
        '4 профессиональные чистки в год',
        'Консультации врача без ограничений',
        'Диагностические снимки (4 шт)',
        'Фторирование зубов (2 раза)',
        'Скидка 15% на лечение',
        'Приоритетная запись'
      ],
      validity: '12 месяцев с даты покупки'
    },
    {
      id: 'family',
      title: 'Семейный',
      subtitle: 'Здоровье зубов для всей семьи',
      icon: <Users className="w-8 h-8 text-white" />,
      currentPrice: 39900,
      oldPrice: 58500,
      installmentPrice: 3325,
      features: [
        'Для семьи до 4 человек',
        'Профчистка каждому (3 раза в год)',
        'Консультации и осмотры без ограничений',
        'Детская адаптация и обучение гигиене',
        'Бесплатная замена зубных щеток для детей',
        'Диагностические снимки (до 8 шт на семью)',
        'Скидка 20% на все виды лечения',
        'Скидка 25% на протезирование',
        'Семейный координатор',
        'SMS и WhatsApp напоминания о визитах',
        'Приоритетная запись для всей семьи'
      ],
      validity: '12 месяцев для всех членов семьи',
      featured: true
    },
    {
      id: 'vip',
      title: 'Комплексный VIP',
      subtitle: 'Полное стоматологическое обслуживание',
      icon: <Star className="w-8 h-8 text-white" />,
      currentPrice: 69900,
      oldPrice: 95000,
      installmentPrice: 5825,
      features: [
        '6 профчисток + отбеливание',
        'Комплексная диагностика (КТ, ОПТГ)',
        'Персональный план лечения',
        'Скидка 25% на все виды лечения',
        'Экстренная помощь 24/7',
        'VIP-сервис и приоритет',
        'Гарантия +6 месяцев на все работы'
      ],
      validity: '12 месяцев + продление на льготных условиях'
    },
    {
      id: 'children-half-year',
      title: 'Детский (полугодовой)',
      subtitle: 'Забота о детских зубках на 6 месяцев',
      icon: <Gift className="w-8 h-8 text-white" />,
      currentPrice: 6900,
      oldPrice: 9500,
      installmentPrice: 575,
      features: [
        'Адаптация и знакомство с клиникой',
        '2 профчистки за 6 месяцев',
        'Бесплатная замена зубной щетки',
        'Обучение правильной гигиене',
        'Герметизация фиссур (при необходимости)',
        'Скидка 15% на лечение',
        'Подарки и игрушки',
        'Консультации для родителей'
      ],
      validity: '6 месяцев для ребенка до 16 лет',
      buttonVariant: 'secondary'
    },
    {
      id: 'children-full-year',
      title: 'Детский (годовой)',
      subtitle: 'Полный год заботы о детских зубках',
      icon: <Gift className="w-8 h-8 text-white" />,
      currentPrice: 12900,
      oldPrice: 18600,
      installmentPrice: 1075,
      features: [
        'Адаптация и знакомство с клиникой',
        '4 профчистки в год',
        'Бесплатная замена зубной щетки (2 раза)',
        'Обучение правильной гигиене',
        'Герметизация фиссур (при необходимости)',
        'Фторирование зубов (2 раза)',
        'Скидка 20% на лечение',
        'Подарки и игрушки после каждого визита',
        'Консультации для родителей'
      ],
      validity: '12 месяцев для ребенка до 16 лет',
      buttonVariant: 'secondary',
      featured: true
    }
  ];

  const benefits = [
    {
      icon: <div className="text-4xl">💰</div>,
      title: 'Экономия до 30%',
      description: 'Значительная экономия по сравнению с разовыми посещениями'
    },
    {
      icon: <Calendar className="w-8 h-8 text-white" />,
      title: 'Приоритетная запись',
      description: 'Запись в удобное время без очередей и ожидания'
    },
    {
      icon: <div className="text-4xl">🎯</div>,
      title: 'Персональный подход',
      description: 'Индивидуальный план профилактики для каждого пациента'
    },
    {
      icon: <Shield className="w-8 h-8 text-white" />,
      title: 'Гарантия здоровья',
      description: 'Регулярные осмотры предотвращают серьезные проблемы'
    }
  ];

  const faqItems: FAQItem[] = [
    {
      question: 'Можно ли оформить рассрочку на абонемент?',
      answer: 'Да, все абонементы можно оплачивать в рассрочку до 12 месяцев без процентов. Оформление займет всего 10 минут.'
    },
    {
      question: 'Что будет, если я не использую все услуги?',
      answer: 'Абонемент действует 12 месяцев. Неиспользованные услуги можно перенести или передать близким родственникам.'
    },
    {
      question: 'Можно ли добавить членов семьи к семейному абонементу?',
      answer: 'Семейный абонемент рассчитан на 4 человек. Дополнительных членов семьи можно добавить со скидкой 50%.'
    },
    {
      question: 'Какие гарантии предоставляются?',
      answer: 'На все услуги по абонементу действуют стандартные гарантии клиники. VIP-абонемент включает расширенную гарантию +6 месяцев.'
    }
  ];

  const handleSubscriptionSelect = (subscriptionTitle: string) => {
    setSelectedSubscription(subscriptionTitle);
    setIsFormOpen(true);
  };

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8 }
  };

  const staggerChildren = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true },
    transition: { staggerChildren: 0.2 }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-br from-primary via-primary-dark to-blue-700 text-white py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Абонементы Зубной Станции
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl opacity-90 mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Комплексные программы лечения и профилактики с экономией до 30%
          </motion.p>
          
          <motion.div 
            className="flex flex-wrap justify-center gap-8 md:gap-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold">30%</div>
              <div className="text-sm md:text-base opacity-80">экономия с абонементом</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold">0%</div>
              <div className="text-sm md:text-base opacity-80">переплаты по рассрочке</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold">12</div>
              <div className="text-sm md:text-base opacity-80">месяцев действия</div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Subscription Cards */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Выберите свой абонемент
            </h2>
            <p className="text-xl text-gray-600">
              Персональные программы для поддержания здоровья зубов всей семьи
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerChildren}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            {subscriptions.map((subscription, index) => (
              <motion.div
                key={subscription.id}
                variants={fadeInUp}
                className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 relative ${
                  subscription.featured ? 'ring-4 ring-green-500 transform scale-105' : ''
                }`}
                whileHover={{ y: -10 }}
              >
                {subscription.featured && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-green-500 text-white px-6 py-2 rounded-full text-sm font-bold">
                      ПОПУЛЯРНЫЙ
                    </span>
                  </div>
                )}

                <div className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl w-20 h-20 flex items-center justify-center mb-6">
                  {subscription.icon}
                </div>

                <h3 className="text-2xl font-bold mb-2 text-gray-900">
                  {subscription.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {subscription.subtitle}
                </p>

                <div className="mb-8">
                  <div className="flex items-baseline">
                    <span className="text-3xl md:text-4xl font-bold text-primary">
                      {subscription.currentPrice.toLocaleString()} ₽
                    </span>
                    <span className="text-lg text-gray-400 line-through ml-3">
                      {subscription.oldPrice.toLocaleString()} ₽
                    </span>
                  </div>
                  <div className="text-green-600 text-sm mt-2">
                    или {subscription.installmentPrice.toLocaleString()} ₽/мес без %
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {subscription.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="bg-blue-50 p-4 rounded-xl mb-8 border-l-4 border-primary">
                  <div className="text-sm">
                    <strong className="text-primary">Действует:</strong> {subscription.validity}
                  </div>
                </div>

                <button
                  onClick={() => handleSubscriptionSelect(subscription.title)}
                  className={`w-full py-4 px-6 rounded-xl font-semibold transition-colors duration-300 ${
                    subscription.buttonVariant === 'secondary'
                      ? 'bg-gray-100 text-primary hover:bg-gray-200'
                      : 'bg-primary text-white hover:bg-primary-dark'
                  }`}
                >
                  Выбрать абонемент
                </button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Преимущества абонементов
            </h2>
            <p className="text-xl text-gray-600">
              Почему абонемент выгоднее разовых посещений
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerChildren}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center"
              >
                <div className="bg-gradient-to-br from-primary to-primary-dark rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Часто задаваемые вопросы
            </h2>
            <p className="text-xl text-gray-600">
              Ответы на популярные вопросы об абонементах
            </p>
          </motion.div>

          <motion.div 
            className="space-y-4"
            variants={staggerChildren}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            {faqItems.map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white rounded-xl overflow-hidden shadow-md"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-300"
                >
                  <span className="font-semibold text-gray-900 pr-4">
                    {item.question}
                  </span>
                  {openFAQ === index ? (
                    <Minus className="w-6 h-6 text-primary flex-shrink-0" />
                  ) : (
                    <Plus className="w-6 h-6 text-primary flex-shrink-0" />
                  )}
                </button>
                {openFAQ === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-6"
                  >
                    <p className="text-gray-600">
                      {item.answer}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <motion.section 
        className="py-20 bg-gradient-to-br from-primary via-primary-dark to-blue-700 text-white"
        variants={fadeInUp}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Готовы начать заботиться о зубах?
          </h2>
          <p className="text-xl mb-12 opacity-90">
            Выберите подходящий абонемент и получите консультацию по его использованию
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-white text-primary px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-300"
            >
              Выбрать абонемент
            </button>
            <a
              href="tel:+79619785454"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-primary transition-colors duration-300 flex items-center justify-center"
            >
              <Phone className="w-5 h-5 mr-2" />
              Позвонить нам
            </a>
          </div>
        </div>
      </motion.section>

      <SubscriptionForm 
        isOpen={isFormOpen} 
        onClose={() => {
          setIsFormOpen(false);
          setSelectedSubscription('');
        }}
      />
    </div>
  );
};