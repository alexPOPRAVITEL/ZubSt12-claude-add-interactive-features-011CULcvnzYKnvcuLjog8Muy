import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, TrendingUp, TrendingDown, Plus, CreditCard as Edit2, Trash2, Calendar, Filter, Download, Wallet, CreditCard, PieChart, BarChart3, ArrowUpRight, ArrowDownRight, X } from 'lucide-react';
import { supabase } from '../../utils/supabase';

interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
  is_active: boolean;
}

interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon: string;
}

interface Transaction {
  id: string;
  account_id: string;
  category_id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  transaction_date: string;
  created_by: string;
  category?: Category;
  account?: Account;
}

export const FinanceManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'accounts' | 'categories'>('overview');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [dateFilter, setDateFilter] = useState('month');
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    monthlyGrowth: 0
  });

  useEffect(() => {
    loadAccounts();
    loadCategories();
    loadTransactions();
  }, [dateFilter]);

  const loadAccounts = async () => {
    const { data } = await supabase
      .from('finance_accounts')
      .select('*')
      .eq('is_active', true)
      .order('name');
    if (data) setAccounts(data);
  };

  const loadCategories = async () => {
    const { data } = await supabase
      .from('finance_categories')
      .select('*')
      .order('type', { ascending: false });
    if (data) setCategories(data);
  };

  const loadTransactions = async () => {
    const dateFrom = getDateFrom(dateFilter);

    const { data } = await supabase
      .from('finance_transactions')
      .select(`
        *,
        category:finance_categories(*),
        account:finance_accounts(*)
      `)
      .gte('transaction_date', dateFrom)
      .order('transaction_date', { ascending: false });

    if (data) {
      setTransactions(data);
      calculateStats(data);
    }
  };

  const calculateStats = (txns: Transaction[]) => {
    const income = txns
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expense = txns
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalBalance = accounts.reduce((sum, acc) => sum + Number(acc.balance), 0);

    setStats({
      totalIncome: income,
      totalExpense: expense,
      balance: totalBalance,
      monthlyGrowth: income > 0 ? ((income - expense) / income * 100) : 0
    });
  };

  const getDateFrom = (filter: string) => {
    const now = new Date();
    switch (filter) {
      case 'week':
        return new Date(now.setDate(now.getDate() - 7)).toISOString().split('T')[0];
      case 'month':
        return new Date(now.setMonth(now.getMonth() - 1)).toISOString().split('T')[0];
      case 'year':
        return new Date(now.setFullYear(now.getFullYear() - 1)).toISOString().split('T')[0];
      default:
        return new Date(now.setMonth(now.getMonth() - 1)).toISOString().split('T')[0];
    }
  };

  const deleteTransaction = async (id: string) => {
    if (confirm('Удалить транзакцию?')) {
      await supabase.from('finance_transactions').delete().eq('id', id);
      loadTransactions();
      loadAccounts();
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <DollarSign className="w-8 h-8 text-green-600" />
          <h1 className="text-3xl font-bold text-gray-900">FinTablo</h1>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="week">Неделя</option>
            <option value="month">Месяц</option>
            <option value="year">Год</option>
          </select>
          <button
            onClick={() => setShowTransactionModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Новая транзакция</span>
          </button>
        </div>
      </div>

      {/* Табы */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'overview', label: 'Обзор', icon: PieChart },
          { id: 'transactions', label: 'Транзакции', icon: BarChart3 },
          { id: 'accounts', label: 'Счета', icon: Wallet },
          { id: 'categories', label: 'Категории', icon: Filter }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-green-600 shadow'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Обзор */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard
              title="Общий баланс"
              value={formatCurrency(stats.balance)}
              icon={<Wallet className="w-6 h-6 text-blue-600" />}
              color="blue"
            />
            <StatCard
              title="Доходы"
              value={formatCurrency(stats.totalIncome)}
              icon={<ArrowUpRight className="w-6 h-6 text-green-600" />}
              color="green"
            />
            <StatCard
              title="Расходы"
              value={formatCurrency(stats.totalExpense)}
              icon={<ArrowDownRight className="w-6 h-6 text-red-600" />}
              color="red"
            />
            <StatCard
              title="Прибыль"
              value={formatCurrency(stats.totalIncome - stats.totalExpense)}
              icon={<TrendingUp className="w-6 h-6 text-purple-600" />}
              color="purple"
              growth={stats.monthlyGrowth}
            />
          </div>

          {/* Счета */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Счета</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {accounts.map(account => (
                <div key={account.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">{account.name}</span>
                    <CreditCard className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="text-2xl font-bold">{formatCurrency(Number(account.balance))}</div>
                  <div className="text-xs text-gray-500 mt-1">{account.type}</div>
                </div>
              ))}
            </div>
          </div>

          {/* График по категориям */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CategoryChart
              title="Доходы по категориям"
              categories={categories.filter(c => c.type === 'income')}
              transactions={transactions.filter(t => t.type === 'income')}
            />
            <CategoryChart
              title="Расходы по категориям"
              categories={categories.filter(c => c.type === 'expense')}
              transactions={transactions.filter(t => t.type === 'expense')}
            />
          </div>
        </div>
      )}

      {/* Транзакции */}
      {activeTab === 'transactions' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Дата</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Категория</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Описание</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Счет</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Сумма</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {transactions.map(transaction => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(transaction.transaction_date).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="px-2 py-1 text-xs rounded-full"
                        style={{
                          backgroundColor: transaction.category?.color + '20',
                          color: transaction.category?.color
                        }}
                      >
                        {transaction.category?.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{transaction.description}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{transaction.account?.name}</td>
                    <td className={`px-6 py-4 text-sm text-right font-medium ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(Number(transaction.amount))}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => deleteTransaction(transaction.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Счета */}
      {activeTab === 'accounts' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Управление счетами</h2>
            <button
              onClick={() => setShowAccountModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Добавить счет
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {accounts.map(account => (
              <div key={account.id} className="p-6 border rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg">{account.name}</h3>
                  <Trash2 className="w-5 h-5 text-gray-400 cursor-pointer hover:text-red-600" />
                </div>
                <div className="text-3xl font-bold mb-2">{formatCurrency(Number(account.balance))}</div>
                <div className="text-sm text-gray-500 capitalize">{account.type}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Категории */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CategoryList title="Доходы" type="income" categories={categories} onReload={loadCategories} />
          <CategoryList title="Расходы" type="expense" categories={categories} onReload={loadCategories} />
        </div>
      )}

      {/* Модальное окно транзакции */}
      {showTransactionModal && (
        <TransactionModal
          accounts={accounts}
          categories={categories}
          onClose={() => setShowTransactionModal(false)}
          onSave={() => {
            loadTransactions();
            loadAccounts();
            setShowTransactionModal(false);
          }}
        />
      )}
    </div>
  );
};

const StatCard: React.FC<{
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  growth?: number;
}> = ({ title, value, icon, color, growth }) => (
  <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 border-${color}-500`}>
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm text-gray-600">{title}</span>
      {icon}
    </div>
    <div className="text-2xl font-bold text-gray-900">{value}</div>
    {growth !== undefined && (
      <div className={`text-sm mt-2 ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
        {growth >= 0 ? '↑' : '↓'} {Math.abs(growth).toFixed(1)}%
      </div>
    )}
  </div>
);

const CategoryChart: React.FC<{
  title: string;
  categories: Category[];
  transactions: Transaction[];
}> = ({ title, categories, transactions }) => {
  const categoryTotals = categories.map(cat => {
    const total = transactions
      .filter(t => t.category_id === cat.id)
      .reduce((sum, t) => sum + Number(t.amount), 0);
    return { ...cat, total };
  }).filter(c => c.total > 0);

  const maxTotal = Math.max(...categoryTotals.map(c => c.total));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      <div className="space-y-3">
        {categoryTotals.map(cat => (
          <div key={cat.id}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-700">{cat.name}</span>
              <span className="text-sm font-medium">{new Intl.NumberFormat('ru-RU').format(cat.total)} ₽</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${(cat.total / maxTotal) * 100}%`,
                  backgroundColor: cat.color
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CategoryList: React.FC<{
  title: string;
  type: 'income' | 'expense';
  categories: Category[];
  onReload: () => void;
}> = ({ title, type, categories, onReload }) => {
  const filtered = categories.filter(c => c.type === type);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="space-y-2">
        {filtered.map(cat => (
          <div key={cat.id} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center space-x-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: cat.color }}
              />
              <span className="font-medium">{cat.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TransactionModal: React.FC<{
  accounts: Account[];
  categories: Category[];
  onClose: () => void;
  onSave: () => void;
}> = ({ accounts, categories, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    account_id: accounts[0]?.id || '',
    category_id: '',
    amount: 0,
    description: '',
    transaction_date: new Date().toISOString().split('T')[0]
  });

  const filteredCategories = categories.filter(c => c.type === formData.type);

  const handleSubmit = async () => {
    await supabase.from('finance_transactions').insert([formData]);
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-lg p-6 max-w-md w-full"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Новая транзакция</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Тип</label>
            <div className="flex space-x-2">
              <button
                onClick={() => setFormData({ ...formData, type: 'income', category_id: '' })}
                className={`flex-1 py-2 px-4 rounded-lg border ${
                  formData.type === 'income'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700'
                }`}
              >
                Доход
              </button>
              <button
                onClick={() => setFormData({ ...formData, type: 'expense', category_id: '' })}
                className={`flex-1 py-2 px-4 rounded-lg border ${
                  formData.type === 'expense'
                    ? 'bg-red-600 text-white'
                    : 'bg-white text-gray-700'
                }`}
              >
                Расход
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Счет</label>
            <select
              value={formData.account_id}
              onChange={(e) => setFormData({ ...formData, account_id: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>{acc.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Категория</label>
            <select
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">Выберите категорию</option>
              {filteredCategories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Сумма</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Описание</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Дата</label>
            <input
              type="date"
              value={formData.transaction_date}
              onChange={(e) => setFormData({ ...formData, transaction_date: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
          >
            Сохранить транзакцию
          </button>
        </div>
      </motion.div>
    </div>
  );
};
