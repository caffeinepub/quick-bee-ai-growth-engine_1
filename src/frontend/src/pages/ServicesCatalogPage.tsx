import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowRight,
  BarChart2,
  Camera,
  Check,
  ChevronRight,
  Code,
  Cpu,
  Database,
  FileText,
  Filter,
  Globe,
  Grid3X3,
  Layers,
  List,
  Mail,
  Megaphone,
  MessageSquare,
  Package,
  Palette,
  Search,
  Settings,
  Share2,
  Shield,
  ShoppingCart,
  Sparkles,
  Star,
  Tag,
  Target,
  TrendingUp,
  Users,
  Video,
  X,
  Zap,
} from "lucide-react";
import React, { useState, useMemo } from "react";
import { useCart } from "../contexts/CartContext";
import { useServices } from "../hooks/useQueries";
import type { Service } from "../hooks/useQueries";

// ─── Master Plans ────────────────────────────────────────────────────────────

interface MasterPlan {
  name: string;
  tagline: string;
  priceINR: number;
  color: string;
  accentBg: string;
  badge?: string;
  features: string[];
}

const masterPlans: MasterPlan[] = [
  {
    name: "Starter",
    tagline: "Perfect for new businesses",
    priceINR: 4999,
    color: "#00d4c8",
    accentBg: "rgba(0,212,200,0.08)",
    features: [
      "Up to 3 services",
      "Basic analytics",
      "Email support",
      "5 GB storage",
    ],
  },
  {
    name: "Growth",
    tagline: "Scale your digital presence",
    priceINR: 12499,
    color: "#f59e0b",
    accentBg: "rgba(245,158,11,0.08)",
    badge: "Popular",
    features: [
      "Up to 10 services",
      "Advanced analytics",
      "Priority support",
      "25 GB storage",
      "Custom domain",
    ],
  },
  {
    name: "Pro",
    tagline: "For established agencies",
    priceINR: 24999,
    color: "#8b5cf6",
    accentBg: "rgba(139,92,246,0.08)",
    features: [
      "Unlimited services",
      "Full analytics suite",
      "24/7 support",
      "100 GB storage",
      "White-label",
      "API access",
    ],
  },
  {
    name: "Enterprise",
    tagline: "Custom solutions at scale",
    priceINR: 49999,
    color: "#ec4899",
    accentBg: "rgba(236,72,153,0.08)",
    features: [
      "Everything in Pro",
      "Dedicated manager",
      "SLA guarantee",
      "Unlimited storage",
      "Custom integrations",
      "On-site training",
    ],
  },
];

// ─── Category Icons ───────────────────────────────────────────────────────────

const categoryIcons: Record<string, React.ReactNode> = {
  "Social Media": <Share2 size={16} />,
  SEO: <TrendingUp size={16} />,
  "Paid Ads": <Target size={16} />,
  "Content Marketing": <FileText size={16} />,
  "Email Marketing": <Mail size={16} />,
  "Web Development": <Code size={16} />,
  "Graphic Design": <Palette size={16} />,
  "Video Production": <Video size={16} />,
  Photography: <Camera size={16} />,
  Analytics: <BarChart2 size={16} />,
  Automation: <Cpu size={16} />,
  CRM: <Users size={16} />,
  "E-commerce": <ShoppingCart size={16} />,
  Branding: <Sparkles size={16} />,
  "PR & Outreach": <Megaphone size={16} />,
  Consulting: <MessageSquare size={16} />,
  "Web3 & Blockchain": <Globe size={16} />,
  "Business & Agency": <Layers size={16} />,
  "Project Management": <Settings size={16} />,
  Security: <Shield size={16} />,
  "Data & Analytics": <Database size={16} />,
};

