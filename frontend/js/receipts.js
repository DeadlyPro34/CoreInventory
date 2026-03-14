// View Switching Logic
function switchView(view) {
    const listView = document.getElementById('listView');
    const kanbanView = document.getElementById('kanbanView');
    const listBtn = document.getElementById('listBtn');
    const kanbanBtn = document.getElementById('kanbanBtn');

    if (view === 'list') {
        listView.classList.remove('hidden');
        kanbanView.classList.add('hidden');
        listBtn.classList.add('active');
        listBtn.classList.remove('text-slate-500');
        kanbanBtn.classList.remove('active');
        kanbanBtn.classList.add('text-slate-500');
    } else {
        listView.classList.add('hidden');
        kanbanView.classList.remove('hidden');
        kanbanBtn.classList.add('active');
        kanbanBtn.classList.remove('text-slate-500');
        listBtn.classList.remove('active');
        listBtn.classList.add('text-slate-500');
    }
}

// Real-time Search Logic
const searchInput = document.getElementById('receiptSearch');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        document.querySelectorAll('.receipt-row').forEach(row => {
            const ref = row.querySelector('.ref-text').textContent.toLowerCase();
            const partner = row.querySelector('.partner-text').textContent.toLowerCase();
            row.style.display = (ref.includes(term) || partner.includes(term)) ? '' : 'none';
        });
        // Update kanban search if needed
        document.querySelectorAll('#kanbanView .bg-white').forEach(card => {
            const text = card.textContent.toLowerCase();
            card.style.display = text.includes(term) ? '' : 'none';
        });
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
