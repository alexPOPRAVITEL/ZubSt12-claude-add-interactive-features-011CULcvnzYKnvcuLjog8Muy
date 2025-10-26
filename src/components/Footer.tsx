import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Send, MessageCircle } from 'lucide-react';
import { getImageUrl } from '../utils/mediaContent';

export const Footer: React.FC = () => {
  const [logoUrl, setLogoUrl] = React.useState('https://files.salebot.pro/uploads/file_item/file/575843/ЗУБНАЯ_СТАНЦИЯ__6_.png');

  React.useEffect(() => {
    // Загружаем логотип из админки
    const loadLogo = async () => {
      const imageUrl = await getImageUrl(
        'general', 
        'logo.png', 
        'https://files.salebot.pro/uploads/file_item/file/575843/ЗУБНАЯ_СТАНЦИЯ__6_.png'
      );
      setLogoUrl(imageUrl);
    };

    loadLogo();
  }, []);

  return (
    <footer className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Contact Info */}
          <div className="space-y-6">
            <div className="relative bg-white rounded-2xl p-4 shadow-xl">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl blur-sm"></div>
                  <img
                    src="/ЗУБНАЯ СТАНЦИЯ (6) copy.png"
                    alt="Зубная Станция"
                    className="relative h-16 w-16 bg-white rounded-xl p-2 shadow-lg"
                  />
                </div>
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                    Зубная Станция
                  </span>
                  <p className="text-sm text-gray-600 mt-1">Следующая станция — здоровая улыбка</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 mt-1 flex-shrink-0" />
                <a href="tel:+79619785454" className="hover:text-white/80 transition-colors">
                  +7 961 978-54-54
                </a>
              </div>

              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 mt-1 flex-shrink-0" />
                <a href="mailto:zubnayast@gmail.com" className="hover:text-white/80 transition-colors break-all">
                  zubnayast@gmail.com
                </a>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
                <span>ул. Панфиловцев, 14, Барнаул</span>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Время работы</h4>
              <div className="space-y-2 text-sm">
                <p>Пн - Пт: 9:00 - 20:00</p>
                <p>Сб - Вс: выходной</p>
              </div>
            </div>
          </div>

          {/* Navigation Column 1 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Навигация</h3>
            <nav className="space-y-2 text-sm">
              <Link to="/about" className="block hover:text-white/80 transition-colors">О клинике</Link>
              <Link to="/services" className="block hover:text-white/80 transition-colors">Услуги</Link>
              <Link to="/doctors" className="block hover:text-white/80 transition-colors">Врачи</Link>
              <Link to="/prices" className="block hover:text-white/80 transition-colors">Цены</Link>
              <Link to="/reviews" className="block hover:text-white/80 transition-colors">Отзывы</Link>
              <Link to="/portfolio" className="block hover:text-white/80 transition-colors">Наши работы</Link>
              <Link to="/team" className="block hover:text-white/80 transition-colors">Команда</Link>
              <Link to="/press" className="block hover:text-white/80 transition-colors">СМИ о нас</Link>
            </nav>
          </div>

          {/* Navigation Column 2 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Услуги</h3>
            <nav className="space-y-2 text-sm">
              <Link to="/subscriptions" className="block hover:text-white/80 transition-colors">Абонементы</Link>
              <Link to="/marketplace" className="block hover:text-white/80 transition-colors">Магазин</Link>
              <Link to="/promotions" className="block hover:text-white/80 transition-colors">Акции</Link>
              <Link to="/loyalty" className="block hover:text-white/80 transition-colors">Программа лояльности</Link>
              <Link to="/blog" className="block hover:text-white/80 transition-colors">Блог</Link>
              <Link to="/contacts" className="block hover:text-white/80 transition-colors">Контакты</Link>
              <Link to="/mobile-app" className="block hover:text-white/80 transition-colors">Мобильное приложение</Link>
              <Link to="/newsletter" className="block hover:text-white/80 transition-colors">Рассылка</Link>
            </nav>
          </div>

          {/* Navigation Column 3 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Информация</h3>
            <nav className="space-y-2 text-sm">
              <Link to="/virtual-tour" className="block hover:text-white/80 transition-colors">Виртуальный тур</Link>
              <Link to="/faq" className="block hover:text-white/80 transition-colors">Часто задаваемые вопросы</Link>
              <Link to="/privacy" className="block hover:text-white/80 transition-colors">Политика конфиденциальности</Link>
              <Link to="/privacy-terms" className="block hover:text-white/80 transition-colors">Пользовательское соглашение</Link>
              <Link to="/license" className="block hover:text-white/80 transition-colors">Лицензия</Link>
            </nav>
          </div>
        </div>

        {/* Social Media Icons Section */}
        <div className="mt-12 pt-8 border-t border-white/20">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-6">Мы в соцсетях</h3>
            <div className="flex justify-center items-center gap-4 flex-wrap">
              <a
                href="https://vk.com/zubst"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col items-center justify-center w-20 h-20 bg-white/10 hover:bg-gradient-to-br hover:from-blue-500 hover:to-blue-600 rounded-2xl transition-all duration-300 hover:scale-110 hover:shadow-xl"
              >
                <span className="text-3xl mb-1">📱</span>
                <span className="text-xs font-medium">VK</span>
              </a>

              <a
                href="https://t.me/zub_st"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col items-center justify-center w-20 h-20 bg-white/10 hover:bg-gradient-to-br hover:from-sky-500 hover:to-sky-600 rounded-2xl transition-all duration-300 hover:scale-110 hover:shadow-xl"
              >
                <Send className="w-8 h-8 mb-1" />
                <span className="text-xs font-medium">Telegram</span>
              </a>

              <a
                href="https://www.instagram.com/zubnayast?igsh=MTNwbGo3c3o4Y2NwZQ%3D%3D&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col items-center justify-center w-20 h-20 bg-white/10 hover:bg-gradient-to-br hover:from-pink-500 hover:to-purple-600 rounded-2xl transition-all duration-300 hover:scale-110 hover:shadow-xl"
              >
                <span className="text-3xl mb-1">📸</span>
                <span className="text-xs font-medium">Instagram</span>
              </a>

              <a
                href="https://wa.me/79619785454"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col items-center justify-center w-20 h-20 bg-white/10 hover:bg-gradient-to-br hover:from-green-500 hover:to-green-600 rounded-2xl transition-all duration-300 hover:scale-110 hover:shadow-xl"
              >
                <MessageCircle className="w-8 h-8 mb-1" />
                <span className="text-xs font-medium">WhatsApp</span>
              </a>

              <a
                href="https://2gis.ru/barnaul/geo/70000001085665549"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col items-center justify-center w-20 h-20 bg-white/10 hover:bg-gradient-to-br hover:from-green-600 hover:to-green-700 rounded-2xl transition-all duration-300 hover:scale-110 hover:shadow-xl"
              >
                <span className="text-3xl mb-1">🗺️</span>
                <span className="text-xs font-medium">2GIS</span>
              </a>

              <a
                href="https://yandex.ru/maps/org/zubnaya_stantsiya/160523065239?si=bh6f5fxy24ttcc8uekgpxc2c7c"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col items-center justify-center w-20 h-20 bg-white/10 hover:bg-gradient-to-br hover:from-red-500 hover:to-red-600 rounded-2xl transition-all duration-300 hover:scale-110 hover:shadow-xl"
              >
                <span className="text-3xl mb-1">📍</span>
                <span className="text-xs font-medium">Yandex</span>
              </a>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-lg mb-2">
                Следующая станция — здоровая улыбка
              </p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-white/70 mb-1">
                ООО "Зубная Станция"
              </p>
              <p className="text-sm text-white/70 mb-1">
                ИНН: 2222901480 | ОГРН: 1232200005245
              </p>
              <p className="text-sm text-white/70 mb-1">
                Лицензия № Л041-01151-22/01108315 от 27.03.2024 г.
              </p>
              <p className="text-sm text-white/70">
                © 2023-2025 Зубная Станция. Все права защищены.
              </p>
              <div className="mt-2 space-x-4">
                <Link to="/privacy" className="text-xs text-white/60 hover:text-white/80 transition-colors">
                  Политика конфиденциальности
                </Link>
                <Link to="/privacy-terms" className="text-xs text-white/60 hover:text-white/80 transition-colors">
                  Пользовательское соглашение
                </Link>
                <Link to="/license" className="text-xs text-white/60 hover:text-white/80 transition-colors">
                  Лицензия
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};