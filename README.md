# Лабораторные работы по дисциплине "Технологии разработки приложений для мобильных платформ"

## Выполненные работы

- Лабораторная работа 1
- Лабораторная работа 2

## Основные возможности

- Карта с маркерами отмеченных пользователями локаций
- Добавление маркеров на карте посредством долгого нажатия
- *(дополнительно)* Премещение маркеров по карте перетаскиванием
- Очистка карты от маркеров
- Просмотр, добавление и удаление изображений, привязанных к маркерам

Информация о маркерах и привязанных к ним изображений хранится в локальной базе данных SQLite.

## Установка и использование

1. Установка зависимостей

   ```bash
   npm install
   ```

2. Запуск Expo

   ```bash
   npx expo start
   ```

Таким образом приложение можно использовать с помощью нескольких вариантов:

- [Development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Эмулятор Android](https://docs.expo.dev/workflow/android-studio-emulator/)
- [Симулятор iOS](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), песочница для тестирования приложений, разработанных с использованием Expo

## Схема БД

База данных создаётся посредством следующего скрипта:

```sql
CREATE TABLE IF NOT EXISTS markers (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   latitude REAL NOT NULL,
   longitude REAL NOT NULL,
   created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS marker_images (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   marker_id INTEGER NOT NULL,
   uri TEXT NOT NULL,
   created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

   FOREIGN KEY (marker_id) REFERENCES markers (id) ON DELETE CASCADE
);
```