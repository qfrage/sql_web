const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/login_page/index.html');
});
app.get('/script.js', (req, res) => {
    res.sendFile(__dirname + '/login_page/script.js');
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
