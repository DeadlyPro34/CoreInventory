const addBtn = document.getElementById('addProdBtn');
const prodNameInput = document.getElementById('addProdName');
const prodQtyInput = document.getElementById('addProdQty');
const tableBody = document.getElementById('productBody');
const itemCountDisp = document.getElementById('itemCount');

function updateCount() {
    if (itemCountDisp && tableBody) {
        itemCountDisp.textContent = tableBody.children.length;
    }
}

function removeRow(btn) {
    btn.closest('tr').remove();
    updateCount();
}

function addNewRow() {
    const name = prodNameInput.value.trim();
    const qty = parseFloat(prodQtyInput.value);

    if (!name || isNaN(qty)) return;

    const row = document.createElement('tr');
    row.className = 'group hover:bg-indigo-50/30 transition-colors animate-fade';
    row.innerHTML = `
        <td class="px-6 py-5 font-semibold text-slate-700">${name}</td>
        <td class="px-6 py-5">
            <span class="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 font-bold text-sm">${qty.toFixed(2)} Units</span>
        </td>
        <td class="px-6 py-5 text-right">
            <button onclick="removeRow(this)" class="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
        </td>
    `;
    tableBody.appendChild(row);

    prodNameInput.value = '';
    prodQtyInput.value = '';
    prodNameInput.focus();
    updateCount();
}

if (addBtn) {
    addBtn.addEventListener('click', addNewRow);
}
if (prodQtyInput) {
    prodQtyInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addNewRow(); });
}

const validateBtn = document.getElementById('validateBtn');
if (validateBtn) {
    validateBtn.addEventListener('click', () => {
        const btn = document.getElementById('validateBtn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span class="flex items-center gap-2"><svg class="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> PROCESSING...</span>';
        btn.disabled = true;

        setTimeout(() => {
            showToast("Order WH/OUT/0001 validated and moved to Ready.");
            btn.innerHTML = originalText;
            btn.disabled = false;
        }, 1200);
    });
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    document.getElementById('toastMsg').textContent = msg;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0) translateX(-50%)';
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(40px) translateX(-50%)';
    }, 3500);
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
