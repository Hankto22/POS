import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface TopbarProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  onLogout?: () => void;
}

const Topbar: React.FC<TopbarProps> = ({
  collapsed,
  setCollapsed,
  darkMode,
  setDarkMode,
  onLogout,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  // 🧭 Convert route path to a readable title
  const pathToTitle = (path: string) => {
    switch (path) {
      case "/":
        return "Home";
      case "/categories":
        return "Categories";
      case "/customers":
        return "Customers";
      case "/pos":
        return "Point of Sale";
      case "/sales":
        return "Sales";
      case "/receipt":
        return "Receipt";
      case "/receipt-history":
        return "Receipt History";
      case "/last-receipt":
        return "Last Receipt";
      case "/settings":
        return "Settings";
      default:
        return "Dashboard";
    }
  };

  const title = pathToTitle(location.pathname);

  return (
    <header
      className={`
        sticky top-0 z-30 flex items-center justify-between px-6 py-3 shadow-lg border-b
        backdrop-blur-md transition-all duration-300
        ${
          darkMode
            ? "bg-gray-900/60 border-gray-800/50 text-gray-100"
            : "bg-amber-50/70 border-amber-200/50 text-gray-900"
        }
      `}
    >
      {/* Left section: collapse button + title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-full bg-amber-500 text-white hover:bg-amber-600 transition"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? "➡️" : "⬅️"}
        </button>
        <h1 className="text-lg md:text-xl font-bold tracking-wide">{title}</h1>
      </div>

      {/* Right section: search, mode toggle, avatar */}
      <div className="flex items-center gap-4">
        {/* Search bar (visible on md+) */}
        <div className="hidden md:block">
          <input
            type="text"
            placeholder="Search..."
            className={`rounded-lg px-3 py-1.5 text-sm focus:outline-none shadow-sm transition
              ${
                darkMode
                  ? "bg-gray-800/80 text-gray-200 placeholder-gray-400"
                  : "bg-white/70 text-gray-800 placeholder-gray-500"
              }`}
          />
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all shadow-sm
            ${
              darkMode
                ? "bg-gray-800/80 hover:bg-gray-700"
                : "bg-amber-200/80 hover:bg-amber-300"
            }`}
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>

        {/* Logout Button */}
        {onLogout && (
          <button
            onClick={() => {
              onLogout();
              navigate('/login');
            }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all shadow-sm
              ${darkMode
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-red-500 hover:bg-red-600 text-white"
              }`}
          >
            🚪 Logout
          </button>
        )}

        {/* Avatar */}
        <div
          className={`rounded-full font-bold flex items-center justify-center text-white shadow-md
            ${darkMode ? "bg-amber-500" : "bg-amber-600"} w-9 h-9`}
        >
          JD
        </div>
      </div>
    </header>
  );
};

export default Topbar;
