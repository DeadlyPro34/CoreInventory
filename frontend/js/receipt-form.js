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

// Add Line Item Logic
const addProdBtn = document.getElementById('addProdBtn');
if (addProdBtn) {
    addProdBtn.addEventListener('click', () => {
        const productBody = document.getElementById('productBody');
        const newRow = document.createElement('tr');
        newRow.className = 'group hover:bg-indigo-50/30 transition-colors';
        newRow.innerHTML = `
            <td class="px-6 py-5">
                <div class="font-bold text-slate-800">[NEW] New Product</div>
                <div class="text-xs text-slate-400">Spec required</div>
            </td>
            <td class="px-6 py-5 text-right font-mono text-slate-600">0.00</td>
            <td class="px-6 py-5 text-right">
                <input type="number" value="1.00" class="w-24 text-right bg-white border border-slate-200 rounded-lg px-2 py-1 font-bold text-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all">
            </td>
            <td class="px-6 py-5 text-right">
                <button onclick="this.closest('tr').remove()" class="p-2 text-slate-300 hover:text-red-500 transition-all">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
            </td>
        `;
        productBody.appendChild(newRow);
        
        // Success animation for adding
        newRow.style.opacity = '0';
        newRow.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            newRow.style.opacity = '1';
            newRow.style.transform = 'translateY(0)';
        }, 10);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    setupDropdowns();
});
