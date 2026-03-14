# CoreInventory 🏢📦

**Enterprise-Grade Warehouse & Logistics Management System**

CoreInventory is a modern, unified web application built to solve the complexities of supply chain management. By replacing chaotic spreadsheets with a centralized, real-time database, it offers "Precision at Scale." It acts as a single source of truth for tracking inbound receipts, outbound deliveries, and real-time stock levels across multiple warehouse locations.

---

## 🚀 Key Features

### 🎨 Frontend (UI/UX)
- **Premium Interface:** Built with Tailwind CSS and Vanilla JavaScript for a lightning-fast, smooth, and visually stunning enterprise experience.
- **Interactive Dashboards:** Real-time calculation of daily workloads (Receipts vs. Deliveries) with proactive "Late" and "Waiting" alerts.
- **Dual-View Operations:** Seamlessly toggle between traditional **List Views** for data density and interactive **Kanban Boards** for visual workflow tracking.
- **Glassmorphism & Smooth Animations:** Modern design tokens, custom scrollbars, and fluid page transitions block jarring loads.
- **Mobile Responsive:** Fully responsive sidebar navigation and adaptive grids for tablet and mobile warehouse operators.

### ⚙️ Backend (Architecture)
- **Robust Framework:** Python with Django for secure, scalable routing and complex business logic.
- **ACID-Compliant database:** SQLite integration ensures that no transaction data (like a massive stock update) is ever corrupted or lost, while keeping local development lightweight.
- **Live Stock Validation:** Prevents human error by instantly checking the database before finalizing orders. (e.g., You cannot dispatch 10 laptops if only 5 are in stock).
- **Unified Audit Ledger (Move History):** An un-editable, consolidated trail of every single inbound and outbound stock movement for 100% accountability.

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, Tailwind CSS, Vanilla JavaScript, Lucide Icons.
- **Backend:** Python, Django, Django REST Framework (DRF).
- **Database:** SQLite (Default for Django).

---

## 📂 Project Structure

```text
CoreInventory/
│
├── frontend/                   # 🎨 UI & Client-side Logic (Static)
│   ├── index.html              # Secure Login/Authentication Portal
│   ├── dashboard.html          # Main Operations Overview
│   ├── pages/                  # All functional modules
│   │   ├── receipts.html       # Inbound Stock Management
│   │   ├── deliveries.html     # Outbound Stock Management
│   │   ├── stock.html          # Real-time Inventory Levels
│   │   ├── history.html        # Unified Audit Ledger
│   │   ├── warehouse.html      # Infrastructure setup
│   │   └── locations.html      # Zone/Shelf mapping
│   ├── css/                    # Tailwind configs & custom styles
│   └── js/                     # Client-side routing, mock data & transitions
│
└── coreinventory-backend/      # ⚙️ Django Server Architecture
    ├── coreinventory/          # Main REST API settings
    ├── apps/
    │   ├── users/              # Operator Authentication & Auth tokens
    │   ├── warehouse/          # Physical facility mapping
    │   ├── products/           # Master Catalog & SKUs
    │   ├── inventory/          # Transaction core (Receipts & Deliveries)
    │   └── history/            # Automated Audit Logging
    └── utils/                  # Scripts & validators
```

---

## 🧩 Core Modules Explained

1. **🔒 Security & Auth:**
   Enterprise data requires strict access control. The portal sits behind a secure login barrier. Future implementations will use JWT (JSON Web Tokens) for session management.

2. **📊 Master Dashboard:**
   The "Operation Center." Summarizes pending workloads. Flags overdue tasks in red and calculates pending operations instantly.

3. **📥 Receipts (Inbound) & 📤 Deliveries (Outbound):**
   The heart of the logistics engine. Manage incoming stock from vendors or outgoing shipments to customers. Features live stock validation.

4. **🏗️ Infrastructure Data:**
   Setup module to digitally map physical space. Define parent `Warehouses` and track items down to specific granular `Locations` (e.g., Aisle 4, Shelf B).

5. **📜 Move History (Ledger):**
   The ultimate accountability tool. Automatically logs every finalized transaction. Green entries denote stock additions, red entries denote stock deductions.

---

## 💻 Getting Started (Local Development)

*(Note: Ensure Python and Node.js are installed on your machine).*

### 1. Frontend Setup
The frontend is currently built using CDN links for Tailwind and Icons, meaning it runs directly in the browser without node modules.
- Navigate to the `frontend/` folder.
- Open `index.html` in any modern web browser to start exploring the UI.

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd coreinventory-backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run migrations to build the database schema:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```
5. Start the development server:
   ```bash
   python manage.py runserver
   ```

---
*Developed with focus on beautiful UI and robust data integrity.* 🚀
