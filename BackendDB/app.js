const express = require('express');
const path = require('path');
const app = express();
const User = require('./Db/user'); // Capitalize model name conventionally

// Middleware setup
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Home Page (Form)
app.get('/', (req, res) => {
    res.render('Form');
});

// Create new user
app.post('/', async (req, res) => {
    try {
        const { name, email, url } = req.body;
        const newUser = new User({ name, email, url });

        console.log('Received user data:', newUser);
        await newUser.save();

        res.redirect('/users');
    } catch (err) {
        console.error('Error saving user:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Get all users
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        const message = req.query.message;
        res.render('users', { users, message });
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Edit user form
app.get('/edit/:id', async (req, res) => {
    try {
        const data = await User.findById(req.params.id);
        if (!data) return res.status(404).send('User not found');
        res.render('edit', { data });
    } catch (err) {
        console.error('Error loading edit form:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Update user
app.post('/updated/:id', async (req, res) => {
    try {
        const { name, email, url } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, url },
            { new: true }
        );

        if (!updatedUser) return res.status(404).send('User not found for update');
        res.redirect('/users?message=User+updated+successfully');
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Delete user
app.get('/delete/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).send('User not found for deletion');
        res.redirect('/users?message=User+deleted+successfully');
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Start server
app.listen(3000, () => {
    console.log('✅ Server is running on http://localhost:3000');
});
