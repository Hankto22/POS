# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
## 📁 `frontend/README.md`

```md
# Royal Gibs Boutique — Frontend

This is the frontend for Royal Gibs Boutique's POS and dashboard system, built with React, Tailwind CSS, and Chart.js. It supports offline sales, receipt printing, analytics, and customer engagement.

## 🏗️ Folder Structure

```
src/
├── pages/            # Main views
│   ├── POS.tsx
│   ├── Customers.tsx
│   ├── Sales.tsx
│   ├── Dashboard.tsx
│   ├── LastReceipt.tsx
│   └── ReceiptHistory.tsx
├── components/       # UI components
│   └── Receipt.tsx
├── services/         # Axios API wrappers
│   └── api.ts
├── hooks/            # Custom hooks
│   └── useSync.ts
├── utils/            # IndexedDB helpers
│   └── db.ts
└── main.tsx          # App entry point
```

## 🚀 Setup

1. Clone the repo
2. Install dependencies: `npm install` or `pnpm install`
3. Start dev server: `npm run dev` or `pnpm dev`
4. Ensure backend is running at `localhost:8000` (API base URL configured in src/services/api.ts)

## 🧠 Current Implementation Status

### ✅ **Fully Implemented & Working**

#### POS System (`src/pages/POS.tsx`)
- **Product Management**: Barcode scanning, product search, and cart management
- **Inventory Control**: Real-time stock validation prevents overselling
- **Customer Integration**: Customer selection with loyalty program support
- **Discount System**: Multiple discount codes (SAVE10, SAVE20, LOYALTY5, BULK15)
- **Tax Calculation**: Automatic 16% VAT calculation for Kenya
- **Payment Processing**: Cash, Card, M-Pesa, and mixed payment methods
- **Receipt Generation**: Printable receipts and PDF export with branding
- **Offline Support**: IndexedDB storage with automatic sync when online

#### Business Logic Features
- Stock validation before sales completion
- Dynamic pricing with discount and tax calculations
- Customer loyalty discounts for returning customers
- Bulk purchase discounts (15% for 5+ items)
- Payment change calculation and validation
- Comprehensive error handling and user feedback

#### Technical Features
- **Offline-First Architecture**: Works without internet using IndexedDB
- **PWA Ready**: Service worker and manifest for mobile installation
- **Responsive Design**: Works on desktop, tablet, and mobile
- **TypeScript**: Full type safety throughout the application
- **Modern UI**: Tailwind CSS with dark mode support

### 🔄 **API Integration Ready**
- Axios-based API client configured for backend communication
- CRUD operations for products, customers, sales, categories, wholesalers
- Automatic offline-to-online sync for sales data

### 📱 **PWA Features**
- Installable on mobile devices
- Offline functionality with data sync
- Service worker for caching and offline shell

## 📦 Features

- ✅ POS terminal with complete cart and checkout system
- ✅ Customer profiles with loyalty points tracking
- ✅ Sales history and receipt printing/PDF export
- ✅ Offline support with IndexedDB + automatic sync
- ✅ Multiple payment methods (Cash, Card, M-Pesa, Mixed)
- ✅ Discount codes and promotional system
- ✅ PWA installable on mobile/tablet
- ✅ Real-time inventory management
- ✅ Tax calculation (Kenya VAT 16%)
- ✅ Receipt generation with QR codes

## 🛠️ Tech Stack

- React 19 + Vite (fast development and building)
- TypeScript (type safety)
- Tailwind CSS (responsive styling)
- Axios (API communication)
- IndexedDB (via idb) (offline storage)
- jsPDF + jspdf-autotable (PDF receipts)
- Service Worker + Manifest (PWA)
- React Router (navigation)
- Chart.js + react-chartjs-2 (analytics - ready for dashboard)

```
## file structure 
frontend/
├── public/
│   ├── manifest.json         # PWA manifest
│   └── service-worker.js     # Offline shell
├── src/
│   ├── main.tsx              # App entry point
│   ├── App.tsx               # Router + layout
│   ├── pages/
│   │   ├── POS.tsx           # POS terminal
│   │   ├── Customers.tsx     # Customer list
│   │   ├── Sales.tsx         # Sales history
│   │   ├── Dashboard.tsx     # Analytics + charts
│   │   ├── LastReceipt.tsx   # View last receipt
│   │   └── ReceiptHistory.tsx# Full receipt history
│   ├── components/
│   │   └── Receipt.tsx       # Receipt UI + PDF export
│   ├── services/
│   │   └── api.ts            # Axios wrappers
│   ├── hooks/
│   │   └── useSync.ts        # Offline sync logic
│   ├── utils/
│   │   └── db.ts             # IndexedDB helpers
├── assets/
│   ├── icon-192.png          # PWA icon
│   └── sample images         # Product images
├── .env                      # API base URL
├── tsconfig.json
└── README.md                 # Frontend documentation
---


