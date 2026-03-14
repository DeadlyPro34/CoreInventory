/**
 * Core Inventory Mock Data
 * Formula implemented: Free To Use = On Hand - Reserved
 */
let inventoryData = [
    {
        id: 1,
        name: 'Ergonomic Desk',
        sku: 'SKU-DSK-001',
        cost: 4500,
        onHand: 120,
        reserved: 15,
        locations: [
            { wh: 'Warehouse A (Main)', loc: 'Aisle 3 - Shelf B', qty: 70 },
            { wh: 'Warehouse B (Overflow)', loc: 'Aisle 1 - Shelf A', qty: 50 }
        ]
    },
    {
        id: 2,
        name: 'Office Chair Pro',
        sku: 'SKU-CHR-042',
        cost: 3200,
        onHand: 45,
        reserved: 45, // Fully reserved scenario
        locations: [
            { wh: 'Warehouse A (Main)', loc: 'Aisle 2 - Shelf C', qty: 45 }
        ]
    },
    {
        id: 3,
        name: 'Wireless Keyboard',
        sku: 'SKU-KBD-909',
        cost: 1200,
        onHand: 350,
        reserved: 20,
        locations: [
            { wh: 'Warehouse C (Tech)', loc: 'Aisle 8 - Bin 12', qty: 350 }
        ]
    },
    {
        id: 4,
        name: 'Dual Monitor Stand',
        sku: 'SKU-MNT-221',
        cost: 2100,
        onHand: 8,
        reserved: 0,
        locations: [
            { wh: 'Warehouse A (Main)', loc: 'Aisle 4 - Shelf A', qty: 8 }
        ]
    },
    {
        id: 5,
        name: 'Conference Table',
        sku: 'SKU-TBL-005',
        cost: 15000,
        onHand: 12,
        reserved: 4,
        locations: [
            { wh: 'Warehouse B (Heavy)', loc: 'Floor Sector 1', qty: 12 }
        ]
    }
];

// Application State
const state = {
    searchQuery: '',
    expandedRows: new Set()
};

// DOM Elements
const tableBody = document.getElementById('inventoryTableBody');
const searchInput = document.getElementById('searchInput');
const recordCount = document.getElementById('recordCount');

// Modal Elements
const modal = document.getElementById('adjustmentModal');
const modalPanel = document.getElementById('modalPanel');
const adjustForm = document.getElementById('adjustStockForm');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelAdjustBtn = document.getElementById('cancelAdjustBtn');
const modalBackdrop = document.getElementById('modalBackdrop');

// Number formatter for Indian Rupees (₹)
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
};

