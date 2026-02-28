import React, { useState } from 'react';
import { Settings2, Plus, Edit2, Trash2, Copy, Eye, EyeOff, GripVertical } from 'lucide-react';
import { useServices, useCreateService, useUpdateService, useDeleteService, useDuplicateService, useReorderServices } from '../hooks/useQueries';
import type { Service, Package, Addon } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const CATEGORIES = ['Web Dev', 'App Dev', 'AI Automation', 'Digital Marketing', 'Branding', 'SaaS', 'Business Setup'];
const TIERS = ['Student', 'Business', 'Premium', 'Enterprise'];

function formatINR(n: number | bigint) {
  return `₹${Number(n).toLocaleString('en-IN')}`;
}

interface ServiceFormData {
  name: string;
  category: string;
  description: string;
  packages: { tier: string; priceINR: string; features: string }[];
  addons: { name: string; price: string }[];
  maintenancePlan: string;
  isVisible: boolean;
}

const defaultForm: ServiceFormData = {
  name: '',
  category: 'Web Dev',
  description: '',
  packages: TIERS.map(tier => ({ tier, priceINR: '', features: '' })),
  addons: [],
  maintenancePlan: '0',
  isVisible: true,
};

function serviceToForm(s: Service): ServiceFormData {
  return {
    name: s.name,
    category: s.category,
    description: s.description,
    packages: TIERS.map(tier => {
      const p = s.packages.find(pk => pk.tier === tier);
      return { tier, priceINR: p ? p.priceINR.toString() : '', features: p ? p.features.join('\n') : '' };
    }),
    addons: s.addons.map(a => ({ name: a.name, price: a.price.toString() })),
    maintenancePlan: s.maintenancePlan.toString(),
    isVisible: s.isVisible,
  };
}

function formToService(form: ServiceFormData, sortOrder: bigint): { packages: Package[]; addons: Addon[]; maintenancePlan: bigint; isVisible: boolean; name: string; category: string; description: string; sortOrder: bigint } {
  const packages: Package[] = form.packages
    .filter(p => p.priceINR.trim() !== '')
    .map(p => ({
      tier: p.tier,
      priceINR: BigInt(parseInt(p.priceINR) || 0),
      features: p.features.split('\n').map(f => f.trim()).filter(Boolean),
    }));
  const addons: Addon[] = form.addons
    .filter(a => a.name.trim() !== '')
    .map(a => ({ name: a.name, price: BigInt(parseInt(a.price) || 0) }));
  return {
    name: form.name,
    category: form.category,
    description: form.description,
    packages,
    addons,
    maintenancePlan: BigInt(parseInt(form.maintenancePlan) || 0),
    isVisible: form.isVisible,
    sortOrder,
  };
}

