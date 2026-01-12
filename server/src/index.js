let habits = [
  { id: 1, name: 'Climb' },
  { id: 2, name: 'Code' }
];

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

//create habit
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

// Delete habit
app.delete('/api/habits/:id', (req, res) => {
  const id = Number(req.params.id)

  if (Number.isNaN(id)){
    return res.status(400).json({erro: 'Invalid id'});
  }

  const index = habits.findIndex(habit => habit.id === id);

  const deleted = habits.splice(index, 1)[0];

  res.json(deleted);
})

app.listen(port, () => {
  console.log(`listening on http://localhost:${port}`);
});