// Get modal elements
const addJobBtn = document.getElementById('addJobBtn');
const jobModal = document.getElementById('jobModal');
const jobForm = document.querySelector('.job-form');

// Job data storage
let jobs = JSON.parse(localStorage.getItem('jobs')) || [];
let editingJobId = null;
let currentSkills = [];
let isViewMode = false;

// Function to save jobs to localStorage
function saveJobs() {
    localStorage.setItem('jobs', JSON.stringify(jobs));
}

// Function to render job cards
function renderJobs() {
    const jobsContainer = document.querySelector('.jobs');
    jobsContainer.innerHTML = '';
    jobs.forEach(job => {
        const jobCard = document.createElement('div');
        jobCard.className = 'job-card';
        jobCard.innerHTML = `
            <h3>${job.title}</h3>
            <p>Category: ${job.category}</p>
            <p>Salary: ${job.minSalary === 'No salary needed' ? 'No salary needed' : `₹${job.minSalary} - ₹${job.maxSalary}`}</p>
            <p>Experience: ${job.experience}${job.years ? ` (${job.years} years)` : ''}</p>
            <p>Type: ${job.employmentTypes.join('<br>')}</p>
            <p>Skills: ${job.skills.join(', ')}</p>
            <p>Expiry: ${job.expiryDate}</p>
            ${job.featured ? '<span class="featured">★ </span>' : ''}
            ${job.urgent ? '<span class="urgent">⚡ </span>' : ''}
            <div class="actions">
                <button class="btn-view" data-id="${job.id}">👁️</button>
                <button class="btn-edit" data-id="${job.id}">✏️</button>
                <button class="btn-delete" data-id="${job.id}">🗑️</button>
            </div>
        `;
        jobsContainer.appendChild(jobCard);
    });
}

// Function to open the job modal
function openJobModal() {
    const modalTitle = document.querySelector('.job-modal-content h2');
    const skillBtn = document.querySelector('.skill-btn');
    if (isViewMode) {
        modalTitle.textContent =('View Job') ;
        // Make text/number/date inputs readonly
        jobForm.querySelectorAll('input[type="text"], input[type="number"], input[type="date"]').forEach(el => el.readOnly = true);
        // Disable radios, checkboxes, selects
        jobForm.querySelectorAll('input[type="radio"], input[type="checkbox"], select').forEach(el => el.disabled = true);
        document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => btn.style.display = 'none');
        skillBtn.disabled = true;
    } else {
        modalTitle.textContent = editingJobId ? 'Edit Job' : 'Post New Job';
        // Remove readonly from text inputs
        jobForm.querySelectorAll('input[type="text"], input[type="number"], input[type="date"]').forEach(el => el.readOnly = false);
        // Enable radios, checkboxes, selects
        jobForm.querySelectorAll('input[type="radio"], input[type="checkbox"], select').forEach(el => el.disabled = false);
        document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => btn.style.display = 'block');
        skillBtn.disabled = false;
    }
    jobModal.style.display = 'flex';
}

// Function to close the job modal
function closeJobModal() {
    jobModal.style.display = 'none';
    editingJobId = null;
    isViewMode = false;
    jobForm.reset();
    experienceYearsInput.style.display = 'none';
    document.querySelector('.job-modal-content h2').textContent = 'Post New Job';
    currentSkills = [];
    renderSkillsList(false);
    // Re-enable elements
    jobForm.querySelectorAll('input[type="text"], input[type="number"], input[type="date"]').forEach(el => el.readOnly = false);
    jobForm.querySelectorAll('input[type="radio"], input[type="checkbox"], select').forEach(el => el.disabled = false);
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => btn.style.display = 'block');
    document.querySelector('.skill-btn').disabled = false;
}

// Function to add skill
function addSkill() {
    const skill = document.getElementById('skillInput').value.trim();
    if (skill && !currentSkills.includes(skill)) {
        currentSkills.push(skill);
        document.getElementById('skillInput').value = '';
        renderSkillsList(false);
    }
}

