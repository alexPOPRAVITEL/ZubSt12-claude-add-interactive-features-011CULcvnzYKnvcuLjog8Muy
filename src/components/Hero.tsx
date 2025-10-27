import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { BookingWizard } from './BookingWizard';
import { getImageUrl } from '../utils/mediaContent';
import { HeroInstagramStories } from './HeroInstagramStories';

export const Hero: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [heroImage, setHeroImage] = useState('https://files.salebot.pro/uploads/file_item/file/449726/GUbc5XlceeL9-5gSQR2xT52WCkDhJOBrx0AmU2sTseS9KQWSVF2Ac9fkTEaKEXJ5Kj7JHp3Pl1doAv238rV-6g__.jpeg');

  useEffect(() => {
    const loadHeroImage = async () => {
      const imageUrl = await getImageUrl(
        'hero',
        'hero-main.jpeg',
        'https://files.salebot.pro/uploads/file_item/file/449726/GUbc5XlceeL9-5gSQR2xT52WCkDhJOBrx0AmU2sTseS9KQWSVF2Ac9fkTEaKEXJ5Kj7JHp3Pl1doAv238rV-6g__.jpeg'
      );
      setHeroImage(imageUrl);
    };

    loadHeroImage();
  }, []);

  return (
    <div className="relative min-h-screen bg-cream overflow-hidden">
      <div className="absolute inset-0 z-0">
        <HeroInstagramStories />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-4rem)] flex flex-col justify-between pt-8 md:pt-12 pb-24 md:pb-32">
        <div className="flex items-start gap-4 md:gap-6">
          <motion.img
            src="/dental-station-logo-main.png"
            alt="Логотип Зубной Станции"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="w-16 h-16 md:w-24 md:h-24 object-contain rounded-xl bg-white p-2 shadow-lg"
          />
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl md:text-5xl font-bold text-white leading-tight"
          >
            ЗУБНАЯ СТАНЦИЯ
          </motion.h1>
        </div>

        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="inline-block"
          >
            <p className="text-xl md:text-2xl text-white max-w-3xl bg-black/50 backdrop-blur-sm px-6 py-4 rounded-2xl leading-relaxed">
              Следующая станция — здоровая улыбка!<br />
              <span className="text-lg md:text-xl">
                • Запись за 30 секунд<br />
                • Приём сегодня<br />
                • Комплексное лечение для всей семьи
              </span>
            </p>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <motion.button
            onClick={() => setIsModalOpen(true)}
            initial={{ opacity: 0, x: -100 }}
            animate={{
              opacity: 1,
              x: 0,
              y: [0, -10, 0]
            }}
            transition={{
              x: { duration: 0.8, delay: 0.6 },
              opacity: { duration: 0.8, delay: 0.6 },
              y: { duration: 0.6, delay: 2.6, repeat: Infinity, repeatDelay: 2 }
            }}
            className="w-full sm:flex-1 px-8 py-4 text-lg font-semibold rounded-xl text-white bg-primary hover:bg-primary-dark transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
          >
            Записаться
          </motion.button>

          <motion.a
            href="tel:+79619785454"
            initial={{ opacity: 0, x: -100 }}
            animate={{
              opacity: 1,
              x: 0,
              y: [0, -10, 0]
            }}
            transition={{
              x: { duration: 0.8, delay: 0.8 },
              opacity: { duration: 0.8, delay: 0.8 },
              y: { duration: 0.6, delay: 2.8, repeat: Infinity, repeatDelay: 2 }
            }}
            className="w-full sm:flex-1 px-8 py-4 text-lg font-semibold rounded-xl text-white bg-[#25D366] hover:bg-[#1EBE5D] transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl text-center"
          >
            Позвонить
          </motion.a>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            y: [-10, 10]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
          className="absolute left-[65%] -translate-x-1/2 bottom-[calc(8rem+1.75rem)] text-white/70"
        >
          <ChevronDown className="h-12 w-12" />
        </motion.div>
      </div>

      <BookingWizard isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};