function getCategoryIcon(category: string) {
  return categoryIcons[category] ?? <Package size={16} />;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatINR(n: number | bigint) {
  return `₹${Number(n).toLocaleString("en-IN")}`;
}

function getMinPrice(service: Service): bigint | null {
  if (!service.packages.length) return null;
  return service.packages.reduce(
    (min, p) => (p.price < min ? p.price : min),
    service.packages[0].price,
  );
}

// ─── Service Card ─────────────────────────────────────────────────────────────

interface ServiceCardProps {
  service: Service;
  onPreview: (service: Service) => void;
  viewMode: "grid" | "list";
}

function ServiceCard({ service, onPreview, viewMode }: ServiceCardProps) {
  const minPrice = getMinPrice(service);

  if (viewMode === "list") {
    return (
      <div
        className="group flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200"
        style={{
          background: "rgba(0,180,166,0.03)",
          border: "1px solid rgba(0,180,166,0.1)",
        }}
        onClick={() => onPreview(service)}
        onKeyUp={(e) => e.key === "Enter" && onPreview(service)}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.background =
            "rgba(0,180,166,0.07)";
          (e.currentTarget as HTMLDivElement).style.borderColor =
            "rgba(0,180,166,0.25)";
          (e.currentTarget as HTMLDivElement).style.transform =
            "translateX(4px)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.background =
            "rgba(0,180,166,0.03)";
          (e.currentTarget as HTMLDivElement).style.borderColor =
            "rgba(0,180,166,0.1)";
          (e.currentTarget as HTMLDivElement).style.transform = "translateX(0)";
        }}
      >
        {/* Icon */}
        <div
          className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ background: "rgba(0,180,166,0.1)", color: "#00d4c8" }}
        >
          {getCategoryIcon(service.category)}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3
              className="font-semibold text-sm truncate"
              style={{ color: "#e8f5f4" }}
            >
              {service.title}
            </h3>
          </div>
          <p
            className="text-xs truncate"
            style={{ color: "rgba(232,245,244,0.45)" }}
          >
            {service.description}
          </p>
        </div>

        {/* Category */}
        <div className="hidden sm:block flex-shrink-0">
          <span
            className="text-xs px-2 py-1 rounded-full"
            style={{
              background: "rgba(0,180,166,0.1)",
              color: "#00d4c8",
              border: "1px solid rgba(0,180,166,0.2)",
            }}
          >
            {service.category}
          </span>
        </div>

        {/* Price */}
        <div className="flex-shrink-0 text-right">
          {minPrice !== null ? (
            <div>
              <div
                className="text-xs"
                style={{ color: "rgba(232,245,244,0.4)" }}
              >
                from
              </div>
              <div className="text-sm font-bold" style={{ color: "#00d4c8" }}>
                {formatINR(minPrice)}
              </div>
            </div>
          ) : (
            <div className="text-xs" style={{ color: "rgba(232,245,244,0.3)" }}>
              Custom
            </div>
          )}
        </div>

        {/* Arrow */}
        <ChevronRight
          size={14}
          className="flex-shrink-0 opacity-0 group-hover:opacity-60 transition-opacity"
          style={{ color: "#00d4c8" }}
        />
      </div>
    );
  }

  return (
    <div
      className="group relative flex flex-col rounded-xl cursor-pointer transition-all duration-200 overflow-hidden"
      style={{
        background: "rgba(0,180,166,0.03)",
        border: "1px solid rgba(0,180,166,0.1)",
      }}
      onClick={() => onPreview(service)}
      onKeyUp={(e) => e.key === "Enter" && onPreview(service)}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.background =
          "rgba(0,180,166,0.07)";
        (e.currentTarget as HTMLDivElement).style.borderColor =
          "rgba(0,180,166,0.28)";
        (e.currentTarget as HTMLDivElement).style.transform =
          "translateY(-3px)";
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 12px 32px rgba(0,0,0,0.4), 0 0 20px rgba(0,180,166,0.08)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.background =
          "rgba(0,180,166,0.03)";
        (e.currentTarget as HTMLDivElement).style.borderColor =
          "rgba(0,180,166,0.1)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
      }}
    >
      {/* Top accent line */}
      <div
        className="h-0.5 w-full opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: "linear-gradient(90deg, #00b4a6, #00d4c8)" }}
      />

      <div className="p-4 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(0,180,166,0.1)", color: "#00d4c8" }}
          >
            {getCategoryIcon(service.category)}
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Star size={11} style={{ color: "#00d4c8" }} />
          </div>
        </div>

        {/* Title */}
        <h3
          className="font-semibold text-sm mb-1.5 leading-snug group-hover:text-teal transition-colors"
          style={{ color: "#e8f5f4" }}
        >
          {service.title}
        </h3>

        {/* Description */}
        <p
          className="text-xs mb-3 line-clamp-2 flex-1"
          style={{ color: "rgba(232,245,244,0.45)" }}
        >
          {service.description}
        </p>

        {/* Footer */}
        <div className="mt-auto">
          <div
            className="flex items-center justify-between pt-3"
            style={{ borderTop: "1px solid rgba(0,180,166,0.08)" }}
          >
            <div>
              {minPrice !== null ? (
                <div className="flex items-baseline gap-1">
                  <span
                    className="text-xs"
                    style={{ color: "rgba(232,245,244,0.35)" }}
                  >
                    from
                  </span>
                  <span
                    className="text-sm font-bold"
                    style={{ color: "#00d4c8" }}
                  >
                    {formatINR(minPrice)}
                  </span>
                </div>
              ) : (
                <span
                  className="text-xs"
                  style={{ color: "rgba(232,245,244,0.3)" }}
                >
                  Custom pricing
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="text-xs"
                style={{ color: "rgba(232,245,244,0.25)" }}
              >
                {service.packages.length}p
                {service.addons.length > 0 && ` · ${service.addons.length}a`}
              </span>
              <ArrowRight
                size={12}
                className="opacity-0 group-hover:opacity-60 transition-opacity"
                style={{ color: "#00d4c8" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Service Preview Modal ────────────────────────────────────────────────────

interface ServicePreviewModalProps {
  service: Service | null;
  open: boolean;
  onClose: () => void;
}

function ServicePreviewModal({
  service,
  open,
  onClose,
}: ServicePreviewModalProps) {
  const { addToCart, items } = useCart();
  const [selectedPackageIdx, setSelectedPackageIdx] = useState(0);
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set());
  const [added, setAdded] = useState(false);

  React.useEffect(() => {
    if (open) {
      setSelectedPackageIdx(0);
      setSelectedAddons(new Set());
      setAdded(false);
    }
  }, [open]);

  if (!service) return null;

  const selectedPkg = service.packages[selectedPackageIdx];
  const addonTotal = Array.from(selectedAddons).reduce((sum, name) => {
    const addon = service.addons.find((a) => a.name === name);
    return sum + (addon ? Number(addon.price) : 0);
  }, 0);
  const totalPrice = selectedPkg
    ? Number(selectedPkg.price) + addonTotal
    : addonTotal;

  const toggleAddon = (name: string) => {
    setSelectedAddons((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const handleAddToCart = () => {
    if (!selectedPkg) return;
    addToCart({
      serviceId: service.id,
      serviceName: service.title,
      selectedTier: selectedPkg.name,
      selectedAddons: Array.from(selectedAddons),
      quantity: 1,
      unitPrice: totalPrice,
      totalPrice,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const alreadyInCart = items.some(
    (i) => i.serviceId === service.id && i.selectedTier === selectedPkg?.name,
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-xl max-h-[88vh] overflow-y-auto p-0"
        style={{
          background: "#0a1010",
          border: "1px solid rgba(0,180,166,0.2)",
          color: "#e8f5f4",
        }}
      >
        {/* Modal Header */}
        <div
          className="px-6 pt-6 pb-4"
          style={{ borderBottom: "1px solid rgba(0,180,166,0.1)" }}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: "rgba(0,180,166,0.12)", color: "#00d4c8" }}
            >
              {getCategoryIcon(service.category)}
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle
                className="text-base font-bold leading-tight mb-1"
                style={{ color: "#e8f5f4" }}
              >
                {service.title}
              </DialogTitle>
              <div className="flex items-center gap-2">
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    background: "rgba(0,180,166,0.1)",
                    color: "#00d4c8",
                    border: "1px solid rgba(0,180,166,0.2)",
                  }}
                >
                  {service.category}
                </span>
              </div>
            </div>
          </div>
          <DialogDescription
            className="mt-3 text-sm leading-relaxed"
            style={{ color: "rgba(232,245,244,0.6)" }}
          >
            {service.description}
          </DialogDescription>
        </div>

        <div className="px-6 py-4 space-y-5">
          {/* Packages */}
          {service.packages.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Layers size={13} style={{ color: "#00d4c8" }} />
                <h4
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "rgba(232,245,244,0.5)" }}
                >
                  Choose Package
                </h4>
              </div>
              <div className="space-y-2">
                {service.packages.map((pkg, idx) => (
                  <button
                    type="button"
                    key={pkg.name}
                    onClick={() => setSelectedPackageIdx(idx)}
                    className="w-full text-left rounded-xl p-3.5 transition-all duration-150"
                    style={{
                      background:
                        selectedPackageIdx === idx
                          ? "rgba(0,180,166,0.1)"
                          : "rgba(0,180,166,0.03)",
                      border:
                        selectedPackageIdx === idx
                          ? "1px solid rgba(0,180,166,0.4)"
                          : "1px solid rgba(0,180,166,0.08)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                          style={{
                            borderColor:
                              selectedPackageIdx === idx
                                ? "#00d4c8"
                                : "rgba(232,245,244,0.2)",
                            background:
                              selectedPackageIdx === idx
                                ? "#00d4c8"
                                : "transparent",
                          }}
                        >
                          {selectedPackageIdx === idx && (
                            <Check size={9} style={{ color: "#080c0c" }} />
                          )}
                        </div>
                        <span
                          className="text-sm font-semibold"
                          style={{
                            color:
                              selectedPackageIdx === idx
                                ? "#e8f5f4"
                                : "rgba(232,245,244,0.7)",
                          }}
                        >
                          {pkg.name}
                        </span>
                      </div>
                      <span
                        className="text-sm font-bold"
                        style={{ color: "#00d4c8" }}
                      >
                        {formatINR(pkg.price)}
                      </span>
                    </div>
                    {pkg.features.length > 0 && (
                      <ul className="ml-6 space-y-0.5">
                        {pkg.features.map((f) => (
                          <li
                            key={f}
                            className="text-xs flex items-start gap-1.5"
                            style={{ color: "rgba(232,245,244,0.5)" }}
                          >
                            <Check
                              size={10}
                              className="mt-0.5 flex-shrink-0"
                              style={{ color: "#00d4c8" }}
                            />
                            {f}
                          </li>
                        ))}
                      </ul>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add-ons */}
          {service.addons.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Zap size={13} style={{ color: "#00d4c8" }} />
                <h4
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "rgba(232,245,244,0.5)" }}
                >
                  Add-ons
                </h4>
              </div>
              <div className="space-y-1.5">
                {service.addons.map((addon) => {
                  const isSelected = selectedAddons.has(addon.name);
                  return (
                    <button
                      type="button"
                      key={addon.name}
                      onClick={() => toggleAddon(addon.name)}
                      className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg transition-all duration-150"
                      style={{
                        background: isSelected
                          ? "rgba(0,180,166,0.08)"
                          : "rgba(0,180,166,0.02)",
                        border: isSelected
                          ? "1px solid rgba(0,180,166,0.3)"
                          : "1px solid rgba(0,180,166,0.07)",
                      }}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
                          style={{
                            background: isSelected ? "#00d4c8" : "transparent",
                            border: isSelected
                              ? "none"
                              : "1px solid rgba(232,245,244,0.2)",
                          }}
                        >
                          {isSelected && (
                            <Check size={9} style={{ color: "#080c0c" }} />
                          )}
                        </div>
                        <span
                          className="text-sm"
                          style={{
                            color: isSelected
                              ? "#e8f5f4"
                              : "rgba(232,245,244,0.6)",
                          }}
                        >
                          {addon.name}
                        </span>
                      </div>
                      <span
                        className="text-sm font-medium"
                        style={{ color: "#00d4c8" }}
                      >
                        +{formatINR(addon.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {service.packages.length > 0 && (
          <div
            className="px-6 py-4 flex items-center justify-between gap-4"
            style={{
              borderTop: "1px solid rgba(0,180,166,0.1)",
              background: "rgba(0,0,0,0.2)",
            }}
          >
            <div>
              <div
                className="text-xs mb-0.5"
                style={{ color: "rgba(232,245,244,0.4)" }}
              >
                Total
              </div>
              <div className="text-lg font-bold" style={{ color: "#00d4c8" }}>
                {formatINR(totalPrice)}
              </div>
              {selectedAddons.size > 0 && (
                <div
                  className="text-xs"
                  style={{ color: "rgba(232,245,244,0.35)" }}
                >
                  incl. {selectedAddons.size} add-on
                  {selectedAddons.size !== 1 ? "s" : ""}
                </div>
              )}
            </div>
            <Button
              onClick={handleAddToCart}
              className="flex items-center gap-2 font-semibold"
              style={{
                background: added
                  ? "rgba(34,197,94,0.2)"
                  : "linear-gradient(135deg, #00b4a6, #00d4c8)",
                color: added ? "#4ade80" : "#080c0c",
                border: added ? "1px solid rgba(34,197,94,0.4)" : "none",
                minWidth: "140px",
              }}
            >
              {added ? (
                <>
                  <Check size={14} />
                  Added!
                </>
              ) : (
                <>
                  <ShoppingCart size={14} />
                  {alreadyInCart ? "Add Again" : "Add to Cart"}
                </>
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

function ServiceCardSkeleton() {
  return (
    <div
      className="rounded-xl p-4"
      style={{
        background: "rgba(0,180,166,0.03)",
        border: "1px solid rgba(0,180,166,0.08)",
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <Skeleton
          className="w-9 h-9 rounded-lg"
          style={{ background: "rgba(0,180,166,0.08)" }}
        />
      </div>
      <Skeleton
        className="h-4 w-3/4 mb-2 rounded"
        style={{ background: "rgba(0,180,166,0.06)" }}
      />
      <Skeleton
        className="h-3 w-full mb-1 rounded"
        style={{ background: "rgba(0,180,166,0.04)" }}
      />
      <Skeleton
        className="h-3 w-2/3 mb-4 rounded"
        style={{ background: "rgba(0,180,166,0.04)" }}
      />
      <div
        className="pt-3"
        style={{ borderTop: "1px solid rgba(0,180,166,0.06)" }}
      >
        <Skeleton
          className="h-3 w-1/3 rounded"
          style={{ background: "rgba(0,180,166,0.06)" }}
        />
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function ServicesCatalogPage() {
  const { data: allServices = [], isLoading } = useServices();
  const { totalItems } = useCart();

  const visibleServices = useMemo(
    () => allServices.filter((s) => s.isVisible),
    [allServices],
  );

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [previewService, setPreviewService] = useState<Service | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const categories = useMemo(
    () => [
      "All",
      ...Array.from(new Set(visibleServices.map((s) => s.category))).sort(),
    ],
    [visibleServices],
  );

  const filtered = useMemo(() => {
    return visibleServices.filter((s) => {
      const matchesCategory =
        selectedCategory === "All" || s.category === selectedCategory;
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [visibleServices, selectedCategory, search]);

  const grouped = useMemo(() => {
    return filtered.reduce<Record<string, Service[]>>((acc, s) => {
      if (!acc[s.category]) acc[s.category] = [];
      acc[s.category].push(s);
      return acc;
    }, {});
  }, [filtered]);

  const handlePreview = (service: Service) => {
    setPreviewService(service);
    setPreviewOpen(true);
  };

  return (
    <div className="space-y-6 pb-10">
      {/* ── Page Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(0,180,166,0.12)", color: "#00d4c8" }}
          >
            <img
              src="/assets/generated/icon-services.dim_128x128.png"
              alt=""
              className="w-7 h-7 object-contain"
            />
          </div>
          <div>
            <h1 className="page-title mb-0">Services Catalog</h1>
            <p className="page-subtitle">
              {isLoading
                ? "Loading…"
                : `${visibleServices.length} services available`}
            </p>
          </div>
        </div>

        {/* Cart indicator */}
        {totalItems > 0 && (
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium"
            style={{
              background: "rgba(0,180,166,0.1)",
              border: "1px solid rgba(0,180,166,0.25)",
              color: "#00d4c8",
            }}
          >
            <ShoppingCart size={14} />
            <span>
              {totalItems} item{totalItems !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>

      {/* ── Hero Banner ── */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, rgba(0,180,166,0.12) 0%, rgba(0,100,90,0.08) 50%, rgba(0,0,0,0) 100%)",
          border: "1px solid rgba(0,180,166,0.15)",
          minHeight: "120px",
        }}
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(0,180,166,0.3) 0%, transparent 60%), radial-gradient(circle at 80% 50%, rgba(0,100,90,0.2) 0%, transparent 60%)",
          }}
        />
        <div className="relative px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={14} style={{ color: "#00d4c8" }} />
              <span
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "#00d4c8" }}
              >
                QuickBee Digital Services
              </span>
            </div>
            <h2 className="text-xl font-bold mb-1" style={{ color: "#e8f5f4" }}>
              Grow Your Business Online
            </h2>
            <p className="text-sm" style={{ color: "rgba(232,245,244,0.55)" }}>
              Explore our full suite of digital marketing, design, and tech
              services — tailored for every stage of growth.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: "#00d4c8" }}>
                {visibleServices.length}+
              </div>
              <div
                className="text-xs"
                style={{ color: "rgba(232,245,244,0.4)" }}
              >
                Services
              </div>
            </div>
            <div
              className="w-px h-10"
              style={{ background: "rgba(0,180,166,0.2)" }}
            />
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: "#00d4c8" }}>
                {categories.length - 1}
              </div>
              <div
                className="text-xs"
                style={{ color: "rgba(232,245,244,0.4)" }}
              >
                Categories
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Search & Controls ── */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "rgba(0,212,200,0.5)" }}
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services, categories…"
            className="pl-9 pr-9 text-sm h-9"
            style={{
              background: "rgba(0,180,166,0.05)",
              borderColor: "rgba(0,180,166,0.2)",
              color: "#e8f5f4",
            }}
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-70 transition-opacity"
            >
              <X size={12} style={{ color: "#e8f5f4" }} />
            </button>
          )}
        </div>

        {/* View toggle */}
        <div
          className="flex items-center rounded-lg overflow-hidden flex-shrink-0"
          style={{
            border: "1px solid rgba(0,180,166,0.2)",
            background: "rgba(0,180,166,0.04)",
          }}
        >
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className="px-3 py-2 transition-colors"
            style={{
              background:
                viewMode === "grid" ? "rgba(0,180,166,0.15)" : "transparent",
              color: viewMode === "grid" ? "#00d4c8" : "rgba(232,245,244,0.4)",
            }}
          >
            <Grid3X3 size={14} />
          </button>
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className="px-3 py-2 transition-colors"
            style={{
              background:
                viewMode === "list" ? "rgba(0,180,166,0.15)" : "transparent",
              color: viewMode === "list" ? "#00d4c8" : "rgba(232,245,244,0.4)",
            }}
          >
            <List size={14} />
          </button>
        </div>
      </div>

      {/* ── Category Filter Pills ── */}
      <div className="flex gap-2 flex-wrap items-center">
        <Filter
          size={12}
          style={{ color: "rgba(232,245,244,0.3)" }}
          className="flex-shrink-0"
        />
        {categories.map((cat) => (
          <button
            type="button"
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150"
            style={
              selectedCategory === cat
                ? {
                    background: "rgba(0,180,166,0.18)",
                    border: "1px solid rgba(0,180,166,0.45)",
                    color: "#00d4c8",
                  }
                : {
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    color: "rgba(232,245,244,0.45)",
                  }
            }
          >
            {cat !== "All" && (
              <span
                style={{
                  color:
                    selectedCategory === cat
                      ? "#00d4c8"
                      : "rgba(232,245,244,0.3)",
                }}
              >
                {getCategoryIcon(cat)}
              </span>
            )}
            {cat}
            {cat !== "All" && (
              <span
                className="ml-0.5 text-xs"
                style={{
                  color:
                    selectedCategory === cat
                      ? "rgba(0,212,200,0.6)"
                      : "rgba(232,245,244,0.25)",
                }}
              >
                {visibleServices.filter((s) => s.category === cat).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Results count ── */}
      {!isLoading && (search || selectedCategory !== "All") && (
        <div className="text-xs" style={{ color: "rgba(232,245,244,0.35)" }}>
          Showing {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          {selectedCategory !== "All" && ` in "${selectedCategory}"`}
          {search && ` for "${search}"`}
        </div>
      )}

      {/* ── Loading State ── */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders have no stable key
            <ServiceCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* ── Empty State ── */}
      {!isLoading && filtered.length === 0 && (
        <div
          className="rounded-2xl p-12 text-center"
          style={{
            background: "rgba(0,180,166,0.03)",
            border: "1px solid rgba(0,180,166,0.08)",
          }}
        >
          <Package
            size={40}
            className="mx-auto mb-3"
            style={{ color: "rgba(0,212,200,0.2)" }}
          />
          <p
            className="font-medium mb-1"
            style={{ color: "rgba(232,245,244,0.5)" }}
          >
            {search || selectedCategory !== "All"
              ? "No services match your filters."
              : "No services available at the moment."}
          </p>
          {(search || selectedCategory !== "All") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedCategory("All");
              }}
              className="mt-3 text-xs underline"
              style={{ color: "#00d4c8" }}
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* ── Services Grid / List ── */}
      {!isLoading && filtered.length > 0 && (
        <div className="space-y-8">
          {Object.entries(grouped).map(([category, services]) => (
            <section key={category}>
              {/* Category heading */}
              <div className="flex items-center gap-2.5 mb-4">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "rgba(0,180,166,0.1)",
                    color: "#00d4c8",
                  }}
                >
                  {getCategoryIcon(category)}
                </div>
                <h2
                  className="text-sm font-bold uppercase tracking-wider"
                  style={{ color: "rgba(0,212,200,0.8)" }}
                >
                  {category}
                </h2>
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    background: "rgba(0,180,166,0.08)",
                    color: "rgba(0,212,200,0.5)",
                    border: "1px solid rgba(0,180,166,0.12)",
                  }}
                >
                  {services.length}
                </span>
                <div
                  className="flex-1 h-px"
                  style={{ background: "rgba(0,180,166,0.08)" }}
                />
              </div>

              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {services.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      onPreview={handlePreview}
                      viewMode="grid"
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {services.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      onPreview={handlePreview}
                      viewMode="list"
                    />
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      )}

      {/* ── Master Plans Section ── */}
      <section>
        <div className="flex items-center gap-2.5 mb-5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(0,180,166,0.1)", color: "#00d4c8" }}
          >
            <Sparkles size={14} />
          </div>
          <h2
            className="text-sm font-bold uppercase tracking-wider"
            style={{ color: "rgba(0,212,200,0.8)" }}
          >
            Master Plans
          </h2>
          <div
            className="flex-1 h-px"
            style={{ background: "rgba(0,180,166,0.08)" }}
          />
        </div>
        <p className="text-sm mb-5" style={{ color: "rgba(232,245,244,0.45)" }}>
          All-inclusive bundles for every stage of growth — pick a plan and get
          started today.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {masterPlans.map((plan) => (
            <div
              key={plan.name}
              className="relative rounded-2xl p-5 flex flex-col"
              style={{
                background: plan.accentBg,
                border: `1px solid ${plan.color}25`,
              }}
            >
              {/* Popular badge */}
              {plan.badge && (
                <div
                  className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-0.5 rounded-full"
                  style={{ background: plan.color, color: "#080c0c" }}
                >
                  {plan.badge}
                </div>
              )}

              {/* Plan name */}
              <div className="mb-1">
                <div
                  className="text-base font-bold"
                  style={{ color: plan.color }}
                >
                  {plan.name}
                </div>
                <div
                  className="text-xs mt-0.5"
                  style={{ color: "rgba(232,245,244,0.45)" }}
                >
                  {plan.tagline}
                </div>
              </div>

              {/* Price */}
              <div className="my-4">
                <div className="flex items-baseline gap-1">
                  <span
                    className="text-2xl font-bold"
                    style={{ color: plan.color }}
                  >
                    {formatINR(plan.priceINR)}
                  </span>
                  <span
                    className="text-xs"
                    style={{ color: "rgba(232,245,244,0.35)" }}
                  >
                    /mo
                  </span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-2 flex-1 mb-5">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-xs"
                    style={{ color: "rgba(232,245,244,0.65)" }}
                  >
                    <Check
                      size={11}
                      className="mt-0.5 flex-shrink-0"
                      style={{ color: plan.color }}
                    />
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                type="button"
                className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-150"
                style={{
                  background: `${plan.color}18`,
                  border: `1px solid ${plan.color}35`,
                  color: plan.color,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    `${plan.color}28`;
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    `${plan.color}60`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    `${plan.color}18`;
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    `${plan.color}35`;
                }}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── Preview Modal ── */}
      <ServicePreviewModal
        service={previewService}
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
      />
    </div>
  );
}
