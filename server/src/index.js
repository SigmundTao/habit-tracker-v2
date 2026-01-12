const express = require('express');
const path = require('path');

const app = express();
const port = 5000;

const publicDir = path.join(__dirname, '..', 'public');
console.log('Serving static from:', publicDir);

app.use(express.static(publicDir));

app.get('/', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.listen(port, () => {
  console.log(`listening on http://localhost:${port}`);
});