const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();
const dbPath = './database.db';
const app = express();

app.use(bodyParser.json());
var db = -1;

// Создание подключения
function connectToDB() {
  db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
      return;
    }
    console.log('Подключено к базе данных');
  });
}
function closeDBConnection() {
  db.close((err) => {
    if (err) {
      console.error(err.message);
      return;
    }
    console.log('Соединение с базой данных закрыто');
  });
}




app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'mysecret', 
  resave: false, 
  saveUninitialized: false 
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

app.post('/deleteFaq', (req, res) => {
  connectToDB();
  const { id } = req.body;

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


app.post('/updateFaq', (req, res) => {
  connectToDB();
  const { id, title, content } = req.body; 

  const checkSql = 'SELECT COUNT(*) AS count FROM faqs WHERE id = ?';
  db.get(checkSql, [id], function (err, row) {
    if (err) {
      console.error(err.message);
      res.status(500).send('Виникла помилка при збереженні.');
      return;
    }

    const count = row.count;

    if (count === 0) {
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


app.get('/api/users', (req, res) => {
  const sql = 'SELECT * FROM users';
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


// Обработчик POST-запроса для обновления значения is_blocked
app.post('/update-user-blocked', (req, res) => {
  connectToDB()
  console.log("Blocked upd");

  const { user_id, is_blocked } = req.body;
  // Выполнение SQL-запроса для обновления значения is_blocked
  const sql = 'UPDATE users SET is_blocked = ? WHERE user_id = ?';
  db.run(sql, [is_blocked, user_id], function(err) {
    if (err) {
      console.error('Ошибка при обновлении значения is_blocked:', err);
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  });
  closeDBConnection();

});

// Обработчик POST-запроса для обновления значения is_admin
app.post('/update-user-admin', (req, res) => {
  connectToDB();
  console.log("Admin upd");
  const { user_id, is_admin } = req.body;

  // Выполнение SQL-запроса для обновления значения is_admin
  const sql = 'UPDATE users SET is_admin = ? WHERE user_id = ?';
  db.run(sql, [is_admin, user_id], function(err) {
    if (err) {
      console.error('Ошибка при обновлении значения is_admin:', err);
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  });
  closeDBConnection();
});

app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if(username == 'admin' && password == 'admin'){
    req.session.isAuthenticated = true; 
    res.redirect('/panel/main_page');
  }
  else{
    alert("Неправильно введені дані.Вхід заборонено");
  }
});


app.listen(3000, () => {
  console.log('Server started on port 3000');
});
