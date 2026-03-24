import { useState } from "react";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CreditCard, Calendar, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AutoPayPage() {
  const [enabled, setEnabled] = useState(false);
  const [frequency, setFrequency] = useState("monthly");

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">Auto Pay</h1>
        <p className="text-muted-foreground">Set up automatic tax payments</p>
      </div>

      <div className="glass-card rounded-xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10"><CreditCard className="text-primary" size={20} /></div>
            <div>
              <h3 className="font-semibold">Enable Auto Pay</h3>
              <p className="text-sm text-muted-foreground">Automatically pay taxes when due</p>
            </div>
          </div>
          <Switch checked={enabled} onCheckedChange={setEnabled} />
        </div>

        {enabled && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-4 pt-4 border-t">
            <div>
              <Label>Payment Frequency</Label>
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="annually">Annually</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>UPI ID</Label>
              <Input placeholder="yourname@upi" />
            </div>
            <div>
              <Label>Maximum Amount per Transaction</Label>
              <Input type="number" placeholder="50000" />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted rounded-lg p-3">
              <Shield size={16} />
              <span>Your payment details are encrypted and secure</span>
            </div>
            <Button className="w-full">Save Auto Pay Settings</Button>
          </motion.div>
        )}
      </div>

      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="text-primary" size={20} />
          <h3 className="font-semibold">Upcoming Payments</h3>
        </div>
        <div className="space-y-3">
          {[
            { prop: "PROP-0001", amount: 15000, date: "2025-01-15" },
            { prop: "PROP-0002", amount: 22000, date: "2025-02-01" },
            { prop: "PROP-0003", amount: 8500, date: "2025-03-01" },
          ].map((p) => (
            <div key={p.prop} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="font-medium text-sm">{p.prop}</p>
                <p className="text-xs text-muted-foreground">Due: {new Date(p.date).toLocaleDateString()}</p>
              </div>
              <p className="font-bold">₹{p.amount.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