// Render logic for the table
const renderTable = () => {
    const q = state.searchQuery.toLowerCase();
    const filteredData = inventoryData.filter(item => 
        item.name.toLowerCase().includes(q) || 
        item.sku.toLowerCase().includes(q)
    );

    recordCount.innerText = `Showing ${filteredData.length} records`;

    if (filteredData.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" class="p-12 text-center text-gray-500">
            <i data-lucide="package-x" class="w-12 h-12 mx-auto mb-3 opacity-20"></i>
            No products found matching "${state.searchQuery}"
        </td></tr>`;
        lucide.createIcons();
        return;
    }

    let html = '';
    
    filteredData.forEach(item => {
        const freeToUse = item.onHand - item.reserved;
        const isExpanded = state.expandedRows.has(item.id);
        
        // Determine styling based on stock health
        let stockStatusClass = 'text-gray-800 font-bold';
        if (freeToUse === 0) stockStatusClass = 'text-red-600 font-bold';
        else if (freeToUse < 10) stockStatusClass = 'text-amber-600 font-bold';

        // Main Row
        html += `
            <tr class="hover:bg-violet-100/50 transition-colors group cursor-pointer" onclick="toggleRow(${item.id})">
                <td class="px-6 py-4">
                    <button class="p-1 rounded-md text-gray-400 hover:text-indigo-600 hover:bg-violet-200/50 transition">
                        <i data-lucide="${isExpanded ? 'chevron-down' : 'chevron-right'}" class="w-5 h-5 transition-transform ${isExpanded ? 'text-indigo-600' : ''}"></i>
                    </button>
                </td>
                <td class="px-6 py-4">
                    <div class="flex flex-col">
                        <span class="font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">${item.name}</span>
                        <span class="text-xs text-gray-500 font-mono mt-0.5">${item.sku}</span>
                    </div>
                </td>
                <td class="px-6 py-4 text-right text-gray-700 font-medium">${formatCurrency(item.cost)}</td>
                <td class="px-6 py-4 text-right">
                    <span class="inline-block px-2.5 py-1 bg-gray-50 border border-gray-200 rounded text-gray-800 font-mono shadow-sm">${item.onHand}</span>
                </td>
                <td class="px-6 py-4 text-right text-gray-500 font-mono">${item.reserved}</td>
                <td class="px-6 py-4 text-right">
                    <span class="${stockStatusClass} text-lg font-mono drop-shadow-sm">${freeToUse}</span>
                </td>
                <td class="px-6 py-4 text-center" onclick="event.stopPropagation()">
                    <button onclick="openAdjustmentModal(${item.id})" class="px-3 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                        Adjust Stock
                    </button>
                </td>
            </tr>
        `;

        // 5. Expandable Warehouse Location Context Row
        if (isExpanded) {
            const locationsHtml = item.locations.map(loc => `
                <div class="flex items-center justify-between p-3 bg-white border border-violet-200 rounded-lg shadow-sm">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded bg-violet-100 flex items-center justify-center border border-violet-200">
                            <i data-lucide="map-pin" class="w-4 h-4 text-indigo-600"></i>
                        </div>
                        <div>
                            <p class="text-sm font-semibold text-gray-800">${loc.wh}</p>
                            <p class="text-xs text-gray-500">${loc.loc}</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="text-xs text-gray-400 uppercase tracking-wider mb-0.5">Stored Qty</p>
                        <p class="text-sm font-mono text-gray-900 font-bold">${loc.qty}</p>
                    </div>
                </div>
            `).join('');

            html += `
                <tr class="bg-violet-50/50 border-b border-violet-100 shadow-inner fade-in">
                    <td colspan="7" class="p-0">
                        <div class="px-16 py-6 border-l-2 border-indigo-500 ml-[38px] my-2">
                            <h4 class="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <i data-lucide="boxes" class="w-4 h-4"></i>
                                Storage Locations
                            </h4>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                ${locationsHtml}
                            </div>
                        </div>
                    </td>
                </tr>
            `;
        }
    });

    tableBody.innerHTML = html;
    lucide.createIcons();
};

// Row Expansion Toggle
window.toggleRow = (id) => {
    if (state.expandedRows.has(id)) {
        state.expandedRows.delete(id);
    } else {
        state.expandedRows.add(id);
    }
    renderTable();
};

// Modal Logic
const openModal = () => {
    modal.classList.remove('opacity-0', 'pointer-events-none');
    modalPanel.classList.remove('scale-95');
    modalPanel.classList.add('scale-100');
    setTimeout(() => document.getElementById('adjustNewStock').focus(), 100);
};

const closeModal = () => {
    modal.classList.add('opacity-0', 'pointer-events-none');
    modalPanel.classList.remove('scale-100');
    modalPanel.classList.add('scale-95');
    adjustForm.reset();
};

window.openAdjustmentModal = (id) => {
    const product = inventoryData.find(p => p.id === id);
    if (!product) return;

    document.getElementById('adjustProductId').value = product.id;
    document.getElementById('adjustProductName').innerText = `${product.name} (${product.sku})`;
    document.getElementById('adjustCurrentStock').innerText = product.onHand;
    document.getElementById('adjustNewStock').value = product.onHand;
    
    openModal();
};

// Form Submit Handler (Simulates API Call for 6. Stock Adjustment)
adjustForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const id = parseInt(document.getElementById('adjustProductId').value);
    const newOnHand = parseInt(document.getElementById('adjustNewStock').value);
    const reason = document.getElementById('adjustReason').value;

    // Find and update item
    const itemIndex = inventoryData.findIndex(p => p.id === id);
    if (itemIndex > -1) {
        const oldOnHand = inventoryData[itemIndex].onHand;
        const difference = newOnHand - oldOnHand;
        
        // Update local state
        inventoryData[itemIndex].onHand = newOnHand;
        
        /*
         * API STRUCTURE NOTE (For Backend Integration):
         * The payload sent to the Django backend should look like this:
         * POST /api/inventory/adjust
         * {
         * "product_id": id,
         * "old_quantity": oldOnHand,
         * "new_quantity": newOnHand,
         * "difference": difference,
         * "reason": reason
         * }
         */
        console.log(`[Move History Logged] Adjusted ${inventoryData[itemIndex].sku} by ${difference}. Reason: ${reason}`);

        // Visual feedback & cleanup
        closeModal();
        renderTable();
    }
});

// Event Listeners
searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    renderTable();
});

closeModalBtn.addEventListener('click', closeModal);
cancelAdjustBtn.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', closeModal);

// Escape key to close modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('opacity-0')) {
        closeModal();
    }
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

document.addEventListener('DOMContentLoaded', () => {
    renderTable();
    lucide.createIcons();
    setupDropdowns();
});
