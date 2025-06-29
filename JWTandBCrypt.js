onst express = require('express');
const cookieParser = require('cookie-parser'); 
const bcrypt = require('bcryptjs'); 
const jwt= require('jsonwebtoken');

app.use(cookieParser());

app.get('/', (req, res) => {
    res.cookie('name', 'Prinshy'); // Set a cookie
    res.send("Cookie set successfully! Yaha sab thik hai bhai log!");
});

app.get('/jwt', (req, res) => {
    const token=jwt.sign("prinshu@gmail.com","secretkey"); 
    console.log("JWT Token generated: ", token);
    
    res.cookie('jwt', token); 
    res.send("JWT Token set successfully!");
});

app.get('/read', (req, res) => {
    const cookies = req.cookies; 
    console.log("Cookies: ", cookies);
    let resp=""
    for(const key in cookies) {
        console.log(`${key}: ${cookies[key]}`);
        resp+=`${key}: ${cookies[key]} ,`;

    }
    resp = resp.slice(0, -2);


    res.send(`Cookies read successfully! Cookies are: ${resp}`);
});



app.listen(port, () => {
    console.log(`App running at http://localhost:${port}`);
    
    bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;
        console.log(`Salt generated: ${salt}`);
        bcrypt.hash(' ', salt, (err, hash) => {
            if (err) throw err;
            console.log(`Hashed password: ${hash}`);
        });
    });
});


