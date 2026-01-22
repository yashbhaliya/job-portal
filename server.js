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
        const { title, category, companyName, location } = req.body;
        if (!title || !category || !companyName || !location) {
            return res.status(400).json({ error: 'Title, category, company name, and location are required' });
        }
        
        const job = new Job(req.body);
        await job.save();
        res.json({ message: 'Job saved successfully!', job });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE a job
app.put('/jobs/:id', async (req, res) => {
    try {
        const { title, category, companyName, location } = req.body;
        if (!title || !category || !companyName || !location) {
            return res.status(400).json({ error: 'Title, category, company name, and location are required' });
        }
        
        const allowedFields = ['title', 'category', 'companyName', 'location', 'companyLogo', 'minSalary', 'maxSalary', 'experience', 'years', 'employmentTypes', 'skills', 'expiryDate', 'featured', 'urgent'];
        const updateData = {};
        
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        });
        
        const updatedJob = await Job.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!updatedJob) {
            return res.status(404).json({ message: 'Job not found' });
        }
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
