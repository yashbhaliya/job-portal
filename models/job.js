const mongoose = require('../db'); // important to import the connection

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true }, // Won't save if title is missing
    category: { type: String, required: true },
    minSalary: String,
    maxSalary: String,
    experience: { type: String, default: 'freshman' },
    years: String,
    employmentTypes: [String],
    skills: [String],
    expiryDate: String,
    featured: { type: Boolean, default: false },
    urgent: { type: Boolean, default: false }
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
