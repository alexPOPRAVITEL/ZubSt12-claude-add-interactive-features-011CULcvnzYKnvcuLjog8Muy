import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cookie, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true and disabled
    analytics: true,
    marketing: false
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    } else {
      const savedPreferences = JSON.parse(consent);
      setPreferences(savedPreferences);
      
      // Apply preferences
      if (!savedPreferences.analytics) {
        window['ga-disable-' + import.meta.env.VITE_GA_MEASUREMENT_ID] = true;
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const newPreferences = {
      necessary: true,
      analytics: true,
      marketing: true
    };
    savePreferences(newPreferences);
  };

  const handleSavePreferences = () => {
    savePreferences(preferences);
  };

  const savePreferences = (prefs: typeof preferences) => {
    localStorage.setItem('cookie-consent', JSON.stringify(prefs));
    setIsVisible(false);

    // Apply preferences
    window['ga-disable-' + import.meta.env.VITE_GA_MEASUREMENT_ID] = !prefs.analytics;

    // Reload page if analytics preference changed
    if (prefs.analytics !== preferences.analytics) {
      window.location.reload();
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 right-4 z-50 max-w-xs bg-white/95 backdrop-blur-md shadow-lg border border-gray-200 rounded-2xl mobile-safe-bottom"
        >
          <div className="p-4">
            <div className="flex items-start gap-2 mb-3">
              <Cookie className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-xs font-semibold mb-1">Файлы cookie</h3>
                <p className="text-xs text-gray-600 mb-2">
                  Для улучшения сайта.{' '}
                  <Link to="/privacy" className="text-primary hover:underline">
                    Подробнее
                  </Link>
                </p>
                
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-primary hover:text-primary-dark text-xs flex items-center gap-1"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="w-3 h-3" />
                      Скрыть
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3 h-3" />
                      Настроить
                    </>
                  )}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-medium">Необходимые</div>
                        <div className="text-xs text-gray-500">
                          Для работы сайта
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.necessary}
                        disabled
                        className="h-4 w-4 text-primary border-2 border-primary rounded focus:ring-primary"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-medium">Аналитика</div>
                        <div className="text-xs text-gray-500">
                          Улучшение сайта
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                        className="h-4 w-4 text-primary border-2 border-primary rounded focus:ring-primary"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-medium">Маркетинг</div>
                        <div className="text-xs text-gray-500">
                          Персонализация
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.marketing}
                        onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                        className="h-4 w-4 text-primary border-2 border-primary rounded focus:ring-primary"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-2">
              {isExpanded ? (
                <button
                  onClick={handleSavePreferences}
                  className="flex-1 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-xs"
                >
                  Сохранить
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setIsVisible(false)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-xs"
                  >
                    Отклонить
                  </button>
                  <button
                    onClick={handleAcceptAll}
                    className="flex-1 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-xs"
                  >
                    Принять
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};