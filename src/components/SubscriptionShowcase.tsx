import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Calendar, Sparkles, Percent } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SubscriptionForm } from './SubscriptionForm';

export const SubscriptionShowcase: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#002B49] mb-4">
            Абонемент "5+2" — инвестиция в здоровье
          </h2>
          <p className="text-xl text-gray-600">
            Экономия 4000₽ и комплексная забота о вашей улыбке
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex items-start space-x-4">
              <Calendar className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">5 лечебных приёмов с пломбировкой</h3>
                <p className="text-gray-600">Современное восстановление зубов</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Star className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">2 профессиональные чистки AirFlow</h3>
                <p className="text-gray-600">Мягкое, но эффективное удаление зубного налёта</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Sparkles className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">2 профилактических осмотра</h3>
                <p className="text-gray-600">Чтобы не пропустить процесс кариеса</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Percent className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Скидка 5% на все услуги клиники</h3>
                <p className="text-gray-600">+ Одна чистка бесплатно!</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800"
              alt="Стоматологический кабинет"
              className="rounded-2xl shadow-lg"
              loading="lazy"
            />
            <div className="absolute -bottom-6 right-6 bg-red-500 text-white px-6 py-3 rounded-full shadow-lg">
              <span className="font-bold">Экономия 4000₽</span>
            </div>
          </motion.div>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFormOpen(true)}
            className="px-8 py-4 bg-primary text-white rounded-xl font-medium shadow-lg hover:bg-primary-dark transition-colors duration-300 w-full md:w-auto"
          >
            Оформить абонемент
          </motion.button>
          
          <Link
            to="/prices?tab=subscriptions"
            className="px-8 py-4 bg-white text-primary border-2 border-primary rounded-xl font-medium hover:bg-primary/5 transition-colors duration-300 text-center w-full md:w-auto"
          >
            Подробнее об абонементах
          </Link>
          
          <Link
            to="/loyalty"
            className="px-8 py-4 bg-accent text-white rounded-xl font-medium hover:bg-accent/80 transition-colors duration-300 text-center w-full md:w-auto"
          >
            Программа лояльности
          </Link>
        </div>
      </div>

      <SubscriptionForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </section>
  );
};