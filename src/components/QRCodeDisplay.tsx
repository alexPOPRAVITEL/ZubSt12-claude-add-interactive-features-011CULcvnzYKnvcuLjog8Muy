import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Download, Apple, PlayCircle, QrCode as QrIcon } from 'lucide-react';

interface QRCodeDisplayProps {
  size?: 'small' | 'medium' | 'large';
  showInstructions?: boolean;
  variant?: 'floating' | 'embedded';
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  size = 'medium',
  showInstructions = true,
  variant = 'embedded'
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [animateGlow, setAnimateGlow] = useState(false);

  const sizeClasses = {
    small: 'w-32 h-32',
    medium: 'w-48 h-48',
    large: 'w-64 h-64'
  };

  const appUrl = 'https://zubst.ru/mobile-app';

  useEffect(() => {
    const generateQRCode = () => {
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${
        size === 'small' ? '200' : size === 'medium' ? '300' : '400'
      }x${
        size === 'small' ? '200' : size === 'medium' ? '300' : '400'
      }&data=${encodeURIComponent(appUrl)}&bgcolor=FFFFFF&color=2176FF&qzone=2&format=svg`;

      setQrCodeUrl(qrApiUrl);
    };

    generateQRCode();

    const glowInterval = setInterval(() => {
      setAnimateGlow(true);
      setTimeout(() => setAnimateGlow(false), 2000);
    }, 5000);

    return () => clearInterval(glowInterval);
  }, [size, appUrl]);

  if (variant === 'floating') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8, x: 100 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed bottom-8 right-8 z-40 stylus-target"
      >
        <motion.div
          animate={animateGlow ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 2 }}
          className="bg-white rounded-3xl shadow-2xl p-6 border-4 border-primary/20"
        >
          <div className="text-center mb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Smartphone className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-bold text-gray-800">Скачайте приложение</h3>
            </div>
            <p className="text-sm text-gray-600">Наведите камеру на QR-код</p>
          </div>

          <div className="relative">
            <div className={`${sizeClasses[size]} mx-auto bg-white p-4 rounded-2xl shadow-inner relative overflow-hidden`}>
              {animateGlow && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 animate-pulse" />
              )}
              {qrCodeUrl ? (
                <img
                  src={qrCodeUrl}
                  alt="QR Code для скачивания приложения"
                  className="w-full h-full object-contain relative z-10"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              )}
            </div>

            <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <QrIcon className="w-6 h-6 text-white" />
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <div className="flex-1 bg-gray-100 rounded-xl p-2 flex items-center justify-center gap-1">
              <Apple className="w-4 h-4 text-gray-700" />
              <span className="text-xs font-medium text-gray-700">iOS</span>
            </div>
            <div className="flex-1 bg-gray-100 rounded-xl p-2 flex items-center justify-center gap-1">
              <PlayCircle className="w-4 h-4 text-gray-700" />
              <span className="text-xs font-medium text-gray-700">Android</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-primary/5 via-white to-accent/5 rounded-3xl p-8 shadow-xl"
      >
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <motion.div
                animate={animateGlow ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 2 }}
                className="relative"
              >
                <div className={`${sizeClasses[size]} mx-auto bg-white p-6 rounded-3xl shadow-2xl border-4 border-primary/10 relative overflow-hidden`}>
                  {animateGlow && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 animate-pulse" />
                  )}
                  {qrCodeUrl ? (
                    <img
                      src={qrCodeUrl}
                      alt="QR Code для скачивания приложения"
                      className="w-full h-full object-contain relative z-10"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
                    </div>
                  )}
                </div>

                <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                  <Smartphone className="w-8 h-8 text-white" />
                </div>

                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full blur-xl"
                />
              </motion.div>
            </div>

            {showInstructions && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Скачайте наше приложение
                  </h2>
                  <p className="text-gray-700 text-lg">
                    Управляйте своим здоровьем удобно с телефона
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3 stylus-target p-4 rounded-2xl hover:bg-white/50 transition-colors">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Откройте камеру телефона</h3>
                      <p className="text-sm text-gray-600">Наведите на QR-код для сканирования</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 stylus-target p-4 rounded-2xl hover:bg-white/50 transition-colors">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Перейдите по ссылке</h3>
                      <p className="text-sm text-gray-600">Нажмите на уведомление на экране</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 stylus-target p-4 rounded-2xl hover:bg-white/50 transition-colors">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Установите приложение</h3>
                      <p className="text-sm text-gray-600">Доступно для iOS и Android</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-3">Или скачайте напрямую:</p>
                  <div className="flex gap-3">
                    <button className="flex-1 bg-black text-white px-4 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors stylus-target">
                      <Apple className="w-5 h-5" />
                      <span className="font-medium">App Store</span>
                    </button>
                    <button className="flex-1 bg-green-600 text-white px-4 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-green-700 transition-colors stylus-target">
                      <PlayCircle className="w-5 h-5" />
                      <span className="font-medium">Google Play</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
