require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path'); 
const User = require('./server/models/User'); // Import the User schema
const Post = require('./server/models/Post'); // Import the Post schema


const router = express.Router();
//const AdminController = require('./controllers/AdminController');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to DB
try {
  mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('Connected to MongoDB');
} catch (error) {
  console.error('MongoDB connection error:', error.message);
  process.exit(1);
}

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public/views"));
app.use(express.urlencoded({ extended: true })); 
app.use(express.json())

app.get('/', async (req, res) => {
  res.render('signup');
});

app.get('/main', async (req, res) => {
  res.render('main');
});

app.get('/contact', async (req, res) => {
  res.render('contact');
});

app.get('/about', async (req, res) => {
  res.render('about');
});

app.get('/login', async (req, res) => {
  res.render('login');
});
app.get('/post', async (req, res) => {
  res.render('post');
});



// User CRUD Endpoints

app.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    await user.save();
    res.redirect('/main');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.render('users/index', { users });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.render('users/show', { user });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

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

app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find();
    res.render('posts/index', { posts });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.render('posts/show', { post });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

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
