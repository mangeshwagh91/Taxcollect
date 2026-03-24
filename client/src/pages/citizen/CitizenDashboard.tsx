import { motion } from "framer-motion";
import { properties, paymentHistory } from "@/data/mockData";
import StatCard from "@/components/StatCard";
import { Building2, IndianRupee, Clock, CheckCircle2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function CitizenDashboard() {
  const myProperties = properties.slice(0, 3);
  const totalTax = myProperties.reduce((s, p) => s + p.taxAmount, 0);
  const paidAmount = myProperties.filter((p) => p.paymentStatus === "paid").reduce((s, p) => s + p.taxAmount, 0);
  const pendingAmount = totalTax - paidAmount;

  const monthlyData = [
    { month: "Jul", paid: 12000 }, { month: "Aug", paid: 0 }, { month: "Sep", paid: 15000 },
    { month: "Oct", paid: 0 }, { month: "Nov", paid: 18000 }, { month: "Dec", paid: 12000 },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome back!</h1>
        <p className="text-muted-foreground mt-1">Here's your property tax overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="My Properties" value={myProperties.length} icon={Building2} />
        <StatCard title="Total Tax Due" value={`₹${totalTax.toLocaleString()}`} icon={IndianRupee} variant="warning" />
        <StatCard title="Paid" value={`₹${paidAmount.toLocaleString()}`} icon={CheckCircle2} variant="success" />
        <StatCard title="Pending" value={`₹${pendingAmount.toLocaleString()}`} icon={Clock} variant="destructive" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-xl p-6">
          <h3 className="font-semibold text-lg mb-4">Payment History</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(150,15%,88%)" />
              <XAxis dataKey="month" stroke="hsl(160,10%,45%)" fontSize={12} />
              <YAxis stroke="hsl(160,10%,45%)" fontSize={12} tickFormatter={(v) => `₹${v / 1000}K`} />
              <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} />
              <Bar dataKey="paid" fill="hsl(160,84%,24%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-xl p-6">
          <h3 className="font-semibold text-lg mb-4">My Properties</h3>
          <div className="space-y-3">
            {myProperties.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium text-sm">{p.id}</p>
                  <p className="text-xs text-muted-foreground">{p.address}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">₹{p.taxAmount.toLocaleString()}</p>
                  <span className={`text-xs font-medium ${p.paymentStatus === "paid" ? "text-success" : "text-destructive"}`}>
                    {p.paymentStatus.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
