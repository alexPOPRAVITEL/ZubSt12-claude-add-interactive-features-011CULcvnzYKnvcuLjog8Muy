import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initDataUnsafe?: {
          user?: {
            first_name?: string;
            username?: string;
            photo_url?: string;
          };
        };
      };
    };
  }
}

const welcomeMessages = [
  {
    title: "С возвращением!",
    message: "Давно вас не видели. Как ваша улыбка?"
  },
  {
    title: "Здравствуйте!",
    message: "Пора проверить здоровье зубов?"
  },
  {
    title: "Добрый день!",
    message: "Напоминаем о важности профилактического осмотра"
  },
  {
    title: "Приветствуем!",
    message: "Записывайтесь на бесплатную консультацию"
  }
];

export const WelcomeDialog: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState(welcomeMessages[0]);
  const [userData, setUserData] = useState<{
    name: string;
    avatar?: string;
  }>({ name: 'дорогой друг' });

  useEffect(() => {
    // Проверяем, показывали ли уже приветствие в этой сессии
    const hasSeenWelcome = sessionStorage.getItem('hasSeenWelcome');
    if (hasSeenWelcome) return; // Не показываем повторно

    const randomMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
    setMessage(randomMessage);

    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    if (tgUser) {
      setUserData({
        name: tgUser.first_name || tgUser.username || 'дорогой друг',
        avatar: tgUser.photo_url
      });
    }

    // Показываем только после 5 секунд, чтобы не мешать сразу
    const showTimer = setTimeout(() => setVisible(true), 5000);
    const hideTimer = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem('hasSeenWelcome', 'true');
    }, 10000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-36 left-4 right-4 z-40 md:left-8 md:right-auto md:w-[400px]"
        >
          <div className="bg-[#2176FF] text-white rounded-2xl p-6 shadow-lg relative">
            <button
              onClick={() => setVisible(false)}
              className="absolute right-3 top-3 text-white/70 hover:text-white"
            >
              <X size={16} />
            </button>
            
            <div className="flex items-center gap-4">
              {userData.avatar ? (
                <img 
                  src={userData.avatar} 
                  alt="User Avatar" 
                  className="w-12 h-12 rounded-full"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  👋
                </div>
              )}
              
              <div>
                <h3 className="font-semibold text-lg mb-1">
                  {message.title} {userData.name}
                </h3>
                <p className="text-white/90">
                  {message.message}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};