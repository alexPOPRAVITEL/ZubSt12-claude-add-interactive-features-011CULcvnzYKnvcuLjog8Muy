import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export const Subscriptions: React.FC = () => {
  const subscriptions = [
    {
      title: 'АБОНЕМЕНТ «5+2»',
      subtitle: 'ЭКОНОМИЯ И ЗАБОТА О ЗДОРОВЬЕ В ОДНОМ',
      description: 'Мы сначала доведём вашу улыбку до идеала, а затем бережно поддерживаем результат.',
      price: 28600,
      savings: 4000,
      includes: [
        '5 лечебных приёмов с пломбировкой — современное восстановление зубов',
        '2 профессиональные чистки AirFlow — мягкое, но эффективное удаление зубного налета',
        '2 профилактических осмотра — чтобы не пропустить процесс кариеса',
        'Скидка 5% на все услуги клиники'
      ],
      benefits: [
        'За счёт проф. чисток и осмотров: профилактика заболеваний полости рта',
        'Время ковыляет деньги — сэкономите на лечении зубной патологии!',
        'Ощутимая скидка 400₽ — стоимость одной чистки вы получаете в подарок!',
        'Итог всего 28 600₽ — на 4000₽ выгоднее, чем оплачивать услуги по отдельности!'
      ]
    },
    {
      title: 'ПРОФЕССИОНАЛЬНОЕ ОТБЕЛИВАНИЕ + ЛЕЧЕНИЕ',
      subtitle: 'В ОДНОМ АБОНЕМЕНТЕ',
      description: 'Вы получаете идеальную улыбку без переплат и со всеми бонусами профессионального подхода.',
      price: 56600,
      savings: 10000,
      includes: [
        'Профессиональное отбеливание обеих челюстей — процедура, которая в среднем по городу стоит от 36 000₽, но у нас — дешевле на 6 000₽',
        'Профессиональная гигиена (2 процедуры) — подготовка к отбеливанию + профилактика кариеса и заболеваний десен',
        '5 пломб по современным стандартам — с коффердамом, анестезией, фотополимером и полным восстановлением функции зуба',
        '2 профилактических осмотра в год — вовремя заметим любые изменения и сохраним результат',
        'Постоянная скидка 5% на все услуги клиники'
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {subscriptions.map((subscription, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.2 }}
          className="bg-white rounded-2xl p-8 shadow-md"
        >
          <h3 className="text-2xl font-bold text-secondary mb-2">{subscription.title}</h3>
          <h4 className="text-lg text-primary mb-4">{subscription.subtitle}</h4>
          <p className="text-gray-600 mb-6">{subscription.description}</p>

          <div className="mb-6">
            <h5 className="font-semibold mb-4">ЧТО ВХОДИТ:</h5>
            <ul className="space-y-3">
              {subscription.includes.map((item, i) => (
                <li key={i} className="flex items-start">
                  <Check className="w-5 h-5 text-primary mt-1 mr-2 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {subscription.benefits && (
            <div className="mb-6">
              <h5 className="font-semibold mb-4">ПОЧЕМУ ЭТО ВЫГОДНО:</h5>
              <ul className="space-y-3">
                {subscription.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="w-5 h-5 text-primary mt-1 mr-2 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8 p-6 bg-cream rounded-xl">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-2xl font-bold">ЦЕНА: {subscription.price.toLocaleString()} ₽</span>
              </div>
              <div className="text-xl font-bold text-primary">
                ВЫГОДА: {subscription.savings.toLocaleString()} ₽
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-6 bg-primary text-white py-3 px-6 rounded-xl hover:bg-primary-dark transition-colors duration-300"
          >
            Оформить абонемент
          </motion.button>
        </motion.div>
      ))}
    </div>
  );
};