---

// import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import Categories from './pages/Categories'
import Customer from './pages/Customer'
import LastReceipt from './pages/LastReceipt'
import POS from './pages/POS'
import Receipt from './pages/Receipt'
import ReceiptHistory from './pages/ReceiptHistory'
import Sales from './pages/Sales'
import { useState } from 'react'

const navLinks = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/categories', label: 'Categories', icon: '📦' },
  { to: '/customers', label: 'Customers', icon: '👤' },
  { to: '/pos', label: 'POS', icon: '🛒' },
  { to: '/sales', label: 'Sales', icon: '💰' },
  { to: '/receipt', label: 'Receipt', icon: '🧾' },
  { to: '/receipt-history', label: 'Receipt History', icon: '📜' },
  { to: '/last-receipt', label: 'Last Receipt', icon: '⏮️' },
]

function Sidebar({ logs }: { logs: string[] }) {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  return (
    <aside className={`bg-gray-900 text-gray-100 w-64 min-h-screen flex flex-col shadow-lg transition-transform duration-200 z-20 ${open ? 'translate-x-0' : '-translate-x-64'} md:translate-x-0 fixed md:static`}>
      <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-800">
        <span className="text-2xl">🛍️</span>
        <span className="font-bold text-lg tracking-wide">Boutique MS</span>
        <button className="ml-auto md:hidden" onClick={() => setOpen(false)} title="Close sidebar">✖️</button>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navLinks.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors duration-150 ${location.pathname === link.to ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 hover:text-blue-400'}`}
            onClick={() => setOpen(false)}
          >
            <span className="text-lg">{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="px-4 py-3 border-t border-gray-800 bg-gray-950 text-xs h-24 overflow-y-auto">
        <div className="font-semibold mb-1 text-blue-400">Logs</div>
        {logs.length === 0 ? <div className="text-gray-500">No logs yet.</div> : logs.map((log, i) => <div key={i}>{log}</div>)}
      </div>
      <button className="absolute top-4 left-4 md:hidden bg-gray-800 text-gray-100 rounded p-1" onClick={() => setOpen(!open)} title="Open sidebar">☰</button>
    </aside>
  )
}

function MainLayout() {
  const [logs, setLogs] = useState<string[]>([])
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar logs={logs} />
      <div className="flex-1 ml-0 md:ml-64 transition-all duration-200">
        <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
          <div className="w-full max-w-3xl p-6">
            <Routes>
              <Route path="/" element={<h1 className="text-3xl md:text-5xl font-bold text-center mt-16 text-gray-900">Welcome to <br />Boutique Management System</h1>} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/customers" element={<Customer />} />
              <Route path="/pos" element={<POS />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/receipt" element={<Receipt />} />
              <Route path="/receipt-history" element={<ReceiptHistory />} />
              <Route path="/last-receipt" element={<LastReceipt />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  )
}

export default App
