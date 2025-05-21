const express = require('express');
const app = express();   // Declare with 'const'
const port = 3000;

app.set('view engine', 'ejs');

// Middleware to log request time
app.use((req, res, next) => {
  console.log('Time:', Date.now());
  next();
});

app.get('/', (req, res) => {
  // Passing data to the EJS template
  res.render('Home', { user: "Prinshu Kumar" });
});

app.get('/index', (req, res) => {
  res.render('index', { user: 'Prinshu' });
});



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
