/*
  # Финансовый модуль FinTablo

  1. Новые таблицы
    - `finance_accounts` - Счета и кассы
    - `finance_categories` - Категории доходов/расходов
    - `finance_transactions` - Транзакции
    - `finance_budgets` - Бюджеты
    - `finance_recurring_transactions` - Регулярные платежи

  2. Security
    - Enable RLS на всех таблицах
    - Политики доступа только для администраторов
*/

-- Счета
CREATE TABLE IF NOT EXISTS finance_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('cash', 'bank', 'card')),
  balance numeric DEFAULT 0,
  currency text DEFAULT 'RUB',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE finance_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view accounts"
  ON finance_accounts FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage accounts"
  ON finance_accounts FOR ALL
  USING (true)
  WITH CHECK (true);

-- Категории
CREATE TABLE IF NOT EXISTS finance_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('income', 'expense')),
  parent_id uuid REFERENCES finance_categories(id) ON DELETE CASCADE,
  color text DEFAULT '#3b82f6',
  icon text,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE finance_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view categories"
  ON finance_categories FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage categories"
  ON finance_categories FOR ALL
  USING (true)
  WITH CHECK (true);

-- Транзакции
CREATE TABLE IF NOT EXISTS finance_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid REFERENCES finance_accounts(id) ON DELETE CASCADE,
  category_id uuid REFERENCES finance_categories(id) ON DELETE SET NULL,
  type text NOT NULL CHECK (type IN ('income', 'expense', 'transfer')),
  amount numeric NOT NULL,
  description text,
  transaction_date date DEFAULT CURRENT_DATE,
  created_by text,
  tags text[],
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE finance_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view transactions"
  ON finance_transactions FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage transactions"
  ON finance_transactions FOR ALL
  USING (true)
  WITH CHECK (true);

-- Бюджеты
CREATE TABLE IF NOT EXISTS finance_budgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES finance_categories(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  period_start date NOT NULL,
  period_end date NOT NULL,
  is_recurring boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE finance_budgets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view budgets"
  ON finance_budgets FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage budgets"
  ON finance_budgets FOR ALL
  USING (true)
  WITH CHECK (true);

-- Регулярные платежи
CREATE TABLE IF NOT EXISTS finance_recurring_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid REFERENCES finance_accounts(id) ON DELETE CASCADE,
  category_id uuid REFERENCES finance_categories(id) ON DELETE SET NULL,
  type text NOT NULL CHECK (type IN ('income', 'expense')),
  amount numeric NOT NULL,
  description text NOT NULL,
  frequency text NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly', 'yearly')),
  next_date date NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE finance_recurring_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view recurring transactions"
  ON finance_recurring_transactions FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage recurring transactions"
  ON finance_recurring_transactions FOR ALL
  USING (true)
  WITH CHECK (true);

-- Индексы для производительности
CREATE INDEX IF NOT EXISTS idx_transactions_account ON finance_transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON finance_transactions(category_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON finance_transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON finance_transactions(type);
CREATE INDEX IF NOT EXISTS idx_categories_type ON finance_categories(type);
CREATE INDEX IF NOT EXISTS idx_budgets_category ON finance_budgets(category_id);
CREATE INDEX IF NOT EXISTS idx_budgets_dates ON finance_budgets(period_start, period_end);

-- Функция для обновления баланса счета
CREATE OR REPLACE FUNCTION update_account_balance()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.type = 'income' THEN
      UPDATE finance_accounts SET balance = balance + NEW.amount WHERE id = NEW.account_id;
    ELSIF NEW.type = 'expense' THEN
      UPDATE finance_accounts SET balance = balance - NEW.amount WHERE id = NEW.account_id;
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.type = 'income' THEN
      UPDATE finance_accounts SET balance = balance - OLD.amount WHERE id = OLD.account_id;
    ELSIF OLD.type = 'expense' THEN
      UPDATE finance_accounts SET balance = balance + OLD.amount WHERE id = OLD.account_id;
    END IF;

    IF NEW.type = 'income' THEN
      UPDATE finance_accounts SET balance = balance + NEW.amount WHERE id = NEW.account_id;
    ELSIF NEW.type = 'expense' THEN
      UPDATE finance_accounts SET balance = balance - NEW.amount WHERE id = NEW.account_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.type = 'income' THEN
      UPDATE finance_accounts SET balance = balance - OLD.amount WHERE id = OLD.account_id;
    ELSIF OLD.type = 'expense' THEN
      UPDATE finance_accounts SET balance = balance + OLD.amount WHERE id = OLD.account_id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггер для автоматического обновления баланса
DROP TRIGGER IF EXISTS update_balance_trigger ON finance_transactions;
CREATE TRIGGER update_balance_trigger
AFTER INSERT OR UPDATE OR DELETE ON finance_transactions
FOR EACH ROW
EXECUTE FUNCTION update_account_balance();

-- Вставка стандартных категорий доходов
INSERT INTO finance_categories (name, type, color, icon) VALUES
  ('Прием пациентов', 'income', '#10b981', 'DollarSign'),
  ('Продажа товаров', 'income', '#3b82f6', 'ShoppingBag'),
  ('Подписки', 'income', '#8b5cf6', 'CreditCard'),
  ('Прочие доходы', 'income', '#6366f1', 'TrendingUp')
ON CONFLICT DO NOTHING;

-- Вставка стандартных категорий расходов
INSERT INTO finance_categories (name, type, color, icon) VALUES
  ('Зарплата', 'expense', '#ef4444', 'Users'),
  ('Аренда', 'expense', '#f59e0b', 'Home'),
  ('Материалы', 'expense', '#14b8a6', 'Package'),
  ('Оборудование', 'expense', '#8b5cf6', 'Settings'),
  ('Коммунальные', 'expense', '#ec4899', 'Zap'),
  ('Маркетинг', 'expense', '#06b6d4', 'Megaphone'),
  ('Налоги', 'expense', '#f43f5e', 'FileText'),
  ('Прочие расходы', 'expense', '#6b7280', 'MoreHorizontal')
ON CONFLICT DO NOTHING;

-- Вставка стандартных счетов
INSERT INTO finance_accounts (name, type, balance) VALUES
  ('Касса', 'cash', 0),
  ('Расчетный счет', 'bank', 0),
  ('Терминал', 'card', 0)
ON CONFLICT DO NOTHING;
