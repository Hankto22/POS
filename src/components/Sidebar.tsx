import React from "react"
import { Link, useLocation } from "react-router-dom"

// ✅ Define navigation links in one place
const navLinks = [
  { to: "/", label: "Home", icon: "🏠" },
  { to: "/categories", label: "Categories", icon: "📦" },
  { to: "/customers", label: "Customers", icon: "👤" },
  { to: "/pos", label: "POS", icon: "🛒" },
  { to: "/sales", label: "Sales", icon: "💰" },
  { to: "/receipt", label: "Receipt", icon: "🧾" },
  { to: "/receipt-history", label: "Receipt History", icon: "📜" },
  { to: "/last-receipt", label: "Last Receipt", icon: "⏮️" },
  { to: "/settings", label: "Settings", icon: "⚙️" },
]

// ✅ Sidebar Props
interface SidebarProps {
  collapsed: boolean
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>
  darkMode: boolean
  adminUser: { firstName: string; lastName: string; role: string; avatar: string }
}

// ✅ Sidebar Component
const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed, darkMode, adminUser }) => {
  const location = useLocation()

  // Hide "Settings" from main nav section — we’ll render it separately at the bottom
  const linksToShow = navLinks.filter(link => link.to !== "/settings")

  return (
    <aside
      className={`
        fixed top-0 left-0 h-screen flex flex-col shadow-lg transition-all duration-300
        ${collapsed ? "w-16" : "w-56"}
        ${darkMode
          ? "bg-gray-900/85 text-gray-100 border-gray-800/50"
          : "bg-amber-50/85 text-gray-900 border-amber-200/50"}
        backdrop-blur-sm border-r
      `}
    >
      {/* Collapse Button */}
      <button
        className={`
          absolute top-3 right-2 rounded p-1 z-30 backdrop-blur-sm shadow-md hover:scale-105 transition-transform
          ${darkMode ? "bg-gray-800/90 text-gray-100" : "bg-amber-100/90 text-gray-800"}
        `}
        onClick={() => setCollapsed(!collapsed)}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? "➡️" : "⬅️"}
      </button>

      {/* User Info */}
      <div
        className={`
          flex flex-col items-center gap-2 px-4 py-5 border-b
          ${darkMode ? "border-gray-800/50" : "border-amber-200/50"}
        `}
      >
        <div
          className={`
            bg-gradient-to-br from-amber-400 to-amber-600 text-white rounded-full flex items-center justify-center font-bold
            ${collapsed ? "w-8 h-8 text-sm" : "w-12 h-12 text-lg"}
          `}
        >
          {adminUser.avatar}
        </div>

        {!collapsed && (
          <div className="text-center">
            <div className="font-bold text-sm">{adminUser.firstName} {adminUser.lastName}</div>
            <div className="text-xs opacity-70">{adminUser.role}</div>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 flex flex-col gap-1 px-2 mt-4 overflow-y-auto">
        {linksToShow.map(link => {
          const isActive = location.pathname === link.to
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`
                flex items-center gap-3 px-3 py-3 rounded-lg font-medium text-sm transition-all
                ${collapsed ? "justify-center" : ""}
                ${
                  isActive
                    ? darkMode
                      ? "bg-gray-800/80 font-bold shadow-md"
                      : "bg-amber-100/80 font-bold shadow-md"
                    : `hover:scale-[1.02] hover:${
                        darkMode ? "text-amber-400" : "text-amber-800"
                      } hover:bg-black/5`
                }
              `}
              title={collapsed ? link.label : undefined}
            >
              <span className="text-xl min-w-[1.5rem] text-center">{link.icon}</span>
              {!collapsed && <span className="truncate">{link.label}</span>}
            </Link>
          )
        })}

        {/* Settings Link — Always Last */}
        <div
          className={`mt-auto border-t pt-2 ${
            darkMode ? "border-gray-800/50" : "border-amber-200/50"
          }`}
        >
          <Link
            to="/settings"
            className={`
              flex items-center gap-3 px-3 py-3 rounded-lg font-medium text-sm transition-all
              ${collapsed ? "justify-center" : ""}
              ${
                location.pathname === "/settings"
                  ? darkMode
                    ? "bg-gray-800/80 font-bold shadow-md"
                    : "bg-amber-100/80 font-bold shadow-md"
                  : `hover:scale-[1.02] hover:${
                      darkMode ? "text-amber-400" : "text-amber-800"
                    } hover:bg-black/5`
              }
            `}
            title={collapsed ? "Settings" : undefined}
          >
            <span className="text-xl min-w-[1.5rem] text-center">⚙️</span>
            {!collapsed && <span className="truncate">Settings</span>}
          </Link>
        </div>
      </nav>
    </aside>
  )
}

export default Sidebar