// Function to render skills list
function renderSkillsList(readonly = false) {
    const list = document.getElementById('skillsList');
    list.innerHTML = '';
    currentSkills.forEach((skill, index) => {
        const skillTag = document.createElement('span');
        skillTag.className = 'skill-tag';
        if (readonly) {
            skillTag.innerHTML = skill;
        } else {
            skillTag.innerHTML = `${skill} <button onclick="removeSkill(${index})">×</button>`;
        }
        list.appendChild(skillTag);
    });
}

// Function to remove skill
function removeSkill(index) {
    currentSkills.splice(index, 1);
    renderSkillsList(false);
}

// Allow adding skill with Enter key
document.getElementById('skillInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        addSkill();
    }
});

// Function to populate form for editing
function populateForm(job) {
    document.querySelector('input[name="title"]').value = job.title;
    document.querySelector('select[name="category"]').value = job.category;
    document.querySelector('input[name="minSalary"]').value = job.minSalary === 'No salary needed' ? '' : job.minSalary;
    document.querySelector('input[name="maxSalary"]').value = job.maxSalary === '' ? 'No salary needed' : job.maxSalary;
    document.querySelector(`input[name="experience"][value="${job.experience}"]`).checked = true;
    document.querySelector('input[name="years"]').value = job.years || '';
    if (job.experience === 'experienced') {
        experienceYearsInput.style.display = 'block';
    }
    document.querySelectorAll('input[name="employmentType"]').forEach(cb => {
        cb.checked = job.employmentTypes.includes(cb.value);
    });
    currentSkills = [...job.skills];
    renderSkillsList(isViewMode);
    document.querySelector('input[name="expiryDate"]').value = job.expiryDate;
    document.querySelector('input[name="featured"]').checked = job.featured;
    document.querySelector('input[name="urgent"]').checked = job.urgent;
}

// Add event listener to the Add New Job button
addJobBtn.addEventListener('click', () => {
    editingJobId = null;
    openJobModal();
});

// Experience level functionality
const experienceRadios = document.querySelectorAll('input[name="experience"]');
const experienceYearsInput = document.getElementById('experienceYears');

// Initially hide the years input
experienceYearsInput.style.display = 'none';

experienceRadios.forEach(radio => {
    radio.addEventListener('change', function() {
        if (this.value === 'experienced') {
            experienceYearsInput.style.display = 'block';
        } else {
            experienceYearsInput.style.display = 'none';
        }
    });
});

// Form submission handler
jobForm.addEventListener('submit', function(e) {
    e.preventDefault();
    if (isViewMode) return; // Prevent submission in view mode
    const formData = new FormData(jobForm);
    let minSalary = formData.get('minSalary');
    let maxSalary = formData.get('maxSalary');
    if (!minSalary && !maxSalary) {
        minSalary = maxSalary = 'No salary needed';
    }
    const job = {
        id: editingJobId || Date.now(),
        title: formData.get('title'),
        category: formData.get('category'),
        minSalary: minSalary,
        maxSalary: maxSalary,
        experience: formData.get('experience'),
        years: formData.get('years'),
        employmentTypes: formData.getAll('employmentType'),
        skills: [...currentSkills],
        expiryDate: formData.get('expiryDate'),
        featured: formData.has('featured'),
        urgent: formData.has('urgent')
    };
    if (editingJobId) {
        const index = jobs.findIndex(j => j.id == editingJobId);
        jobs[index] = job;
    } else {
        jobs.push(job);
    }
    saveJobs();
    renderJobs();
    closeJobModal();
});

// Event delegation for job card buttons
document.querySelector('.jobs').addEventListener('click', function(e) {
    const target = e.target;
    const jobId = target.dataset.id;
    if (!jobId) return;
    const job = jobs.find(j => j.id == jobId);
    if (target.classList.contains('btn-view')) {
        isViewMode = true;
        editingJobId = null;
        populateForm(job);
        openJobModal();
    } else if (target.classList.contains('btn-edit')) {
        editingJobId = jobId;
        populateForm(job);
        openJobModal();
    } else if (target.classList.contains('btn-delete')) {
        if (confirm('Are you sure you want to delete this job?')) {
            jobs = jobs.filter(j => j.id != jobId);
            saveJobs();
            renderJobs();
        }
    }
});

// Initial render
renderJobs();