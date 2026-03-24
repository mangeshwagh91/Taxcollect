import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Building2, Shield, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<"admin" | "citizen">("citizen");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, signup, authError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = isLogin ? await login(email, password, role) : await signup(name, email, password, role);
    setIsSubmitting(false);
    if (success) navigate(role === "admin" ? "/admin" : "/citizen");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-1 bg-sidebar items-center justify-center p-12">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <Building2 className="text-sidebar-primary" size={40} />
            <h1 className="text-3xl font-bold text-sidebar-foreground">SPTIP</h1>
          </div>
          <h2 className="text-2xl font-semibold text-sidebar-foreground mb-4">Smart Property Tax Intelligence Platform</h2>
          <p className="text-sidebar-foreground/60 text-lg leading-relaxed">
            AI-powered property tax management with GIS visualization, intelligent analytics, and seamless citizen services.
          </p>
          <div className="mt-12 grid grid-cols-2 gap-4">
            {[
              { label: "Properties Managed", value: "10,000+" },
              { label: "Revenue Collected", value: "₹45Cr+" },
              { label: "Tax Compliance", value: "87%" },
              { label: "AI Queries/Day", value: "500+" },
            ].map((s) => (
              <div key={s.label} className="bg-sidebar-accent rounded-lg p-4">
                <p className="text-sidebar-primary text-xl font-bold">{s.value}</p>
                <p className="text-sidebar-foreground/50 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <Building2 className="text-primary" size={32} />
            <span className="text-2xl font-bold">SPTIP</span>
          </div>

          <h2 className="text-2xl font-bold mb-2">{isLogin ? "Welcome back" : "Create account"}</h2>
          <p className="text-muted-foreground mb-8">{isLogin ? "Sign in to your account" : "Register for a new account"}</p>

          {/* Role Selector */}
          <div className="flex gap-3 mb-6">
            {([
              { r: "citizen" as const, icon: User, label: "Citizen" },
              { r: "admin" as const, icon: Shield, label: "Admin / Official" },
            ]).map(({ r, icon: Icon, label }) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                  role === r ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/30"
                }`}
              >
                <Icon size={18} />
                <span className="font-medium text-sm">{label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" required />
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            {authError && <p className="text-sm text-destructive">{authError}</p>}
            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button onClick={() => setIsLogin(!isLogin)} className="text-primary font-medium hover:underline">
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
