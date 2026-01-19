// Get modal elements
const addJobBtn = document.getElementById('addJobBtn');
const jobModal = document.getElementById('jobModal');

// Function to open the job modal
function openJobModal() {
    jobModal.style.display = 'flex';
}

// Function to close the job modal
function closeJobModal() {
    jobModal.style.display = 'none';
}

// Add event listener to the Add New Job button
addJobBtn.addEventListener('click', openJobModal);

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