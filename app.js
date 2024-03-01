const collection = require("./mongodb");

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const User = require('./server/models/User'); // Import the User schema
const Post = require('./server/models/Post'); // Import the Post schema

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to DB
try {
  mongoose.connect(process.env.MONGODB_URL, {});

  console.log('Connected to MongoDB');
} catch (error) {
  console.error('MongoDB connection error:', error.message);
  process.exit(1); // Exit the application if the connection fails
}

app.use(express.static('public'));

// Templating Engine
app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

// Body Parser Middleware
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
  res.render('./layouts/main');
});

// User CRUD Endpoints

// Create a new user
app.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    await user.save();
    res.redirect('/users');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Read all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.render('users/index', { users });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Read a specific user
app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.render('users/show', { user });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Update a user
app.put('/users/:id', async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Delete a user
app.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Post CRUD Endpoints


// Create a new post
app.post('/posts', async (req, res) => {
  try {
    const { title, body } = req.body;
    const post = new Post({ title, body });
    await post.save();
    res.redirect('/posts');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Read all posts
app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find();
    res.render('posts/index', { posts });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Read a specific post
app.get('/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.render('posts/show', { post });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

//login
app.post("/login", async (req, res) => {
  try {
    const exist = await collection.findOne({ name: req.body.name });

    if (!exist) {
      res.send("No such user!");
    }

    const isCorrect = exist.password.localeCompare(req.body.password);

    if (!isCorrect) {
      res.send('You logged in!');
    } else {
      res.send('Password is wrong!');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Update a post
app.put('/posts/:id', async (req, res) => {
  try {
    const { title, body } = req.body;
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { title, body, updatedAt: Date.now() },
      { new: true }
    );
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Delete a post
app.delete('/posts/:id', async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});