import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  variant?: "default" | "success" | "warning" | "destructive";
}

const variantClasses = {
  default: "border-l-primary",
  success: "border-l-success",
  warning: "border-l-warning",
  destructive: "border-l-destructive",
};

const iconVariantClasses = {
  default: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  destructive: "bg-destructive/10 text-destructive",
};

export default function StatCard({ title, value, icon: Icon, trend, variant = "default" }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`stat-card border-l-4 ${variantClasses[variant]}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-muted-foreground text-sm">{title}</p>
          <p className="text-2xl font-bold mt-1 text-foreground">{value}</p>
          {trend && (
            <p className={`text-xs mt-1 ${trend.value >= 0 ? "text-success" : "text-destructive"}`}>
              {trend.value >= 0 ? "↑" : "↓"} {Math.abs(trend.value)}% {trend.label}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${iconVariantClasses[variant]}`}>
          <Icon size={22} />
        </div>
      </div>
    </motion.div>
  );
}
