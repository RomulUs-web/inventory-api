const express = require('express');
const router = express.Router(); // Создаем изолированный роутер
const { pool } = require('../db'); // Пул подключений к Postgres

// Получить все напитки
router.get('/', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM drinks ORDER BY id');
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// Получить один напиток по id
router.get('/:id', async (req, res, next) => {
  try {
    const drinkId = Number(req.params.id);
    // $1 — параметр запроса. Драйвер сам подставит значение безопасно,
    // что защищает от SQL-инъекций (нельзя «дописать» вредоносный SQL).
    const { rows } = await pool.query('SELECT * FROM drinks WHERE id = $1', [drinkId]);

    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ error: "Напиток не найден" });
    }
  } catch (err) {
    next(err);
  }
});

// Создать напиток
router.post('/', async (req, res, next) => {
  const { name, stock } = req.body;

  // Если имени нет, или оно пустое, или stock вообще не число
  if (!name || typeof stock !== 'number' || stock < 0) {
    return res.status(400).json({ error: "Некорректные данные. Укажите name (строка) и stock (положительное число)" });
  }

  try {
    // RETURNING * возвращает только что вставленную строку (с присвоенным id)
    const { rows } = await pool.query(
      'INSERT INTO drinks (name, stock) VALUES ($1, $2) RETURNING *',
      [name, stock]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// Удалить напиток
router.delete('/:id', async (req, res, next) => {
  try {
    const drinkId = Number(req.params.id);
    const result = await pool.query('DELETE FROM drinks WHERE id = $1', [drinkId]);

    // rowCount — сколько строк затронул запрос. 0 значит такого id не было.
    if (result.rowCount > 0) {
      res.status(202).json({ success: "Удаление успешно" });
    } else {
      res.status(404).json({ error: "Напиток не найден" });
    }
  } catch (err) {
    next(err);
  }
});

// Обновить напиток
router.put('/:id', async (req, res, next) => {
  const { name, stock } = req.body;

  // Если имени нет, или оно пустое, или stock вообще не число
  if (!name || typeof stock !== 'number' || stock < 0) {
    return res.status(400).json({ error: "Некорректные данные. Укажите name (строка) и stock (положительное число)" });
  }

  try {
    const drinkId = Number(req.params.id);
    const { rows } = await pool.query(
      'UPDATE drinks SET name = $1, stock = $2 WHERE id = $3 RETURNING *',
      [name, stock, drinkId]
    );

    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ error: "Напиток не найден" });
    }
  } catch (err) {
    next(err);
  }
});

// Экспортируем роутер, чтобы главный файл мог его увидеть
module.exports = router;
