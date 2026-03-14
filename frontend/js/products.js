// Init Lucide Icons
lucide.createIcons();

// Modal Logic
function toggleModal(show) {
    const modal = document.getElementById('modal');
    if (show) {
        modal.classList.remove('hidden');
    } else {
        modal.classList.add('hidden');
    }
}

// Search Logic
document.getElementById('searchInput').addEventListener('input', function(e) {
    const term = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#stockTable tbody tr');
    
    rows.forEach(row => {
        const productName = row.querySelector('td:first-child span.font-bold').textContent.toLowerCase();
        if (productName.includes(term)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
});

// Toast Logic
function showToast(msg) {
    const toast = document.getElementById('toast');
    document.getElementById('toastMsg').textContent = msg;
    
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0) translateX(-50%)';
    
    toggleModal(false);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(40px) translateX(-50%)';
    }, 3000);
}

// Attach toast to all update buttons
document.querySelectorAll('.table-row button').forEach(btn => {
    btn.addEventListener('click', () => showToast('Stock updated successfully!'));
});

// Setup Dropdown behaviors
function setupDropdowns() {
    const dropdownContainers = document.querySelectorAll('.dropdown-container');
    
    // Toggle on click
    dropdownContainers.forEach(container => {
        const trigger = container.querySelector('.dropdown-trigger');
        const content = container.querySelector('.dropdown-content');
        const chevron = container.querySelector('[data-lucide="chevron-down"]');
        
        trigger.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent closing immediately
            
            // Close others first
            document.querySelectorAll('.dropdown-content.show').forEach(el => {
                if (el !== content) {
                    el.classList.remove('show');
                    el.previousElementSibling.querySelector('[data-lucide="chevron-down"]').style.transform = 'rotate(0deg)';
                    el.previousElementSibling.classList.remove('text-theme-primary', 'bg-theme-light');
                }
            });

            // Toggle current
            const isShowing = content.classList.contains('show');
            if (isShowing) {
                content.classList.remove('show');
                chevron.style.transform = 'rotate(0deg)';
                trigger.classList.remove('text-theme-primary', 'bg-theme-light');
            } else {
                content.classList.add('show');
                chevron.style.transform = 'rotate(180deg)';
                trigger.classList.add('text-theme-primary', 'bg-theme-light');
            }
        });
    });

    // Close on click outside
    document.addEventListener('click', () => {
        document.querySelectorAll('.dropdown-content.show').forEach(content => {
            content.classList.remove('show');
            const trigger = content.previousElementSibling;
            const chevron = trigger.querySelector('[data-lucide="chevron-down"]');
            if(chevron) chevron.style.transform = 'rotate(0deg)';
            trigger.classList.remove('text-theme-primary', 'bg-theme-light');
        });
    });
}

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

// Fetch and render products on load
async function fetchProducts() {
    try {
        const response = await fetch('/api/products/');
        const products = await response.json();
        
        const tbody = document.querySelector('#stockTable tbody');
        tbody.innerHTML = '';
        
        products.forEach(product => {
            const newRow = document.createElement('tr');
            newRow.className = 'table-row group';
            newRow.innerHTML = `
                <td class="px-6 py-5">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-theme-light rounded-lg flex items-center justify-center text-theme-primary">
                            <i data-lucide="${product.category_icon || 'box'}" class="w-5 h-5"></i>
                        </div>
                        <span class="font-bold text-theme-dark">${product.name}</span>
                    </div>
                </td>
                <td class="px-6 py-5 text-theme-gray font-medium">${Number(product.cost).toLocaleString()} Rs</td>
                <td class="px-6 py-5 text-center">
                    <input type="number" value="${product.stock_on_hand}"
                        class="w-16 text-center py-1 rounded bg-theme-light border border-theme-secondary focus:border-theme-primary outline-none text-sm font-medium">
                </td>
                <td class="px-6 py-5 text-center">
                    <span class="badge-pill bg-green-100 text-green-700">${product.stock_on_hand} Units</span>
                </td>
                <td class="px-6 py-5 text-right">
                    <button class="px-4 py-1.5 text-xs font-bold text-theme-white bg-theme-primary rounded-lg hover:bg-theme-dark transition-all shadow-sm">Update</button>
                </td>
            `;
            tbody.appendChild(newRow);
            
            newRow.querySelector('button').addEventListener('click', () => showToast('Stock updated successfully!'));
        });
        
        if (typeof lucide !== 'undefined') lucide.createIcons();
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Add Product Logic
const addProductForm = document.getElementById('addProductForm');
if (addProductForm) {
    addProductForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const productData = {
            name: document.getElementById('prodName').value,
            cost: document.getElementById('prodCost').value,
            stock_on_hand: document.getElementById('prodStock').value,
            category_icon: document.getElementById('prodCategory').value,
            sku: 'PROD-' + Date.now() // Simple unique SKU
        };

        try {
            const response = await fetch('/api/products/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });

            if (response.ok) {
                addProductForm.reset();
                toggleModal(false);
                showToast('New product added!');
                fetchProducts(); // Refresh list
            } else {
                showToast('Error saving product');
            }
        } catch (error) {
            console.error('Error saving product:', error);
            showToast('Error saving product');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setupDropdowns();
    setupMobileMenu();
    fetchProducts();
});
