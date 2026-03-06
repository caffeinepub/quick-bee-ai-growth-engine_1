import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ChevronDown,
  Copy,
  Download,
  Edit2,
  Eye,
  EyeOff,
  FileSpreadsheet,
  FileText,
  GripVertical,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import React, { useRef, useState } from "react";
import { toast } from "sonner";
import LiveDataBadge from "../components/LiveDataBadge";
import {
  useCreateService,
  useDeleteService,
  useDuplicateService,
  useReorderServices,
  useServices,
  useSetServiceVisibilityById,
  useUpdateService,
} from "../hooks/useQueries";
import type { Addon, Package, Service } from "../hooks/useQueries";
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

const CATEGORIES = [
  "Web Development",
  "E-Commerce",
  "Social Media",
  "Digital Marketing",
  "Content",
  "Design",
  "Video",
  "App Development",
  "Business Solutions",
  "Photography",
];
const PKG_NAMES = ["Basic", "Standard", "Premium", "Enterprise"];

const DEFAULT_IMAGE = "/assets/generated/icon-services.dim_128x128.png";

function formatINR(n: number | bigint) {
  return `₹${Number(n).toLocaleString("en-IN")}`;
}

interface ServiceFormData {
  title: string;
  category: string;
  description: string;
  packages: { name: string; price: string; features: string }[];
  addons: { name: string; price: string }[];
  imageUrl: string;
  isVisible: boolean;
}

const defaultForm: ServiceFormData = {
  title: "",
  category: "Web Development",
  description: "",
  packages: PKG_NAMES.map((name) => ({ name, price: "", features: "" })),
  addons: [],
  imageUrl: DEFAULT_IMAGE,
  isVisible: true,
};

function serviceToForm(s: Service): ServiceFormData {
  return {
    title: s.title,
    category: s.category,
    description: s.description,
    packages: PKG_NAMES.map((pkgName) => {
      const p = s.packages.find((pk) => pk.name === pkgName);
      return {
        name: pkgName,
        price: p ? p.price.toString() : "",
        features: p ? p.features.join("\n") : "",
      };
    }),
    addons: s.addons.map((a) => ({ name: a.name, price: a.price.toString() })),
    imageUrl: s.imageUrl ?? DEFAULT_IMAGE,
    isVisible: s.isVisible,
  };
}

function formToService(form: ServiceFormData): {
  packages: Package[];
  addons: Addon[];
  isVisible: boolean;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
} {
  const packages: Package[] = form.packages
    .filter((p) => p.price.trim() !== "")
    .map((p) => ({
      name: p.name,
      price: BigInt(Number.parseInt(p.price) || 0),
      features: p.features
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean),
    }));
  const addons: Addon[] = form.addons
    .filter((a) => a.name.trim() !== "")
    .map((a) => ({
      name: a.name,
      price: BigInt(Number.parseInt(a.price) || 0),
    }));
  return {
    title: form.title,
    category: form.category,
    description: form.description,
    packages,
    addons,
    imageUrl: form.imageUrl,
    isVisible: form.isVisible,
  };
}

