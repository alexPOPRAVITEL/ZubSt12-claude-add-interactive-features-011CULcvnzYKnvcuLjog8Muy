import React from 'react';
import { motion } from 'framer-motion';
import { Gift, Clock, Star } from 'lucide-react';

export const WhyNow: React.FC = () => {
  const reasons = [
    {
      icon: <Star className="w-8 h-8 text-primary" />,
      title: 'Бесплатная консультация',
      description: 'экономия 1500₽',
      highlight: true
    },
    {
      icon: <Clock className="w-8 h-8 text-primary" />,
      title: 'Запись без очереди',
      description: 'на завтра',
      highlight: false
    },
    {
      icon: <Gift className="w-8 h-8 text-primary" />,
      title: 'Подарок',
      description: 'набор для ухода за зубами',
      highlight: false
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-green-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold mb-4">🎯 Почему сейчас?</h2>
          <p className="text-xl text-gray-700 mb-12">3 причины записаться сегодня:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reasons.map((reason, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 ${
                  reason.highlight ? 'ring-2 ring-primary' : ''
                }`}
              >
                <div className="mb-4 flex justify-center">{reason.icon}</div>
                <h4 className="text-xl font-semibold mb-2">✅ {reason.title}</h4>
                <p className="text-gray-600">{reason.description}</p>
                {reason.highlight && (
                  <div className="mt-4 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                    Только сегодня!
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};