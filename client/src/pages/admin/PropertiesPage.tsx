import { useState } from "react";
import { motion } from "framer-motion";
import { properties as allProperties, calculateTax } from "@/data/mockData";
import type { Property } from "@/data/mockData";
import { Plus, Search, Edit2, Trash2, Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>(allProperties);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showForm, setShowForm] = useState(false);
  const [editingProp, setEditingProp] = useState<Property | null>(null);
  const [viewProp, setViewProp] = useState<Property | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const filtered = properties.filter((p) => {
    const matchSearch = p.ownerName.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase()) || p.address.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || p.type === typeFilter;
    const matchStatus = statusFilter === "all" || p.paymentStatus === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  const [form, setForm] = useState({ ownerName: "", address: "", area: "", type: "residential" as "residential" | "commercial", zone: "Zone 1 - Premium", ward: "Ward A" });

  const handleSave = () => {
    const area = parseInt(form.area);
    if (!form.ownerName || !form.address || !area) return;
    const tax = calculateTax(area, form.type, form.zone);
    if (editingProp) {
      setProperties((prev) => prev.map((p) => p.id === editingProp.id ? { ...p, ...form, area, taxAmount: tax } : p));
    } else {
      const newProp: Property = {
        id: `PROP-${String(properties.length + 1).padStart(4, "0")}`,
        ownerName: form.ownerName, address: form.address, area, type: form.type, zone: form.zone, ward: form.ward,
        location: { lat: 19.076 + (Math.random() - 0.5) * 0.05, lng: 72.8777 + (Math.random() - 0.5) * 0.05 },
        taxAmount: tax, paymentStatus: "unpaid", lastPaymentDate: null,
      };
      setProperties((prev) => [...prev, newProp]);
    }
    setShowForm(false);
    setEditingProp(null);
    setForm({ ownerName: "", address: "", area: "", type: "residential", zone: "Zone 1 - Premium", ward: "Ward A" });
  };

  const handleEdit = (p: Property) => {
    setEditingProp(p);
    setForm({ ownerName: p.ownerName, address: p.address, area: String(p.area), type: p.type, zone: p.zone, ward: p.ward });
    setShowForm(true);
  };

  const handleDelete = (id: string) => setProperties((prev) => prev.filter((p) => p.id !== id));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Properties</h1>
          <p className="text-muted-foreground">Manage all registered properties</p>
        </div>
        <Button onClick={() => { setEditingProp(null); setForm({ ownerName: "", address: "", area: "", type: "residential", zone: "Zone 1 - Premium", ward: "Ward A" }); setShowForm(true); }}>
          <Plus size={18} className="mr-2" /> Add Property
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search by name, ID, or address..." className="pl-9" />
        </div>
        <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(1); }}>
          <SelectTrigger className="w-[150px]"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="residential">Residential</SelectItem>
            <SelectItem value="commercial">Commercial</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
          <SelectTrigger className="w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="unpaid">Unpaid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3 font-medium">ID</th>
                <th className="text-left p-3 font-medium">Owner</th>
                <th className="text-left p-3 font-medium">Type</th>
                <th className="text-left p-3 font-medium">Area</th>
                <th className="text-left p-3 font-medium">Zone</th>
                <th className="text-left p-3 font-medium">Tax</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-left p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((p) => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-mono text-xs">{p.id}</td>
                  <td className="p-3">{p.ownerName}</td>
                  <td className="p-3 capitalize">{p.type}</td>
                  <td className="p-3">{p.area} sq.ft</td>
                  <td className="p-3 text-xs">{p.zone}</td>
                  <td className="p-3 font-medium">₹{p.taxAmount.toLocaleString()}</td>
                  <td className="p-3">
                    <Badge variant={p.paymentStatus === "paid" ? "default" : "destructive"} className={p.paymentStatus === "paid" ? "bg-success text-success-foreground" : ""}>
                      {p.paymentStatus}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      <button onClick={() => setViewProp(p)} className="p-1.5 rounded hover:bg-muted"><Eye size={15} /></button>
                      <button onClick={() => handleEdit(p)} className="p-1.5 rounded hover:bg-muted"><Edit2 size={15} /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded hover:bg-muted text-destructive"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-3 border-t">
            <p className="text-sm text-muted-foreground">Showing {(page - 1) * perPage + 1}-{Math.min(page * perPage, filtered.length)} of {filtered.length}</p>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</Button>
              <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</Button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingProp ? "Edit Property" : "Add Property"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Owner Name</Label><Input value={form.ownerName} onChange={(e) => setForm({ ...form, ownerName: e.target.value })} /></div>
            <div><Label>Address</Label><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Area (sq.ft)</Label><Input type="number" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} /></div>
              <div>
                <Label>Type</Label>
                <Select value={form.type} onValueChange={(v: "residential" | "commercial") => setForm({ ...form, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="residential">Residential</SelectItem><SelectItem value="commercial">Commercial</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Zone</Label>
                <Select value={form.zone} onValueChange={(v) => setForm({ ...form, zone: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Zone 1 - Premium", "Zone 2 - Central", "Zone 3 - Suburban", "Zone 4 - Rural"].map((z) => <SelectItem key={z} value={z}>{z}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Ward</Label>
                <Select value={form.ward} onValueChange={(v) => setForm({ ...form, ward: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Ward A", "Ward B", "Ward C", "Ward D", "Ward E"].map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {form.area && <p className="text-sm text-muted-foreground">Estimated Tax: ₹{calculateTax(parseInt(form.area) || 0, form.type, form.zone).toLocaleString()}</p>}
            <Button onClick={handleSave} className="w-full">{editingProp ? "Update" : "Add"} Property</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={!!viewProp} onOpenChange={() => setViewProp(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Property Details</DialogTitle></DialogHeader>
          {viewProp && (
            <div className="space-y-3 text-sm">
              {[
                ["Property ID", viewProp.id],
                ["Owner", viewProp.ownerName],
                ["Address", viewProp.address],
                ["Type", viewProp.type],
                ["Area", `${viewProp.area} sq.ft`],
                ["Zone", viewProp.zone],
                ["Ward", viewProp.ward],
                ["Tax Amount", `₹${viewProp.taxAmount.toLocaleString()}`],
                ["Status", viewProp.paymentStatus],
                ["Last Payment", viewProp.lastPaymentDate ? new Date(viewProp.lastPaymentDate).toLocaleDateString() : "Never"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-1 border-b last:border-0">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-medium">{v}</span>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
