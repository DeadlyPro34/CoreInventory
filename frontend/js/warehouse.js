const warehouseForm = document.getElementById('warehouseForm');
const toast = document.getElementById('toast');
const toastMsg = document.getElementById('toastMsg');

function showNotification(message, isSuccess = true) {
    if (!toastMsg || !toast) return;
    toastMsg.textContent = message;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0) translateX(-50%)';
    
    if (!isSuccess) {
        toast.classList.replace('bg-slate-900', 'bg-red-600');
    } else {
        toast.classList.replace('bg-red-600', 'bg-slate-900');
    }

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(40px) translateX(-50%)';
    }, 3000);
}

if (warehouseForm) {
    warehouseForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const saveBtn = document.getElementById('saveBtn');
        const originalText = saveBtn.innerHTML;
        
        const warehouseData = {
            name: document.getElementById('warehouseName').value,
            description: document.getElementById('addressLine1').value // Mapping description to address for now
        };

        saveBtn.disabled = true;
        saveBtn.innerHTML = `<svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Saving...`;

        try {
            const response = await fetch('/api/warehouses/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(warehouseData)
            });

            if (response.ok) {
                showNotification("Warehouse details updated successfully!");
            } else {
                showNotification("Error saving warehouse.", false);
            }
        } catch (error) {
            console.error('Error saving warehouse:', error);
            showNotification("Error saving warehouse.", false);
        } finally {
            saveBtn.disabled = false;
            saveBtn.innerHTML = originalText;
        }
    });
}

const updateBtn = document.getElementById('updateBtn');
if (updateBtn) {
    updateBtn.addEventListener('click', () => {
         showNotification("System is syncing latest warehouse data...", true);
    });
}

// Dropdown functionality
const setupDropdowns = () => {
    const dropdownContainers = document.querySelectorAll('.dropdown-container');

    dropdownContainers.forEach(container => {
        const trigger = container.querySelector('.dropdown-trigger');
        const content = container.querySelector('.dropdown-content');
        const chevron = trigger.querySelector('.lucide-chevron-down');

        if (!trigger || !content) return;

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();

            dropdownContainers.forEach(other => {
                if (other !== container) {
                    const otherContent = other.querySelector('.dropdown-content');
                    if (otherContent) otherContent.classList.remove('show');
                    const otherChevron = other.querySelector('.dropdown-trigger .lucide-chevron-down');
                    if (otherChevron) otherChevron.style.transform = 'rotate(0deg)';
                }
            });

            if (content.classList.contains('show')) {
                content.classList.remove('show');
                if (chevron) chevron.style.transform = 'rotate(0deg)';
            } else {
                content.classList.add('show');
                if (chevron) chevron.style.transform = 'rotate(180deg)';
            }
        });
    });

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
