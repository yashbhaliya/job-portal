let allJobs = [];


// Load jobs when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadJobs();
    
    // Get category from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    
    if (category) {
        updatePageTitle(category);
    }
    
    // Add event listeners
    document.querySelector('.filter-search-btn').addEventListener('click', applyFilters);
    document.querySelector('.clear-filters').addEventListener('click', clearAllFilters);
    document.querySelector('.all-btn').addEventListener('click', () => showAllJobs());
    document.querySelector('.urgent-btn').addEventListener('click', () => filterJobs('urgent'));
    document.querySelector('.featured-btn').addEventListener('click', () => filterJobs('featured'));
    
    // Add change listeners to checkboxes
    const checkboxes = document.querySelectorAll('.filter-options input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });
});

function updatePageTitle(category) {
    const titleElement = document.getElementById('categoryTitle');
    if (category === 'it&softwate' || category === 'it&amp;softwate' || category === 'it & software') {
        titleElement.textContent = 'IT & Software Jobs';
    } else if (category === 'marketing') {
        titleElement.textContent = 'Marketing Jobs';
    } else if (category === 'finance') {
        titleElement.textContent = 'Finance Jobs';
    } else if (category === 'design') {
        titleElement.textContent = 'Design Jobs';
    } else {
        titleElement.textContent = 'Filtered Jobs';
    }
}

async function loadJobs() {
    try {
        const response = await fetch('http://localhost:5000/jobs');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        allJobs = await response.json();
        console.log('Loaded jobs:', allJobs.length, allJobs);
        
        // Get category from URL and filter jobs
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        console.log('URL category parameter:', category);
        
        if (category) {
            filterJobsByCategory(category);
        } else {
            displayJobs(allJobs);
        }
    } catch (error) {
        console.error('Error loading jobs:', error);
        document.getElementById('jobsContainer').innerHTML = '<p>Unable to load jobs. Please make sure the server is running on port 5000.</p>';
    }
}

function filterJobsByCategory(category) {
    let filteredJobs = allJobs;
    console.log('Filtering by category:', category);
    console.log('All jobs before filtering:', allJobs.length);
    
    // Handle different category formats
    if (category === 'it&softwate' || category === 'it&softwate' || category === 'it & software' || category === 'it%20%26%20software') {
        filteredJobs = allJobs.filter(job => job.category === 'IT & Software');
        console.log('IT & Software jobs found:', filteredJobs.length);
    } else if (category === 'marketing') {
        filteredJobs = allJobs.filter(job => job.category === 'Marketing');
        console.log('Marketing jobs found:', filteredJobs.length);
    } else if (category === 'finance') {
        filteredJobs = allJobs.filter(job => job.category === 'Finance');
        console.log('Finance jobs found:', filteredJobs.length);
    } else if (category === 'design') {
        filteredJobs = allJobs.filter(job => job.category === 'Design');
        console.log('Design jobs found:', filteredJobs.length);
    }
    
    console.log('Final filtered jobs:', filteredJobs.length, filteredJobs);
    displayJobs(filteredJobs);
}

function displayJobs(jobs) {
    const container = document.getElementById('jobsContainer');
    if (jobs.length === 0) {
        container.innerHTML = '<p>No jobs found matching your criteria</p>';
        return;
    }
    
    function getCategoryIcon(category) {
        const icons = {
            'IT & Software': { emoji: '💻', class: 'it' },
            'Marketing': { emoji: '📈', class: 'marketing' },
            'Finance': { emoji: '💰', class: 'finance' },
            'Design': { emoji: '🎨', class: 'design' }
        };
        return icons[category] || { emoji: '💼', class: 'default' };
    }
    
    container.innerHTML = jobs.map(job => {
        const icon = getCategoryIcon(job.category);
        const salary = job.minSalary && job.maxSalary ? `₹${job.minSalary} - ₹${job.maxSalary}` : 'Salary not specified';
        const experience = job.experience === 'freshman' ? 'Fresher' : job.experience || 'Not specified';
        const experienceYears = job.years ? ` (${job.years} years)` : '';
        const fullExperience = experience + experienceYears;
        const employmentType = job.employmentTypes && job.employmentTypes.length > 0 ? job.employmentTypes.join(', ') : 'Not specified';
        
        return `
            <div class="job-card" onclick="openJobDetails('${job._id}')" style="cursor: pointer;">
                <div class="job-header">
                    ${job.companyLogo ? `<img src="${job.companyLogo}" alt="${job.companyName}" class="company-logo">` : `<span class="job-icon ${icon.class}">${icon.emoji}</span>`}
                    <div class="title-section">
                        <h3>${job.title}</h3>
                        <div class="company-small">${job.companyName}</div>
                    </div>
                </div>
                <div class="job-info">
                    <div class="category"><strong>Category:</strong> ${job.category}</div>
                    <div class="salary"><strong>Salary:</strong> ${salary}</div>
                    <div class="experience"><strong>Experience:</strong> ${fullExperience}</div>
                    <div class="employment-type"><strong>Type:</strong> ${employmentType}</div>
                    <div class="expiry-date"><strong>Expires:</strong> ${job.expiryDate || 'Not specified'}</div>
                    ${job.urgent ? '<span class="badge urgent" title="Urgent">⭐</span>' : ''}
                    ${job.featured ? '<span class="badge featured" title="Featured">⚡</span>' : ''}
                </div>
            </div>
        `;
    }).join('');
}

function showAllJobs() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    
    if (category) {
        filterJobsByCategory(category);
    } else {
        displayJobs(allJobs);
    }
}

