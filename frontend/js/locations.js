const form = document.getElementById('locationForm');
const toast = document.getElementById('toast');
const toastMsg = document.getElementById('toastMsg');

function triggerToast(message) {
    toastMsg.textContent = message;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0) translateX(-50%)';
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(40px) translateX(-50%)';
    }, 3000);
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('loc_name').value;
    
    // For simplicity, we'll try to get the first warehouse or create one
    let warehouseId = 1; 

    const locationData = {
        name: name,
        warehouse: warehouseId
    };

    try {
        const response = await fetch('/api/locations/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(locationData)
        });

        if (response.ok) {
            triggerToast(`Location "${name}" saved successfully!`);
            form.reset();
        } else {
            triggerToast("Error saving location. Make sure a warehouse exists.");
        }
    } catch (error) {
        console.error('Error saving location:', error);
        triggerToast("Error saving location.");
    }
});

document.getElementById('updateBtn').addEventListener('click', () => {
    const name = document.getElementById('loc_name').value;
    if(!name) {
        triggerToast("Please enter a location name to update.");
        return;
    }
    triggerToast("Updating location records...");
});

// Dropdown functionality
const setupDropdowns = () => {
    const dropdownContainers = document.querySelectorAll('.dropdown-container');

    dropdownContainers.forEach(container => {
        const trigger = container.querySelector('.dropdown-trigger');
        const content = container.querySelector('.dropdown-content');
        const chevron = trigger.querySelector('.lucide-chevron-down');

        if (!trigger || !content) return;

        // Toggle on click
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();

            // Close other dropdowns
            dropdownContainers.forEach(other => {
                if (other !== container) {
                    const otherContent = other.querySelector('.dropdown-content');
                    if (otherContent) otherContent.classList.remove('show');
                    const otherChevron = other.querySelector('.dropdown-trigger .lucide-chevron-down');
                    if (otherChevron) otherChevron.style.transform = 'rotate(0deg)';
                }
            });

            // Toggle current dropdown
            if (content.classList.contains('show')) {
                content.classList.remove('show');
                if (chevron) chevron.style.transform = 'rotate(0deg)';
            } else {
                content.classList.add('show');
                if (chevron) chevron.style.transform = 'rotate(180deg)';
            }
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', () => {
        const contents = document.querySelectorAll('.dropdown-content');
        const chevrons = document.querySelectorAll('.dropdown-trigger .lucide-chevron-down');

        contents.forEach(c => c.classList.remove('show'));
        chevrons.forEach(c => c.style.transform = 'rotate(0deg)');
    });
};

// Mobile Menu Toggle Logic
function toggleMobileMenu(show) {
    const sidebar = document.getElementById('mobile-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar && overlay) {
        if (show) {
            sidebar.classList.add('show');
            overlay.classList.add('show');
            document.body.style.overflow = 'hidden'; // Prevent scroll
        } else {
            sidebar.classList.remove('show');
            overlay.classList.remove('show');
            document.body.style.overflow = ''; // Restore scroll
        }
    }
}

function setupMobileMenu() {
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const closeBtn = document.getElementById('close-sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    if (toggleBtn) toggleBtn.addEventListener('click', () => toggleMobileMenu(true));
    if (closeBtn) closeBtn.addEventListener('click', () => toggleMobileMenu(false));
    if (overlay) overlay.addEventListener('click', () => toggleMobileMenu(false));
}

document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    setupDropdowns();
    setupMobileMenu();
});
