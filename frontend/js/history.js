/**
 * 5 & 6. Unified Data Rule & Granular Row Expansion
 * Mock database representing individual move lines.
 * Notice WH/OUT/0002 has two rows to represent different products in one delivery.
 */
const initialData = [
    { id: 1, ref: 'WH/IN/0001', date: '2026-03-12', contact: 'Azure Interior', product: 'Office Chair', from: 'Vendor', to: 'WH/Stock1', quantity: 12, status: 'Done', type: 'IN' },
    { id: 2, ref: 'WH/IN/0001', date: '2026-03-12', contact: 'Azure Interior', product: 'Desk Lamp', from: 'Vendor', to: 'WH/Stock1', quantity: 40, status: 'Done', type: 'IN' },
    { id: 3, ref: 'WH/OUT/0002', date: '2026-03-14', contact: 'Interior Solutions', product: 'Laptop L302', from: 'WH/Stock1', to: 'Customer', quantity: 5, status: 'Ready', type: 'OUT' },
    { id: 4, ref: 'WH/OUT/0002', date: '2026-03-14', contact: 'Interior Solutions', product: 'Wireless Mouse', from: 'WH/Stock1', to: 'Customer', quantity: 10, status: 'Ready', type: 'OUT' },
    { id: 5, ref: 'WH/IN/0003', date: '2026-03-14', contact: 'Logitech Vendor', product: 'Keyboard K120', from: 'Vendor', to: 'WH/Stock2', quantity: 50, status: 'Draft', type: 'IN' },
    { id: 6, ref: 'WH/OUT/0004', date: '2026-03-15', contact: 'Local Retailer', product: 'Office Chair', from: 'WH/Stock1', to: 'Customer', quantity: 4, status: 'Draft', type: 'OUT' },
    { id: 7, ref: 'WH/IN/0005', date: '2026-03-15', contact: 'Dell Supply', product: 'Monitor 24"', from: 'Vendor', to: 'WH/Stock2', quantity: 20, status: 'Ready', type: 'IN' },
];

// Application State
const state = {
    view: 'list', // 'list' | 'kanban'
    searchQuery: '',
    data: [...initialData]
};

// DOM Elements
const viewContainer = document.getElementById('viewContainer');
const searchInput = document.getElementById('searchInput');
const btnListView = document.getElementById('btnListView');
const btnKanbanView = document.getElementById('btnKanbanView');

// Helpers
const getStatusStyles = (status) => {
    switch (status.toLowerCase()) {
        case 'draft': return 'bg-gray-100 text-gray-600 border border-gray-200';
        case 'ready': return 'bg-indigo-50 text-indigo-700 border border-indigo-200';
        case 'done': return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
        default: return 'bg-gray-100 text-gray-600';
    }
};

const getRefColor = (type) => {
    return type === 'IN' ? 'text-emerald-600' : 'text-red-600';
};

// Rendering logic
const renderList = (data) => {
    if (data.length === 0) return `<div class="p-8 text-center text-gray-500 bg-white rounded-xl border border-violet-200">No movements found matching criteria.</div>`;

    const rows = data.map(item => `
        <tr class="hover:bg-violet-100/50 transition border-b border-violet-100 last:border-none group">
            <td class="px-5 py-3 whitespace-nowrap">
                <div class="flex items-center gap-2">
                    <i data-lucide="${item.type === 'IN' ? 'arrow-down-left' : 'arrow-up-right'}" class="w-4 h-4 ${getRefColor(item.type)}"></i>
                    <span class="text-sm font-bold ${getRefColor(item.type)}">${item.ref}</span>
                </div>
            </td>
            <td class="px-5 py-3 whitespace-nowrap text-sm text-gray-600">${item.date}</td>
            <td class="px-5 py-3 whitespace-nowrap text-sm font-medium text-gray-800">${item.contact}</td>
            <td class="px-5 py-3 whitespace-nowrap text-sm text-gray-600">${item.product}</td>
            <td class="px-5 py-3 whitespace-nowrap text-sm text-gray-500">${item.from}</td>
            <td class="px-5 py-3 whitespace-nowrap text-sm text-gray-500">
                <div class="flex items-center gap-1">
                    <i data-lucide="arrow-right" class="w-3 h-3 text-gray-300"></i>
                    ${item.to}
                </div>
            </td>
            <td class="px-5 py-3 whitespace-nowrap text-sm font-bold text-gray-800 text-right">${item.quantity}</td>
            <td class="px-5 py-3 whitespace-nowrap text-right">
                <span class="px-2.5 py-1 rounded-md text-xs font-semibold ${getStatusStyles(item.status)}">
                    ${item.status}
                </span>
            </td>
        </tr>
    `).join('');

    return `
        <div class="bg-white rounded-xl shadow-sm border border-violet-200 overflow-hidden flex flex-col min-h-0">
            <div class="overflow-x-auto overflow-y-auto flex-1">
                <table class="w-full text-left border-collapse min-w-[800px]">
                    <thead class="bg-violet-50/50 text-gray-500 text-xs uppercase font-semibold sticky top-0 z-10 shadow-sm">
                        <tr>
                            <th class="px-5 py-3">Reference</th>
                            <th class="px-5 py-3">Date</th>
                            <th class="px-5 py-3">Contact</th>
                            <th class="px-5 py-3">Product</th>
                            <th class="px-5 py-3">From</th>
                            <th class="px-5 py-3">To</th>
                            <th class="px-5 py-3 text-right">Quantity</th>
                            <th class="px-5 py-3 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-violet-100">
                        ${rows}
                    </tbody>
                </table>
            </div>
            <div class="bg-violet-50/50 border-t border-violet-200 px-5 py-3 text-xs text-gray-500 flex justify-between items-center">
                <span>Showing ${data.length} records</span>
                <div class="flex gap-2">
                    <button class="px-2 py-1 rounded hover:bg-violet-200 disabled:opacity-50" disabled>Previous</button>
                    <button class="px-2 py-1 rounded hover:bg-violet-200 disabled:opacity-50" disabled>Next</button>
                </div>
            </div>
        </div>
    `;
};