function EditServiceModal({
  open,
  onClose,
  service,
  onSubmit,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  service?: Service;
  onSubmit: (data: ServiceFormData) => void;
  loading: boolean;
}) {
  const [form, setForm] = useState<ServiceFormData>(
    service ? serviceToForm(service) : defaultForm,
  );

  React.useEffect(() => {
    if (open) setForm(service ? serviceToForm(service) : defaultForm);
  }, [open, service]);

  const updatePackage = (
    i: number,
    field: "price" | "features",
    value: string,
  ) => {
    setForm((prev) => {
      const packages = [...prev.packages];
      packages[i] = { ...packages[i], [field]: value };
      return { ...prev, packages };
    });
  };

  const addAddon = () =>
    setForm((prev) => ({
      ...prev,
      addons: [...prev.addons, { name: "", price: "" }],
    }));
  const removeAddon = (i: number) =>
    setForm((prev) => ({
      ...prev,
      addons: prev.addons.filter((_, idx) => idx !== i),
    }));
  const updateAddon = (i: number, field: "name" | "price", value: string) => {
    setForm((prev) => {
      const addons = [...prev.addons];
      addons[i] = { ...addons[i], [field]: value };
      return { ...prev, addons };
    });
  };

  const inputStyle = {
    background: "rgba(0,180,166,0.05)",
    borderColor: "rgba(0,180,166,0.2)",
    color: "#e8f5f4",
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        style={{
          background: "rgba(8,12,12,0.98)",
          borderColor: "rgba(0,180,166,0.2)",
          color: "#e8f5f4",
        }}
      >
        <DialogHeader>
          <DialogTitle className="teal-gradient-text font-display">
            {service ? "Edit Service" : "Create New Service"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-5 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-white/70 text-xs mb-1 block">
                Service Name
              </Label>
              <Input
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
                style={inputStyle}
              />
            </div>
            <div>
              <Label className="text-white/70 text-xs mb-1 block">
                Category
              </Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm((p) => ({ ...p, category: v }))}
              >
                <SelectTrigger style={inputStyle}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  style={{
                    background: "#0d1414",
                    borderColor: "rgba(0,180,166,0.2)",
                  }}
                >
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c} style={{ color: "#e8f5f4" }}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label className="text-white/70 text-xs mb-1 block">
              Description
            </Label>
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              rows={2}
              style={inputStyle}
            />
          </div>
          <div>
            <Label className="text-white/70 text-xs mb-2 block">Packages</Label>
            <div className="space-y-3">
              {form.packages.map((pkg, i) => (
                <div
                  key={pkg.name}
                  className="p-3 rounded-lg"
                  style={{
                    background: "rgba(0,180,166,0.04)",
                    border: "1px solid rgba(0,180,166,0.12)",
                  }}
                >
                  <div
                    className="text-xs font-semibold mb-2"
                    style={{ color: "#00d4c8" }}
                  >
                    {pkg.name}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-white/50 text-xs mb-1 block">
                        Price (INR)
                      </Label>
                      <Input
                        value={pkg.price}
                        onChange={(e) =>
                          updatePackage(i, "price", e.target.value)
                        }
                        placeholder="e.g. 4999"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <Label className="text-white/50 text-xs mb-1 block">
                        Features (one per line)
                      </Label>
                      <Textarea
                        value={pkg.features}
                        onChange={(e) =>
                          updatePackage(i, "features", e.target.value)
                        }
                        rows={2}
                        style={inputStyle}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-white/70 text-xs">Add-ons</Label>
              <Button
                size="sm"
                variant="ghost"
                onClick={addAddon}
                className="text-teal text-xs h-6 px-2"
              >
                + Add
              </Button>
            </div>
            {form.addons.map((addon, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: addon list has no stable ID
              <div key={i} className="flex gap-2 mb-2">
                <Input
                  value={addon.name}
                  onChange={(e) => updateAddon(i, "name", e.target.value)}
                  placeholder="Add-on name"
                  style={inputStyle}
                  className="flex-1"
                />
                <Input
                  value={addon.price}
                  onChange={(e) => updateAddon(i, "price", e.target.value)}
                  placeholder="Price"
                  style={inputStyle}
                  className="w-24"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeAddon(i)}
                  className="text-red-400 px-2"
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 pt-2">
            <Switch
              checked={form.isVisible}
              onCheckedChange={(v) => setForm((p) => ({ ...p, isVisible: v }))}
            />
            <Label className="text-white/70 text-xs">Visible in catalog</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose} className="text-white/50">
            Cancel
          </Button>
          <Button
            onClick={() => onSubmit(form)}
            disabled={loading || !form.title.trim()}
            className="btn-teal"
          >
            {loading ? "Saving..." : "Save Service"}
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
  const setServiceVisibilityById = useSetServiceVisibilityById();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [editService, setEditService] = useState<Service | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [toggleError, setToggleError] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [showImportMenu, setShowImportMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const sorted = [...services];

  const visibleCount = services.filter((s) => s.isVisible).length;
  const hiddenCount = services.filter((s) => !s.isVisible).length;

  const handleCreate = async (form: ServiceFormData) => {
    const data = formToService(form);
    await createService.mutateAsync(data);
    setAddOpen(false);
  };

  const handleUpdate = async (form: ServiceFormData) => {
    if (!editService) return;
    const data = formToService(form);
    await updateService.mutateAsync({ id: editService.id, ...data });
    setEditService(null);
  };

  const handleDelete = async () => {
    if (deleteId === null) return;
    await deleteService.mutateAsync(deleteId);
    setDeleteId(null);
  };

  const handleDuplicate = async (id: string) => {
    await duplicateService.mutateAsync(id);
  };

  const handleToggleVisibility = async (service: Service) => {
    setTogglingId(service.id);
    setToggleError(null);
    try {
      await setServiceVisibilityById.mutateAsync({
        id: service.id,
        isVisible: !service.isVisible,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setToggleError(message);
    } finally {
      setTogglingId(null);
    }
  };

  // suppress unused warning — reorderServices is kept for API compatibility
  void reorderServices;

  const getExportData = () =>
    services.map((s) => ({
      title: s.title,
      category: s.category,
      description: s.description,
      packages: s.packages
        .map((p) => `${p.name}:${Number(p.price)}`)
        .join(" | "),
      addons: s.addons.map((a) => `${a.name}:${Number(a.price)}`).join(" | "),
      isVisible: s.isVisible ? "Yes" : "No",
    }));

  const handleExportCSV = () => {
    downloadAsCSV(getExportData(), "services-export.csv");
    toast.success(`Exported ${services.length} service(s) to CSV`);
    setShowExportMenu(false);
  };

  const handleExportExcel = () => {
    downloadAsExcel(getExportData(), "services-export.xls");
    toast.success(`Exported ${services.length} service(s) to Excel`);
    setShowExportMenu(false);
  };

  const handleExportPDF = () => {
    downloadAsPDF(getExportData(), "services-export.pdf", "Services Catalog");
    toast.success(`Exported ${services.length} service(s) to PDF`);
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

      let imported = 0;
      for (const row of rows) {
        const title =
          row.title ?? row.service_name ?? row.name ?? row.service ?? "";
        if (!title.trim()) continue;

        const category =
          row.category ?? row.service_category ?? row.type ?? "Web Development";
        const description = row.description ?? row.desc ?? row.details ?? "";

        // Parse basic price fields
        const priceVal = Number(
          row.price ?? row.basic_price ?? row.amount ?? row.cost ?? "0",
        );
        const packages: Package[] = [];
        if (priceVal > 0) {
          packages.push({
            name: "Basic",
            price: BigInt(priceVal),
            features: [],
          });
        }

        await createService.mutateAsync({
          title: title.trim(),
          category: category.trim() || "Web Development",
          description: description.trim(),
          packages,
          addons: [],
          imageUrl: "/assets/generated/icon-services.dim_128x128.png",
          isVisible:
            (row.is_visible ?? row.visible ?? "yes").toLowerCase() !== "no",
        });
        imported++;
      }

      if (imported === 0) {
        toast.error(
          'No valid services found. Ensure file has a "title" or "name" column.',
        );
      } else {
        toast.success(`Successfully imported ${imported} service(s)`);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to import file";
      toast.error(message);
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={IMPORT_ACCEPT}
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="page-header mb-0">
            <div className="flex items-center gap-3">
              <img
                src="/assets/generated/icon-services.dim_128x128.png"
                alt=""
                className="w-10 h-10 rounded-xl"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="page-title mb-0">Service Management</h1>
                  <LiveDataBadge />
                </div>
                <p className="page-subtitle">
                  {services.length} services configured
                </p>
              </div>
            </div>
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
                disabled={isImporting}
                className="gap-2 text-white/70 border-teal/20 hover:border-teal/40"
                data-ocid="service_management.import_button"
              >
                {isImporting ? (
                  <span className="w-4 h-4 border-2 border-teal/30 border-t-teal rounded-full animate-spin inline-block" />
                ) : (
                  <Upload size={14} />
                )}
                Import
                <ChevronDown size={12} />
              </Button>
              {showImportMenu && (
                <div
                  className="absolute right-0 top-full mt-1 z-50 min-w-[230px] rounded-lg shadow-xl py-1"
                  style={{
                    background: "#0d1414",
                    border: "1px solid rgba(0,180,166,0.2)",
                  }}
                  onMouseLeave={() => setShowImportMenu(false)}
                >
                  <div
                    className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider border-b mb-1"
                    style={{
                      color: "#00d4c8",
                      borderColor: "rgba(0,180,166,0.15)",
                    }}
                  >
                    Import from
                  </div>
                  <button
                    type="button"
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-teal/5 text-left"
                    onClick={handleImportClick}
                  >
                    <FileSpreadsheet size={14} className="text-green-400" />
                    Excel (.xlsx / .xls)
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-teal/5 text-left"
                    onClick={handleImportClick}
                  >
                    <FileSpreadsheet size={14} className="text-green-500" />
                    Google Sheets (CSV export)
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-teal/5 text-left"
                    onClick={handleImportClick}
                  >
                    <FileText size={14} className="text-red-400" />
                    PDF
                  </button>
                  <div
                    className="px-3 pt-2 pb-1 text-xs border-t mt-1"
                    style={{
                      color: "rgba(232,245,244,0.4)",
                      borderColor: "rgba(0,180,166,0.1)",
                    }}
                  >
                    {IMPORT_FORMATS}
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
                className="gap-2 text-white/70 border-teal/20 hover:border-teal/40"
                data-ocid="service_management.export_button"
              >
                <Download size={14} />
                Export
                <ChevronDown size={12} />
              </Button>
              {showExportMenu && (
                <div
                  className="absolute right-0 top-full mt-1 z-50 min-w-[200px] rounded-lg shadow-xl py-1"
                  style={{
                    background: "#0d1414",
                    border: "1px solid rgba(0,180,166,0.2)",
                  }}
                  onMouseLeave={() => setShowExportMenu(false)}
                >
                  <div
                    className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider border-b mb-1"
                    style={{
                      color: "#00d4c8",
                      borderColor: "rgba(0,180,166,0.15)",
                    }}
                  >
                    Export as
                  </div>
                  <button
                    type="button"
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-teal/5 text-left"
                    onClick={handleExportCSV}
                  >
                    <FileSpreadsheet size={14} className="text-blue-400" />
                    CSV
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-teal/5 text-left"
                    onClick={handleExportExcel}
                  >
                    <FileSpreadsheet size={14} className="text-green-400" />
                    Excel (.xls)
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-teal/5 text-left"
                    onClick={handleExportPDF}
                  >
                    <FileText size={14} className="text-red-400" />
                    PDF
                  </button>
                </div>
              )}
            </div>

            <Button
              onClick={() => setAddOpen(true)}
              className="btn-teal"
              data-ocid="service_management.add_service_button"
            >
              <Plus size={16} />
              <span className="ml-2">Add Service</span>
            </Button>
          </div>
        </div>

        {toggleError && (
          <div
            className="rounded-lg px-4 py-3 text-sm"
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              color: "#fca5a5",
            }}
          >
            {toggleError}
          </div>
        )}

        <div className="grid grid-cols-3 gap-4">
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold teal-gradient-text">
              {services.length}
            </div>
            <div className="text-xs text-white/40 mt-0.5">Total Services</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {visibleCount}
            </div>
            <div className="text-xs text-white/40 mt-0.5">Visible</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white/40">
              {hiddenCount}
            </div>
            <div className="text-xs text-white/40 mt-0.5">Hidden</div>
          </div>
        </div>

        {!isLoading && services.length > 0 && (
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr
                    style={{
                      borderBottom: "1px solid rgba(0,180,166,0.15)",
                      background: "rgba(0,180,166,0.05)",
                    }}
                  >
                    {[
                      "",
                      "Service",
                      "Category",
                      "Packages",
                      "Visibility",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider"
                        style={{ color: "#00d4c8" }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((service) => (
                    <tr
                      key={service.id}
                      style={{ borderBottom: "1px solid rgba(0,180,166,0.08)" }}
                      className="hover:bg-teal/5 transition-colors"
                    >
                      <td className="px-4 py-3 text-white/20">
                        <GripVertical size={14} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-white">
                          {service.title}
                        </div>
                        <div className="text-xs text-white/40 mt-0.5 max-w-xs truncate">
                          {service.description}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="text-xs px-2 py-1 rounded-full"
                          style={{
                            background: "rgba(0,180,166,0.1)",
                            color: "#00d4c8",
                          }}
                        >
                          {service.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-white/60 text-xs">
                        {service.packages.length > 0 ? (
                          <div className="space-y-0.5">
                            {service.packages.slice(0, 2).map((p) => (
                              <div key={p.name}>
                                {p.name}: {formatINR(p.price)}
                              </div>
                            ))}
                            {service.packages.length > 2 && (
                              <div className="text-white/30">
                                +{service.packages.length - 2} more
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-white/30">No packages</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              onClick={() => handleToggleVisibility(service)}
                              disabled={togglingId === service.id}
                              className={`p-1.5 rounded-lg transition-colors ${service.isVisible ? "text-green-400 hover:bg-green-500/10" : "text-white/30 hover:bg-white/5"}`}
                            >
                              {service.isVisible ? (
                                <Eye size={16} />
                              ) : (
                                <EyeOff size={16} />
                              )}
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {service.isVisible
                              ? "Visible in catalog"
                              : "Hidden from catalog"}
                          </TooltipContent>
                        </Tooltip>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => setEditService(service)}
                            className="p-1.5 rounded-lg hover:bg-teal/10 text-white/40 hover:text-teal transition-colors"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDuplicate(service.id)}
                            className="p-1.5 rounded-lg hover:bg-teal/10 text-white/40 hover:text-teal transition-colors"
                          >
                            <Copy size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteId(service.id)}
                            className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-colors"
                          >
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
        )}

        {isLoading && (
          <div className="glass-card rounded-xl p-12 text-center">
            <div
              className="animate-spin w-8 h-8 border-2 border-teal/30 border-t-teal rounded-full mx-auto mb-3"
              style={{ borderTopColor: "#00d4c8" }}
            />
            <p style={{ color: "rgba(232,245,244,0.5)" }}>
              Loading services...
            </p>
          </div>
        )}

        <EditServiceModal
          open={addOpen}
          onClose={() => setAddOpen(false)}
          onSubmit={handleCreate}
          loading={createService.isPending}
        />
        <EditServiceModal
          open={!!editService}
          onClose={() => setEditService(null)}
          service={editService ?? undefined}
          onSubmit={handleUpdate}
          loading={updateService.isPending}
        />

        <AlertDialog
          open={deleteId !== null}
          onOpenChange={() => setDeleteId(null)}
        >
          <AlertDialogContent
            style={{
              background: "rgba(8,12,12,0.97)",
              borderColor: "rgba(0,180,166,0.2)",
            }}
          >
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">
                Delete Service?
              </AlertDialogTitle>
              <AlertDialogDescription
                style={{ color: "rgba(232,245,244,0.6)" }}
              >
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="text-white/60">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-500/80 hover:bg-red-500 text-white"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  );
}
