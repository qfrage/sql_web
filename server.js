const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();
const dbPath = './database.db';
var db = -1;

// Создание подключения
function connectToDB(){
    db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            console.error(err.message);
            return;
        }
        console.log('Подключено к базе данных');
    });
}
function closeDBConnection(){
    db.close((err) => {
        if (err) {
            console.error(err.message);
            return;
        }
        console.log('Соединение с базой данных закрыто');
    });
}


function getAllQuestions(){
    const query = 'SELECT * FROM questions';

    db.all(query, [], (err, rows) => {
      if (err) {
        console.error(err.message);
        return;
      }
      
      // Выводим результат в консоль
      rows.forEach((row) => {
        console.log(row.user_id);
      });
    });
}







app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'mysecret', // Секрет для подписания куки
    resave: false, // Не сохранять сессию, если она не изменилась
    saveUninitialized: false // Не сохранять пустую сессию
}));

app.get('/', (req, res) => {
    if (req.session.isAuthenticated) res.sendFile(__dirname + '/panel/main_page.html');
    else res.sendFile(__dirname + '/login_page/index.html');
});
app.get('/script.js', (req, res) => {
    res.sendFile(__dirname + '/login_page/script.js');
});


app.get('/panel/main_page', (req, res) => {
    if (req.session.isAuthenticated) {
        res.sendFile(__dirname + '/panel/main_page.html');
    } else {
        res.redirect('/');
    }
});
app.get('/panel/style.css', (req, res) => {
    if (req.session.isAuthenticated) {
        res.sendFile(__dirname + '/panel/style.css');
    } else {
        res.redirect('/');
    }
});

app.get('/panel/script.js', (req, res) => {
    res.sendFile(__dirname + '/panel/script.js');
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    connection.query(
        'SELECT * FROM admins WHERE login = ? AND password = ?',
        [username, password],
        (error, results, fields) => {
            if (error) console.log(error);

            if (results.length > 0) {
                req.session.isAuthenticated = true; // Устанавливаем флаг аутентификации в сессии
                res.redirect('/panel/main_page');
                // Действия, которые нужно выполнить в случае успешной аутентификации
            } else {
                res.send('Неверный логин или пароль');
                // Действия, которые нужно выполнить в случае ошибки аутентификации
            }
        }
    );
});


app.listen(3000, () => {
    console.log('Server started on port 3000');
});
