import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  Calendar,
  Plus,
  Download,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  bank_name?: string;
  currency: string;
}

interface Transaction {
  id: string;
  type: string;
  category: string;
  amount: number;
  description?: string;
  counterparty?: string;
  date: string;
}

interface MetricData {
  totalBalance: number;
  netProfit: number;
  profitability: number;
  monthlyRevenue: number;
  balanceChange: number;
  profitChange: number;
}

export const FinTablo: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [metrics, setMetrics] = useState<MetricData>({
    totalBalance: 0,
    netProfit: 0,
    profitability: 0,
    monthlyRevenue: 0,
    balanceChange: 0,
    profitChange: 0
  });
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState<'income' | 'expenses' | 'balance'>('income');

  useEffect(() => {
    loadFinancialData();
  }, []);

  const loadFinancialData = async () => {
    setLoading(true);
    try {
      // Загрузка счетов
      const { data: accountsData } = await supabase
        .from('financial_accounts')
        .select('*')
        .eq('is_active', true);

      if (accountsData) {
        setAccounts(accountsData);
        const totalBalance = accountsData.reduce((sum, acc) => sum + Number(acc.balance), 0);
        setMetrics(prev => ({ ...prev, totalBalance }));
      }

      // Загрузка транзакций за последние 30 дней
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: transactionsData } = await supabase
        .from('financial_transactions')
        .select('*')
        .gte('date', thirtyDaysAgo.toISOString().split('T')[0])
        .order('date', { ascending: false })
        .limit(50);

      if (transactionsData) {
        setTransactions(transactionsData);
        calculateMetrics(transactionsData);
      }

    } catch (error) {
      console.error('Error loading financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = (trans: Transaction[]) => {
    const income = trans
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expenses = trans
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const netProfit = income - expenses;
    const profitability = income > 0 ? (netProfit / income) * 100 : 0;

    setMetrics(prev => ({
      ...prev,
      netProfit,
      profitability,
      monthlyRevenue: income,
      profitChange: Math.random() * 20 - 10, // Mock data
      balanceChange: Math.random() * 15
    }));
  };

  const syncBanks = async () => {
    setSyncing(true);
    // Имитация синхронизации
    await new Promise(resolve => setTimeout(resolve, 2000));
    await loadFinancialData();
    setSyncing(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getTransactionsByTab = () => {
    switch (activeTab) {
      case 'income':
        return transactions.filter(t => t.type === 'income');
      case 'expenses':
        return transactions.filter(t => t.type === 'expense');
      case 'balance':
        return accounts.map(acc => ({
          id: acc.id,
          type: 'balance',
          category: acc.name,
          amount: acc.balance,
          description: acc.bank_name || 'Счет',
          date: new Date().toISOString()
        }));
      default:
        return [];
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка финансовых данных...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                Ф
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">ФинТабло</h1>
                <p className="text-sm text-gray-500">Управленческий учет клиники</p>
              </div>
            </div>
            <button
              onClick={syncBanks}
              disabled={syncing}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Синхронизация...' : 'Синхронизировать'}
            </button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Total Balance */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="text-sm text-gray-500 uppercase">Денег на счетах</div>
              <DollarSign className="w-5 h-5 text-teal-500" />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-2">
              {formatCurrency(metrics.totalBalance)}
            </div>
            <div className={`flex items-center gap-1 text-sm ${metrics.balanceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {metrics.balanceChange >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              <span>{Math.abs(metrics.balanceChange).toFixed(1)}% за месяц</span>
            </div>
          </div>

          {/* Net Profit */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="text-sm text-gray-500 uppercase">Чистая прибыль</div>
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-2">
              {formatCurrency(metrics.netProfit)}
            </div>
            <div className={`flex items-center gap-1 text-sm ${metrics.profitChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {metrics.profitChange >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              <span>{Math.abs(metrics.profitChange).toFixed(1)}% к плану</span>
            </div>
          </div>

          {/* Profitability */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="text-sm text-gray-500 uppercase">Рентабельность</div>
              <TrendingUp className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-2">
              {metrics.profitability.toFixed(1)}%
            </div>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <ArrowUpRight className="w-4 h-4" />
              <span>Хороший показатель</span>
            </div>
          </div>

          {/* Monthly Revenue */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="text-sm text-gray-500 uppercase">Выручка за месяц</div>
              <CreditCard className="w-5 h-5 text-orange-500" />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-2">
              {formatCurrency(metrics.monthlyRevenue)}
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>30 дней</span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Transactions Panel */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Движение средств</h2>
              <button className="text-teal-500 hover:text-teal-600 text-sm font-medium">
                Показать все
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-4 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('income')}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === 'income'
                    ? 'text-teal-500 border-b-2 border-teal-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Доходы
              </button>
              <button
                onClick={() => setActiveTab('expenses')}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === 'expenses'
                    ? 'text-teal-500 border-b-2 border-teal-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Расходы
              </button>
              <button
                onClick={() => setActiveTab('balance')}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === 'balance'
                    ? 'text-teal-500 border-b-2 border-teal-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Остатки
              </button>
            </div>

            {/* Transactions List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {getTransactionsByTab().slice(0, 10).map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">
                      {transaction.category || transaction.description}
                    </div>
                    <div className="text-sm text-gray-500">
                      {transaction.counterparty || transaction.description}
                    </div>
                  </div>
                  <div
                    className={`font-bold ${
                      transaction.type === 'income' || activeTab === 'balance'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {transaction.type === 'expense' ? '-' : ''}
                    {formatCurrency(transaction.amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Accounts Panel */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Счета</h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors text-sm">
                <Plus className="w-4 h-4" />
                Добавить счет
              </button>
            </div>

            <div className="space-y-3">
              {accounts.map((account) => (
                <div
                  key={account.id}
                  className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-600 rounded-lg flex items-center justify-center text-white">
                        {account.type === 'bank' ? '🏦' : account.type === 'cash' ? '💵' : '💳'}
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">{account.name}</div>
                        <div className="text-sm text-gray-500">{account.bank_name || account.type}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-800">
                        {formatCurrency(account.balance)}
                      </div>
                      <div className="text-xs text-gray-500">{account.currency}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mt-6">
          <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all">
            <Plus className="w-5 h-5" />
            Добавить операцию
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-lg border border-gray-300 hover:shadow-md transition-all">
            <Download className="w-5 h-5" />
            Сформировать отчет
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinTablo;