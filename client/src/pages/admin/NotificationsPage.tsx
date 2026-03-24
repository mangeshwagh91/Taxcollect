import { useState } from "react";
import { motion } from "framer-motion";
import { notifications as mockNotifications } from "@/data/mockData";
import { Bell, AlertTriangle, Info, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const iconMap = {
  warning: AlertTriangle,
  info: Info,
  success: CheckCircle2,
};

const colorMap = {
  warning: "text-warning bg-warning/10",
  info: "text-primary bg-primary/10",
  success: "text-success bg-success/10",
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);

  const markRead = (id: string) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-primary/10"><Bell className="text-primary" size={24} /></div>
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="text-muted-foreground text-sm">{unread} unread alerts</p>
          </div>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="text-sm text-primary hover:underline">Mark all as read</button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.map((n, i) => {
          const Icon = iconMap[n.type];
          return (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => markRead(n.id)}
              className={`glass-card rounded-xl p-4 flex items-start gap-4 cursor-pointer transition-all ${!n.read ? "border-l-4 border-l-primary" : "opacity-70"}`}
            >
              <div className={`p-2 rounded-lg shrink-0 ${colorMap[n.type]}`}><Icon size={18} /></div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{n.title}</h3>
                  {!n.read && <span className="w-2 h-2 rounded-full bg-primary animate-pulse-dot" />}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{n.message}</p>
                <p className="text-xs text-muted-foreground mt-2">{new Date(n.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
