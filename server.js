// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Job = require('./models/Job'); // Import Job model
require('./db'); // Import MongoDB connection

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // serve frontend files

// Routes
// GET all jobs
app.get('/jobs', async (req, res) => {
    try {
        const jobs = await Job.find();
        res.json(jobs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/jobs', async (req, res) => {
    try {
        console.log('Incoming job:', req.body); // debug
        const job = new Job(req.body);
        await job.save();
        console.log('Job saved successfully!');
        res.json({ message: 'Job saved successfully!', job });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// UPDATE a job
app.put('/jobs/:id', async (req, res) => {
    try {
        const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedJob);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE a job
app.delete('/jobs/:id', async (req, res) => {
    try {
        await Job.findByIdAndDelete(req.params.id);
        res.json({ message: 'Job deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
});
