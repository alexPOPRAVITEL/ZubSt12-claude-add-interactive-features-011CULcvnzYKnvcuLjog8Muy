import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Stethoscope, 
  Baby, 
  Sparkles, 
  Syringe, 
  Magnet, 
  Shield,
  Camera,
  Heart
} from 'lucide-react';
import { AppointmentModal } from './AppointmentModal';

export const OurServices: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('');

  const services = [
    {
      icon: <Stethoscope className="w-12 h-12 text-primary" />,
      title: 'Терапевтическая стоматология',
      description: 'Что это простыми словами: лечим дырки в зубах, спасаем зубной нерв, ставим красивые пломбы. Всё без боли!',
      services: [
        'Лечение кариеса (дырки в зубах) — от маленьких до больших',
        'Лечение нерва — спасаем зуб от удаления',
        'Красивые пломбы — как родные зубы',
        'Реставрация передних зубов — для красивой улыбки',
        'Работаем под увеличением — видим каждую деталь'
      ],
      priceFrom: 'от 2 500 руб.',
      duration: '30-60 мин',
      guarantee: '2 года',
      image: 'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      icon: <Magnet className="w-12 h-12 text-primary" />,
      title: 'Ортодонтия',
      description: 'Что это простыми словами: выравниваем кривые зубы брекетами или прозрачными капами. Результат — голливудская улыбка!',
      services: [
        'Брекеты металлические — классика, надёжно и доступно',
        'Брекеты керамические — почти незаметные',
        'Прозрачные капы — никто не заметит лечения',
        'Детская ортодонтия — исправляем прикус с детства',
        'Закрепление результата — чтобы зубы не вернулись назад'
      ],
      priceFrom: 'от 35 000 руб.',
      duration: '12-24 месяца',
      guarantee: '5 лет',
      image: 'https://images.pexels.com/photos/6812540/pexels-photo-6812540.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      icon: <Syringe className="w-12 h-12 text-primary" />,
      title: 'Имплантология',
      description: 'Что это простыми словами: вместо отсутствующего зуба ставим титановый корень и коронку. Как новый зуб!',
      services: [
        'Классическая имплантация — надёжно и проверено',
        'Имплант за 1 день — сразу с временной коронкой',
        'Наращивание кости — если её мало для импланта',
        'Синус-лифтинг — для верхних зубов',
        'Коронка на имплант — как настоящий зуб'
      ],
      priceFrom: 'от 25 000 руб.',
      duration: '3-6 месяцев',
      guarantee: 'пожизненная',
      image: 'https://images.pexels.com/photos/3845623/pexels-photo-3845623.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      icon: <Shield className="w-12 h-12 text-primary" />,
      title: 'Хирургическая стоматология',
      description: 'Что это простыми словами: удаляем зубы, которые нельзя спасти. Быстро, без боли, с заботой о заживлении.',
      services: [
        'Простое удаление — за 10 минут',
        'Сложное удаление — зубы мудрости, корни',
        'Удаление кисты — спасаем соседние зубы',
        'Пластика уздечки — для правильной речи',
        'Подготовка к протезированию'
      ],
      priceFrom: 'от 1 500 руб.',
      duration: '15-45 мин',
      guarantee: '1 месяц',
      image: 'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      icon: <Sparkles className="w-12 h-12 text-primary" />,
      title: 'Ортопедия',
      description: 'Что это простыми словами: делаем коронки, мосты и протезы. Возвращаем красоту и возможность нормально жевать.',
      services: [
        'Коронки — "колпачки" на повреждённые зубы',
        'Мосты — заменяют несколько отсутствующих зубов',
        'Съёмные протезы — когда нет многих зубов',
        'Виниры — тонкие накладки для красоты',
        'Вкладки — когда пломба уже не поможет'
      ],
      priceFrom: 'от 8 000 руб.',
      duration: '2-3 визита',
      guarantee: '3 года',
      image: 'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      icon: <Baby className="w-12 h-12 text-primary" />,
      title: 'Детская стоматология',
      description: 'Что это простыми словами: лечим детские зубки без слёз и страха. Превращаем визит к врачу в игру!',
      services: [
        'Лечение молочных зубов — важно для постоянных',
        'Серебрение — останавливает кариес у малышей',
        'Герметизация — защита от кариеса',
        'Обучение чистке зубов — в игровой форме',
        'Детские коронки — красивые и цветные'
      ],
      priceFrom: 'от 1 800 руб.',
      duration: '20-40 мин',
      guarantee: '1 год',
      image: 'https://images.pexels.com/photos/6812540/pexels-photo-6812540.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      icon: <Heart className="w-12 h-12 text-primary" />,
      title: 'Профилактика и гигиена',
      description: 'Что это простыми словами: убираем зубной камень и налёт, которые не снимаются дома. Зубы становятся белее!',
      services: [
        'Ультразвуковая чистка — убираем зубной камень',
        'Air Flow — удаляем налёт от кофе и сигарет',
        'Полировка — зубы становятся гладкими',
        'Фторирование — укрепляем эмаль',
        'Обучение правильной чистке дома'
      ],
      priceFrom: 'от 2 500 руб.',
      duration: '40-60 мин',
      guarantee: '6 месяцев',
      image: 'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      icon: <Camera className="w-12 h-12 text-primary" />,
      title: 'Диагностика',
      description: 'Что это простыми словами: делаем снимки зубов, чтобы увидеть проблемы, которые не видны глазу.',
      services: [
        'Прицельный снимок — одного зуба',
        'Панорамный снимок — всех зубов сразу',
        '3D снимок — объёмное изображение',
        'Диагностика прикуса — как смыкаются зубы',
        'Фото до/после — видим результат лечения'
      ],
      priceFrom: 'от 500 руб.',
      duration: '5-15 мин',
      guarantee: 'мгновенно',
      image: 'https://images.pexels.com/photos/3845623/pexels-photo-3845623.jpeg?auto=compress&cs=tinysrgb&w=600'
    }
  ];

  const advantages = [
    {
      title: 'Современное оборудование',
      description: 'Используем новейшие стоматологические установки и инструменты ведущих производителей'
    },
    {
      title: 'Качественные материалы',
      description: 'Работаем только с сертифицированными материалами от проверенных поставщиков'
    },
    {
      title: 'Безболезненное лечение',
      description: 'Применяем современные методы анестезии для комфортного лечения'
    },
    {
      title: 'Гарантия на работы',
      description: 'Предоставляем гарантию на все виды выполненных работ'
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
            Полный спектр стоматологических услуг
          </h1>
          
          <p className="text-xl text-gray-700 text-center mb-12 max-w-3xl mx-auto">
            Полный спектр стоматологических услуг для всей семьи в одной клинике. 
            От профилактики до сложных реставраций.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="mb-4">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-48 object-cover rounded-xl mb-4"
                    loading="lazy"
                  />
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Что входит:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {service.services.map((item, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-4 bg-gray-50 rounded-lg p-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Цена:</span>
                      <div className="font-semibold text-primary">{service.priceFrom}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Время:</span>
                      <div className="font-medium">{service.duration}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Гарантия:</span>
                      <div className="font-medium">{service.guarantee}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Результат:</span>
                      <div className="font-medium text-green-600">Сразу</div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <button
                    onClick={() => {
                      setSelectedService(service.title);
                      setIsModalOpen(true);
                    }}
                    className="w-full bg-primary text-white px-4 py-2 rounded-xl hover:bg-primary-dark transition-colors duration-300"
                  >
                    Записаться
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Advantages Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8"
          >
            <h2 className="text-3xl font-bold text-center mb-12">
              Преимущества лечения в "Зубной Станции"
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {advantages.map((advantage, index) => (
                <div key={index} className="text-center">
                  <h3 className="text-lg font-semibold mb-3">{advantage.title}</h3>
                  <p className="text-gray-600">{advantage.description}</p>
                </div>
              ))}
            </div>
          </motion.section>
        </motion.div>
      </div>

      <AppointmentModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setSelectedService('');
        }}
        selectedService={selectedService}
      />
    </div>
  );
};