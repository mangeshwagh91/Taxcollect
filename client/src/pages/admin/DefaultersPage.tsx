import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { properties } from "@/data/mockData";
import { AlertTriangle, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function DefaultersPage() {
  const [wardFilter, setWardFilter] = useState("all");
  const [durationFilter, setDurationFilter] = useState("all");
  const [search, setSearch] = useState("");

  const defaulters = useMemo(() => {
    return properties.filter((p) => {
      if (p.paymentStatus === "paid") return false;
      const matchWard = wardFilter === "all" || p.ward === wardFilter;
      const matchSearch = p.ownerName.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());

      let matchDuration = true;
      if (durationFilter !== "all" && p.lastPaymentDate) {
        const years = (Date.now() - new Date(p.lastPaymentDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000);
        if (durationFilter === "1") matchDuration = years >= 1;
        else if (durationFilter === "2") matchDuration = years >= 2;
        else if (durationFilter === "3") matchDuration = years >= 3;
      }

      return matchWard && matchSearch && matchDuration;
    });
  }, [wardFilter, durationFilter, search]);

  const totalOutstanding = defaulters.reduce((s, d) => s + d.taxAmount, 0);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-lg bg-destructive/10">
          <AlertTriangle className="text-destructive" size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Defaulters</h1>
          <p className="text-muted-foreground">{defaulters.length} properties with unpaid taxes • Total outstanding: ₹{totalOutstanding.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search defaulters..." className="flex-1 min-w-[200px]" />
        <Select value={wardFilter} onValueChange={setWardFilter}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Ward" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Wards</SelectItem>
            {["Ward A", "Ward B", "Ward C", "Ward D", "Ward E"].map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={durationFilter} onValueChange={setDurationFilter}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Duration" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Durations</SelectItem>
            <SelectItem value="1">&gt; 1 Year Unpaid</SelectItem>
            <SelectItem value="2">&gt; 2 Years Unpaid</SelectItem>
            <SelectItem value="3">&gt; 3 Years Unpaid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {defaulters.map((d, i) => {
          const years = d.lastPaymentDate ? Math.floor((Date.now() - new Date(d.lastPaymentDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : null;
          return (
            <motion.div key={d.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className="glass-card rounded-xl p-4 flex items-center justify-between gap-4 border-l-4 border-l-destructive"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs text-muted-foreground">{d.id}</span>
                  <Badge variant="destructive" className="text-xs">Unpaid</Badge>
                  {years && years >= 2 && <Badge variant="outline" className="text-xs border-warning text-warning">⚠ {years}yr overdue</Badge>}
                </div>
                <p className="font-medium">{d.ownerName}</p>
                <p className="text-sm text-muted-foreground truncate">{d.address}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-lg font-bold text-destructive">₹{d.taxAmount.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{d.ward} • {d.type}</p>
              </div>
            </motion.div>
          );
        })}
        {defaulters.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">No defaulters found matching filters.</div>
        )}
      </div>
    </motion.div>
  );
}
