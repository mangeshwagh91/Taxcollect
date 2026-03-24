import { motion } from "framer-motion";
import { properties } from "@/data/mockData";
import PropertyMap from "@/components/PropertyMap";
import { Badge } from "@/components/ui/badge";

export default function GISMapPage() {
  const paid = properties.filter((p) => p.paymentStatus === "paid").length;
  const unpaid = properties.filter((p) => p.paymentStatus === "unpaid").length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">GIS Map</h1>
          <p className="text-muted-foreground">Interactive property visualization</p>
        </div>
        <div className="flex gap-3">
          <Badge variant="outline" className="gap-2 py-1.5 px-3 bg-success/10 border-success/30 text-success">
            <span className="w-2 h-2 rounded-full bg-success" /> {paid} Paid
          </Badge>
          <Badge variant="outline" className="gap-2 py-1.5 px-3 bg-destructive/10 border-destructive/30 text-destructive">
            <span className="w-2 h-2 rounded-full bg-destructive" /> {unpaid} Unpaid
          </Badge>
        </div>
      </div>
      <div className="glass-card rounded-xl overflow-hidden">
        <PropertyMap properties={properties} height="calc(100vh - 220px)" />
      </div>
    </motion.div>
  );
}