const renderKanban = (data) => {
    const statuses = ['Draft', 'Ready', 'Done'];

    const columns = statuses.map(status => {
        const items = data.filter(d => d.status === status);
        const cards = items.map(item => `
            <div class="bg-white p-4 rounded-lg shadow-sm border border-violet-200 hover:shadow-md transition cursor-pointer group flex flex-col gap-3">
                <div class="flex justify-between items-start">
                    <div class="flex flex-col">
                        <span class="text-xs font-bold ${getRefColor(item.type)}">${item.ref}</span>
                        <span class="text-[10px] text-gray-400 font-medium">${item.date}</span>
                    </div>
                    <div class="p-1 rounded bg-violet-50 group-hover:bg-violet-100 transition">
                        <i data-lucide="${item.type === 'IN' ? 'arrow-down-left' : 'arrow-up-right'}" class="w-4 h-4 ${getRefColor(item.type)}"></i>
                    </div>
                </div>
                
                <div>
                    <p class="text-sm font-semibold text-gray-800 line-clamp-1">${item.product}</p>
                    <div class="flex justify-between items-end mt-1">
                        <p class="text-xs text-gray-500">Qty: <span class="font-bold text-gray-700">${item.quantity}</span></p>
                        <span class="text-[10px] bg-violet-50 text-gray-600 px-1.5 py-0.5 rounded border border-violet-200">${item.type}</span>
                    </div>
                </div>

                <div class="pt-3 border-t border-violet-100 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <div class="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold">
                            ${item.contact.charAt(0)}
                        </div>
                        <span class="text-xs text-gray-600 font-medium truncate w-24">${item.contact}</span>
                    </div>
                </div>
            </div>
        `).join('');

        return `
            <div class="flex flex-col bg-violet-100/30 rounded-xl p-3 h-full border border-violet-200">
                <div class="flex items-center justify-between mb-3 px-1">
                    <h3 class="text-sm font-bold text-gray-700 uppercase tracking-wider">${status}</h3>
                    <span class="bg-violet-200 text-gray-700 text-xs font-bold px-2 py-0.5 rounded-full">${items.length}</span>
                </div>
                <div class="flex flex-col gap-3 overflow-y-auto flex-1 pr-1 pb-2">
                    ${cards || `<div class="text-center text-xs text-gray-400 py-4 border-2 border-dashed border-violet-200 rounded-lg">No ${status} movements</div>`}
                </div>
            </div>
        `;
    }).join('');

    return `<div class="grid grid-cols-1 md:grid-cols-3 gap-6 h-full min-h-0">${columns}</div>`;
};

// Core Update Function
const updateView = () => {
    // Apply search filter
    const q = state.searchQuery.toLowerCase();
    state.data = initialData.filter(item =>
        item.ref.toLowerCase().includes(q) ||
        item.contact.toLowerCase().includes(q)
    );

    // Render active view
    viewContainer.innerHTML = state.view === 'list'
        ? renderList(state.data)
        : renderKanban(state.data);

    // Re-initialize icons for newly injected HTML
    lucide.createIcons();

    // Update toggle button styles
    if (state.view === 'list') {
        btnListView.className = 'p-1.5 rounded-md text-indigo-600 bg-white shadow-sm transition';
        btnKanbanView.className = 'p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-violet-200/50 transition';
    } else {
        btnKanbanView.className = 'p-1.5 rounded-md text-indigo-600 bg-white shadow-sm transition';
        btnListView.className = 'p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-violet-200/50 transition';
    }

    // Trigger simple fade reflow
    viewContainer.classList.remove('fade-in');
    void viewContainer.offsetWidth; // trigger reflow
    viewContainer.classList.add('fade-in');
};

// Event Listeners
searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    updateView();
});

btnListView.addEventListener('click', () => {
    if (state.view !== 'list') {
        state.view = 'list';
        updateView();
    }
});

btnKanbanView.addEventListener('click', () => {
    if (state.view !== 'kanban') {
        state.view = 'kanban';
        updateView();
    }
});

// Initialize App
updateView();

/*
 * API STRUCTURE NOTE (For Backend Integration):
 * * To achieve this unified ledger with granular row expansion, the Django Backend 
 * should NOT query `StockPicking` (transfer headers). Instead, it must query `StockMove`
 * or `StockMoveLine` (individual items inside a transfer).
 * * Example API Response:
 * GET /api/inventory/moves?status=done&search=WH/IN/0001
 * {
 * "count": 2,
 * "results": [
 * {
 * "id": 1,
 * "reference": "WH/IN/0001",
 * "product_name": "Office Chair",
 * "quantity": 12,
 * "move_type": "IN",
 * "from_location": "Vendor",
 * "to_location": "WH/Stock1",
 * ...
 * },
 * // ...
 * ]
 * }
 */
