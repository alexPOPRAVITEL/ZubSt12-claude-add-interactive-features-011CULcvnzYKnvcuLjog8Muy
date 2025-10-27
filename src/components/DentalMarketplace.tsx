import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Plus, Minus, Trash2, Gift, Clock, MapPin, CreditCard, Smartphone, User, Mail, Phone, Check, Star, Heart, Home } from 'lucide-react';
import { supabase } from '../utils/supabase';

interface MarketplaceItem {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  category: 'services' | 'products';
  image: string;
  description: string;
  duration?: string;
  rating: number;
  popular: boolean;
  free: boolean;
}

interface PromoCode {
  id: string;
  code: string;
  discount_value: number;
  discount_type: 'fixed' | 'percent';
  is_active: boolean;
}

interface CartItem extends MarketplaceItem {
  quantity: number;
}

interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
  isGift: boolean;
  notifications: boolean;
}

const DentalMarketplace = () => {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [flyingItems, setFlyingItems] = useState<{ id: string; x: number; y: number }[]>([]);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    phone: '',
    email: '',
    isGift: false,
    notifications: true
  });

  // Load data from Supabase
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Load marketplace items
        const { data: itemsData, error: itemsError } = await supabase
          .from('marketplace_items')
          .select('*')
          .eq('is_published', true)
          .order('popular', { ascending: false });

        if (itemsError) throw itemsError;

        // Load promo codes
        const { data: promoData, error: promoError } = await supabase
          .from('promo_codes')
          .select('*')
          .eq('is_active', true);

        if (promoError) throw promoError;

        setItems(itemsData || []);
        setPromoCodes(promoData || []);
      } catch (error) {
        console.error('Error loading marketplace data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const addToCart = (item: MarketplaceItem, event?: React.MouseEvent) => {
    if (event) {
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      const flyingId = `${item.id}-${Date.now()}`;
      setFlyingItems(prev => [...prev, { id: flyingId, x: rect.left, y: rect.top }]);

      setTimeout(() => {
        setFlyingItems(prev => prev.filter(f => f.id !== flyingId));
      }, 1000);
    }

    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (id: string, change: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const applyPromoCode = () => {
    const promo = promoCodes.find(p => p.code.toUpperCase() === promoCode.toUpperCase());
    if (promo) {
      setAppliedPromo(promo);
    } else {
      alert('Промокод не найден или недействителен');
    }
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    );
  };

  const calculateTotal = () => {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let discount = 0;
    
    if (appliedPromo) {
      discount = appliedPromo.discount_type === 'fixed' 
        ? appliedPromo.discount_value 
        : (subtotal * appliedPromo.discount_value) / 100;
    }
    
    return Math.max(0, subtotal - discount);
  };

  const getFilteredItems = () => {
    switch (activeFilter) {
      case 'services':
        return items.filter(item => item.category === 'services');
      case 'products':
        return items.filter(item => item.category === 'products');
      case 'popular':
        return items.filter(item => item.popular);
      default:
        return items;
    }
  };

  const handleCheckout = async () => {
    if (!customerInfo.name || !customerInfo.phone) {
      alert('Пожалуйста, заполните обязательные поля');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        customer_name: customerInfo.name,
        customer_phone: customerInfo.phone,
        customer_email: customerInfo.email,
        items: cart,
        subtotal: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        discount: appliedPromo ? (appliedPromo.discount_type === 'fixed' 
          ? appliedPromo.discount_value 
          : (cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) * appliedPromo.discount_value) / 100) : 0,
        total: calculateTotal(),
        promo_code: appliedPromo?.code,
        is_gift: customerInfo.isGift,
        notifications: customerInfo.notifications
      };

      // Save order to database
      const { error: orderError } = await supabase
        .from('orders')
        .insert([orderData]);

      if (orderError) throw orderError;

      // Send notification
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/notify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          type: 'Заказ из магазина',
          ...orderData
        }),
      });

      if (!response.ok) throw new Error('Failed to send notification');

      alert('Заказ успешно оформлен! Мы свяжемся с вами в ближайшее время.');
      
      // Reset form
      setCart([]);
      setCustomerInfo({
        name: '',
        phone: '',
        email: '',
        isGift: false,
        notifications: true
      });
      setAppliedPromo(null);
      setPromoCode('');
      setShowCheckout(false);
      setShowCart(false);

    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Произошла ошибка при оформлении заказа. Пожалуйста, попробуйте позже.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const cartTotal = calculateTotal();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const filteredItems = getFilteredItems();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold text-blue-600">🦷 Зубная Станция</div>
              <div className="hidden md:block text-sm text-gray-600">Семейная стоматология в Барнауле</div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-blue-600 transition-colors">
                <Heart size={24} />
              </button>
              
              <button 
                onClick={() => setShowCart(true)}
                className="relative bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <ShoppingCart size={20} />
                <span>Корзина</span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Стоматологические услуги и товары</h1>
          <p className="text-gray-600">Выберите услуги и товары, сформируйте свой идеальный комплект</p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button 
            onClick={() => setActiveFilter('all')}
            className={`px-6 py-2 rounded-full transition-colors ${
              activeFilter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 border hover:bg-gray-50'
            }`}
          >
            Все
          </button>
          <button 
            onClick={() => setActiveFilter('services')}
            className={`px-6 py-2 rounded-full transition-colors ${
              activeFilter === 'services' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 border hover:bg-gray-50'
            }`}
          >
            Услуги
          </button>
          <button 
            onClick={() => setActiveFilter('products')}
            className={`px-6 py-2 rounded-full transition-colors ${
              activeFilter === 'products' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 border hover:bg-gray-50'
            }`}
          >
            Товары
          </button>
          <button 
            onClick={() => setActiveFilter('popular')}
            className={`px-6 py-2 rounded-full transition-colors ${
              activeFilter === 'popular' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 border hover:bg-gray-50'
            }`}
          >
            Популярное
          </button>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
              {item.popular && (
                <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs px-3 py-1 text-center font-medium">
                  🔥 ПОПУЛЯРНОЕ
                </div>
              )}
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{item.image}</div>
                  <button 
                    onClick={() => toggleFavorite(item.id)}
                    className={`${favorites.includes(item.id) ? 'text-red-500' : 'text-gray-300'} hover:text-red-500 transition-colors`}
                  >
                    <Heart size={20} fill={favorites.includes(item.id) ? 'currentColor' : 'none'} />
                  </button>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2 min-h-[3rem]">{item.name}</h3>
                <p className="text-gray-600 text-sm mb-4 min-h-[2.5rem]">{item.description}</p>
                
                <div className="flex items-center mb-4">
                  <div className="flex items-center text-yellow-400 mr-2">
                    <Star size={16} fill="currentColor" />
                    <span className="text-sm text-gray-600 ml-1">{item.rating}</span>
                  </div>
                  {item.duration && (
                    <div className="flex items-center text-gray-500 text-sm">
                      <Clock size={14} className="mr-1" />
                      {item.duration}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div>
                    {item.free ? (
                      <div className="text-2xl font-bold text-green-600">БЕСПЛАТНО</div>
                    ) : (
                      <>
                        <div className="text-2xl font-bold text-gray-900">{item.price.toLocaleString()} ₽</div>
                        {item.original_price && (
                          <div className="text-sm text-gray-500 line-through">{item.original_price.toLocaleString()} ₽</div>
                        )}
                      </>
                    )}
                  </div>
                </div>
                
                <motion.button
                  onClick={(e) => addToCart(item, e)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <Plus size={20} />
                  <span>В корзину</span>
                </motion.button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Корзина ({cartCount})</h2>
                <button 
                  onClick={() => setShowCart(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {cart.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <ShoppingCart size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>Корзина пуста</p>
                </div>
              ) : (
                <>
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center space-x-4 border-b py-4">
                      <div className="text-2xl">{item.image}</div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <p className="text-blue-600 font-bold">{item.price.toLocaleString()} ₽</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                        >
                          <Plus size={16} />
                        </button>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {/* Promo Code */}
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Промокод"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-1 px-3 py-2 border rounded-lg text-sm"
                      />
                      <button 
                        onClick={applyPromoCode}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                      >
                        Применить
                      </button>
                    </div>
                    {appliedPromo && (
                      <div className="mt-2 text-green-600 text-sm flex items-center">
                        <Check size={16} className="mr-1" />
                        Промокод применен!
                      </div>
                    )}
                  </div>
                  
                  {/* Total */}
                  <div className="mt-6 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Подытог:</span>
                      <span>{cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()} ₽</span>
                    </div>
                    {appliedPromo && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Скидка:</span>
                        <span>-{appliedPromo.discount_type === 'fixed' ? appliedPromo.discount_value : Math.round(cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) * appliedPromo.discount_value / 100)} ₽</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span>Итого:</span>
                      <span>{cartTotal.toLocaleString()} ₽</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setShowCheckout(true)}
                    className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors font-medium mt-6"
                  >
                    Оформить заказ • {cartTotal.toLocaleString()} ₽
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Оформление заказа</h2>
                <button 
                  onClick={() => setShowCheckout(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="font-semibold mb-4">Контактная информация</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Имя *</label>
                    <input
                      type="text"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ваше имя"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Телефон *</label>
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+7 (999) 123-45-67"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>
              </div>

              {/* Service Options */}
              <div>
                <h3 className="font-semibold mb-4">Получение услуг</h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input type="radio" name="service" defaultChecked />
                    <MapPin size={20} className="text-blue-600" />
                    <div>
                      <div className="font-medium">В клинике</div>
                      <div className="text-sm text-gray-600">г. Барнаул, ул. Панфиловцев, 14</div>
                    </div>
                  </label>
                  <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input type="radio" name="service" />
                    <Home size={20} className="text-blue-600" />
                    <div>
                      <div className="font-medium">Вызов врача на дом</div>
                      <div className="text-sm text-gray-600">Доплата 2000 ₽</div>
                    </div>
                  </label>
                  <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input type="radio" name="service" />
                    <Gift size={20} className="text-blue-600" />
                    <div>
                      <div className="font-medium">Подарочный сертификат</div>
                      <div className="text-sm text-gray-600">Отправим на email</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <h3 className="font-semibold mb-4">Способ оплаты</h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input type="radio" name="payment" defaultChecked />
                    <CreditCard size={20} className="text-blue-600" />
                    <div className="font-medium">Онлайн картой</div>
                  </label>
                  <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input type="radio" name="payment" />
                    <MapPin size={20} className="text-blue-600" />
                    <div className="font-medium">В клинике</div>
                  </label>
                  <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input type="radio" name="payment" />
                    <CreditCard size={20} className="text-blue-600" />
                    <div className="font-medium">Рассрочка 0%</div>
                  </label>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input 
                    type="checkbox" 
                    checked={customerInfo.isGift}
                    onChange={(e) => setCustomerInfo({...customerInfo, isGift: e.target.checked})}
                  />
                  <span>Получатель другой человек</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input 
                    type="checkbox" 
                    checked={customerInfo.notifications}
                    onChange={(e) => setCustomerInfo({...customerInfo, notifications: e.target.checked})}
                  />
                  <span>Хочу получать напоминания о записи</span>
                </label>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Ваш заказ</h4>
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between text-sm mb-2">
                    <span>{item.name} × {item.quantity}</span>
                    <span>{(item.price * item.quantity).toLocaleString()} ₽</span>
                  </div>
                ))}
                {appliedPromo && (
                  <div className="flex justify-between text-sm text-green-600 mb-2">
                    <span>Скидка по промокоду</span>
                    <span>-{appliedPromo.discount_type === 'fixed' ? appliedPromo.discount_value : Math.round(cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) * appliedPromo.discount_value / 100)} ₽</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>Итого:</span>
                  <span>{cartTotal.toLocaleString()} ₽</span>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="space-y-3">
                <button 
                  onClick={handleCheckout}
                  disabled={isSubmitting}
                  className={`w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors font-medium ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? 'Обработка...' : `Оплатить онлайн • ${cartTotal.toLocaleString()} ₽`}
                </button>
                <button 
                  onClick={handleCheckout}
                  disabled={isSubmitting}
                  className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Купить в 1 клик
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Flying Cart Animation */}
      <AnimatePresence>
        {flyingItems.map(item => (
          <motion.div
            key={item.id}
            initial={{ x: item.x, y: item.y, scale: 1, opacity: 1 }}
            animate={{
              x: window.innerWidth - 100,
              y: 20,
              scale: 0.3,
              opacity: 0
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed z-[100] pointer-events-none"
          >
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default DentalMarketplace;