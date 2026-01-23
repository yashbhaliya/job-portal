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
        if (query) {
            console.log('Searching for:', query);
            alert(`Searching for: "${query}"`);
        }
    }
    
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', performSearch);
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
});
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
        
        const jobs = await response.json();
        
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
            const salary = job.minSalary && job.maxSalary ? `$${job.minSalary} - $${job.maxSalary}` : 'Salary not specified';
            const experience = job.experience || 'Not specified';
            const employmentType = job.employmentTypes && job.employmentTypes.length > 0 ? job.employmentTypes.join(', ') : 'Not specified';
            
            return `
                <div class="job-card">
                    ${job.companyLogo ? `<img src="${job.companyLogo}" alt="${job.companyName}" class="company-logo">` : `<span class="job-icon ${icon.class}">${icon.emoji}</span>`}
                    <div class="job-info">
                        <h3>${job.title}</h3>
                        <div class="company">${job.companyName}</div>
                        <div class="category">${job.category}</div>
                        <div class="salary">${salary}</div>
                        <div class="experience">Experience: ${experience}</div>
                        <div class="employment-type">${employmentType}</div>
                        <div class="location">${job.location}</div>
                        ${job.urgent ? '<span class="badge urgent">⭐</span>' : ''}
                        ${job.featured ? '<span class="badge featured">⚡</span>' : ''}
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading jobs:', error);
        document.getElementById('jobsContainer').innerHTML = '<p>Unable to load jobs. Please make sure the server is running on port 5000.</p>';
    }
}

// Load jobs when page loads
document.addEventListener('DOMContentLoaded', loadJobs);