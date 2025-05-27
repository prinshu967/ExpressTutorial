const express = require('express');
const path = require('path');
const app = express();
const user = require('./Db/user');

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get('/', (req, res) => {
    res.render('Form');
});

// Route to save user
app.post('/', (req, res) => {
    const { name, email, url } = req.body;

    const newUser = new user({ name, email, url });
    console.log('Received user data:', newUser);
    newUser.save()
        .then(() => res.redirect('/users'))
        .catch(err => {
            console.error('Error saving user:', err);
            res.status(500).send('Internal Server Error');
        });
});

// Route to view all users
app.get('/users', async (req, res) => {
    try {
        const users = await user.find();
        res.render('users', { users });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
