const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Post = require('./models/Post');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

mongoose.connect('mongodb://localhost/social-media-app', { useNewUrlParser: true, useUnifiedTopology: true });

app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });

    try {
        await user.save();
        res.status(201).json({ message: 'User  registered successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error registering user' });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ id: user._id }, 'secret', { expiresIn: '1h' });
        res.json({ success: true, token });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
});

app.post('/api/posts', async (req, res) => {
    const { content } = req.body;
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, 'secret');

    const post = new Post({ content, userId: decoded.id });
    await post.save();
    res.json({ message: 'Post created successfully' });
});

app.get('/api/posts', async (req, res) => {
    const posts = await Post .find().populate('userId', 'email').exec();
    res.json(posts);
});

app.post('/api/profile', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, 'secret');
    const { bio } = req.body;

    const user = await User.findById(decoded.id);
    if (user) {
        user.bio = bio;
        if (req.files) {
            if (req.files.profilePic) {
                user.profilePic = req.files.profilePic[0].path; // Assuming you handle file uploads
            }
            if (req.files.coverPic) {
                user.coverPic = req.files.coverPic[0].path; // Assuming you handle file uploads
            }
        }
        await user.save();
        res.json({ message: 'Profile updated successfully' });
    } else {
        res.status(404).json({ message: 'User  not found' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
