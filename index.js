require('dotenv').config();
const express = require('express');
const { initDb } = require('./db');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.set('json spaces', 2);

  



// Импортируем наш новый роутер
const drinksRouter = require('./routes/drinks');

// Говорим приложению: "Все запросы, которые начинаются на /api/drinks, отправляй в drinksRouter"
app.use('/api/drinks', drinksRouter);

// Обработка несуществующих маршрутов (404)
app.use((req, res) => {
    res.status(404).json({ error: "Маршрут не найден" });
});

// Глобальный обработчик ошибок. У middleware с 4 аргументами (err первый)
// Express понимает: это ловушка для всего, что пришло через next(err).
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
});

// Сначала готовим БД (создаём таблицу + сидим данные), и только потом
// поднимаем сервер. Если база недоступна — падаем с понятной ошибкой.
initDb()
    .then(() => {
        app.listen(port, () => {
            console.log(`Сервер запустился и слушает порт ${port}`)
        });
    })
    .catch((err) => {
        console.error("Не удалось инициализировать базу данных:", err);
        process.exit(1);
    });