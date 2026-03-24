import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { User, Bell, Shield } from "lucide-react";

export default function CitizenSettingsPage() {
  const { user } = useAuth();
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(false);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences</p>
      </div>

      <div className="glass-card rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <User size={20} className="text-primary" />
          <h3 className="font-semibold">Profile</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><Label>Full Name</Label><Input defaultValue={user?.name} /></div>
          <div><Label>Email</Label><Input defaultValue={user?.email} /></div>
          <div><Label>Phone</Label><Input placeholder="+91 9876543210" /></div>
          <div><Label>Aadhaar Number</Label><Input placeholder="XXXX XXXX XXXX" /></div>
        </div>
        <Button>Update Profile</Button>
      </div>

      <div className="glass-card rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <Bell size={20} className="text-primary" />
          <h3 className="font-semibold">Notifications</h3>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-sm">Email Notifications</p>
            <p className="text-xs text-muted-foreground">Receive tax reminders via email</p>
          </div>
          <Switch checked={emailNotifs} onCheckedChange={setEmailNotifs} />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-sm">SMS Notifications</p>
            <p className="text-xs text-muted-foreground">Get payment alerts via SMS</p>
          </div>
          <Switch checked={smsNotifs} onCheckedChange={setSmsNotifs} />
        </div>
      </div>

      <div className="glass-card rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <Shield size={20} className="text-primary" />
          <h3 className="font-semibold">Security</h3>
        </div>
        <div>
          <Label>Current Password</Label>
          <Input type="password" placeholder="••••••••" />
        </div>
        <div>
          <Label>New Password</Label>
          <Input type="password" placeholder="••••••••" />
        </div>
        <Button variant="outline">Change Password</Button>
      </div>
    </motion.div>
  );
}