function EditServiceModal({ open, onClose, service, onSubmit, loading }: {
  open: boolean; onClose: () => void; service?: Service;
  onSubmit: (data: ServiceFormData) => void; loading: boolean;
}) {
  const [form, setForm] = useState<ServiceFormData>(service ? serviceToForm(service) : defaultForm);

  React.useEffect(() => {
    if (open) setForm(service ? serviceToForm(service) : defaultForm);
  }, [open, service]);

  const updatePackage = (i: number, field: 'priceINR' | 'features', value: string) => {
    setForm(prev => {
      const packages = [...prev.packages];
      packages[i] = { ...packages[i], [field]: value };
      return { ...prev, packages };
    });
  };

  const addAddon = () => setForm(prev => ({ ...prev, addons: [...prev.addons, { name: '', price: '' }] }));
  const removeAddon = (i: number) => setForm(prev => ({ ...prev, addons: prev.addons.filter((_, idx) => idx !== i) }));
  const updateAddon = (i: number, field: 'name' | 'price', value: string) => {
    setForm(prev => {
      const addons = [...prev.addons];
      addons[i] = { ...addons[i], [field]: value };
      return { ...prev, addons };
    });
  };

  const inputStyle = { background: 'rgba(0,180,166,0.05)', borderColor: 'rgba(0,180,166,0.2)', color: '#e8f5f4' };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" style={{ background: 'rgba(8,12,12,0.98)', borderColor: 'rgba(0,180,166,0.2)', color: '#e8f5f4' }}>
        <DialogHeader>
          <DialogTitle className="teal-gradient-text font-display">{service ? 'Edit Service' : 'Create New Service'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-5 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-white/70 text-xs mb-1 block">Service Name</Label>
              <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} style={inputStyle} />
            </div>
            <div>
              <Label className="text-white/70 text-xs mb-1 block">Category</Label>
              <Select value={form.category} onValueChange={v => setForm(p => ({ ...p, category: v }))}>
                <SelectTrigger style={inputStyle}><SelectValue /></SelectTrigger>
                <SelectContent style={{ background: '#0d1414', borderColor: 'rgba(0,180,166,0.2)' }}>
                  {CATEGORIES.map(c => <SelectItem key={c} value={c} style={{ color: '#e8f5f4' }}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label className="text-white/70 text-xs mb-1 block">Description</Label>
            <Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2} style={inputStyle} />
          </div>
          <div>
            <Label className="text-white/70 text-xs mb-2 block">Packages</Label>
            <div className="space-y-3">
              {form.packages.map((pkg, i) => (
                <div key={pkg.tier} className="p-3 rounded-lg" style={{ background: 'rgba(0,180,166,0.04)', border: '1px solid rgba(0,180,166,0.12)' }}>
                  <div className="text-xs font-semibold mb-2" style={{ color: '#00d4c8' }}>{pkg.tier}</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-white/50 text-xs mb-1 block">Price (INR)</Label>
                      <Input value={pkg.priceINR} onChange={e => updatePackage(i, 'priceINR', e.target.value)} placeholder="e.g. 4999" style={inputStyle} />
                    </div>
                    <div>
                      <Label className="text-white/50 text-xs mb-1 block">Features (one per line)</Label>
                      <Textarea value={pkg.features} onChange={e => updatePackage(i, 'features', e.target.value)} rows={2} style={inputStyle} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-white/70 text-xs">Add-ons</Label>
              <Button size="sm" variant="ghost" onClick={addAddon} className="text-teal text-xs h-6 px-2">+ Add</Button>
            </div>
            {form.addons.map((addon, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <Input value={addon.name} onChange={e => updateAddon(i, 'name', e.target.value)} placeholder="Add-on name" style={inputStyle} className="flex-1" />
                <Input value={addon.price} onChange={e => updateAddon(i, 'price', e.target.value)} placeholder="Price" style={inputStyle} className="w-24" />
                <Button size="sm" variant="ghost" onClick={() => removeAddon(i)} className="text-red-400 px-2">×</Button>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-white/70 text-xs mb-1 block">Maintenance Plan (INR/mo)</Label>
              <Input value={form.maintenancePlan} onChange={e => setForm(p => ({ ...p, maintenancePlan: e.target.value }))} style={inputStyle} />
            </div>
            <div className="flex items-center gap-3 pt-5">
              <Switch checked={form.isVisible} onCheckedChange={v => setForm(p => ({ ...p, isVisible: v }))} />
              <Label className="text-white/70 text-xs">Visible in catalog</Label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose} className="text-white/50">Cancel</Button>
          <Button onClick={() => onSubmit(form)} disabled={loading || !form.name.trim()} className="btn-teal">
            {loading ? 'Saving...' : 'Save Service'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ServiceManagementPage() {
  const { data: services = [], isLoading } = useServices();
  const createService = useCreateService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();
  const duplicateService = useDuplicateService();
  const reorderServices = useReorderServices();

  const [addOpen, setAddOpen] = useState(false);
  const [editService, setEditService] = useState<Service | null>(null);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);

  const sorted = [...services].sort((a, b) => Number(a.sortOrder) - Number(b.sortOrder));

  const handleCreate = async (form: ServiceFormData) => {
    const data = formToService(form, BigInt(services.length));
    await createService.mutateAsync(data);
    setAddOpen(false);
  };

  const handleUpdate = async (form: ServiceFormData) => {
    if (!editService) return;
    const data = formToService(form, editService.sortOrder);
    await updateService.mutateAsync({ id: editService.id, ...data });
    setEditService(null);
  };

  const handleDelete = async () => {
    if (deleteId === null) return;
    await deleteService.mutateAsync(deleteId);
    setDeleteId(null);
  };

  const handleDuplicate = async (id: bigint) => {
    await duplicateService.mutateAsync(id);
  };

  const handleMoveUp = async (idx: number) => {
    if (idx === 0) return;
    const ids = sorted.map(s => s.id);
    [ids[idx - 1], ids[idx]] = [ids[idx], ids[idx - 1]];
    await reorderServices.mutateAsync(ids);
  };

  const handleMoveDown = async (idx: number) => {
    if (idx === sorted.length - 1) return;
    const ids = sorted.map(s => s.id);
    [ids[idx], ids[idx + 1]] = [ids[idx + 1], ids[idx]];
    await reorderServices.mutateAsync(ids);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="page-header mb-0">
          <div className="flex items-center gap-3">
            <img src="/assets/generated/icon-services.dim_128x128.png" alt="" className="w-10 h-10 rounded-xl" />
            <div>
              <h1 className="page-title mb-0">Service Management</h1>
              <p className="page-subtitle">{services.length} services configured</p>
            </div>
          </div>
        </div>
        <Button onClick={() => setAddOpen(true)} className="btn-teal">
          <Plus size={16} /><span className="ml-2">Add Service</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="glass-card rounded-xl p-12 text-center">
          <div className="animate-spin w-8 h-8 border-2 rounded-full mx-auto mb-3" style={{ borderColor: 'rgba(0,180,166,0.3)', borderTopColor: '#00d4c8' }} />
          <p style={{ color: 'rgba(232,245,244,0.5)' }}>Loading services...</p>
        </div>
      ) : sorted.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center">
          <Settings2 size={40} className="mx-auto mb-3 opacity-20" style={{ color: '#00d4c8' }} />
          <p style={{ color: 'rgba(232,245,244,0.4)' }}>No services yet. Create your first service!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((service, idx) => (
            <div key={service.id.toString()} className="glass-card rounded-xl p-4 flex items-center gap-4">
              <div className="flex flex-col gap-1">
                <button onClick={() => handleMoveUp(idx)} disabled={idx === 0} className="p-0.5 text-white/20 hover:text-teal disabled:opacity-10 transition-colors">
                  <GripVertical size={14} />
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-white text-sm">{service.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,180,166,0.12)', color: '#00d4c8' }}>{service.category}</span>
                  {!service.isVisible && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/15 text-red-400">Hidden</span>
                  )}
                </div>
                <p className="text-xs mt-0.5 truncate" style={{ color: 'rgba(232,245,244,0.45)' }}>{service.description}</p>
                <div className="flex gap-3 mt-1.5 flex-wrap">
                  {service.packages.map(p => (
                    <span key={p.tier} className="text-xs" style={{ color: 'rgba(232,245,244,0.5)' }}>
                      {p.tier}: <span style={{ color: '#00d4c8' }}>₹{Number(p.priceINR).toLocaleString('en-IN')}</span>
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button onClick={() => handleDuplicate(service.id)} className="p-1.5 rounded-lg hover:bg-teal/10 text-white/30 hover:text-teal transition-colors" title="Duplicate">
                  <Copy size={14} />
                </button>
                <button onClick={() => setEditService(service)} className="p-1.5 rounded-lg hover:bg-teal/10 text-white/30 hover:text-teal transition-colors" title="Edit">
                  <Edit2 size={14} />
                </button>
                <button onClick={() => setDeleteId(service.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-colors" title="Delete">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <EditServiceModal open={addOpen} onClose={() => setAddOpen(false)} onSubmit={handleCreate} loading={createService.isPending} />
      <EditServiceModal
        open={!!editService}
        onClose={() => setEditService(null)}
        service={editService || undefined}
        onSubmit={handleUpdate}
        loading={updateService.isPending}
      />

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent style={{ background: 'rgba(8,12,12,0.97)', borderColor: 'rgba(0,180,166,0.2)' }}>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Service?</AlertDialogTitle>
            <AlertDialogDescription style={{ color: 'rgba(232,245,244,0.6)' }}>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-white/60">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500/80 hover:bg-red-500 text-white">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
