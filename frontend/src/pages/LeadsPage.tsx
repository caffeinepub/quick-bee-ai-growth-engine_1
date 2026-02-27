import React, { useState } from 'react';
import { Users, Plus, Download, Edit2, Trash2, LayoutGrid, List } from 'lucide-react';
import { useLeads, useCreateLead, useUpdateLead, useDeleteLead } from '../hooks/useQueries';
import type { Lead } from '../backend';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const STATUSES = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Closed Won', 'Closed Lost'];

const statusColors: Record<string, string> = {
  'New': 'bg-blue-500/15 text-blue-400',
  'Contacted': 'bg-purple-500/15 text-purple-400',
  'Qualified': 'bg-teal-500/15 text-teal-400',
  'Proposal Sent': 'bg-yellow-500/15 text-yellow-400',
  'Closed Won': 'bg-green-500/15 text-green-400',
  'Closed Lost': 'bg-red-500/15 text-red-400',
};

interface LeadFormData {
  name: string; email: string; phone: string;
  serviceInterest: string; status: string; notes: string;
}

const emptyForm: LeadFormData = { name: '', email: '', phone: '', serviceInterest: '', status: 'New', notes: '' };

function LeadModal({ open, onClose, initial, onSubmit, loading }: {
  open: boolean; onClose: () => void;
  initial?: LeadFormData; onSubmit: (d: LeadFormData) => void; loading: boolean;
}) {
  const [form, setForm] = useState<LeadFormData>(initial || emptyForm);
  React.useEffect(() => { if (open) setForm(initial || emptyForm); }, [open, initial]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass-card border-teal/20 text-white max-w-lg" style={{ background: 'rgba(8,12,12,0.97)' }}>
        <DialogHeader>
          <DialogTitle className="teal-gradient-text font-display">{initial ? 'Edit Lead' : 'Add New Lead'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {(['name', 'email', 'phone', 'serviceInterest'] as const).map(field => (
            <div key={field}>
              <Label className="text-white/70 text-xs mb-1 block capitalize">{field === 'serviceInterest' ? 'Service Interest' : field}</Label>
              <Input
                value={form[field]}
                onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}
                className="input-dark w-full"
                style={{ background: 'rgba(0,180,166,0.05)', borderColor: 'rgba(0,180,166,0.2)', color: '#e8f5f4' }}
              />
            </div>
          ))}
          <div>
            <Label className="text-white/70 text-xs mb-1 block">Status</Label>
            <Select value={form.status} onValueChange={v => setForm(p => ({ ...p, status: v }))}>
              <SelectTrigger style={{ background: 'rgba(0,180,166,0.05)', borderColor: 'rgba(0,180,166,0.2)', color: '#e8f5f4' }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent style={{ background: '#0d1414', borderColor: 'rgba(0,180,166,0.2)' }}>
                {STATUSES.map(s => <SelectItem key={s} value={s} style={{ color: '#e8f5f4' }}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-white/70 text-xs mb-1 block">Notes</Label>
            <Textarea
              value={form.notes}
              onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
              rows={3}
              style={{ background: 'rgba(0,180,166,0.05)', borderColor: 'rgba(0,180,166,0.2)', color: '#e8f5f4' }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose} className="text-white/50">Cancel</Button>
          <Button onClick={() => onSubmit(form)} disabled={loading} className="btn-teal">
            {loading ? 'Saving...' : 'Save Lead'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function LeadsPage() {
  const { data: leads = [], isLoading } = useLeads();
  const createLead = useCreateLead();
  const updateLead = useUpdateLead();
  const deleteLead = useDeleteLead();

  const [view, setView] = useState<'table' | 'kanban'>('table');
  const [addOpen, setAddOpen] = useState(false);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);

  const handleCreate = async (data: LeadFormData) => {
    await createLead.mutateAsync(data);
    setAddOpen(false);
  };

  const handleUpdate = async (data: LeadFormData) => {
    if (!editLead) return;
    await updateLead.mutateAsync({ id: editLead.id, ...data });
    setEditLead(null);
  };

  const handleDelete = async () => {
    if (deleteId === null) return;
    await deleteLead.mutateAsync(deleteId);
    setDeleteId(null);
  };

  const exportCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Service Interest', 'Status', 'Notes'];
    const rows = leads.map(l => [l.id.toString(), l.name, l.email, l.phone, l.serviceInterest, l.status, l.notes]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'leads.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => window.print();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="page-header mb-0">
          <div className="flex items-center gap-3">
            <img src="/assets/generated/icon-leads.dim_128x128.png" alt="" className="w-10 h-10 rounded-xl" />
            <div>
              <h1 className="page-title mb-0">Lead Management</h1>
              <p className="page-subtitle">{leads.length} total leads</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setView(view === 'table' ? 'kanban' : 'table')}
            className="text-white/60 hover:text-teal border border-teal/20"
          >
            {view === 'table' ? <LayoutGrid size={16} /> : <List size={16} />}
            <span className="ml-2">{view === 'table' ? 'Kanban' : 'Table'}</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={exportCSV} className="text-white/60 hover:text-teal border border-teal/20">
            <Download size={16} /><span className="ml-2">CSV</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={exportPDF} className="text-white/60 hover:text-teal border border-teal/20">
            <Download size={16} /><span className="ml-2">PDF</span>
          </Button>
          <Button onClick={() => setAddOpen(true)} className="btn-teal">
            <Plus size={16} /><span className="ml-2">Add Lead</span>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="glass-card rounded-xl p-12 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-teal/30 border-t-teal rounded-full mx-auto mb-3" style={{ borderTopColor: '#00d4c8' }} />
          <p style={{ color: 'rgba(232,245,244,0.5)' }}>Loading leads...</p>
        </div>
      ) : view === 'table' ? (
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(0,180,166,0.15)', background: 'rgba(0,180,166,0.05)' }}>
                  {['Name', 'Email', 'Phone', 'Service Interest', 'Status', 'Notes', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider" style={{ color: '#00d4c8' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-12" style={{ color: 'rgba(232,245,244,0.4)' }}>No leads yet. Add your first lead!</td></tr>
                ) : leads.map(lead => (
                  <tr key={lead.id.toString()} style={{ borderBottom: '1px solid rgba(0,180,166,0.08)' }} className="hover:bg-teal/5 transition-colors">
                    <td className="px-4 py-3 font-medium text-white">{lead.name}</td>
                    <td className="px-4 py-3" style={{ color: 'rgba(232,245,244,0.7)' }}>{lead.email}</td>
                    <td className="px-4 py-3" style={{ color: 'rgba(232,245,244,0.7)' }}>{lead.phone}</td>
                    <td className="px-4 py-3" style={{ color: 'rgba(232,245,244,0.7)' }}>{lead.serviceInterest}</td>
                    <td className="px-4 py-3">
                      <span className={`status-badge ${statusColors[lead.status] || ''}`}>{lead.status}</span>
                    </td>
                    <td className="px-4 py-3 max-w-xs truncate" style={{ color: 'rgba(232,245,244,0.5)' }}>{lead.notes}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => setEditLead(lead)} className="p-1.5 rounded-lg hover:bg-teal/10 text-white/40 hover:text-teal transition-colors">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => setDeleteId(lead.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto">
          {STATUSES.map(status => {
            const statusLeads = leads.filter(l => l.status === status);
            return (
              <div key={status} className="glass-card rounded-xl p-3 min-w-[160px]">
                <div className="flex items-center justify-between mb-3">
                  <span className={`status-badge text-xs ${statusColors[status] || ''}`}>{status}</span>
                  <span className="text-xs font-bold" style={{ color: '#00d4c8' }}>{statusLeads.length}</span>
                </div>
                <div className="space-y-2">
                  {statusLeads.map(lead => (
                    <div key={lead.id.toString()} className="p-2 rounded-lg cursor-pointer hover:bg-teal/5 transition-colors" style={{ background: 'rgba(0,0,0,0.2)' }}>
                      <div className="text-xs font-semibold text-white truncate">{lead.name}</div>
                      <div className="text-xs truncate mt-0.5" style={{ color: 'rgba(232,245,244,0.5)' }}>{lead.serviceInterest}</div>
                      <div className="flex gap-1 mt-1.5">
                        <button onClick={() => setEditLead(lead)} className="p-1 rounded hover:bg-teal/10 text-white/30 hover:text-teal transition-colors">
                          <Edit2 size={10} />
                        </button>
                        <button onClick={() => setDeleteId(lead.id)} className="p-1 rounded hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-colors">
                          <Trash2 size={10} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {statusLeads.length === 0 && (
                    <div className="text-xs text-center py-4" style={{ color: 'rgba(232,245,244,0.2)' }}>Empty</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <LeadModal open={addOpen} onClose={() => setAddOpen(false)} onSubmit={handleCreate} loading={createLead.isPending} />
      <LeadModal
        open={!!editLead}
        onClose={() => setEditLead(null)}
        initial={editLead ? { name: editLead.name, email: editLead.email, phone: editLead.phone, serviceInterest: editLead.serviceInterest, status: editLead.status, notes: editLead.notes } : undefined}
        onSubmit={handleUpdate}
        loading={updateLead.isPending}
      />

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent style={{ background: 'rgba(8,12,12,0.97)', borderColor: 'rgba(0,180,166,0.2)' }}>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Lead?</AlertDialogTitle>
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
