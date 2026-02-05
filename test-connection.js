const Job = require('./models/Job');
require('./db');

async function testConnection() {
    try {
        console.log('Testing MongoDB connection...');
        
        // Check if we can fetch jobs
        const jobs = await Job.find();
        console.log(`Found ${jobs.length} jobs in database`);
        
        if (jobs.length === 0) {
            console.log('No jobs found. Adding sample data...');
            
            const sampleJobs = [
                {
                    title: 'Frontend Developer',
                    category: 'IT & Software',
                    companyName: 'Tech Corp',
                    location: 'Mumbai',
                    minSalary: '50000',
                    maxSalary: '80000',
                    experience: 'junior',
                    years: '2',
                    employmentTypes: ['Full-time'],
                    skills: ['React', 'JavaScript'],
                    expiryDate: '2024-12-31',
                    featured: true,
                    urgent: false
                },
                {
                    title: 'Marketing Manager',
                    category: 'Marketing',
                    companyName: 'Marketing Pro',
                    location: 'Delhi',
                    minSalary: '60000',
                    maxSalary: '90000',
                    experience: 'mid',
                    years: '4',
                    employmentTypes: ['Full-time'],
                    skills: ['Digital Marketing', 'SEO'],
                    expiryDate: '2024-12-25',
                    featured: false,
                    urgent: true
                }
            ];
            
            await Job.insertMany(sampleJobs);
            console.log('Sample jobs added successfully!');
            
            const updatedJobs = await Job.find();
            console.log(`Now have ${updatedJobs.length} jobs in database`);
        } else {
            console.log('Jobs found:');
            jobs.forEach((job, index) => {
                console.log(`${index + 1}. ${job.title} at ${job.companyName}`);
            });
        }
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

testConnection();