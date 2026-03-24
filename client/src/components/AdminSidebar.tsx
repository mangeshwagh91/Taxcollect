import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Building2, Map, UserX, Bot, BarChart3, Bell, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/admin/properties", icon: Building2, label: "Properties" },
  { to: "/admin/map", icon: Map, label: "GIS Map" },
  { to: "/admin/defaulters", icon: UserX, label: "Defaulters" },
  { to: "/admin/chatbot", icon: Bot, label: "AI Chatbot" },
  { to: "/admin/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/admin/notifications", icon: Bell, label: "Notifications" },
];

export default function AdminSidebar() {
  const { logout, user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.2 }}
      className="h-screen bg-sidebar flex flex-col border-r border-sidebar-border sticky top-0"
    >
      <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
        <AnimatePresence>
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col">
              <span className="text-sidebar-primary font-bold text-lg">SPTIP</span>
              <span className="text-sidebar-foreground/50 text-xs">Admin Panel</span>
            </motion.div>
          )}
        </AnimatePresence>
        <button onClick={() => setCollapsed(!collapsed)} className="text-sidebar-foreground/50 hover:text-sidebar-foreground p-1">
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const isActive = link.end ? location.pathname === link.to : location.pathname.startsWith(link.to);
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={`sidebar-link ${isActive ? "sidebar-link-active" : ""}`}
              title={collapsed ? link.label : undefined}
            >
              <link.icon size={20} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {link.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        {!collapsed && (
          <div className="px-4 py-2 mb-2">
            <p className="text-sidebar-foreground text-sm font-medium truncate">{user?.name}</p>
            <p className="text-sidebar-foreground/50 text-xs truncate">{user?.email}</p>
          </div>
        )}
        <button onClick={logout} className="sidebar-link w-full text-destructive/80 hover:text-destructive" title="Logout">
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
}
