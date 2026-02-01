const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --- 1. CONNECT TO DATABASE & START SERVER ---

// Initialize hardcoded users (Deepak and Anjali)
const initializeHardcodedUsers = async () => {
    const hardcodedUsers = [
        { 
            name: 'Deepak',
            subjects: [
                {
                    id: 'deepak-subject-1',
                    name: 'Data Structures',
                    description: 'Learning DSA fundamentals',
                    entries: [],
                    createdAt: new Date().toISOString()
                }
            ],
            dailylogs: []
        },
        { 
            name: 'Anjali',
            subjects: [
                {
                    id: 'anjali-subject-1',
                    name: 'Web Development',
                    description: 'Full stack development',
                    entries: [],
                    createdAt: new Date().toISOString()
                }
            ],
            dailylogs: []
        }
    ];

    for (const userData of hardcodedUsers) {
        const existing = await User.findOne({ name: userData.name });
        if (!existing) {
            await User.create(userData);
            console.log(`Created user: ${userData.name}`);
        }
    }
};

const startServer = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected');

        // Initialize hardcoded users
        await initializeHardcodedUsers();
        console.log('Hardcoded users initialized');

        // Only start listening AFTER the DB is connected
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1); // Stop the app if DB fails
    }
};

startServer();

// --- 2. ROUTES ---

// Get all available users
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find({}, 'name');
        res.json(users.map(u => u.name));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all data for a user
app.get('/api/:user', async (req, res) => {
    try {
        const { user } = req.params;
        let userData = await User.findOne({ name: user });

        if (!userData) {
            userData = new User({
                name: user,
                subjects: [],
                dailylogs: []
            });
            await userData.save();
        }
        res.json(userData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- SUBJECTS ---

app.get('/api/:user/subjects', async (req, res) => {
    try {
        const { user } = req.params;
        const userData = await User.findOne({ name: user });
        res.json(userData ? userData.subjects : []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/:user/subjects', async (req, res) => {
    try {
        const { user } = req.params;
        const newSubjects = req.body;

        const userData = await User.findOneAndUpdate(
            { name: user },
            { subjects: newSubjects },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.json(userData.subjects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/:user/subjects/:id', async (req, res) => {
    try {
        const { user, id } = req.params;
        const userData = await User.findOne({ name: user });

        if (userData) {
            // Filter out the subject
            userData.subjects = userData.subjects.filter(s => s.id !== parseInt(id) && s.id !== id);
            await userData.save();
            res.json(userData.subjects);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- DAILY LOGS ---

app.get('/api/:user/dailylogs', async (req, res) => {
    try {
        const { user } = req.params;
        const userData = await User.findOne({ name: user });
        res.json(userData ? userData.dailylogs : []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/:user/dailylogs', async (req, res) => {
    try {
        const { user } = req.params;
        const newLogs = req.body;

        const userData = await User.findOneAndUpdate(
            { name: user },
            { dailylogs: newLogs },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.json(userData.dailylogs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});