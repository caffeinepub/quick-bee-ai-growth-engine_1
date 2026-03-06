import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen,
  ChevronDown,
  Download,
  Edit,
  FileSpreadsheet,
  FileText,
  Filter,
  Info,
  Loader2,
  Mail,
  Phone,
  Plus,
  Search,
  Trash2,
  Upload,
  User,
} from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import LiveDataBadge from "../components/LiveDataBadge";
import {
  type Lead,
  LeadStatus,
  useCreateLead,
  useDeleteLead,
  useGetAllLeads,
  useImportLeads,
  useUpdateLead,
} from "../hooks/useQueries";
import {
  downloadAsCSV,
  downloadAsExcel,
  downloadAsPDF,
} from "../utils/downloadHelper";
import {
  IMPORT_ACCEPT,
  IMPORT_FORMATS,
  parseImportFile,
} from "../utils/importParser";

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  contacted:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  qualified:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  proposal_sent:
    "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  closed_won:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
};

const statusLabels: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  proposal_sent: "Proposal Sent",
  closed_won: "Closed Won",
};

interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
  notes: string;
}

const defaultFormData: LeadFormData = {
  name: "",
  email: "",
  phone: "",
  status: LeadStatus.new,
  notes: "",
};

function normalizeStatus(raw: string): LeadStatus {
  const s = raw
    .toLowerCase()
    .trim()
    .replace(/[\s\-]/g, "_");
  // Exact matches for new statuses
  if (s === "new") return LeadStatus.new;
  if (s === "contacted" || s === "contact") return LeadStatus.contacted;
  if (s === "qualified" || s === "qualify") return LeadStatus.qualified;
  if (
    s === "proposal_sent" ||
    s === "proposal" ||
    s === "sent" ||
    s === "proposal sent"
  )
    return LeadStatus.proposal_sent;
  if (
    s === "closed_won" ||
    s === "closed won" ||
    s === "closed" ||
    s === "won" ||
    s === "close"
  )
    return LeadStatus.closed_won;
  // Legacy / alternate mappings (optional — these won't error, just map to nearest)
  if (s === "open" || s === "lead") return LeadStatus.new;
  if (s === "in_progress" || s === "in_progress" || s === "follow_up")
    return LeadStatus.contacted;
  if (s === "lost" || s === "dead" || s === "cold") return LeadStatus.new;
  // Default for blank or unknown
  return LeadStatus.new;
}

