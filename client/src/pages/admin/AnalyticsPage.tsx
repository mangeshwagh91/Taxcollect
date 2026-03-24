import { motion } from "framer-motion";
import { properties, monthlyRevenue, wardRevenue } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { TrendingUp, AlertTriangle, Target, BarChart3 } from "lucide-react";
import StatCard from "@/components/StatCard";

export default function AnalyticsPage() {
  const totalRevenue = properties.filter((p) => p.paymentStatus === "paid").reduce((s, p) => s + p.taxAmount, 0);
  const totalDue = properties.reduce((s, p) => s + p.taxAmount, 0);
  const collectionRate = Math.round((totalRevenue / totalDue) * 100);

  const zonePerformance = ["Zone 1 - Premium", "Zone 2 - Central", "Zone 3 - Suburban", "Zone 4 - Rural"].map((z) => {
    const zp = properties.filter((p) => p.zone === z);
    const paid = zp.filter((p) => p.paymentStatus === "paid");
    return { zone: z.split(" - ")[1], collected: paid.reduce((s, p) => s + p.taxAmount, 0), pending: zp.filter((p) => p.paymentStatus === "unpaid").reduce((s, p) => s + p.taxAmount, 0), rate: zp.length > 0 ? Math.round((paid.length / zp.length) * 100) : 0 };
  });

  const radarData = wardRevenue.map((w) => ({ subject: w.ward, rate: w.total > 0 ? Math.round((w.revenue / w.total) * 100) : 0, fullMark: 100 }));

  const highRisk = properties.filter((p) => {
    if (p.paymentStatus === "paid") return false;
    if (!p.lastPaymentDate) return true;
    return (Date.now() - new Date(p.lastPaymentDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000) >= 2;
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Analytics Engine</h1>
        <p className="text-muted-foreground">Deep insights into tax collection performance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value={`₹${(totalRevenue / 100000).toFixed(1)}L`} icon={TrendingUp} variant="success" />
        <StatCard title="Collection Rate" value={`${collectionRate}%`} icon={Target} variant="warning" />
        <StatCard title="High-Risk Defaulters" value={highRisk.length} icon={AlertTriangle} variant="destructive" />
        <StatCard title="Avg Tax/Property" value={`₹${Math.round(totalDue / properties.length).toLocaleString()}`} icon={BarChart3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-xl p-6">
          <h3 className="font-semibold text-lg mb-4">Revenue Trend (Cumulative)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlyRevenue.map((m, i, arr) => ({ ...m, cumulative: arr.slice(0, i + 1).reduce((s, x) => s + x.revenue, 0) }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(150,15%,88%)" />
              <XAxis dataKey="month" stroke="hsl(160,10%,45%)" fontSize={12} />
              <YAxis stroke="hsl(160,10%,45%)" fontSize={12} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
              <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} />
              <Area type="monotone" dataKey="cumulative" stroke="hsl(160,84%,24%)" fill="hsl(160,84%,24%)" fillOpacity={0.1} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-xl p-6">
          <h3 className="font-semibold text-lg mb-4">Zone Performance</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={zonePerformance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(150,15%,88%)" />
              <XAxis type="number" stroke="hsl(160,10%,45%)" fontSize={12} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
              <YAxis type="category" dataKey="zone" stroke="hsl(160,10%,45%)" fontSize={12} width={80} />
              <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} />
              <Bar dataKey="collected" fill="hsl(142,76%,36%)" name="Collected" stackId="a" radius={[0, 0, 0, 0]} />
              <Bar dataKey="pending" fill="hsl(0,72%,51%)" name="Pending" stackId="a" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-xl p-6">
          <h3 className="font-semibold text-lg mb-4">Ward Collection Radar</h3>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(150,15%,88%)" />
              <PolarAngleAxis dataKey="subject" fontSize={12} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} fontSize={10} />
              <Radar name="Collection %" dataKey="rate" stroke="hsl(160,84%,24%)" fill="hsl(160,84%,24%)" fillOpacity={0.2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-xl p-6">
          <h3 className="font-semibold text-lg mb-4">High-Risk Defaulters</h3>
          <div className="space-y-2 max-h-[250px] overflow-y-auto">
            {highRisk.slice(0, 10).map((p) => (
              <div key={p.id} className="flex items-center justify-between p-2 rounded-lg bg-destructive/5 border border-destructive/10">
                <div>
                  <p className="font-medium text-sm">{p.ownerName}</p>
                  <p className="text-xs text-muted-foreground">{p.id} • {p.ward}</p>
                </div>
                <p className="font-bold text-destructive text-sm">₹{p.taxAmount.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
