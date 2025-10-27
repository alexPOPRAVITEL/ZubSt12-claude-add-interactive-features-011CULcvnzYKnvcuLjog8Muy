import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Check } from 'lucide-react';

interface SubscriptionFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubscriptionForm: React.FC<SubscriptionFormProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    agreement: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showAgreementError, setShowAgreementError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowAgreementError(false);

    if (!formData.agreement) {
      setShowAgreementError(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/notify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          ...formData,
          type: 'Абонемент "5+2"'
        }),
      });

      if (!response.ok) throw new Error('Failed to send notification');

      setSubmitStatus('success');
      setTimeout(() => {
        onClose();
        setSubmitStatus('idle');
        setFormData({
          name: '',
          phone: '',
          email: '',
          agreement: false
        });
      }, 2000);
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl p-6 w-full max-w-lg relative"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-[#002B49] mb-6">
              Оформление абонемента "5+2"
            </h2>

            {submitStatus === 'success' ? (
              <div className="text-center py-8">
                <div className="text-green-500 text-xl mb-2">✓</div>
                <h3 className="text-xl font-semibold mb-2">Спасибо за заявку!</h3>
                <p className="text-gray-600">
                  Мы свяжемся с вами в ближайшее время для подтверждения.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Ваше имя
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary"
                    placeholder="Как к вам обращаться?"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Телефон
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary"
                    placeholder="+7 (___) ___-__-__"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary"
                    placeholder="example@mail.ru"
                  />
                </div>

                <div className="flex items-start bg-primary/5 p-3 rounded-xl relative">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={formData.agreement ? { scale: 1 } : { scale: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="absolute left-3 top-3 text-green-500"
                  >
                    <Check className="w-5 h-5" />
                  </motion.div>
                  <input
                    type="checkbox"
                    id="agreement"
                    checked={formData.agreement}
                    onChange={(e) => {
                      setFormData({ ...formData, agreement: e.target.checked });
                      setShowAgreementError(false);
                    }}
                    className="h-5 w-5 text-primary border-2 border-primary rounded focus:ring-primary"
                  />
                  <label 
                    htmlFor="agreement" 
                    className={`ml-2 text-sm ${showAgreementError ? 'text-red-500' : 'text-gray-600'}`}
                  >
                    Я согласен на обработку персональных данных
                  </label>
                </div>

                {showAgreementError && (
                  <p className="text-red-500 text-sm">
                    Необходимо согласие на обработку персональных данных
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-primary text-white py-3 px-6 rounded-xl hover:bg-primary-dark transition-colors duration-300 ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2 inline" />
                      Отправка...
                    </>
                  ) : (
                    'Оформить абонемент'
                  )}
                </button>

                {submitStatus === 'error' && (
                  <p className="text-red-500 text-sm text-center">
                    Произошла ошибка. Пожалуйста, попробуйте позже.
                  </p>
                )}

                <p className="text-sm text-gray-500 text-center">
                  Нажимая кнопку, вы соглашаетесь с{' '}
                  <a href="/privacy" className="text-primary hover:underline">
                    политикой обработки персональных данных
                  </a>
                </p>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};