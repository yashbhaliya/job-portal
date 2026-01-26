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
    
    // Add event listeners for navbar links
    const navLinks = document.querySelectorAll('.nav-a');
    navLinks.forEach(link => {
        if (link.textContent.trim() === 'Urgent') {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                filterJobs('urgent');
            });
        } else if (link.textContent.trim() === 'Featured') {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                filterJobs('featured');
            });
        }
    });

    // Clear filters functionality
    const clearFiltersBtn = document.querySelector('.clear-filters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearAllFilters);
    }

    // Filter search functionality
    const filterSearchInput = document.getElementById('filterSearch');
    const filterSearchBtn = document.querySelector('.filter-search-btn');
    
    if (filterSearchBtn) {
        filterSearchBtn.addEventListener('click', applyFilters);
    }
    
    if (filterSearchInput) {
        filterSearchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                applyFilters();
            }
        });
    }

    // Add event listeners to all filter checkboxes
    const filterCheckboxes = document.querySelectorAll('.filter-options input[type="checkbox"]');
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });
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
        // Filter to show only IT & Software jobs
        const itJobs = allJobs.filter(job => job.category === 'IT & Software');
        displayJobs(itJobs);
    } catch (error) {
        console.error('Error loading jobs:', error);
        document.getElementById('jobsContainer').innerHTML = '<p>Unable to load jobs. Please make sure the server is running on port 5000.</p>';
    }
}

function displayJobs(jobs) {
    const container = document.getElementById('jobsContainer');
    if (jobs.length === 0) {
        container.innerHTML = '<p>No jobs found matching your criteria</p>';
        return;
    }
    
    function getCategoryIcon(category) {
        const icons = {
            'IT & Software': { class: 'it' },
            'Marketing': { class: 'marketing' },
            'Finance': { class: 'finance' },
            'Design': { class: 'design' }
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

function searchJobs(query) {
    if (!query.trim()) {
        const itJobs = allJobs.filter(job => job.category === 'IT & Software');
        displayJobs(itJobs);
        return;
    }
    
    const filteredJobs = allJobs.filter(job => {
        const searchText = query.toLowerCase();
        return job.category === 'IT & Software' && (
            job.title.toLowerCase().includes(searchText) ||
            job.companyName.toLowerCase().includes(searchText) ||
            job.location.toLowerCase().includes(searchText) ||
            job.experience.toLowerCase().includes(searchText) ||
            (job.employmentTypes && job.employmentTypes.some(type => type.toLowerCase().includes(searchText))) ||
            (job.skills && job.skills.some(skill => skill.toLowerCase().includes(searchText)))
        );
    });
    
    displayJobs(filteredJobs);
}

// Filter jobs by type
function filterJobs(type) {
    let filteredJobs = allJobs.filter(job => job.category === 'IT & Software');
    
    if (type === 'urgent') {
        filteredJobs = filteredJobs.filter(job => job.urgent === true);
    } else if (type === 'featured') {
        filteredJobs = filteredJobs.filter(job => job.featured === true);
    }
    
    displayJobs(filteredJobs);
}

// Function to open job details page
function openJobDetails(jobId) {
    window.location.href = `detail.html?id=${jobId}`;
}

// Clear all filters
function clearAllFilters() {
    // Uncheck all checkboxes
    const checkboxes = document.querySelectorAll('.filter-options input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Clear search input
    const filterSearchInput = document.getElementById('filterSearch');
    if (filterSearchInput) {
        filterSearchInput.value = '';
    }
    
    // Show all jobs
    displayJobs(allJobs);
}

// Apply all filters
function applyFilters() {
    let filteredJobs = [...allJobs];
    
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