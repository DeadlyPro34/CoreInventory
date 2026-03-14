// --- 1. Business Logic & Mock Data Generation ---

// Helper to generate dates relative to today
const getRelativeDate = (daysOffset) => {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    date.setHours(0, 0, 0, 0);
    return date;
};

const today = getRelativeDate(0);

// Mocking the database state to perfectly match your wireframe request
const dbOperations = [
    // --- RECEIPTS ---
    { id: 'REC-001', type: 'receipt', schedule_date: getRelativeDate(-2), status: 'pending', stock_available: true },
    { id: 'REC-002', type: 'receipt', schedule_date: today, status: 'pending', stock_available: true },
    { id: 'REC-003', type: 'receipt', schedule_date: today, status: 'pending', stock_available: true },
    { id: 'REC-004', type: 'receipt', schedule_date: today, status: 'pending', stock_available: true },
    { id: 'REC-005', type: 'receipt', schedule_date: today, status: 'pending', stock_available: true },
    { id: 'REC-006', type: 'receipt', schedule_date: getRelativeDate(2), status: 'pending', stock_available: true },
    { id: 'REC-007', type: 'receipt', schedule_date: getRelativeDate(2), status: 'pending', stock_available: true },
    { id: 'REC-008', type: 'receipt', schedule_date: getRelativeDate(3), status: 'pending', stock_available: true },
    { id: 'REC-009', type: 'receipt', schedule_date: getRelativeDate(4), status: 'pending', stock_available: true },
    { id: 'REC-010', type: 'receipt', schedule_date: getRelativeDate(5), status: 'pending', stock_available: true },
    { id: 'REC-011', type: 'receipt', schedule_date: getRelativeDate(6), status: 'pending', stock_available: true },

    // --- DELIVERIES ---
    { id: 'DEL-001', type: 'delivery', schedule_date: getRelativeDate(-1), status: 'pending', stock_available: true },
    { id: 'DEL-002', type: 'delivery', schedule_date: today, status: 'pending', stock_available: true },
    { id: 'DEL-003', type: 'delivery', schedule_date: today, status: 'pending', stock_available: true },
    { id: 'DEL-004', type: 'delivery', schedule_date: today, status: 'pending', stock_available: true },
    { id: 'DEL-005', type: 'delivery', schedule_date: today, status: 'pending', stock_available: true },
    { id: 'DEL-006', type: 'delivery', schedule_date: today, status: 'pending', stock_available: false },
    { id: 'DEL-007', type: 'delivery', schedule_date: today, status: 'pending', stock_available: false },
    { id: 'DEL-008', type: 'delivery', schedule_date: getRelativeDate(3), status: 'pending', stock_available: true },
    { id: 'DEL-009', type: 'delivery', schedule_date: getRelativeDate(3), status: 'pending', stock_available: true },
    { id: 'DEL-010', type: 'delivery', schedule_date: getRelativeDate(4), status: 'pending', stock_available: true },
    { id: 'DEL-011', type: 'delivery', schedule_date: getRelativeDate(4), status: 'pending', stock_available: true },
    { id: 'DEL-012', type: 'delivery', schedule_date: getRelativeDate(5), status: 'pending', stock_available: true },
    { id: 'DEL-013', type: 'delivery', schedule_date: getRelativeDate(5), status: 'pending', stock_available: true },
];

// Core logic calculator simulating Django backend calculations
function calculateDashboardStats() {
    const stats = {
        receipts: { toAction: 0, late: 0, operations: 0 },
        deliveries: { toAction: 0, late: 0, waiting: 0, operations: 0 }
    };

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    dbOperations.forEach(op => {
        const opDate = op.schedule_date;
        
        if (op.type === 'receipt') {
            if (opDate < now) stats.receipts.late++;
            else if (opDate.getTime() === now.getTime()) stats.receipts.toAction++;
            else if (opDate > now) stats.receipts.operations++;
        } 
        else if (op.type === 'delivery') {
            if (op.stock_available === false) {
                stats.deliveries.waiting++;
            } else {
                if (opDate < now) stats.deliveries.late++;
                else if (opDate.getTime() === now.getTime()) stats.deliveries.toAction++;
                else if (opDate > now) stats.deliveries.operations++;
            }
        }
    });

    return stats;
}

