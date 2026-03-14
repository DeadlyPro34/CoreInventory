// 1. View Switching Logic
function toggleView(view) {
    const list = document.getElementById('listView');
    const kanban = document.getElementById('kanbanView');
    const listTab = document.getElementById('listTab');
    const kanbanTab = document.getElementById('kanbanTab');

    if (view === 'list') {
        list.classList.remove('view-hidden');
        kanban.classList.add('view-hidden');
        listTab.classList.add('tab-active');
        listTab.classList.remove('text-slate-500');
        kanbanTab.classList.remove('tab-active');
        kanbanTab.classList.add('text-slate-500');
    } else {
        list.classList.add('view-hidden');
        kanban.classList.remove('view-hidden');
        kanbanTab.classList.add('tab-active');
        kanbanTab.classList.remove('text-slate-500');
        listTab.classList.remove('tab-active');
        listTab.classList.add('text-slate-500');
    }
}

// 2. Dynamic Search Logic
const searchInput = document.getElementById('deliverySearch');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        
        // Filter List View Rows
        document.querySelectorAll('.delivery-row').forEach(row => {
            const ref = row.querySelector('.ref-text').textContent.toLowerCase();
            const contact = row.querySelector('.contact-text').textContent.toLowerCase();
            row.style.display = (ref.includes(term) || contact.includes(term)) ? '' : 'none';
        });

        // Filter Kanban Cards
        document.querySelectorAll('.kanban-card').forEach(card => {
            const ref = card.dataset.ref.toLowerCase();
            const contact = card.dataset.contact.toLowerCase();
            card.style.display = (ref.includes(term) || contact.includes(term)) ? 'block' : 'none';
        });
    });
}

// 3. Modal Controls
function toggleModal(show) {
    const overlay = document.getElementById('modalOverlay');
    const container = document.getElementById('modalContainer');
    if (show) {
        overlay.classList.remove('opacity-0', 'pointer-events-none');
        container.classList.remove('scale-95');
        container.classList.add('scale-100');
    } else {
        overlay.classList.add('opacity-0', 'pointer-events-none');
        container.classList.remove('scale-100');
        container.classList.add('scale-95');
    }
}

// 4. Form Submission Logic
const newDeliveryForm = document.getElementById('newDeliveryForm');
if (newDeliveryForm) {
    newDeliveryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const contact = document.getElementById('newContact').value;
        
        toggleModal(false);
        showToast(`Order created for ${contact}!`);
        
        // Reset form
        e.target.reset();
    });
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    document.getElementById('toastMsg').textContent = msg;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0) translateX(-50%)';
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(40px) translateX(-50%)';
    }, 3000);
}

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

document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    setupDropdowns();
});
