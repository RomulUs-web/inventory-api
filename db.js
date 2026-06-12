const { Pool } = require('pg');

// Пул соединений с Postgres. Пул переиспользует подключения между запросами,
// вместо того чтобы открывать новое на каждый запрос — это быстрее и надёжнее.
// Параметры (PGHOST, PGUSER, PGPASSWORD, PGDATABASE, PGPORT) драйвер pg
// автоматически берёт из переменных окружения.
const pool = new Pool();

// Создаёт таблицу drinks, если её ещё нет, и наполняет начальными данными.
// Вызывается один раз при старте приложения.
async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS drinks (
      id    SERIAL PRIMARY KEY,
      name  TEXT NOT NULL,
      stock INTEGER NOT NULL CHECK (stock >= 0)
    )
  `);

  // Если таблица пустая — добавляем стартовый набор напитков
  const { rows } = await pool.query('SELECT COUNT(*) FROM drinks');
  if (Number(rows[0].count) === 0) {
    await pool.query(`
      INSERT INTO drinks (name, stock) VALUES
        ('Gorilla', 5),
        ('Adrenaline Rush', 122),
        ('Tornado', 10),
        ('Monster', 15)
    `);
  }
}

module.exports = { pool, initDb };