// --- 2. View Rendering Functions ---

const container = document.getElementById('app-container');

function renderDashboard() {
    const stats = calculateDashboardStats();
    
    container.innerHTML = `
        <div class="mb-8 fade-in">
            <h2 class="text-3xl font-bold text-theme-dark tracking-tight">Operations Overview</h2>
            <p class="text-theme-gray mt-2 flex items-center gap-2">
                <i data-lucide="calendar" class="w-4 h-4 text-theme-primary"></i>
                Workload for ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Card 1: Receipts -->
            <div class="bg-theme-white border border-theme-secondary rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm hover:shadow-md hover:border-theme-primary transition-all relative overflow-hidden group">
                
                <div class="w-full sm:w-auto relative z-10">
                    <div class="flex items-center gap-3 mb-5 text-theme-dark">
                        <div class="p-2 bg-theme-light rounded-lg text-theme-primary">
                            <i data-lucide="download" class="w-5 h-5"></i>
                        </div>
                        <h3 class="text-xl font-bold">Receipt</h3>
                    </div>
                    
                    <!-- Primary Action Button -->
                    <button onclick="navigate('receipts')" class="w-full sm:w-auto group/btn flex items-center gap-4 bg-theme-primary hover:bg-theme-dark py-3 px-6 rounded-xl transition-all shadow-md active:scale-95">
                        <span class="text-3xl font-bold text-theme-white group-hover/btn:scale-110 transition-transform">${stats.receipts.toAction}</span>
                        <span class="text-sm font-semibold text-theme-secondary uppercase tracking-widest text-left leading-tight">
                            To<br/>Receive
                        </span>
                    </button>
                </div>

                <!-- Quick Statistics Panel -->
                <div class="w-full sm:w-auto flex flex-col gap-3 relative z-10 sm:min-w-[160px]">
                    <div class="flex items-center justify-between sm:justify-end gap-4 p-3 rounded-lg bg-theme-light border border-theme-secondary/50">
                        <span class="text-sm font-semibold text-theme-gray">Late</span>
                        <div class="flex items-center gap-1.5 text-red-600">
                            <i data-lucide="alert-circle" class="w-4 h-4"></i>
                            <span class="text-lg font-bold">${stats.receipts.late}</span>
                        </div>
                    </div>
                    <div class="flex items-center justify-between sm:justify-end gap-4 p-3 rounded-lg bg-theme-light border border-theme-secondary/50">
                        <span class="text-sm font-semibold text-theme-gray">Operations</span>
                        <div class="flex items-center gap-1.5 text-theme-primary">
                            <i data-lucide="clock" class="w-4 h-4"></i>
                            <span class="text-lg font-bold">${stats.receipts.operations}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Card 2: Delivery -->
            <div class="bg-theme-white border border-theme-secondary rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm hover:shadow-md hover:border-theme-primary transition-all relative overflow-hidden group">

                <div class="w-full sm:w-auto relative z-10">
                    <div class="flex items-center gap-3 mb-5 text-theme-dark">
                        <div class="p-2 bg-theme-light rounded-lg text-theme-primary">
                            <i data-lucide="upload" class="w-5 h-5"></i>
                        </div>
                        <h3 class="text-xl font-bold">Delivery</h3>
                    </div>
                    
                    <!-- Primary Action Button -->
                    <button onclick="navigate('deliveries')" class="w-full sm:w-auto group/btn flex items-center gap-4 bg-theme-primary hover:bg-theme-dark py-3 px-6 rounded-xl transition-all shadow-md active:scale-95">
                        <span class="text-3xl font-bold text-theme-white group-hover/btn:scale-110 transition-transform">${stats.deliveries.toAction}</span>
                        <span class="text-sm font-semibold text-theme-secondary uppercase tracking-widest text-left leading-tight">
                            To<br/>Deliver
                        </span>
                    </button>
                </div>

                <!-- Quick Statistics Panel -->
                <div class="w-full sm:w-auto flex flex-col gap-3 relative z-10 sm:min-w-[160px]">
                    <div class="flex items-center justify-between sm:justify-end gap-4 p-2.5 rounded-lg bg-theme-light border border-theme-secondary/50">
                        <span class="text-sm font-semibold text-theme-gray">Late</span>
                        <div class="flex items-center gap-1.5 text-red-600">
                            <i data-lucide="alert-circle" class="w-4 h-4"></i>
                            <span class="text-lg font-bold">${stats.deliveries.late}</span>
                        </div>
                    </div>
                    <div class="flex items-center justify-between sm:justify-end gap-4 p-2.5 rounded-lg bg-theme-light border border-theme-secondary/50">
                        <span class="text-sm font-semibold text-theme-gray">Waiting</span>
                        <div class="flex items-center gap-1.5 text-amber-500">
                            <i data-lucide="loader" class="w-4 h-4"></i>
                            <span class="text-lg font-bold">${stats.deliveries.waiting}</span>
                        </div>
                    </div>
                    <div class="flex items-center justify-between sm:justify-end gap-4 p-2.5 rounded-lg bg-theme-light border border-theme-secondary/50">
                        <span class="text-sm font-semibold text-theme-gray">Operations</span>
                        <div class="flex items-center gap-1.5 text-theme-primary">
                            <i data-lucide="clock" class="w-4 h-4"></i>
                            <span class="text-lg font-bold">${stats.deliveries.operations}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    lucide.createIcons(); // Re-initialize icons in injected HTML
}

function renderPlaceholder(title, iconName) {
    container.innerHTML = `
        <div class="h-[60vh] flex flex-col items-center justify-center text-center fade-in">
            <div class="w-20 h-20 bg-theme-light rounded-full flex items-center justify-center mb-6 border border-theme-secondary shadow-sm">
                <i data-lucide="${iconName}" class="w-10 h-10 text-theme-primary"></i>
            </div>
            <h2 class="text-2xl font-bold text-theme-dark mb-2">${title} View</h2>
            <p class="text-theme-gray max-w-md">This is a placeholder for the ${title} page. In the final Django integration, this route will load the respective list view or configuration panel.</p>
            <button onclick="navigate('dashboard')" class="mt-8 text-theme-primary hover:text-theme-dark font-medium flex items-center gap-2 transition-colors">
                <i data-lucide="arrow-left" class="w-4 h-4"></i> Back to Dashboard
            </button>
        </div>
    `;
    lucide.createIcons();
}

// --- 3. Interaction & Navigation Logic ---

function navigate(route) {
    const isRoot = window.location.pathname.endsWith('dashboard.html') || window.location.pathname.endsWith('/');
    
    // If we're already on dashboard and requesting dashboard, just render it (no reload)
    if (route === 'dashboard' && isRoot) {
        renderDashboard();
        return;
    }

    // Route mapping to actual files
    const routes = {
        'dashboard': isRoot ? 'dashboard.html' : '../dashboard.html',
        'receipts': isRoot ? 'pages/receipts.html' : 'receipts.html',
        'deliveries': isRoot ? 'pages/deliveries.html' : 'deliveries.html',
        'stock': isRoot ? 'pages/stock.html' : 'stock.html',
        'history': isRoot ? 'pages/history.html' : 'history.html',
        'warehouses': isRoot ? 'pages/warehouse.html' : 'warehouse.html',
        'locations': isRoot ? 'pages/locations.html' : 'locations.html',
        'products': isRoot ? 'pages/products.html' : 'products.html',
        'adjustments': 'javascript:void(0)' // Placeholder
    };

    if (routes[route]) {
        // If smoothNavigate is available (from transitions.js), use it
        if (window.smoothNavigate) {
            window.smoothNavigate(routes[route]);
        } else {
            window.location.href = routes[route];
        }
    }
}

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

// --- 4. Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons(); // Init initial DOM icons
    setupDropdowns();
    setupMobileMenu();
    navigate('dashboard'); // Load default view
});
