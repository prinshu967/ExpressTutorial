const express = require('express');
const app = express();  
const path = require('path');
const fs = require('fs');
const port = 3000;

app.set('view engine', 'ejs');

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Middleware to log request time
app.use((req, res, next) => {
  console.log('Time:', Date.now());
  next();
});

app.get('/', (req, res) => {
  const dir = path.join(__dirname, 'files');
  fs.readdir(dir, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return res.status(500).send('Directory read error');
    }

    const readFilePromises = files.map(file => {
      return new Promise((resolve, reject) => {
        fs.readFile(path.join(dir, file), 'utf8', (err, data) => {
          if (err) {
            return reject(err);
          }
          resolve({ name: file, description: data });
        });
      });
    });

    console.log(readFilePromises);

    Promise.all(readFilePromises)
      .then(fileData => {
        res.render('index', { files: fileData }); // `files` is an array of objects: [{ name, description }]
      })
      .catch(error => {
        console.error('Error reading files:', error);
        res.status(500).send('Failed to read files');
      });
  });
});


app.post('/submit', (req, res) => {
  const body = req.body;
  console.log(body);
  res.render('submit', { body });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  
  // const dir = path.join(__dirname, 'files');
  // console.log('Directory:', dir);

  // fs.readdir(dir, (err, files) => {
  //   if (err) {
  //     console.error('Error reading directory:', err);
  //     return;
  //   }

  //   files.forEach(file => {
  //     console.log(file);
  //     console.log(typeof file);
  //     fs.readFile(path.join(dir, file), 'utf8', (err, data) => {
  //       if (err) {
  //         console.error(`Error reading file ${file}:`, err);
  //         return;
  //       }
  //       console.log(`Contents of ${file}:`, data);
  //     });
  //   });
  // });


  // fs.writeFile(path.join(dir, 'Akash'+'.txt'), 'Hello World!', (err) => {
  //   if (err) {
  //     console.error('Error writing file:', err);
  //     return;
  //   }
  //   console.log('File written successfully');
  // });
});

