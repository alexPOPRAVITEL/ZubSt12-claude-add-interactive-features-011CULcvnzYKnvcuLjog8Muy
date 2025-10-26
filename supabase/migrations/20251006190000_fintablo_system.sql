/*
  # Финансовое Табло - Система учета

  ## Новые таблицы

  ### 1. financial_accounts (Счета)
  Хранит информацию о банковских счетах и кассах клиники

  ### 2. financial_transactions (Транзакции)
  Все финансовые операции: доходы, расходы, переводы

  ### 3. financial_categories (Категории)
  Категории доходов и расходов для классификации

  ### 4. financial_budgets (Бюджеты)
  Планирование бюджетов по категориям

  ### 5. financial_reports (Отчеты)
  Сохраненные финансовые отчеты

  ## Безопасность
  - RLS включен для всех таблиц
  - Доступ только для authenticated пользователей
*/

-- Таблица счетов
CREATE TABLE IF NOT EXISTS financial_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('bank', 'cash', 'card', 'other')),
  currency TEXT DEFAULT 'RUB',
  balance DECIMAL(15, 2) DEFAULT 0,
  bank_name TEXT,
  account_number TEXT,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Таблица транзакций
CREATE TABLE IF NOT EXISTS financial_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES financial_accounts(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense', 'transfer')),
  category TEXT NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  description TEXT,
  counterparty TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_method TEXT,
  invoice_number TEXT,
  tags TEXT[],
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Таблица категорий
CREATE TABLE IF NOT EXISTS financial_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  parent_id UUID REFERENCES financial_categories(id),
  icon TEXT,
  color TEXT,
  is_system BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Таблица бюджетов
CREATE TABLE IF NOT EXISTS financial_budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES financial_categories(id),
  period_type TEXT CHECK (period_type IN ('month', 'quarter', 'year')),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  planned_amount DECIMAL(15, 2) NOT NULL,
  actual_amount DECIMAL(15, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Таблица отчетов
CREATE TABLE IF NOT EXISTS financial_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_type TEXT CHECK (report_type IN ('p_and_l', 'cash_flow', 'balance_sheet', 'custom')),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  data JSONB DEFAULT '{}',
  generated_at TIMESTAMPTZ DEFAULT now()
);

-- Индексы для производительности
CREATE INDEX IF NOT EXISTS idx_financial_accounts_clinic ON financial_accounts(clinic_id);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_account ON financial_transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_date ON financial_transactions(date DESC);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_type ON financial_transactions(type);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_category ON financial_transactions(category);
CREATE INDEX IF NOT EXISTS idx_financial_categories_type ON financial_categories(type);
CREATE INDEX IF NOT EXISTS idx_financial_budgets_period ON financial_budgets(period_start, period_end);

-- Включаем Row Level Security
ALTER TABLE financial_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_reports ENABLE ROW LEVEL SECURITY;

-- Политики доступа
CREATE POLICY "Allow authenticated users to view accounts"
  ON financial_accounts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to manage accounts"
  ON financial_accounts FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to view transactions"
  ON financial_transactions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to create transactions"
  ON financial_transactions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to view categories"
  ON financial_categories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to manage categories"
  ON financial_categories FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to view budgets"
  ON financial_budgets FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to manage budgets"
  ON financial_budgets FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to view reports"
  ON financial_reports FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to generate reports"
  ON financial_reports FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Функция обновления баланса счета при добавлении транзакции
CREATE OR REPLACE FUNCTION update_account_balance()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.type = 'income' THEN
    UPDATE financial_accounts
    SET balance = balance + NEW.amount,
        updated_at = now()
    WHERE id = NEW.account_id;
  ELSIF NEW.type = 'expense' THEN
    UPDATE financial_accounts
    SET balance = balance - NEW.amount,
        updated_at = now()
    WHERE id = NEW.account_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггер для автоматического обновления баланса
CREATE TRIGGER trigger_update_account_balance
  AFTER INSERT ON financial_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_account_balance();

-- Вставка системных категорий доходов
INSERT INTO financial_categories (name, type, icon, color, is_system) VALUES
  ('Оплата за услуги', 'income', '💰', '#10b981', true),
  ('Розничные продажи', 'income', '🛍️', '#3b82f6', true),
  ('Предоплата', 'income', '💵', '#8b5cf6', true),
  ('Консультации', 'income', '👨‍⚕️', '#06b6d4', true)
ON CONFLICT DO NOTHING;

-- Вставка системных категорий расходов
INSERT INTO financial_categories (name, type, icon, color, is_system) VALUES
  ('Зарплата сотрудников', 'expense', '👥', '#ef4444', true),
  ('Аренда помещения', 'expense', '🏢', '#f59e0b', true),
  ('Коммунальные услуги', 'expense', '⚡', '#06b6d4', true),
  ('Маркетинг и реклама', 'expense', '📢', '#ec4899', true),
  ('Закупка материалов', 'expense', '📦', '#6366f1', true),
  ('Налоги и сборы', 'expense', '📊', '#14b8a6', true),
  ('Обслуживание оборудования', 'expense', '🔧', '#8b5cf6', true),
  ('Прочие расходы', 'expense', '📝', '#64748b', true)
ON CONFLICT DO NOTHING;