export default function LeadsPage() {
  const { data: leads = [], isLoading } = useGetAllLeads();
  const createLead = useCreateLead();
  const updateLead = useUpdateLead();
  const deleteLead = useDeleteLead();
  const importLeads = useImportLeads();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [formData, setFormData] = useState<LeadFormData>(defaultFormData);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [showImportMenu, setShowImportMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showImportRules, setShowImportRules] = useState(false);

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openCreate = () => {
    setEditingLead(null);
    setFormData(defaultFormData);
    setIsModalOpen(true);
  };

  const openEdit = (lead: Lead) => {
    setEditingLead(lead);
    setFormData({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      status: lead.status as LeadStatus,
      notes: lead.notes,
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    try {
      if (editingLead) {
        await updateLead.mutateAsync({
          id: editingLead.id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          status: formData.status,
          notes: formData.notes,
        });
        toast.success("Lead updated successfully");
      } else {
        await createLead.mutateAsync({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          status: formData.status,
          notes: formData.notes,
        });
        toast.success("Lead created successfully");
      }
      setIsModalOpen(false);
      setFormData(defaultFormData);
      setEditingLead(null);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to save lead";
      toast.error(message);
    }
  };

  const handleDelete = async () => {
    if (deleteId === null) return;
    try {
      await deleteLead.mutateAsync(deleteId);
      toast.success("Lead deleted");
      setDeleteId(null);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to delete lead";
      toast.error(message);
    }
  };

  const getExportData = () =>
    filteredLeads.map((lead) => ({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      status: lead.status as string,
      notes: lead.notes,
    }));

  const handleExportCSV = () => {
    if (filteredLeads.length === 0) {
      toast.error("No leads to export");
      return;
    }
    downloadAsCSV(getExportData(), "leads-export.csv");
    toast.success(`Exported ${filteredLeads.length} lead(s) to CSV`);
    setShowExportMenu(false);
  };

  const handleExportExcel = () => {
    if (filteredLeads.length === 0) {
      toast.error("No leads to export");
      return;
    }
    downloadAsExcel(getExportData(), "leads-export.xls");
    toast.success(`Exported ${filteredLeads.length} lead(s) to Excel`);
    setShowExportMenu(false);
  };

  const handleExportPDF = () => {
    if (filteredLeads.length === 0) {
      toast.error("No leads to export");
      return;
    }
    downloadAsPDF(
      getExportData(),
      "leads-export.pdf",
      "Lead Management Report",
    );
    toast.success(`Exported ${filteredLeads.length} lead(s) to PDF`);
    setShowExportMenu(false);
  };

  const handleImportClick = () => {
    setShowImportMenu(false);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsImporting(true);
    try {
      const rows = await parseImportFile(file);
      if (rows.length === 0) {
        toast.error("No data rows found in file");
        return;
      }

      // Map parsed rows to leads — accept flexible column names
      const parsedLeads = rows
        .map((row) => {
          const name =
            row.name ??
            row.full_name ??
            row.lead_name ??
            row.contact_name ??
            "";
          const email = row.email ?? row.email_address ?? row.e_mail ?? "";
          const phone =
            row.phone ?? row.phone_number ?? row.mobile ?? row.contact ?? "";
          const status = normalizeStatus(
            row.status ?? row.lead_status ?? row.stage ?? "",
          );
          const notes =
            row.notes ??
            row.note ??
            row.comments ??
            row.description ??
            row.text ??
            "";
          return {
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            status,
            notes: notes.trim(),
          };
        })
        .filter((l) => l.name !== "");

      if (parsedLeads.length === 0) {
        toast.error(
          'No valid leads found. Ensure the file has a "name" column.',
        );
        return;
      }

      const ids = await importLeads.mutateAsync(parsedLeads);
      toast.success(`Successfully imported ${ids.length} lead(s)`);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to import file";
      toast.error(message);
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const isSaving = createLead.isPending || updateLead.isPending;

  const kanbanColumns: LeadStatus[] = [
    LeadStatus.new,
    LeadStatus.contacted,
    LeadStatus.qualified,
    LeadStatus.proposal_sent,
    LeadStatus.closed_won,
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Hidden file input for universal import */}
      <input
        ref={fileInputRef}
        type="file"
        accept={IMPORT_ACCEPT}
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">
              Lead Management
            </h1>
            <LiveDataBadge />
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            Track and manage your sales pipeline
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Import dropdown */}
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => {
                setShowImportMenu((v) => !v);
                setShowExportMenu(false);
              }}
              disabled={isImporting || importLeads.isPending}
              className="gap-2"
              data-ocid="leads.import_button"
            >
              {isImporting || importLeads.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              Import
              <ChevronDown className="w-3 h-3 ml-1" />
            </Button>
            {showImportMenu && (
              <div
                className="absolute right-0 top-full mt-1 z-50 min-w-[260px] rounded-lg border bg-popover shadow-lg py-1"
                onMouseLeave={() => setShowImportMenu(false)}
              >
                <div className="px-3 py-1.5 text-xs text-muted-foreground font-medium uppercase tracking-wider border-b mb-1">
                  Import from
                </div>
                <button
                  type="button"
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-accent text-left"
                  onClick={handleImportClick}
                >
                  <FileSpreadsheet className="w-4 h-4 text-green-500" />
                  Excel (.xlsx / .xls)
                </button>
                <button
                  type="button"
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-accent text-left"
                  onClick={handleImportClick}
                >
                  <FileSpreadsheet className="w-4 h-4 text-green-600" />
                  Google Sheets (CSV export)
                </button>
                <button
                  type="button"
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-accent text-left"
                  onClick={handleImportClick}
                >
                  <FileText className="w-4 h-4 text-red-400" />
                  PDF (table format)
                </button>
                <div className="border-t mt-1 pt-1">
                  <button
                    type="button"
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-accent text-left text-primary font-medium"
                    onClick={() => {
                      setShowImportRules(true);
                      setShowImportMenu(false);
                    }}
                    data-ocid="leads.import_rules_button"
                  >
                    <BookOpen className="w-4 h-4" />
                    View Import Rules & Template
                  </button>
                </div>
                <div className="px-3 pt-1 pb-2 text-xs text-muted-foreground border-t mt-1">
                  Supported: {IMPORT_FORMATS}
                </div>
              </div>
            )}
          </div>

          {/* Export dropdown */}
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => {
                setShowExportMenu((v) => !v);
                setShowImportMenu(false);
              }}
              className="gap-2"
              data-ocid="leads.export_button"
            >
              <Download className="w-4 h-4" />
              Export
              <ChevronDown className="w-3 h-3 ml-1" />
            </Button>
            {showExportMenu && (
              <div
                className="absolute right-0 top-full mt-1 z-50 min-w-[200px] rounded-lg border bg-popover shadow-lg py-1"
                onMouseLeave={() => setShowExportMenu(false)}
              >
                <div className="px-3 py-1.5 text-xs text-muted-foreground font-medium uppercase tracking-wider border-b mb-1">
                  Export as
                </div>
                <button
                  type="button"
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-accent text-left"
                  onClick={handleExportCSV}
                >
                  <FileSpreadsheet className="w-4 h-4 text-blue-400" />
                  CSV
                </button>
                <button
                  type="button"
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-accent text-left"
                  onClick={handleExportExcel}
                >
                  <FileSpreadsheet className="w-4 h-4 text-green-500" />
                  Excel (.xls)
                </button>
                <button
                  type="button"
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-accent text-left"
                  onClick={handleExportPDF}
                >
                  <FileText className="w-4 h-4 text-red-400" />
                  PDF
                </button>
              </div>
            )}
          </div>

          <Button
            onClick={openCreate}
            className="gap-2"
            data-ocid="leads.add_lead_button"
          >
            <Plus className="w-4 h-4" />
            Add Lead
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kanbanColumns.map((status) => {
          const count = leads.filter((l) => l.status === status).length;
          return (
            <Card key={status}>
              <CardContent className="pt-4 pb-4">
                <div className="text-2xl font-bold">{count}</div>
                <div className="text-sm text-muted-foreground">
                  {statusLabels[status]}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="qualified">Qualified</SelectItem>
            <SelectItem value="proposal_sent">Proposal Sent</SelectItem>
            <SelectItem value="closed_won">Closed Won</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("table")}
          >
            Table
          </Button>
          <Button
            variant={viewMode === "kanban" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("kanban")}
          >
            Kanban
          </Button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : viewMode === "table" ? (
        <Card>
          <CardContent className="p-0">
            {filteredLeads.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <User className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p>No leads found. Add your first lead!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                        Name
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                        Email
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                        Phone
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                        Status
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                        Notes
                      </th>
                      <th className="text-right p-4 text-sm font-medium text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map((lead) => (
                      <tr
                        key={lead.id.toString()}
                        className="border-b hover:bg-muted/20 transition-colors"
                      >
                        <td className="p-4 font-medium">{lead.name}</td>
                        <td className="p-4 text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {lead.email}
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {lead.phone}
                          </div>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[lead.status as string]}`}
                          >
                            {statusLabels[lead.status as string]}
                          </span>
                        </td>
                        <td className="p-4 text-muted-foreground text-sm max-w-xs truncate">
                          {lead.notes}
                        </td>
                        <td className="p-4">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEdit(lead)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => setDeleteId(lead.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        /* Kanban View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kanbanColumns.map((status) => {
            const columnLeads = filteredLeads.filter(
              (l) => l.status === status,
            );
            return (
              <div key={status} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm">
                    {statusLabels[status]}
                  </h3>
                  <Badge variant="secondary">{columnLeads.length}</Badge>
                </div>
                <div className="space-y-2 min-h-[100px]">
                  {columnLeads.map((lead) => (
                    <Card
                      key={lead.id.toString()}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">
                              {lead.name}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {lead.email}
                            </p>
                            {lead.notes && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {lead.notes}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-1 shrink-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => openEdit(lead)}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-destructive hover:text-destructive"
                              onClick={() => setDeleteId(lead.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsModalOpen(false);
            setEditingLead(null);
            setFormData(defaultFormData);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingLead ? "Edit Lead" : "Add New Lead"}
            </DialogTitle>
            <DialogDescription>
              {editingLead
                ? "Update the lead information below."
                : "Fill in the details to add a new lead."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label htmlFor="lead-name">Name *</Label>
              <Input
                id="lead-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Full name"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="lead-email">Email</Label>
              <Input
                id="lead-email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="email@example.com"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="lead-phone">Phone</Label>
              <Input
                id="lead-phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="lead-status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(val) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: val as LeadStatus,
                  }))
                }
              >
                <SelectTrigger id="lead-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={LeadStatus.new}>New</SelectItem>
                  <SelectItem value={LeadStatus.contacted}>
                    Contacted
                  </SelectItem>
                  <SelectItem value={LeadStatus.qualified}>
                    Qualified
                  </SelectItem>
                  <SelectItem value={LeadStatus.proposal_sent}>
                    Proposal Sent
                  </SelectItem>
                  <SelectItem value={LeadStatus.closed_won}>
                    Closed Won
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="lead-notes">Notes</Label>
              <Textarea
                id="lead-notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, notes: e.target.value }))
                }
                placeholder="Additional notes..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setEditingLead(null);
                setFormData(defaultFormData);
              }}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editingLead ? "Update Lead" : "Save Lead"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Rules Dialog */}
      <Dialog open={showImportRules} onOpenChange={setShowImportRules}>
        <DialogContent
          className="sm:max-w-2xl max-h-[90vh] overflow-y-auto"
          data-ocid="leads.import_rules_modal"
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Import Rules & Format Guide
            </DialogTitle>
            <DialogDescription>
              Follow these rules to ensure your data imports correctly into Lead
              Management.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2 text-sm">
            {/* Required columns */}
            <div>
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-1">
                <Info className="w-4 h-4 text-blue-500" /> Required &amp;
                Optional Columns
              </h3>
              <div className="rounded-lg border overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-muted/50 border-b">
                      <th className="text-left p-2 font-medium">
                        Column Name(s)
                      </th>
                      <th className="text-left p-2 font-medium">Field</th>
                      <th className="text-left p-2 font-medium">Required?</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-2 font-mono text-xs">
                        name, full_name, contact_name, lead_name
                      </td>
                      <td className="p-2">Name</td>
                      <td className="p-2 text-red-500 font-medium">Required</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-mono text-xs">
                        email, email_address, e_mail
                      </td>
                      <td className="p-2">Email</td>
                      <td className="p-2 text-muted-foreground">Optional</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-mono text-xs">
                        phone, phone_number, mobile, contact
                      </td>
                      <td className="p-2">Phone</td>
                      <td className="p-2 text-muted-foreground">Optional</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-mono text-xs">
                        status, lead_status, stage
                      </td>
                      <td className="p-2">Status</td>
                      <td className="p-2 text-muted-foreground">
                        Optional (defaults to New)
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 font-mono text-xs">
                        notes, note, comments, description, text
                      </td>
                      <td className="p-2">Notes</td>
                      <td className="p-2 text-muted-foreground">Optional</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Status values */}
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                Status Values (optional field)
              </h3>
              <p className="text-muted-foreground text-xs mb-2">
                The status column is <strong>optional</strong>. If left blank or
                unrecognized, it defaults to <strong>New</strong>. Accepted
                values (case-insensitive):
              </p>
              <div className="rounded-lg border overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-muted/50 border-b">
                      <th className="text-left p-2 font-medium">
                        Value in file
                      </th>
                      <th className="text-left p-2 font-medium">Maps to</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-2 font-mono">new, open, lead</td>
                      <td className="p-2">
                        <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                          New
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-mono">
                        contacted, contact, follow_up
                      </td>
                      <td className="p-2">
                        <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-xs font-medium">
                          Contacted
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-mono">qualified, qualify</td>
                      <td className="p-2">
                        <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium">
                          Qualified
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-mono">
                        proposal_sent, proposal sent, proposal, sent
                      </td>
                      <td className="p-2">
                        <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 text-xs font-medium">
                          Proposal Sent
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 font-mono">
                        closed_won, closed won, closed, won, close
                      </td>
                      <td className="p-2">
                        <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                          Closed Won
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Format rules */}
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                Format-Specific Rules
              </h3>
              <div className="space-y-3">
                <div className="rounded-lg border p-3 bg-green-50 dark:bg-green-950/20">
                  <div className="flex items-center gap-2 font-medium mb-1">
                    <FileSpreadsheet className="w-4 h-4 text-green-600" /> Excel
                    (.xlsx / .xls)
                  </div>
                  <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Row 1 must be the header row with column names</li>
                    <li>Remove merged cells before importing</li>
                    <li>Remove blank rows at the top of the sheet</li>
                    <li>
                      Column names are case-insensitive (Name = name = NAME)
                    </li>
                    <li>Only the first sheet/tab is imported</li>
                  </ul>
                </div>
                <div className="rounded-lg border p-3 bg-blue-50 dark:bg-blue-950/20">
                  <div className="flex items-center gap-2 font-medium mb-1">
                    <FileSpreadsheet className="w-4 h-4 text-blue-600" /> Google
                    Sheets (CSV export)
                  </div>
                  <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                    <li>
                      Export as:{" "}
                      <strong>File &gt; Download &gt; CSV (.csv)</strong>
                    </li>
                    <li>Row 1 must be the header row</li>
                    <li>Supports comma, semicolon, or tab separators</li>
                    <li>UTF-8 encoding is recommended</li>
                    <li>
                      Status column is optional — leave blank to default to New
                    </li>
                  </ul>
                </div>
                <div className="rounded-lg border p-3 bg-red-50 dark:bg-red-950/20">
                  <div className="flex items-center gap-2 font-medium mb-1">
                    <FileText className="w-4 h-4 text-red-500" /> PDF
                  </div>
                  <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                    <li>
                      PDF must contain a <strong>structured table</strong> (not
                      plain paragraph text)
                    </li>
                    <li>First row of the table must be the header</li>
                    <li>
                      Column headers must match the accepted names listed above
                    </li>
                    <li>
                      Plain narrative PDFs or scanned images will not parse
                      correctly
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Sample template */}
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                Sample Data Template
              </h3>
              <p className="text-xs text-muted-foreground mb-2">
                Copy this structure into Excel or Google Sheets:
              </p>
              <div className="rounded-lg border overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-muted/50 border-b">
                      <th className="text-left p-2 font-mono font-bold">
                        name
                      </th>
                      <th className="text-left p-2 font-mono font-bold">
                        email
                      </th>
                      <th className="text-left p-2 font-mono font-bold">
                        phone
                      </th>
                      <th className="text-left p-2 font-mono font-bold">
                        status
                      </th>
                      <th className="text-left p-2 font-mono font-bold">
                        notes
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-2">Raj Kumar</td>
                      <td className="p-2">raj@email.com</td>
                      <td className="p-2">9876543210</td>
                      <td className="p-2">New</td>
                      <td className="p-2">Interested in AI package</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2">Priya Singh</td>
                      <td className="p-2">priya@email.com</td>
                      <td className="p-2">9123456789</td>
                      <td className="p-2">Contacted</td>
                      <td className="p-2">Follow up next week</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2">Arjun Mehta</td>
                      <td className="p-2">arjun@email.com</td>
                      <td className="p-2">9988776655</td>
                      <td className="p-2">Qualified</td>
                      <td className="p-2">Ready for proposal</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2">Sneha Patel</td>
                      <td className="p-2">sneha@email.com</td>
                      <td className="p-2">9871234560</td>
                      <td className="p-2">Proposal Sent</td>
                      <td className="p-2">Awaiting response</td>
                    </tr>
                    <tr>
                      <td className="p-2">Vikram Rao</td>
                      <td className="p-2">vikram@email.com</td>
                      <td className="p-2">9765432100</td>
                      <td className="p-2">Closed Won</td>
                      <td className="p-2">Purchased Growth Pack</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                <strong>Tip:</strong> The status column is optional. You can
                leave it blank — the app will automatically assign{" "}
                <strong>New</strong>.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={() => setShowImportRules(false)}
              data-ocid="leads.import_rules_close_button"
            >
              Got it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Lead</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this lead? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              disabled={deleteLead.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteLead.isPending}
            >
              {deleteLead.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
