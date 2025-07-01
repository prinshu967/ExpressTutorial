const express = require('express');
const cookieParser = require('cookie-parser'); 
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');

const User = require('./models/user'); // Import the User model if you have a database setup

const app = express();
const port = 3000;

app.set('view engine', 'ejs'); // Set EJS as the view engine
app.use(express.static('public')); // Serve static files from "public" folder
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Enable cookie parsing

// Home route
app.get('/', (req, res) => {
    res.render('index'); 
});

app.get('/create', (req, res) => {
    res.render('create'); 
});

app.post('/', async (req, res) => {
    const { email, password } = req.body;
    console.log("Email:", email, "Password:", password);

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).send("User not found");
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(401).send("Incorrect password");
        }

        return res.send("Login successful!");
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).send("Internal server error");
    }
});


app.post('/create', async (req, res) => {
    const { name, email, password, age } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); 
    if(User.findOne({ email })) {
        return res.status(400).send("User with this email already exists");
    }
    const user = new User({
        name,
        email ,
        password: hashedPassword,
        age
    });
    

    await user.save();
    console.log("User created:", user);
    res.send("User created successfully!");
});


// Start server
app.listen(port, () => {
    console.log(`App running at http://localhost:${port}`);
});










