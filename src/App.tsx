import React, { useState, useEffect, Suspense } from "react"
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import Sidebar from "./components/Sidebar"
import Topbar from "./components/Topbar"
import backgroundImage from "./assets/vintage thrift shop.jpeg"
// import App from "./App";
import "./index.css"; // ✅ important
// ✅ Lazy load pages
const Login = React.lazy(() => import("./pages/Login.tsx"))
const Signup = React.lazy(() => import("./pages/Signup.tsx"))
const Categories = React.lazy(() => import("./pages/Categories"))
const Customer = React.lazy(() => import("./pages/Customer"))
const POS = React.lazy(() => import("./pages/POS"))
const Sales = React.lazy(() => import("./pages/Sales"))
const Receipt = React.lazy(() => import("./pages/Receipt"))
const ReceiptHistory = React.lazy(() => import("./pages/ReceiptHistory"))
const LastReceipt = React.lazy(() => import("./pages/LastReceipt"))
const Products = React.lazy(() => import("./pages/Products"))
const Wholesalers = React.lazy(() => import("./pages/Wholesalers"))
const SalesHistory = React.lazy(() => import("./pages/SalesHistory"))
const ShiftManagement = React.lazy(() => import("./pages/ShiftManagement"))
const Shop = React.lazy(() => import("./pages/Shop"))

// ✅ Loading Spinner
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen text-amber-500 text-xl font-semibold">
    Loading...
  </div>
)

// ✅ FullScreenCard (for full-screen pages)
interface FullScreenCardProps {
  children: React.ReactNode
}

const FullScreenCard = ({ children }: FullScreenCardProps) => (
  <div className="min-h-screen bg-white dark:bg-gray-900 p-4 md:p-6 lg:p-8">
    {children}
  </div>
)

// ✅ FrostedCard (for consistent blur look - kept for settings)
interface FrostedCardProps {
  children: React.ReactNode
  frostedOverlay: boolean
}

const FrostedCard = ({ children, frostedOverlay }: FrostedCardProps) => (
  <div
    className={`rounded-2xl shadow-lg p-6 border transition-all duration-300 hover:shadow-xl ${
      frostedOverlay
        ? "backdrop-blur-md bg-white/30 dark:bg-gray-800/30 border-white/20 dark:border-gray-700/30"
        : "bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700"
    }`}
  >
    {children}
  </div>
)

// ✅ WelcomeCard
const WelcomeCard = ({ frostedOverlay }: { frostedOverlay: boolean }) => (
  <FrostedCard frostedOverlay={frostedOverlay}>
    <h1 className="text-3xl font-bold mb-4 text-amber-600 dark:text-amber-400">
      Welcome to ThriftPOS
    </h1>
    <p className="text-lg text-gray-700 dark:text-gray-300">
      Manage your sales, customers, and receipts — now with a warm vintage feel ✨
    </p>
  </FrostedCard>
)

// ✅ Reusable toggle component
const Toggle = ({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: () => void
}) => (
  <div className="flex items-center justify-between mb-4">
    <span className="font-medium">{label}</span>
    <label className="flex items-center cursor-pointer">
      <input type="checkbox" className="hidden" checked={checked} onChange={onChange} />
      <div
        className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 ${
          checked ? "bg-amber-600" : "bg-amber-200"
        }`}
      >
        <div
          className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${
            checked ? "translate-x-6" : ""
          }`}
        />
      </div>
    </label>
  </div>
)

// ✅ Admin Profile Form Component
interface AdminProfileFormProps {
  adminUser: AdminUser
  setAdminUser: (user: AdminUser) => void
}

function AdminProfileForm({ adminUser, setAdminUser }: AdminProfileFormProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(adminUser)

  const handleSave = () => {
    setAdminUser(formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData(adminUser)
    setIsEditing(false)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Admin Profile</h3>

      {!isEditing ? (
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
              {adminUser.avatar}
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">{adminUser.firstName} {adminUser.lastName}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">@{adminUser.username}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{adminUser.email}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{adminUser.phone}</p>
              <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">{adminUser.role}</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium"
          >
            ✏️ Edit Profile
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Username
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/\s/g, '') })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-gray-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                First Name
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-gray-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-gray-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-gray-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-gray-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Role
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-gray-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Avatar Initials
              </label>
              <input
                type="text"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value.slice(0, 2).toUpperCase() })}
                maxLength={2}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-gray-200"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
            >
              ✅ Save Changes
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
            >
              ❌ Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ✅ Settings Page
interface SettingsProps {
  darkMode: boolean
  setDarkMode: (value: boolean) => void
  enhancedBg: boolean
  setEnhancedBg: (value: boolean) => void
  frostedOverlay: boolean
  setFrostedOverlay: (value: boolean) => void
  adminUser: AdminUser
  setAdminUser: (user: AdminUser) => void
}

function SettingsPage({
  darkMode,
  setDarkMode,
  enhancedBg,
  setEnhancedBg,
  frostedOverlay,
  setFrostedOverlay,
  adminUser,
  setAdminUser,
}: SettingsProps) {
  return (
    <FrostedCard frostedOverlay={frostedOverlay}>
      <h2 className="text-2xl font-bold mb-6">Settings</h2>

      <div className="space-y-6">
        <AdminProfileForm adminUser={adminUser} setAdminUser={setAdminUser} />

        <hr className="border-gray-200 dark:border-gray-700" />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">App Preferences</h3>

          <Toggle label="🌙 Dark Mode" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
          <Toggle
            label="🖼️ Enhanced Background"
            checked={enhancedBg}
            onChange={() => setEnhancedBg(!enhancedBg)}
          />
          <Toggle
            label="🧊 Frosted Overlay"
            checked={frostedOverlay}
            onChange={() => setFrostedOverlay(!frostedOverlay)}
          />

          <p className="text-sm text-gray-700 dark:text-gray-300">
            Toggle between dark/light theme, enhanced visuals, and frosted overlay for immersive demos.
          </p>
        </div>
      </div>
    </FrostedCard>
  )
}