function filterJobs(type) {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    
    let filteredJobs = allJobs;
    
    // First filter by category if specified
    if (category) {
        if (category === 'it&softwate' || category === 'it&amp;softwate' || category === 'it & software' || category === 'it%20%26%20software') {
            filteredJobs = filteredJobs.filter(job => job.category === 'IT & Software');
        } else if (category === 'marketing') {
            filteredJobs = filteredJobs.filter(job => job.category === 'Marketing');
        } else if (category === 'finance') {
            filteredJobs = filteredJobs.filter(job => job.category === 'Finance');
        } else if (category === 'design') {
            filteredJobs = filteredJobs.filter(job => job.category === 'Design');
        }
    }
    
    // Then filter by type
    if (type === 'urgent') {
        filteredJobs = filteredJobs.filter(job => job.urgent === true);
    } else if (type === 'featured') {
        filteredJobs = filteredJobs.filter(job => job.featured === true);
    }
    
    displayJobs(filteredJobs);
}

function openJobDetails(jobId) {
    window.location.href = `detail.html?id=${jobId}`;
}

function clearAllFilters() {
    const checkboxes = document.querySelectorAll('.filter-options input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    
    const filterSearchInput = document.getElementById('filterSearch');
    if (filterSearchInput) {
        filterSearchInput.value = '';
    }
    
    showAllJobs();
}

function applyFilters() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    
    let filteredJobs = allJobs;
    
    // First filter by category if specified
    if (category) {
        if (category === 'it&softwate' || category === 'it&amp;softwate' || category === 'it & software' || category === 'it%20%26%20software') {
            filteredJobs = filteredJobs.filter(job => job.category === 'IT & Software');
        } else if (category === 'marketing') {
            filteredJobs = filteredJobs.filter(job => job.category === 'Marketing');
        } else if (category === 'finance') {
            filteredJobs = filteredJobs.filter(job => job.category === 'Finance');
        } else if (category === 'design') {
            filteredJobs = filteredJobs.filter(job => job.category === 'Design');
        }
    }
    
    // Get search term
    const searchTerm = document.getElementById('filterSearch')?.value.toLowerCase().trim() || '';
    
    // Get selected employment types
    const selectedEmploymentTypes = Array.from(document.querySelectorAll('.filter-options input[value="Full-time"], .filter-options input[value="Part-time"], .filter-options input[value="Remote"], .filter-options input[value="Internship"]'))
        .filter(cb => cb.checked)
        .map(cb => cb.value);
    
    // Get selected salary ranges
    const selectedSalaryRanges = Array.from(document.querySelectorAll('.filter-options input[value="0-30000"], .filter-options input[value="30000-60000"], .filter-options input[value="60000-100000"], .filter-options input[value="100000+"]'))
        .filter(cb => cb.checked)
        .map(cb => cb.value);
    
    // Get selected experience levels
    const selectedExperience = Array.from(document.querySelectorAll('.filter-options input[value="freshman"], .filter-options input[value="junior"], .filter-options input[value="mid"], .filter-options input[value="senior"]'))
        .filter(cb => cb.checked)
        .map(cb => cb.value);
    
    // Apply search filter
    if (searchTerm) {
        filteredJobs = filteredJobs.filter(job => 
            job.title.toLowerCase().includes(searchTerm) ||
            job.companyName.toLowerCase().includes(searchTerm) ||
            job.category.toLowerCase().includes(searchTerm) ||
            job.location?.toLowerCase().includes(searchTerm) ||
            job.experience?.toLowerCase().includes(searchTerm) ||
            (job.employmentTypes && job.employmentTypes.some(type => type.toLowerCase().includes(searchTerm))) ||
            (job.skills && job.skills.some(skill => skill.toLowerCase().includes(searchTerm)))
        );
    }
    
    // Apply employment type filter
    if (selectedEmploymentTypes.length > 0) {
        filteredJobs = filteredJobs.filter(job => 
            job.employmentTypes && job.employmentTypes.some(type => selectedEmploymentTypes.includes(type))
        );
    }
    
    // Apply salary range filter
    if (selectedSalaryRanges.length > 0) {
        filteredJobs = filteredJobs.filter(job => {
            if (!job.minSalary || !job.maxSalary) return false;
            
            return selectedSalaryRanges.some(range => {
                switch(range) {
                    case '0-30000':
                        return job.maxSalary <= 30000;
                    case '30000-60000':
                        return job.minSalary >= 30000 && job.maxSalary <= 60000;
                    case '60000-100000':
                        return job.minSalary >= 60000 && job.maxSalary <= 100000;
                    case '100000+':
                        return job.minSalary >= 100000;
                    default:
                        return false;
                }
            });
        });
    }
    
    // Apply experience filter
    if (selectedExperience.length > 0) {
        filteredJobs = filteredJobs.filter(job => {
            const jobExp = job.experience?.toLowerCase();
            return selectedExperience.some(exp => {
                switch(exp) {
                    case 'freshman':
                        return jobExp === 'freshman' || jobExp === 'fresher';
                    case 'junior':
                        return jobExp === 'junior' || (job.years && job.years >= 1 && job.years <= 3);
                    case 'mid':
                        return jobExp === 'mid' || jobExp === 'mid-level' || (job.years && job.years >= 3 && job.years <= 5);
                    case 'senior':
                        return jobExp === 'senior' || (job.years && job.years >= 5);
                    default:
                        return false;
                }
            });
        });
    }
    
    displayJobs(filteredJobs);
}