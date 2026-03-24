import { motion } from "framer-motion";
import { Building2, IndianRupee, UserX, TrendingUp } from "lucide-react";
import StatCard from "@/components/StatCard";
import { properties, monthlyRevenue, wardRevenue } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from "recharts";

const COLORS = ["hsl(160,84%,24%)", "hsl(142,76%,36%)", "hsl(38,92%,50%)", "hsl(0,72%,51%)", "hsl(200,80%,50%)"];

export default function AdminDashboard() {
  const totalRevenue = properties.filter((p) => p.paymentStatus === "paid").reduce((s, p) => s + p.taxAmount, 0);
  const defaulters = properties.filter((p) => p.paymentStatus === "unpaid");
  const typeData = [
    { name: "Residential", value: properties.filter((p) => p.type === "residential").length },
    { name: "Commercial", value: properties.filter((p) => p.type === "commercial").length },
  ];
  const statusData = [
    { name: "Paid", value: properties.filter((p) => p.paymentStatus === "paid").length },
    { name: "Unpaid", value: defaulters.length },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of property tax management</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value={`₹${(totalRevenue / 100000).toFixed(1)}L`} icon={IndianRupee} variant="success" trend={{ value: 12.5, label: "vs last month" }} />
        <StatCard title="Total Properties" value={properties.length} icon={Building2} trend={{ value: 3, label: "new this month" }} />
        <StatCard title="Defaulters" value={defaulters.length} icon={UserX} variant="destructive" trend={{ value: -5, label: "vs last month" }} />
        <StatCard title="Collection Rate" value={`${Math.round((1 - defaulters.length / properties.length) * 100)}%`} icon={TrendingUp} variant="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-xl p-6">
          <h3 className="font-semibold text-lg mb-4">Monthly Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(150,15%,88%)" />
              <XAxis dataKey="month" stroke="hsl(160,10%,45%)" fontSize={12} />
              <YAxis stroke="hsl(160,10%,45%)" fontSize={12} tickFormatter={(v) => `₹${v / 1000}K`} />
              <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, "Revenue"]} />
              <Line type="monotone" dataKey="revenue" stroke="hsl(160,84%,24%)" strokeWidth={2} dot={{ fill: "hsl(160,84%,24%)" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-xl p-6">
          <h3 className="font-semibold text-lg mb-4">Ward-wise Revenue</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={wardRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(150,15%,88%)" />
              <XAxis dataKey="ward" stroke="hsl(160,10%,45%)" fontSize={12} />
              <YAxis stroke="hsl(160,10%,45%)" fontSize={12} tickFormatter={(v) => `₹${v / 1000}K`} />
              <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="revenue" fill="hsl(160,84%,24%)" name="Collected" radius={[4, 4, 0, 0]} />
              <Bar dataKey="total" fill="hsl(150,15%,88%)" name="Total Due" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-xl p-6">
          <h3 className="font-semibold text-lg mb-4">Property Types</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={typeData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                {typeData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-xl p-6">
          <h3 className="font-semibold text-lg mb-4">Payment Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                <Cell fill="hsl(142,76%,36%)" />
                <Cell fill="hsl(0,72%,51%)" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}