// ✅ Page title hook
const usePageTitle = () => {
  const location = useLocation()
  useEffect(() => {
    const page = location.pathname === "/" ? "Home" : location.pathname.replace("/", "")
    document.title = `ThriftPOS – ${page.charAt(0).toUpperCase() + page.slice(1)}`
  }, [location])
}

// ✅ Admin User State
interface AdminUser {
  username: string
  firstName: string
  lastName: string
  phone: string
  email: string
  profilePic?: string
  role: string
  avatar: string
}

// ✅ Main Layout
function MainLayout() {
  const { isAuthenticated, logout } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const [darkMode, setDarkMode] = useState(true)
  const [enhancedBg, setEnhancedBg] = useState(false)
  const [frostedOverlay, setFrostedOverlay] = useState(true)
  const [adminUser, setAdminUser] = useState<AdminUser>({
    username: "janedoe",
    firstName: "Jane",
    lastName: "Doe",
    phone: "+254712345678",
    email: "admin@thriftpos.com",
    profilePic: "",
    role: "Admin",
    avatar: "JD"
  })

  usePageTitle()

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode)
  }, [darkMode])

  const handleLogout = () => {
    logout()
  }

  if (!isAuthenticated) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </Suspense>
    )
  }

  return (
    <div
      className="flex min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Background Frosted Overlay */}
      {frostedOverlay && (
        <div
          className={`absolute inset-0 transition-colors duration-500 backdrop-blur-sm ${
            darkMode
              ? enhancedBg
                ? "bg-gray-900/40"
                : "bg-gray-900/55"
              : enhancedBg
              ? "bg-amber-50/15"
              : "bg-amber-50/35"
          }`}
        />
      )}

      {/* Main UI */}
      <div className="relative z-10 flex w-full">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} darkMode={darkMode} adminUser={adminUser} />

        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            collapsed ? "ml-16" : "ml-56"
          }`}
        >
          {/* ✅ Topbar now integrated */}
          <Topbar
                collapsed={collapsed}
                 setCollapsed={setCollapsed}
               darkMode={darkMode}
               setDarkMode={setDarkMode}
               onLogout={handleLogout}
            />

          {/* <Topbar collapsed={collapsed} setCollapsed={setCollapsed} darkMode={darkMode} /> */}

          {/* ✅ Main content */}
          <main className="p-6 relative z-10 space-y-6">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<WelcomeCard frostedOverlay={frostedOverlay} />} />
                <Route
                  path="/shop"
                  element={
                    <FullScreenCard>
                      <Shop />
                    </FullScreenCard>
                  }
                />
                <Route
                  path="/categories"
                  element={
                    <FullScreenCard>
                      <Categories />
                    </FullScreenCard>
                  }
                />
                <Route
                  path="/customers"
                  element={
                    <FullScreenCard>
                      <Customer />
                    </FullScreenCard>
                  }
                />
                <Route
                  path="/pos"
                  element={
                    <FullScreenCard>
                      <POS />
                    </FullScreenCard>
                  }
                />
                <Route
                  path="/sales"
                  element={
                    <FullScreenCard>
                      <Sales />
                    </FullScreenCard>
                  }
                />
                <Route
                  path="/receipt"
                  element={
                    <FullScreenCard>
                      <Receipt />
                    </FullScreenCard>
                  }
                />
                <Route
                  path="/receipt-history"
                  element={
                    <FullScreenCard>
                      <ReceiptHistory />
                    </FullScreenCard>
                  }
                />
                <Route
                  path="/last-receipt"
                  element={
                    <FullScreenCard>
                      <LastReceipt />
                    </FullScreenCard>
                  }
                />
                <Route
                  path="/products"
                  element={
                    <FullScreenCard>
                      <Products />
                    </FullScreenCard>
                  }
                />
                <Route
                  path="/wholesalers"
                  element={
                    <FullScreenCard>
                      <Wholesalers />
                    </FullScreenCard>
                  }
                />
                <Route
                  path="/sales-history"
                  element={
                    <FullScreenCard>
                      <SalesHistory />
                    </FullScreenCard>
                  }
                />
                <Route
                  path="/shift-management"
                  element={
                    <FullScreenCard>
                      <ShiftManagement />
                    </FullScreenCard>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <SettingsPage
                      darkMode={darkMode}
                      setDarkMode={setDarkMode}
                      enhancedBg={enhancedBg}
                      setEnhancedBg={setEnhancedBg}
                      frostedOverlay={frostedOverlay}
                      setFrostedOverlay={setFrostedOverlay}
                      adminUser={adminUser}
                      setAdminUser={setAdminUser}
                    />
                  }
                />
              </Routes>
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  )
}

// ✅ Root App
function App() {
  return (
    <AuthProvider>
      <Router>
        <MainLayout />
      </Router>
    </AuthProvider>
  )
}

export default App
