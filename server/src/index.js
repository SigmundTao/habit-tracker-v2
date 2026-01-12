let habits = [];
let nextId = 1;

const express = require('express');
const path = require('path');

const app = express();
const port = 5000;

const publicDir = path.join(__dirname, '..', 'public');

app.use(express.static(publicDir));
app.use(express.json())

app.get('/', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.get('/health', (req,res) => {
  res.json({ ok: true, time: new Date().toISOString() });
})

//Send back habits array
app.get('/api/habits', (req, res) => {
  res.json(habits);
});

app.post('/api/habits', (req, res) => {
  const { name } = req.body;

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Name is required' });
  }

  const habit = {
    id: nextId++,
    name: name.trim(),
    createdAt: new Date().toISOString()
  };

  habits.push(habit);
  res.status(201).json(habit);
});

app.listen(port, () => {
  console.log(`listening on http://localhost:${port}`);
});