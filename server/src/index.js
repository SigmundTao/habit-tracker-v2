const { initDb } = require('./database');
let nextId = 1;

const express = require('express');
const path = require('path');

const app = express();
const port = 5000;

let db;

async function main() {
  db = await initDb();
  console.log('SQLite ready');

  app.listen(port, () => {
    console.log(`listening on http://localhost:${port}`);
  });
}

main();

const publicDir = path.join(__dirname, '..', 'public');

app.use(express.static(publicDir));
app.use(express.json())

app.get('/', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.get('/health', (req,res) => {
  res.json({ ok: true, time: new Date().toISOString() });
})

//get habits
app.get('/api/habits', async (req, res) => {
  try {
    const rows = await db.all(
      'SELECT id, name, created_at FROM habits ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error'})
  }
});

//create habit
app.post("/api/habits", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return res.status(400).json({ error: "Name is required" });
    }

    const trimmed = name.trim();

    const result = await db.run(
      "INSERT INTO habits (name) VALUES (?)",
      [trimmed]
    );

    const habit = await db.get(
      "SELECT id, name, created_at FROM habits WHERE id = ?",
      [result.lastID]
    );

    res.status(201).json(habit);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Delete habit
app.delete('/api/habits/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'Invalid id' });
    }

    // fetch it first so we can return the deleted record
    const habit = await db.get(
      "SELECT id, name, created_at FROM habits WHERE id = ?",
      [id]
    );

    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    await db.run("DELETE FROM habits WHERE id = ?", [id]);

    res.json(habit);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});
