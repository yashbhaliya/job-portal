// Dropdown functionality
document.addEventListener('DOMContentLoaded', function() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const btn = dropdown.querySelector('.dropbtn');
        const content = dropdown.querySelector('.dropdown-content');
        
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Close other dropdowns
            dropdowns.forEach(other => {
                if (other !== dropdown) {
                    other.querySelector('.dropdown-content').style.display = 'none';
                }
            });
            
            // Toggle current dropdown
            content.style.display = content.style.display === 'block' ? 'none' : 'block';
        });
        
        // Handle dropdown item clicks
        content.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                btn.textContent = e.target.textContent + ' ▾';
                content.style.display = 'none';
            }
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function() {
        dropdowns.forEach(dropdown => {
            dropdown.querySelector('.dropdown-content').style.display = 'none';
        });
    });
});