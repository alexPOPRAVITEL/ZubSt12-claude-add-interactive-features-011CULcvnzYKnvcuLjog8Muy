import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Search, 
  Eye,
  ShoppingBag,
  Calendar,
  Phone,
  Mail,
  User,
  Package,
  DollarSign,
  CheckCircle,
  Clock,
  X as XIcon
} from 'lucide-react';
import { supabase } from '../../utils/supabase';

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  items: any[];
  subtotal: number;
  discount: number;
  total: number;
  promo_code?: string;
  service_type: string;
  payment_method: string;
  is_gift: boolean;
  notifications: boolean;
  status: string;
  created_at: string;
}

interface OrdersManagementProps {
  onBack: () => void;
}

export const OrdersManagement: React.FC<OrdersManagementProps> = ({ onBack }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const statusOptions = [
    { value: 'all', label: 'Все заказы' },
    { value: 'pending', label: 'Ожидают' },
    { value: 'confirmed', label: 'Подтверждены' },
    { value: 'completed', label: 'Выполнены' },
    { value: 'cancelled', label: 'Отменены' }
  ];

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      await loadOrders();
      alert('Статус заказа обновлен!');
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Ошибка обновления статуса');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Ожидает';
      case 'confirmed': return 'Подтвержден';
      case 'completed': return 'Выполнен';
      case 'cancelled': return 'Отменен';
      default: return status;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customer_phone.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Управление заказами</h1>
            <span className="text-sm text-gray-500">Заказы из магазина и записи</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Поиск по имени или телефону..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
        >
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Заказ #{order.id.slice(-8)}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{order.customer_name}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{order.customer_phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{new Date(order.created_at).toLocaleDateString('ru-RU')}</span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1 text-green-500" />
                      <span className="font-semibold text-green-600">
                        {order.total.toLocaleString()} ₽
                      </span>
                      {order.discount > 0 && (
                        <span className="ml-2 text-sm text-gray-500">
                          (скидка: {order.discount.toLocaleString()} ₽)
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Package className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {order.items?.length || 0} товаров
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Просмотр"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="pending">Ожидает</option>
                    <option value="confirmed">Подтвержден</option>
                    <option value="completed">Выполнен</option>
                    <option value="cancelled">Отменен</option>
                  </select>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Детали заказа #{selectedOrder.id.slice(-8)}</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Customer Info */}
              <div>
                <h4 className="font-semibold mb-3">Информация о клиенте</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div><strong>Имя:</strong> {selectedOrder.customer_name}</div>
                  <div><strong>Телефон:</strong> {selectedOrder.customer_phone}</div>
                  {selectedOrder.customer_email && (
                    <div><strong>Email:</strong> {selectedOrder.customer_email}</div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-semibold mb-3">Состав заказа</h4>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-600">Количество: {item.quantity}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{(item.price * item.quantity).toLocaleString()} ₽</div>
                        <div className="text-sm text-gray-600">{item.price.toLocaleString()} ₽ за шт.</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h4 className="font-semibold mb-3">Итого</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Подытог:</span>
                    <span>{selectedOrder.subtotal.toLocaleString()} ₽</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Скидка:</span>
                      <span>-{selectedOrder.discount.toLocaleString()} ₽</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Итого:</span>
                    <span>{selectedOrder.total.toLocaleString()} ₽</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};