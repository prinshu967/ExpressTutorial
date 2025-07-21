const express = require('express');
const cookieParser = require('cookie-parser');
const User = require('./models/user');
const Post = require('./models/post');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const flash = require('connect-flash');




const app = express();
const port = 3000;



// Middlewares



app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));
app.use(cookieParser());

app.use(session({
  secret: 'prinshu',
  resave: false,
  saveUninitialized: true
}));
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});

isLoggedIn = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.redirect('/');
    }
    try {
        const decoded = jwt.verify(token, "prinshu");
        console.log("Decorded User", decoded);
        req.user = decoded; 
        next();
    } catch (err) {
        console.error("Invalid token:", err.message);
        res.clearCookie("token");
        return res.redirect('/');
    }
}

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/register', (req, res) => {
    res.render('create'); 
});


app.post('/register', async (req, res) => {
    const { name, email, password, age } = req.body;

    try {
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send("User with this email already exists");
        }

        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

       
        const user = new User({
            name,
            email,
            password: hashedPassword,
            age
        });


        await user.save();
      const token = jwt.sign({ email: user.email, id: user._id }, "prinshu");

       console.log("Token generated:", token);
        res.cookie('token', token );
        res.send("User created successfully!");
        
    } catch (err) {
        console.error("Error during registration:", err);
        res.status(500).send("Internal server error");
    } 
});
 

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send("Email and password are required");
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send("User not found");
        }
        console.log("User found:", user);

        if (!user.password) {
            return res.status(400).send("No password set for this user");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send("Invalid credentials");
        }

        const token = jwt.sign({ email: user.email, id: user._id }, "prinshu", {
            expiresIn: "1h"
        });

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000 // 1 hour
        });

        res.redirect("/profile");
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send("Internal Server Error");
    }
});


//  This code is cousing error in During Deletion of post;


// app.get('/profile',  isLoggedIn, async (req, res) => {
//     // const token = req.cookies.token;

//     // if (!token) {
//     //     // Optional: You can flash a message using req.flash() if using connect-flash
//     //     return res.redirect('/');
//     // }

//     try {
//         // const decoded = jwt.verify(token, "prinshu"); // match secret
//         // const user = await User.findById(decoded.id);
//         const user = await User.findById(req.user.id); 

//         if (!user) {
//             return res.status(404).send("User not found");
//         }
//       const posts = await Promise.all(
//             user.post.map(postId => Post.findById(postId))
//         );
        

//         console.log(`User is ${user} and posts are ${posts}`);

        


//         res.render('profile', { user ,posts});   
//     } catch (err) {
//         console.error("Invalid token:", err.message);
//         res.clearCookie("token");
//         return res.redirect('/');
//     }
// });

//  Safe Code For the same is Given  Below

app.get('/profile', isLoggedIn, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).send("User not found");
        }

        // Fetch posts by ID
        const posts = await Promise.all(
            user.post.map(postId => Post.findById(postId))
        );

        // Filter out null posts (i.e. deleted from DB)
        const validPosts = posts.filter(post => post !== null);

        // Clean up dangling post references in user if needed
        if (validPosts.length !== user.post.length) {
            user.post = validPosts.map(p => p._id);
            await user.save();
        }

        res.render('profile', { user, posts: validPosts });

    } catch (err) {
        console.error("Error loading profile:", err.message);
        res.clearCookie("token");
        return res.redirect('/');
    }
});




app.post('/post', isLoggedIn, async (req, res) => {
    const { post } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).send("User not found");
        }

        const newPost = new Post({
            content: post,
            user: user._id
        });

        await newPost.save();

        user.post.push(newPost._id);
        await user.save();
        console.log("Post created successfully:", newPost);

        return res.redirect('/profile');
    } catch (err) {
        if (err.name === 'ValidationError') {
            console.error("Validation error:", err.message);
            return res.status(400).send("Invalid post data");
        }

        console.error("Error creating post:", err);
        return res.status(500).send("Server error. Please try again later.");
    }
});

app.put('/edit/:id', async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    await Post.findByIdAndUpdate(id, { content });
    res.redirect('/profile');
    res.status(200).json({ message: "Post updated" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update post" });
  }
});

app.post('/delete/:id', isLoggedIn, async (req, res) => {
  const postId = req.params.id;
  const userId = req.user._id;

  try {
    // Delete the post from the Post collection
    await Post.findByIdAndDelete(postId);

    // Remove postId from the user's post array
    await User.findByIdAndUpdate(userId, {
      $pull: { post: postId }
    });

    res.redirect('/profile');
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).send("Server error while deleting post.");
  }
});


app.get('/posts', isLoggedIn, async (req, res) => {
  try {
    const posts = await Post.find().populate('user'); // fetch posts with user details
    res.render('posts.ejs', { posts, user: req.user });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading posts.");
  }
});


app.post('/posts/:id/like', isLoggedIn, async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).send("Post not found");

    if (post.likedBy.includes(userId)) {
      req.flash('error_msg', 'You already liked this post');
      return res.redirect('/posts');
    }

    post.likes += 1;
    post.likedBy.push(userId);
    await post.save();

    req.flash('success_msg', 'You liked the post!');
    res.redirect('back');

  } catch (err) {
    console.error("Like error:", err);
    req.flash('error_msg', 'Something went wrong!');
    res.redirect('/posts');
  }
});



app.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});
// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
