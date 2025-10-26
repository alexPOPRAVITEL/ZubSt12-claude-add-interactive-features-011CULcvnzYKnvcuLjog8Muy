import React from 'react';
import { motion } from 'framer-motion';
import { Stethoscope, Wrench, Sparkles, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export const OurMission: React.FC = () => {
  const stations = [
    {
      icon: <Stethoscope className="w-8 h-8 text-primary" />,
      title: '🚇 СТАНЦИЯ "КОНСУЛЬТАЦИЯ"',
      description: 'Бесплатный осмотр и план лечения',
      action: 'Записаться на осмотр',
      link: '/contacts'
    },
    {
      icon: <Wrench className="w-8 h-8 text-primary" />,
      title: '🚇 СТАНЦИЯ "ЛЕЧЕНИЕ"',
      description: 'Современное оборудование без боли',
      action: 'Узнать о методах',
      link: '/services'
    },
    {
      icon: <Sparkles className="w-8 h-8 text-primary" />,
      title: '🚇 СТАНЦИЯ "ПРОФИЛАКТИКА"',
      description: 'Чистка зубов от 2500₽',
      action: 'Записаться на чистку',
      link: '/contacts'
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: '🚇 СТАНЦИЯ "СЕМЬЯ"',
      description: 'Скидки для всей семьи до 20%',
      action: 'Семейные тарифы',
      link: '/subscriptions'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-primary/5 to-accent/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold mb-8">Следующая станция — здоровая улыбка</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stations.map((station, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-md"
              >
                <div className="mb-4 flex justify-center">{station.icon}</div>
                <h4 className="text-lg font-semibold mb-3">{station.title}</h4>
                <p className="text-gray-600 mb-4">{station.description}</p>
                <Link
                  to={station.link}
                  className="w-full bg-primary text-white py-2 px-4 rounded-xl hover:bg-primary-dark transition-colors duration-300 text-center block"
                >
                  {station.action}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};