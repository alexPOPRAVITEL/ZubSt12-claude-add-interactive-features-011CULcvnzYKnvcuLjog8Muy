import React from 'react';
import { motion } from 'framer-motion';
import { Stethoscope, ClipboardList, Heart } from 'lucide-react';

export const PatientJourney: React.FC = () => {
  const steps = [
    {
      icon: <Stethoscope className="w-12 h-12 text-primary" />,
      title: 'Бесплатная консультация',
      description: 'Знакомство с врачом и первичный осмотр'
    },
    {
      icon: <ClipboardList className="w-12 h-12 text-primary" />,
      title: 'Персональный план лечения',
      description: 'Индивидуальный подход к вашему здоровью'
    },
    {
      icon: <Heart className="w-12 h-12 text-primary" />,
      title: 'Забота на каждом этапе',
      description: 'Поддержка и внимание до и после лечения'
    }
  ];

  return (
    <section className="py-16 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-center mb-12">Путь к здоровой улыбке</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4">{step.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};