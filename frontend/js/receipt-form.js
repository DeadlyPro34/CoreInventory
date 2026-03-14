const validateBtn = document.getElementById('validateBtn');
if (validateBtn) {
    validateBtn.addEventListener('click', () => {
        const btn = document.getElementById('validateBtn');
        btn.innerHTML = 'PROCESSING...';
        btn.disabled = true;

        setTimeout(() => {
            const toast = document.getElementById('toast');
            document.getElementById('toastMsg').textContent = "Receipt WH/IN/0001 validated successfully.";
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0) translateX(-50%)';

            btn.innerHTML = 'VALIDATE';
            btn.disabled = false;

            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateY(40px) translateX(-50%)';
            }, 3000);
        }, 1000);
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
