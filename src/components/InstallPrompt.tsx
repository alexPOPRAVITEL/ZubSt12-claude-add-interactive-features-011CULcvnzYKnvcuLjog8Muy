import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Проверяем, установлено ли уже приложение
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Проверяем localStorage - показывали ли уже промпт
    const hasSeenPrompt = localStorage.getItem('hasSeenInstallPrompt');

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Показываем промпт через 60 секунд, если пользователь ещё не видел его
      // Это даст пользователю время освоиться на сайте
      if (!hasSeenPrompt) {
        setTimeout(() => {
          setShowPrompt(true);
        }, 60000); // 1 минута вместо 10 секунд
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
    localStorage.setItem('hasSeenInstallPrompt', 'true');
  };

  const handleClose = () => {
    setShowPrompt(false);
    localStorage.setItem('hasSeenInstallPrompt', 'true');
  };

  // Если приложение установлено или нет события установки, не показываем
  if (isInstalled || !deferredPrompt) return null;

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-24 left-4 right-4 lg:left-auto lg:right-8 lg:bottom-8 lg:w-96 z-50"
        >
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-blue-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl">
                    🦷
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Установите приложение</h3>
                    <p className="text-xs text-blue-100">Зубная Станция</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4">
              <div className="space-y-3 mb-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Smartphone className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">Быстрый доступ</h4>
                    <p className="text-xs text-gray-600">Запускайте с главного экрана</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Download className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">Работает офлайн</h4>
                    <p className="text-xs text-gray-600">Основные функции без интернета</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 text-sm">🔔</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">Уведомления</h4>
                    <p className="text-xs text-gray-600">Напоминания о записи и акциях</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleInstallClick}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span>Установить приложение</span>
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                Займет всего несколько секунд
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
