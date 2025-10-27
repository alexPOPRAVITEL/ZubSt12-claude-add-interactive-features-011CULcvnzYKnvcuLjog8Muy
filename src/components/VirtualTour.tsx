import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Play, 
  Pause, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Maximize,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const VirtualTour: React.FC = () => {
  const [currentRoom, setCurrentRoom] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const rooms = [
    {
      id: 'reception',
      title: 'Ресепшн и зона ожидания',
      description: 'Уютная атмосфера с первых минут. Комфортные кресла, детская зона, кофе и чай для гостей.',
      image: 'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=800',
      highlights: [
        'Детская игровая зона',
        'Бесплатный Wi-Fi',
        'Кофе и чай',
        'Журналы и книги'
      ]
    },
    {
      id: 'treatment1',
      title: 'Кабинет терапевтической стоматологии',
      description: 'Современное оборудование для комфортного лечения. Работаем под увеличением для максимальной точности.',
      image: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=800',
      highlights: [
        'Стоматологическая установка Sirona',
        'Микроскоп для точности',
        'Система обезболивания',
        'Мониторы для пациента'
      ]
    },
    {
      id: 'surgery',
      title: 'Хирургический кабинет',
      description: 'Специально оборудованный кабинет для хирургических вмешательств и имплантации.',
      image: 'https://images.pexels.com/photos/3845623/pexels-photo-3845623.jpeg?auto=compress&cs=tinysrgb&w=800',
      highlights: [
        'Хирургическая установка',
        'Система имплантации',
        'Стерильная зона',
        'Современная анестезия'
      ]
    },
    {
      id: 'children',
      title: 'Детский кабинет',
      description: 'Яркий и дружелюбный кабинет, где дети не боятся лечить зубы. Игрушки, мультики и подарки.',
      image: 'https://images.pexels.com/photos/6812540/pexels-photo-6812540.jpeg?auto=compress&cs=tinysrgb&w=800',
      highlights: [
        'Яркий дизайн',
        'Мультики на потолке',
        'Игрушки и подарки',
        'Специальные инструменты'
      ]
    },
    {
      id: 'sterilization',
      title: 'Стерилизационная',
      description: 'Современная система стерилизации обеспечивает 100% безопасность всех процедур.',
      image: 'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=800',
      highlights: [
        'Автоклавы класса B',
        'УЗ-мойка инструментов',
        'Система упаковки',
        'Контроль качества'
      ]
    }
  ];

  const tourFeatures = [
    {
      icon: <Camera className="w-6 h-6 text-primary" />,
      title: 'Панорама 360°',
      description: 'Полный обзор каждого кабинета'
    },
    {
      icon: <ZoomIn className="w-6 h-6 text-primary" />,
      title: 'Детальный осмотр',
      description: 'Рассмотрите оборудование вблизи'
    },
    {
      icon: <Play className="w-6 h-6 text-primary" />,
      title: 'Интерактивность',
      description: 'Управляйте просмотром самостоятельно'
    }
  ];

  const nextRoom = () => {
    setCurrentRoom((prev) => (prev + 1) % rooms.length);
  };

  const prevRoom = () => {
    setCurrentRoom((prev) => (prev - 1 + rooms.length) % rooms.length);
  };

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-8">
              Виртуальная экскурсия по клинике
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Познакомьтесь с нашей клиникой не выходя из дома. 
              Современные кабинеты, новейшее оборудование и уютная атмосфера.
            </p>
          </div>

          {/* Tour Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {tourFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="mb-4 flex justify-center">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Virtual Tour Viewer */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-12">
            <div className="relative">
              <img
                src={rooms[currentRoom].image}
                alt={rooms[currentRoom].title}
                className="w-full h-96 object-cover"
              />
              
              {/* Tour Controls */}
              <div className="absolute top-4 left-4 flex space-x-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
                <button className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors">
                  <RotateCcw className="w-5 h-5" />
                </button>
                <button className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors">
                  <ZoomIn className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsFullscreen(true)}
                  className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  <Maximize className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation */}
              <button
                onClick={prevRoom}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <button
                onClick={nextRoom}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Room Info Overlay */}
              <div className="absolute bottom-4 left-4 right-4 bg-black/70 text-white p-4 rounded-xl">
                <h3 className="text-xl font-semibold mb-2">{rooms[currentRoom].title}</h3>
                <p className="text-white/90 mb-3">{rooms[currentRoom].description}</p>
                <div className="flex flex-wrap gap-2">
                  {rooms[currentRoom].highlights.map((highlight, index) => (
                    <span
                      key={index}
                      className="bg-primary px-3 py-1 rounded-full text-sm"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Room Thumbnails */}
            <div className="p-4 bg-gray-50">
              <div className="flex space-x-4 overflow-x-auto">
                {rooms.map((room, index) => (
                  <button
                    key={room.id}
                    onClick={() => setCurrentRoom(index)}
                    className={`flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      currentRoom === index ? 'border-primary' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={room.image}
                      alt={room.title}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Room Details */}
          <motion.div
            key={currentRoom}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          >
            <div>
              <h2 className="text-3xl font-bold mb-6">{rooms[currentRoom].title}</h2>
              <p className="text-gray-700 mb-8 text-lg leading-relaxed">
                {rooms[currentRoom].description}
              </p>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Особенности кабинета:</h3>
                <ul className="space-y-3">
                  {rooms[currentRoom].highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-primary mr-3 text-lg">✓</span>
                      <span className="text-gray-700">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">Хотите посетить лично?</h3>
              <p className="text-gray-700 mb-6">
                Запишитесь на бесплатную экскурсию по клинике. 
                Покажем всё оборудование и ответим на вопросы.
              </p>
              <button className="bg-primary text-white px-8 py-4 rounded-xl font-medium hover:bg-primary-dark transition-colors w-full">
                Записаться на экскурсию
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex items-center justify-center"
          >
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 text-white p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="relative w-full h-full">
              <img
                src={rooms[currentRoom].image}
                alt={rooms[currentRoom].title}
                className="w-full h-full object-contain"
              />
              
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black/70 text-white p-4 rounded-xl">
                <h3 className="text-xl font-semibold text-center">{rooms[currentRoom].title}</h3>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};