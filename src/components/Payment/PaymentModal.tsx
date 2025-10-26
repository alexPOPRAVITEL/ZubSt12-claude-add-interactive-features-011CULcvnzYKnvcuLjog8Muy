import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Lock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  description: string;
  customerEmail?: string;
  customerPhone?: string;
  onSuccess?: (paymentId: string) => void;
  onError?: (error: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  description,
  customerEmail,
  customerPhone,
  onSuccess,
  onError
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handlePayment = async () => {
    setIsProcessing(true);
    setPaymentStatus('processing');
    setErrorMessage('');

    try {
      // Создаем платеж через Supabase Edge Function
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/tbank-payment`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            amount: Math.round(amount * 100), // Конвертируем в копейки
            description,
            customerEmail,
            customerPhone,
            returnUrl: `${window.location.origin}/payment/success`,
            failUrl: `${window.location.origin}/payment/fail`,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка создания платежа');
      }

      const data = await response.json();

      if (data.paymentUrl) {
        // Перенаправляем на страницу оплаты T-Bank
        window.location.href = data.paymentUrl;
      } else if (data.paymentId) {
        // Успешная оплата (для тестового режима)
        setPaymentStatus('success');
        if (onSuccess) {
          onSuccess(data.paymentId);
        }
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error('Payment error:', error);
      const errorMsg = error instanceof Error ? error.message : 'Произошла ошибка при оплате';
      setErrorMessage(errorMsg);
      setPaymentStatus('error');
      if (onError) {
        onError(errorMsg);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const formatAmount = (value: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB'
    }).format(value);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={(e) => e.target === e.currentTarget && !isProcessing && onClose()}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl w-full max-w-md relative overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <button
                onClick={onClose}
                disabled={isProcessing}
                className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 disabled:opacity-50"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Оплата услуг</h2>
                  <p className="text-sm text-gray-500">Безопасный платеж через Т-Банк</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {paymentStatus === 'success' ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Оплата прошла успешно!</h3>
                  <p className="text-gray-600">Спасибо за ваш платеж</p>
                </motion.div>
              ) : paymentStatus === 'error' ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Ошибка оплаты</h3>
                  <p className="text-gray-600 mb-4">{errorMessage}</p>
                  <button
                    onClick={() => setPaymentStatus('idle')}
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    Попробовать снова
                  </button>
                </motion.div>
              ) : (
                <div className="space-y-6">
                  {/* Payment Details */}
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Описание:</span>
                      <span className="font-medium text-gray-900">{description}</span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                      <span className="text-gray-900 font-semibold">Сумма к оплате:</span>
                      <span className="text-2xl font-bold text-primary">{formatAmount(amount)}</span>
                    </div>
                  </div>

                  {/* Security Info */}
                  <div className="flex items-start gap-3 bg-blue-50 rounded-xl p-4">
                    <Lock className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-blue-900 mb-1">Безопасная оплата</h4>
                      <p className="text-sm text-blue-700">
                        Платеж обрабатывается через защищенное соединение Т-Банк.
                        Данные вашей карты надежно защищены.
                      </p>
                    </div>
                  </div>

                  {/* Payment Button */}
                  <button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="w-full px-6 py-4 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all duration-300 font-semibold text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Обработка...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        Оплатить {formatAmount(amount)}
                      </>
                    )}
                  </button>

                  {/* Terms */}
                  <p className="text-xs text-gray-500 text-center">
                    Нажимая кнопку "Оплатить", вы соглашаетесь с{' '}
                    <a href="/privacy" className="text-primary hover:underline">условиями оплаты</a>
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
