import { motion } from "framer-motion";
import { paymentHistory } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Receipt } from "lucide-react";

export default function PaymentHistoryPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-lg bg-primary/10"><Receipt className="text-primary" size={24} /></div>
        <div>
          <h1 className="text-2xl font-bold">Payment History</h1>
          <p className="text-muted-foreground text-sm">{paymentHistory.length} transactions</p>
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-3 font-medium">Receipt</th>
              <th className="text-left p-3 font-medium">Property</th>
              <th className="text-left p-3 font-medium">Amount</th>
              <th className="text-left p-3 font-medium">Date</th>
              <th className="text-left p-3 font-medium">Method</th>
              <th className="text-left p-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {paymentHistory.slice(0, 15).map((p) => (
              <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30">
                <td className="p-3 font-mono text-xs">{p.receiptNo.slice(0, 16)}</td>
                <td className="p-3">{p.propertyId}</td>
                <td className="p-3 font-medium">₹{p.amount.toLocaleString()}</td>
                <td className="p-3">{new Date(p.date).toLocaleDateString()}</td>
                <td className="p-3">{p.method}</td>
                <td className="p-3"><Badge className="bg-success text-success-foreground">{p.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
