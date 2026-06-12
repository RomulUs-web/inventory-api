const express = require('express');
const nodemon = require('nodemon');
const app = express();
const port = 3000; 

app.use(express.json());
app.set('json spaces', 2);

  



// Импортируем наш новый роутер
const drinksRouter = require('./routes/drinks');

// Говорим приложению: "Все запросы, которые начинаются на /api/drinks, отправляй в drinksRouter"
app.use('/api/drinks', drinksRouter);

app.listen(port, () => {
    console.log(`Сервер запустился и слушает порт ${port}`)
});