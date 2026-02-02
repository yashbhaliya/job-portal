// Dropdown functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.getElementById("navMenu");
    const closeMenu = document.querySelector(".close-menu");

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", () => {
            navMenu.classList.toggle("active");
        });
    }

    if (closeMenu && navMenu) {
        closeMenu.addEventListener("click", () => {
            navMenu.classList.remove("active");
            // Reset all dropdown states
            const categoryItem = document.querySelector('.category');
            const employmentItem = document.querySelector('.Employment-Type');
            if (categoryItem) categoryItem.classList.remove('active');
            if (employmentItem) employmentItem.classList.remove('active');
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu && !e.target.closest('#navMenu') && !e.target.closest('.menu-toggle')) {
            navMenu.classList.remove('active');
            // Reset all dropdown states
            const categoryItem = document.querySelector('.category');
            const employmentItem = document.querySelector('.Employment-Type');
            if (categoryItem) categoryItem.classList.remove('active');
            if (employmentItem) employmentItem.classList.remove('active');
        }
    });

    // Desktop dropdown functionality
    const categoryItem = document.querySelector('.category');
    const employmentItem = document.querySelector('.Employment-Type');
    
    // Mobile dropdown toggle
    if (categoryItem) {
        const categoryLink = categoryItem.querySelector('.nav-a');
        if (categoryLink) {
            categoryLink.addEventListener('click', function(e) {
                if (window.innerWidth <= 900) {
                    e.preventDefault();
                    // Close other dropdown first
                    if (employmentItem) employmentItem.classList.remove('active');
                    categoryItem.classList.toggle('active');
                }
            });
        }
    }
    
    if (employmentItem) {
        const employmentLink = employmentItem.querySelector('.nav-a');
        if (employmentLink) {
            employmentLink.addEventListener('click', function(e) {
                if (window.innerWidth <= 900) {
                    e.preventDefault();
                    // Close other dropdown first
                    if (categoryItem) categoryItem.classList.remove('active');
                    employmentItem.classList.toggle('active');
                }
            });
        }
    }

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.querySelector('.search-btn');
    
    function performSearch() {
        const query = searchInput ? searchInput.value.trim() : '';
        searchJobs(query);
    }
    
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', performSearch);
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    // Load jobs when page loads
    loadJobs();
    
    // Add event listeners for filter buttons
    const allBtn = document.querySelector('.all-btn');
    const urgentBtn = document.querySelector('.urgent-btn');
    const featuredBtn = document.querySelector('.featured-btn');
    
    if (allBtn) {
        allBtn.addEventListener('click', () => filterJobs('all'));
    }
    
    if (urgentBtn) {
        urgentBtn.addEventListener('click', () => filterJobs('urgent'));
    }
    
    if (featuredBtn) {
        featuredBtn.addEventListener('click', () => filterJobs('featured'));
    }

});
let allJobs = [];

// Fetch and display jobs from MongoDB
async function loadJobs() {
    try {
        const response = await fetch('http://localhost:5000/jobs', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        allJobs = await response.json();
        displayJobs(allJobs);
    } catch (error) {
        console.error('Error loading jobs:', error);
        document.getElementById('jobsContainer').innerHTML = '<p>Unable to load jobs. Please make sure the server is running on port 5000.</p>';
    }
}

function displayJobs(jobs) {
    const container = document.getElementById('jobsContainer');
    if (jobs.length === 0) {
        container.innerHTML = '<p>No jobs available</p>';
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
                    ${job.urgent ? '<span class="badge urgent" title="Urgent"><img src="/img/urgent.png" alt="Urgent" class="star-icon"></span>' : ''}
                    ${job.featured ? '<span class="badge featured" title="Featured"><img src="/img/features.png" alt="Featured" class="star-icon"></span>' : ''}
                </div>
            </div>
        `;
    }).join('');
}

function searchJobs(query) {
    if (!query.trim()) {
        displayJobs(allJobs);
        return;
    }
    
    const filteredJobs = allJobs.filter(job => {
        const searchText = query.toLowerCase();
        return (
            job.title.toLowerCase().includes(searchText) ||
            job.companyName.toLowerCase().includes(searchText) ||
            job.category.toLowerCase().includes(searchText) ||
            job.location.toLowerCase().includes(searchText) ||
            job.experience.toLowerCase().includes(searchText) ||
            (job.employmentTypes && job.employmentTypes.some(type => type.toLowerCase().includes(searchText))) ||
            (job.skills && job.skills.some(skill => skill.toLowerCase().includes(searchText)))
        );
    });
    
    displayJobs(filteredJobs);
}

// Function to open job details page
function openJobDetails(jobId) {
    window.location.href = `detail.html?id=${jobId}`;
}

// Load jobs when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadJobs();
    
    // Set "All" button as active by default
    const allBtn = document.querySelector('.all-btn');
    if (allBtn) {
        allBtn.classList.add('active');
    }
    
    // Add event listeners for filter buttons
    const urgentBtn = document.querySelector('.urgent-btn');
    const featuredBtn = document.querySelector('.featured-btn');
    
    if (allBtn) {
        allBtn.addEventListener('click', () => {
            setActiveButton(allBtn);
            filterJobs('all');
        });
    }
    
    if (urgentBtn) {
        urgentBtn.addEventListener('click', () => {
            setActiveButton(urgentBtn);
            filterJobs('urgent');
        });
    }
    
    if (featuredBtn) {
        featuredBtn.addEventListener('click', () => {
            setActiveButton(featuredBtn);
            filterJobs('featured');
        });
    }

});

function setActiveButton(activeBtn) {
    // Remove active class from all buttons
    document.querySelectorAll('.main-btn').forEach(btn => btn.classList.remove('active'));
    // Add active class to clicked button
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}

// Filter jobs by type
function filterJobs(type) {
    let filteredJobs;
    
    if (type === 'all') {
        filteredJobs = allJobs;
    } else if (type === 'urgent') {
        filteredJobs = allJobs.filter(job => job.urgent === true);
    } else if (type === 'featured') {
        filteredJobs = allJobs.filter(job => job.featured === true);
    }
    
    displayJobs(filteredJobs);
}