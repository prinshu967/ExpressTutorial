const express = require('express');
const app = express();   // Declare with 'const'
const port = 3000;

app.set('view engine', 'ejs');


// Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true }));


// Middleware to log request time
app.use((req, res, next) => {
  console.log('Time:', Date.now());
  next();
});


app.get('/', (req, res) => {
  res.render('index');
});
app.post('/submit', (req, res,next) => {
  const body = req.body
  console.log(body);
  res.render('submit', { body });


  
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
