const express = require('express');
const mysql = require('mysql');

const app = express();

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

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
