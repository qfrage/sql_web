const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sql_web'
});
connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database!');
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/login_page/index.html');
});
app.get('/script.js', (req, res) => {
    res.sendFile(__dirname + '/login_page/script.js');
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Обработка логина и пароля здесь
    console.log("Login data:"+username+","+password);
  });

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
