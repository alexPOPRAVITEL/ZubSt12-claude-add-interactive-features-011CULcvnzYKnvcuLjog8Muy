# Как протестировать PWA локально

## Способ 1: Chrome DevTools (рекомендуется)

1. Запустите dev сервер: `npm run dev`
2. Откройте Chrome: http://localhost:5173
3. Откройте DevTools (F12) → вкладка "Application"
4. Слева выберите "Manifest" - проверьте что манифест загружен
5. Слева выберите "Service Workers" - проверьте регистрацию
6. В разделе "Service Workers" нажмите "Update" и "Unregister" если нужно

## Способ 2: Lighthouse проверка

1. В Chrome DevTools → вкладка "Lighthouse"
2. Выберите "Progressive Web App"
3. Нажмите "Analyze page load"
4. Получите отчёт с оценкой PWA

## Способ 3: Тест установки на телефоне

### Android:
1. Соберите проект: `npm run build`
2. Залейте на хостинг с HTTPS (Netlify/Vercel)
3. Откройте сайт в Chrome на телефоне
4. Chrome покажет баннер "Установить приложение"
5. Или меню → "Добавить на главный экран"

### iOS:
1. Откройте сайт в Safari
2. Нажмите кнопку "Поделиться" (квадрат со стрелкой)
3. Прокрутите вниз → "На экран «Домой»"
4. Нажмите "Добавить"

## Способ 4: ngrok для HTTPS локально

```bash
# Установите ngrok
npm install -g ngrok

# Запустите dev сервер
npm run dev

# В другом терминале запустите ngrok
ngrok http 5173

# Используйте HTTPS URL для тестирования на телефоне
```
