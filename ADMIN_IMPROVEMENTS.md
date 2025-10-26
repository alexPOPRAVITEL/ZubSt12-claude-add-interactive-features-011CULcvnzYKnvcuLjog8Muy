# Улучшения административной панели

## Обзор изменений

Административная панель была значительно улучшена с добавлением современных функций управления и мониторинга.

## Новые возможности

### 1. Ролевая система аутентификации ✅

- **Таблица `admin_users`**: Управление администраторами с различными ролями
  - `super_admin`: Полный доступ ко всем функциям
  - `admin`: Доступ к большинству функций (кроме управления администраторами)
  - `editor`: Создание и редактирование контента
  - `viewer`: Только просмотр

- **Hook `useAdminAuth`**: Централизованное управление аутентификацией
  - Проверка прав доступа
  - Автоматическое логирование входов/выходов
  - Обновление времени последнего входа

### 2. Система уведомлений в реальном времени ✅

- **Компонент `NotificationCenter`**:
  - Отображение уведомлений в реальном времени
  - Индикатор непрочитанных уведомлений
  - Типы уведомлений: новые заказы, отзывы, записи, системные
  - Подписка на изменения через Supabase Realtime

- **Hook `useAdminNotifications`**:
  - Автоматическая загрузка уведомлений
  - Отметка как прочитанное
  - Удаление уведомлений

### 3. Журнал активности ✅

- **Компонент `ActivityLogViewer`**:
  - Полная история действий администраторов
  - Фильтрация по действиям и типам ресурсов
  - Поиск по администраторам и ресурсам
  - Экспорт в CSV
  - Отображение деталей каждого действия

- **Автоматическое логирование**:
  - Все действия CRUD
  - Входы и выходы
  - IP-адреса и User Agent

### 4. Массовые операции ✅

- **Компонент `BulkActions`**:
  - Выбор нескольких элементов одновременно
  - Массовая активация/деактивация
  - Массовое удаление
  - Экспорт выбранных элементов
  - Архивирование
  - Настраиваемые действия

### 5. Расширенная фильтрация ✅

- **Компонент `AdvancedFilters`**:
  - Текстовые фильтры
  - Выпадающие списки
  - Диапазоны дат
  - Множественный выбор
  - Сохранение состояния фильтров
  - Быстрая очистка всех фильтров

### 6. Экспорт данных ✅

- **Утилита `exportData.ts`**:
  - Экспорт в CSV с поддержкой UTF-8
  - Экспорт в JSON
  - Форматирование данных для экспорта
  - Автоматическая генерация имен файлов

### 7. Настраиваемые виджеты дашборда ✅

- **Компонент `DashboardWidgets`**:
  - Добавление/удаление виджетов
  - Изменение видимости виджетов
  - Перетаскивание для изменения порядка
  - Сохранение настроек для каждого пользователя
  - Встроенные виджеты:
    - Быстрая статистика
    - Последние отзывы
    - Сводка заказов
    - Предстоящие записи
    - Популярные услуги

### 8. Адаптивный дизайн ✅

- Мобильное меню с анимацией
- Адаптивные таблицы
- Touch-friendly элементы управления
- Оптимизация для планшетов
- Sticky header для удобной навигации

## Структура базы данных

### Новые таблицы:

```sql
admin_users
├── id (uuid)
├── email (text, unique)
├── full_name (text)
├── role (text: super_admin|admin|editor|viewer)
├── permissions (jsonb)
├── is_active (boolean)
├── last_login (timestamptz)
├── created_at (timestamptz)
└── updated_at (timestamptz)

admin_activity_logs
├── id (uuid)
├── admin_user_id (uuid, FK)
├── action (text)
├── resource_type (text)
├── resource_id (uuid)
├── details (jsonb)
├── ip_address (text)
├── user_agent (text)
└── created_at (timestamptz)

admin_notifications
├── id (uuid)
├── admin_user_id (uuid, FK)
├── type (text)
├── title (text)
├── message (text)
├── data (jsonb)
├── is_read (boolean)
└── created_at (timestamptz)

dashboard_widgets
├── id (uuid)
├── admin_user_id (uuid, FK)
├── widget_type (text)
├── position (int)
├── settings (jsonb)
├── is_visible (boolean)
└── created_at (timestamptz)
```

## Безопасность

### Row Level Security (RLS)

Все таблицы защищены политиками RLS:

- **admin_users**: Только super_admin может управлять пользователями
- **admin_activity_logs**: Все администраторы могут просматривать, система может записывать
- **admin_notifications**: Администраторы видят только свои уведомления
- **dashboard_widgets**: Каждый администратор управляет только своими виджетами

### Индексы для производительности

```sql
- idx_admin_activity_logs_admin_user
- idx_admin_activity_logs_created_at
- idx_admin_notifications_admin_user
- idx_admin_notifications_is_read
- idx_dashboard_widgets_admin_user
```

## Использование

### Вход в админ-панель

1. Перейдите на `/admin`
2. Введите пароль: `zubst2024admin`
3. После входа вы увидите обновленный дашборд

### Настройка виджетов

1. На дашборде нажмите кнопку "Настроить"
2. Выберите нужные виджеты из списка
3. Управляйте видимостью и порядком виджетов
4. Нажмите "Готово" для сохранения

### Просмотр журнала активности

1. В боковом меню выберите "Журнал активности"
2. Используйте фильтры для поиска нужных записей
3. Экспортируйте данные при необходимости

### Работа с уведомлениями

1. Иконка колокольчика в правом верхнем углу
2. Клик для открытия центра уведомлений
3. Отмечайте прочитанными или удаляйте

## Технический стек

- **React 18** с TypeScript
- **Supabase** для базы данных и real-time
- **Framer Motion** для анимаций
- **Tailwind CSS** для стилей
- **Lucide React** для иконок

## Hooks

### useAdminAuth
```typescript
const { adminUser, loading, login, logout, hasPermission, logActivity } = useAdminAuth();
```

### useAdminNotifications
```typescript
const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useAdminNotifications(adminUserId);
```

## Компоненты

### NotificationCenter
```typescript
<NotificationCenter adminUserId={adminUser.id} />
```

### BulkActions
```typescript
<BulkActions
  selectedCount={selected.length}
  onDelete={handleDelete}
  onActivate={handleActivate}
  onExport={handleExport}
/>
```

### AdvancedFilters
```typescript
<AdvancedFilters
  filters={filterOptions}
  onApplyFilters={handleApply}
  onClearFilters={handleClear}
/>
```

### DashboardWidgets
```typescript
<DashboardWidgets adminUserId={adminUser.id} stats={stats} />
```

## Будущие улучшения

- [ ] Двухфакторная аутентификация (2FA)
- [ ] Email уведомления
- [ ] Расширенная аналитика с графиками
- [ ] Автоматические отчеты
- [ ] Шаблоны для быстрых действий
- [ ] Интеграция с внешними сервисами
- [ ] Настраиваемые роли и права доступа
- [ ] История изменений с возможностью отката
- [ ] Комментарии к действиям
- [ ] Планировщик задач

## Миграция

Миграция базы данных выполняется автоматически при первом запуске:
- Файл: `supabase/migrations/admin_system_improvements.sql`
- Создается super_admin пользователь с email: `admin@zubnayastanciya.ru`

## Поддержка

При возникновении проблем:
1. Проверьте консоль браузера на ошибки
2. Убедитесь, что миграции применены
3. Проверьте настройки Supabase RLS
4. Очистите localStorage и попробуйте войти заново
