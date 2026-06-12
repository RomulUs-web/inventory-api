const express = require('express');
const router = express.Router(); // Создаем изолированный роутер
const fs = require('fs'); // Нам всё еще нужен модуль fs для работы с файлом

// Перенеси сюда чтение файла
let drinks = JSON.parse(fs.readFileSync('database.json', 'utf8'));

// 1. Переносим маршрут получения всех напитков
// ВАЖНО: Вместо app.get пишем router.get
// И обрати внимание, что путь стал просто '/', потому что префикс '/api/drinks' мы настроим в главном файле
router.get('/', (req, res) => {
  res.json(drinks);
});

router.get('/:id', (req, res) => {
 const drinkId = Number(req.params.id)
 const foundDrink = drinks.find(drink => drink.id === drinkId);       

 if (foundDrink) {
    res.json(foundDrink);
 } 
 else{
    res.status(404).json({error: "Напиток не найден"});
    };
 });

router.post('/', (req, res) =>{

  const { name, stock } = req.body;

    // Если имени нет, или оно пустое, или stock вообще не число
    if (!name || typeof stock !== 'number' || stock < 0) {
        // Сразу прерываем работу и отдаем ошибку 400 (Bad Request - плохой запрос)
        return res.status(400).json({ error: "Некорректные данные. Укажите name (строка) и stock (положительное число)" });
    }
    const newId = drinks.length + 1;
    const newDrink = {
        id: newId,
        name: req.body.name,
        stock: req.body.stock
    };
    drinks.push(newDrink) 
    fs.writeFileSync('database.json', JSON.stringify(drinks, null, 2));
    res.json(newDrink)
});

router.delete('/:id', (req, res) =>{
    const drinkId = Number(req.params.id);
    const index = drinks.findIndex(drink => drink.id === drinkId)
    if (index != -1){
        drinks.splice(index, 1);
        fs.writeFileSync('database.json', JSON.stringify(drinks, null, 2));
    res.status(202).json({succes:"Удаление успешно"})
    }else{
        res.status(404).json({error: "Напиток не найден"});
    }
});

router.put('/:id', (req, res) =>{

      const { name, stock } = req.body;

    // Если имени нет, или оно пустое, или stock вообще не число
    if (!name || typeof stock !== 'number' || stock < 0) {
        // Сразу прерываем работу и отдаем ошибку 400 (Bad Request - плохой запрос)
        return res.status(400).json({ error: "Некорректные данные. Укажите name (строка) и stock (положительное число)" });
    }
    const drinkId = Number(req.params.id);
    const index = drinks.findIndex(drink => drink.id === drinkId);
    if (index != -1){
        drinks[index].stock = req.body.stock;
        fs.writeFileSync('database.json', JSON.stringify(drinks, null, 2));
        res.json(drinks[index])
    }else{
        res.status(404).json({error: "Напиток не найден"});
    }
})

// Экспортируем роутер, чтобы главный файл мог его увидеть
module.exports = router;