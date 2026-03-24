import { useState } from "react";
import { motion } from "framer-motion";
import { properties } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, CheckCircle2, Building2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function CitizenProperties() {
  const [myProps, setMyProps] = useState(properties.slice(0, 5));
  const [payingProp, setPayingProp] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);

  const handlePay = (id: string) => {
    setPayingProp(id);
    setTimeout(() => {
      setMyProps((prev) => prev.map((p) => p.id === id ? { ...p, paymentStatus: "paid" as const, lastPaymentDate: new Date().toISOString() } : p));
      setPayingProp(null);
      setPaymentSuccess(id);
    }, 2000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Properties</h1>
        <p className="text-muted-foreground">View and manage your registered properties</p>
      </div>

      <div className="grid gap-4">
        {myProps.map((p) => (
          <motion.div key={p.id} layout className="glass-card rounded-xl p-5">
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className="p-3 rounded-lg bg-primary/10 shrink-0"><Building2 className="text-primary" size={22} /></div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{p.id}</h3>
                    <Badge variant={p.paymentStatus === "paid" ? "default" : "destructive"} className={p.paymentStatus === "paid" ? "bg-success text-success-foreground" : ""}>
                      {p.paymentStatus}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{p.address}</p>
                  <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                    <span>{p.type} • {p.area} sq.ft</span>
                    <span>{p.zone}</span>
                    <span>{p.ward}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold">₹{p.taxAmount.toLocaleString()}</p>
                {p.paymentStatus === "unpaid" && (
                  <Button size="sm" className="mt-2" onClick={() => handlePay(p.id)} disabled={payingProp === p.id}>
                    <CreditCard size={14} className="mr-1" />
                    {payingProp === p.id ? "Processing..." : "Pay Now"}
                  </Button>
                )}
                {p.lastPaymentDate && <p className="text-xs text-muted-foreground mt-1">Paid: {new Date(p.lastPaymentDate).toLocaleDateString()}</p>}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Payment Success Dialog */}
      <Dialog open={!!paymentSuccess} onOpenChange={() => setPaymentSuccess(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Payment Successful!</DialogTitle></DialogHeader>
          <div className="text-center py-6">
            <div className="mx-auto w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
              <CheckCircle2 className="text-success" size={32} />
            </div>
            <p className="text-lg font-semibold">Payment Confirmed</p>
            <p className="text-muted-foreground mt-1">Property {paymentSuccess}</p>
            <div className="mt-4 p-4 bg-muted rounded-lg text-sm space-y-2">
              <div className="flex justify-between"><span className="text-muted-foreground">Receipt No</span><span className="font-mono">RCP-{Date.now()}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span>{new Date().toLocaleDateString()}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Method</span><span>UPI</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Status</span><span className="text-success font-medium">Completed</span></div>
            </div>
            <Button className="mt-4 w-full" onClick={() => setPaymentSuccess(null)}>Done</Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
