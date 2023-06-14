const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();
const dbPath = './database.db';
const app = express();

app.use(bodyParser.json());
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

// Код на серверній стороні (приклад використання Express.js)
app.post('/deleteFaq', (req, res) => {
  connectToDB();
  const { id } = req.body; // Отримання даних з запиту

  // Виконання операції видалення з бази даних
  const sql = `DELETE FROM faqs WHERE id = ?`;
  db.run(sql, [id], function (err) {
      if (err) {
          console.error(err.message);
          res.status(500).send('Помилка при видаленні запису.');
      } else {
          res.send('Запис успішно видалено.');
      }
  });

  closeDBConnection();
});


// Обработчик HTTP-запроса для обновления записи faq
app.post('/updateFaq', (req, res) => {
  connectToDB();
  const { id, title, content } = req.body; // Получение данных из запроса

  // Проверяем, чи існує рядок з вказаним id
  const checkSql = 'SELECT COUNT(*) AS count FROM faqs WHERE id = ?';
  db.get(checkSql, [id], function (err, row) {
      if (err) {
          console.error(err.message);
          res.status(500).send('Виникла помилка при збереженні.');
          return;
      }

      const count = row.count;

      if (count === 0) {
          // Рядок з вказаним id не існує, додаємо новий запис
          const insertSql = 'INSERT INTO faqs (id, title, content) VALUES (?, ?, ?)';
          db.run(insertSql, [id, title, content], function (err) {
              if (err) {
                  console.error(err.message);
                  res.status(500).send('Виникла помилка при збереженні.');
              } else {
                  res.send('Збережено!');
              }
          });
      } else {
          // Рядок з вказаним id існує, виконуємо оновлення
          const updateSql = 'UPDATE faqs SET title = ?, content = ? WHERE id = ?';
          db.run(updateSql, [title, content, id], function (err) {
              if (err) {
                  console.error(err.message);
                  res.status(500).send('Виникла помилка при оновленні запису.');
              } else {
                  res.send('Збережено.');
              }
          });
      }
  });

  closeDBConnection();
});


// Обработчик GET-запроса на /api/faq
app.get('/api/faq', (req, res) => {
    const sql = 'SELECT * FROM faqs';
    connectToDB();
    db.all(sql, [], (err, rows) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка при получении данных' });
      } else {
        res.json(rows);
      }
    });
    closeDBConnection();
  });

app.get('/panel/script.js', (req, res) => {
    res.sendFile(__dirname + '/panel/script.js');
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    req.session.isAuthenticated = true; // Устанавливаем флаг аутентификации в сессии
    res.redirect('/panel/main_page');
    // connection.query(
    //     'SELECT * FROM admins WHERE login = ? AND password = ?',
    //     [username, password],
    //     (error, results, fields) => {
    //         if (error) console.log(error);

    //         if (results.length > 0) {
                
    //             // Действия, которые нужно выполнить в случае успешной аутентификации
    //         } else {
    //             res.send('Неверный логин или пароль');
    //             // Действия, которые нужно выполнить в случае ошибки аутентификации
    //         }
    //     }
    // );
});


app.listen(3000, () => {
    console.log('Server started on port 3000');
});
