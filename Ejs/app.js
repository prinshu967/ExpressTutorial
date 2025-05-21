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

// Optional error handler
// app.get('/about', (req, res, next) => {
//   return next(new Error('Something went wrong!'));
// });

// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Something broke!');
// });

// Dynamic Route Example
app.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  res.send(`User Name: ${userId}`);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
