import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, AlertCircle, Sparkles, Clock, Shield, Star } from 'lucide-react';
import { AppointmentModal } from '../AppointmentModal';

export const Whitening: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
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
    <div className="space-y-16">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[60vh] min-h-[400px] overflow-hidden rounded-3xl mb-16"
      >
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=1920"
            alt="Профессиональное отбеливание"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
        </div>
        
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Профессиональное отбеливание зубов
          </motion.h1>
          <motion.p 
            className="text-xl text-white/90 max-w-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Безопасное отбеливание по технологии ZOOM с гарантированным результатом
          </motion.p>
        </div>
      </motion.section>

      {/* Benefits Section */}
      <motion.section 
        variants={staggerChildren}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {[
          {
            icon: <Sparkles className="w-8 h-8" />,
            title: "Мгновенный результат",
            description: "Видимый эффект сразу после процедуры"
          },
          {
            icon: <Shield className="w-8 h-8" />,
            title: "Безопасная процедура",
            description: "Защита эмали и минимальная чувствительность"
          },
          {
            icon: <Clock className="w-8 h-8" />,
            title: "Длительный эффект",
            description: "Результат сохраняется до 2-х лет"
          }
        ].map((benefit, index) => (
          <motion.div
            key={index}
            variants={fadeInUp}
            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="text-primary mb-4">{benefit.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
            <p className="text-gray-600">{benefit.description}</p>
          </motion.div>
        ))}
      </motion.section>

      {/* Process Section */}
      <motion.section 
        variants={fadeInUp}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true }}
        className="bg-white rounded-2xl p-8 shadow-lg"
      >
        <h2 className="text-3xl font-bold text-center mb-12">Этапы отбеливания</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              step: 1,
              title: "Консультация",
              description: "Определяем текущий оттенок и обсуждаем желаемый результат"
            },
            {
              step: 2,
              title: "Профессиональная чистка",
              description: "Подготовка зубов к процедуре отбеливания"
            },
            {
              step: 3,
              title: "Процедура ZOOM",
              description: "Использование современной системы отбеливания"
            },
            {
              step: 4,
              title: "Рекомендации",
              description: "Советы по поддержанию результата"
            }
          ].map((step, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="flex items-start space-x-4"
            >
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold flex-shrink-0">
                {step.step}
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Pricing Section */}
      <motion.section 
        variants={fadeInUp}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true }}
        className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-8 text-white"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Стоимость отбеливания ZOOM</h2>
          <p className="text-xl opacity-90">Профессиональное отбеливание обеих челюстей</p>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center gap-8">
          <div className="text-4xl md:text-6xl font-bold">
            25 000₽
          </div>
          <div className="h-px md:h-16 w-16 md:w-px bg-white/20 mx-4" />
          <div className="text-center md:text-left">
            <div className="text-2xl font-semibold mb-2">Скидка 6 000₽</div>
            <div className="opacity-90">При записи через сайт</div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="mt-8 w-full md:w-auto bg-white text-primary px-8 py-4 rounded-xl font-medium mx-auto block"
        >
          Записаться на отбеливание
        </motion.button>
      </motion.section>

      {/* FAQ Section */}
      <motion.section
        variants={fadeInUp}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true }}
        className="bg-white rounded-2xl p-8 shadow-lg"
      >
        <h2 className="text-3xl font-bold text-center mb-12">Частые вопросы</h2>
        
        <div className="space-y-6">
          {[
            {
              question: "Больно ли это?",
              answer: "Процедура безболезненна. Возможна небольшая чувствительность после отбеливания, которая проходит в течение нескольких дней."
            },
            {
              question: "Сколько держится результат?",
              answer: "При правильном уходе результат сохраняется до 2 лет. Мы дадим подробные рекомендации по поддержанию эффекта."
            },
            {
              question: "Есть ли противопоказания?",
              answer: "Да, основные противопоказания: кариес, беременность и лактация, возраст до 18 лет. Точный ответ вы получите на консультации."
            }
          ].map((faq, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="border-b border-gray-200 pb-6 last:border-0"
            >
              <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
              <p className="text-gray-600">{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <AppointmentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        selectedService="Отбеливание ZOOM"
      />
    </div>
  );
};