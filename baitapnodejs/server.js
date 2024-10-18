const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Đọc file user.txt
const readUsers = () => {
  const data = fs.readFileSync('user.txt', 'utf8');
  return data.split('\n').map(line => {
    const [username, password] = line.split(':');
    return { username, password };
  });
};

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();

  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    res.send(`
      <h1>Welcome, ${username}!</h1>
      <p>Login successful.</p>
    `);
  } else {
    res.status(401).send('Invalid username or password');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});