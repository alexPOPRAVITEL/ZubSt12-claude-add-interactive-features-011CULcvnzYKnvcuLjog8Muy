import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Users, Percent, Shield } from 'lucide-react';

export const PaymentSolutions: React.FC = () => {
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
      subtitle: 'Без банков и переплат. Только паспорт.',
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
      description: 'Скидка 15% при лечении всей семьи',
      subtitle: 'Специальные условия для семейных пациентов'
    },
    {
      icon: <Percent className="w-8 h-8 text-primary" />,
      title: 'Социальные скидки',
      description: 'Скидки для пенсионеров, студентов и многодетных семей'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-center mb-12">Удобные способы оплаты</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {paymentOptions.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 ${
                  option.featured ? 'ring-2 ring-primary' : ''
                }`}
              >
                <div className="mb-4">{option.icon}</div>
                <h3 className="text-lg font-semibold mb-3">{option.title}</h3>
                {option.subtitle && (
                  <p className="text-primary font-medium mb-2">{option.subtitle}</p>
                )}
                <p className="text-gray-600 mb-4">{option.description}</p>
                {option.details && (
                  <div className="space-y-1 mb-4">
                    {option.details.map((detail, i) => (
                      <p key={i} className="text-sm text-gray-600">{detail}</p>
                    ))}
                  </div>
                )}
                {option.featured && (
                  <button className="w-full bg-primary text-white py-2 px-4 rounded-xl hover:bg-primary-dark transition-colors duration-300">
                    Узнать условия рассрочки
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};