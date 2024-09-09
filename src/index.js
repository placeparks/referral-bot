const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const { Bot } = require('./models/Bot');
const { User } = require('./models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { initializeBots } = require('./botManager');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb+srv://kainat:kainat107@cluster0.lkl2zyh.mongodb.net/telegram_referral', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// User signup
app.post('/api/signup', async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, password: hashedPassword });
        await user.save();
        res.status(201).send({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error during user signup:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
});

// User login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password)) {
        return res.status(401).send({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, 'your_jwt_secret');
    res.send({ token });
});

// Middleware to authenticate requests
const authenticate = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).send({ message: 'Unauthorized' });
    try {
        const payload = jwt.verify(token, 'your_jwt_secret');
        req.userId = payload.userId;
        next();
    } catch (error) {
        res.status(401).send({ message: 'Unauthorized' });
    }
};

// Bot token submission
app.post('/api/bot', authenticate, async (req, res) => {
    const { token, settings } = req.body;
    const bot = new Bot({ token, owner: req.userId, settings });
    await bot.save();
    res.status(201).send({ message: 'Bot token saved successfully' });
});

// Fetch referral statistics
app.get('/api/stats', authenticate, async (req, res) => {
    const bots = await Bot.find({ owner: req.userId });
    const stats = bots.map(bot => ({
        _id: bot._id, // Ensure _id is included
        token: bot.token,
        referrals: bot.referrals, // Assuming you have a referrals field in the Bot schema
    }));
    res.send(stats);
});

// List users (for debugging purposes)
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
});

// Delete bot token
app.delete('/api/bot/:id', authenticate, async (req, res) => {
    try {
        const botId = req.params.id;
        const bot = await Bot.findOneAndDelete({ _id: botId, owner: req.userId });
        if (!bot) {
            return res.status(404).send({ message: 'Bot not found or not authorized' });
        }
        res.status(200).send({ message: 'Bot token deleted successfully' });
    } catch (error) {
        console.error('Error deleting bot token:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
    initializeBots(); // Initialize bots when the server starts
});