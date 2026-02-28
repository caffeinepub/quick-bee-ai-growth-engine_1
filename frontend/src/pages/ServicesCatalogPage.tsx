import React, { useState, useEffect } from 'react';
import { ShoppingCart, Eye, Star } from 'lucide-react';
import { useServices } from '../hooks/useQueries';
import type { Service } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCart } from '../contexts/CartContext';
import { masterPlans } from '../data/masterPlans';

const CATEGORIES = ['All', 'Web Development', 'E-Commerce', 'Social Media', 'Digital Marketing', 'Content', 'Design', 'Video', 'App Development', 'Business Solutions', 'Photography'];

function formatINR(n: number | bigint) {
  return `₹${Number(n).toLocaleString('en-IN')}`;
}

function ServicePreviewModal({ service, open, onClose }: { service: Service | null; open: boolean; onClose: () => void }) {
  const { addToCart } = useCart();
  const [selectedPkgIdx, setSelectedPkgIdx] = useState(0);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (open) {
      setSelectedPkgIdx(0);
      setSelectedAddons([]);
      setQty(1);
    }
  }, [open]);

  if (!service) return null;

  const pkg = service.packages[selectedPkgIdx];
  const addonTotal = service.addons
    .filter(a => selectedAddons.includes(a.name))
    .reduce((s, a) => s + Number(a.price), 0);
  const total = pkg ? (Number(pkg.price) + addonTotal) * qty : 0;

  const handleBuy = () => {
    if (!pkg) return;
    addToCart({
      serviceId: service.id.toString(),
      serviceName: service.title,
      selectedTier: pkg.name,
      selectedAddons,
      quantity: qty,
      unitPrice: Number(pkg.price) + addonTotal,
      totalPrice: total,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" style={{ background: 'rgba(8,12,12,0.98)', borderColor: 'rgba(0,180,166,0.2)', color: '#e8f5f4' }}>
        <DialogHeader>
          <DialogTitle className="teal-gradient-text font-display text-xl">{service.title}</DialogTitle>
          <p className="text-sm" style={{ color: 'rgba(232,245,244,0.6)' }}>{service.description}</p>
        </DialogHeader>
        <div className="space-y-5 py-2">
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Select Package</h4>
            <div className="grid grid-cols-2 gap-2">
              {service.packages.map((p, i) => (
                <button
                  key={p.name}
                  onClick={() => setSelectedPkgIdx(i)}
                  className={`p-3 rounded-xl text-left transition-all border ${selectedPkgIdx === i ? '' : 'border-white/10 hover:border-teal/30'}`}
                  style={selectedPkgIdx === i ? { borderColor: 'rgba(0,180,166,0.6)', background: 'rgba(0,180,166,0.1)', border: '1px solid rgba(0,180,166,0.6)' } : { border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <div className="text-xs font-semibold" style={{ color: '#00d4c8' }}>{p.name}</div>
                  <div className="text-lg font-bold text-white">{formatINR(p.price)}</div>
                  <ul className="mt-2 space-y-1">
                    {p.features.slice(0, 3).map(f => (
                      <li key={f} className="text-xs flex items-center gap-1" style={{ color: 'rgba(232,245,244,0.6)' }}>
                        <span style={{ color: '#00d4c8' }}>✓</span> {f}
                      </li>
                    ))}
                    {p.features.length > 3 && <li className="text-xs" style={{ color: 'rgba(232,245,244,0.4)' }}>+{p.features.length - 3} more</li>}
                  </ul>
                </button>
              ))}
            </div>
          </div>

          {service.addons.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Add-ons</h4>
              <div className="space-y-2">
                {service.addons.map(addon => (
                  <label key={addon.name} className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-teal/5 transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedAddons.includes(addon.name)}
                      onChange={e => setSelectedAddons(prev =>
                        e.target.checked ? [...prev, addon.name] : prev.filter(a => a !== addon.name)
                      )}
                      className="accent-teal"
                    />
                    <span className="text-sm text-white flex-1">{addon.name}</span>
                    <span className="text-sm font-semibold" style={{ color: '#00d4c8' }}>{formatINR(addon.price)}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'rgba(0,180,166,0.05)', border: '1px solid rgba(0,180,166,0.15)' }}>
            <div>
              <div className="text-xs text-white/50 mb-1">Quantity</div>
              <div className="flex items-center gap-2">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-7 h-7 rounded-lg bg-white/10 hover:bg-teal/20 text-white font-bold transition-colors">-</button>
                <span className="text-white font-bold w-6 text-center">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="w-7 h-7 rounded-lg bg-white/10 hover:bg-teal/20 text-white font-bold transition-colors">+</button>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-white/50 mb-1">Total</div>
              <div className="text-2xl font-bold teal-gradient-text">{formatINR(total)}</div>
            </div>
          </div>

          <Button onClick={handleBuy} className="w-full btn-teal">
            <ShoppingCart size={16} className="mr-2" /> Add to Cart — {formatINR(total)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ServiceCard({ service }: { service: Service }) {
  const { addToCart } = useCart();
  const [previewOpen, setPreviewOpen] = useState(false);

  const firstPkg = service.packages[0];

  const handleBuyNow = () => {
    if (!firstPkg) return;
    addToCart({
      serviceId: service.id.toString(),
      serviceName: service.title,
      selectedTier: firstPkg.name,
      selectedAddons: [],
      quantity: 1,
      unitPrice: Number(firstPkg.price),
      totalPrice: Number(firstPkg.price),
    });
  };

  return (
    <>
      <div className="glass-card-hover rounded-xl p-5 flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(0,180,166,0.15)', color: '#00d4c8' }}>
              {service.category}
            </span>
            <h3 className="text-base font-semibold text-white mt-2">{service.title}</h3>
            <p className="text-xs mt-1 line-clamp-2" style={{ color: 'rgba(232,245,244,0.5)' }}>{service.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1.5 mb-4 flex-1">
          {service.packages.map(pkg => (
            <div key={pkg.name} className="p-2 rounded-lg text-center" style={{ background: 'rgba(0,0,0,0.2)' }}>
              <div className="text-xs" style={{ color: 'rgba(232,245,244,0.5)' }}>{pkg.name}</div>
              <div className="text-sm font-bold" style={{ color: '#00d4c8' }}>{formatINR(pkg.price)}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-auto">
          <Button size="sm" variant="ghost" onClick={() => setPreviewOpen(true)} className="flex-1 border border-teal/20 text-white/60 hover:text-teal hover:border-teal/40" style={{ borderColor: 'rgba(0,180,166,0.2)' }}>
            <Eye size={14} className="mr-1" /> Preview
          </Button>
          <Button size="sm" onClick={handleBuyNow} className="flex-1 btn-teal">
            <ShoppingCart size={14} className="mr-1" /> Buy Now
          </Button>
        </div>
      </div>
      <ServicePreviewModal service={service} open={previewOpen} onClose={() => setPreviewOpen(false)} />
    </>
  );
}

function MasterPlanCard({ plan }: { plan: typeof masterPlans[0] }) {
  const { addToCart } = useCart();
  return (
    <div
      className="glass-card rounded-2xl p-6 relative overflow-hidden flex flex-col"
      style={plan.popular ? { borderColor: 'rgba(0,180,166,0.4)', boxShadow: '0 0 30px rgba(0,180,166,0.15)' } : {}}
    >
      {plan.popular && (
        <div className="absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded-full teal-gradient text-black">
          Most Popular
        </div>
      )}
      <div className="mb-4">
        <div className="text-2xl font-display font-bold teal-gradient-text">{plan.name}</div>
        <div className="text-sm mt-1" style={{ color: 'rgba(232,245,244,0.5)' }}>{plan.tagline}</div>
        <div className="text-3xl font-bold text-white mt-3">{formatINR(plan.priceINR)}</div>
      </div>
      <ul className="space-y-2 mb-5 flex-1">
        {plan.features.map(f => (
          <li key={f} className="flex items-center gap-2 text-sm" style={{ color: 'rgba(232,245,244,0.7)' }}>
            <span style={{ color: '#00d4c8' }}>✓</span> {f}
          </li>
        ))}
      </ul>
      <Button
        className="w-full btn-teal mt-auto"
        onClick={() => addToCart({
          serviceId: `plan-${plan.name}`,
          serviceName: `${plan.name} Master Plan`,
          selectedTier: 'Master',
          selectedAddons: [],
          quantity: 1,
          unitPrice: plan.priceINR,
          totalPrice: plan.priceINR,
        })}
      >
        <ShoppingCart size={16} className="mr-2" /> Get {plan.name} Plan
      </Button>
    </div>
  );
}

export function ServicesCatalogPage() {
  const { data: services = [], isLoading } = useServices();
  const [category, setCategory] = useState('All');

  const visibleServices = services.filter(s => s.isVisible);
  const filtered = category === 'All' ? visibleServices : visibleServices.filter(s => s.category === category);

  // Derive unique categories from actual data
  const availableCategories = ['All', ...Array.from(new Set(services.map(s => s.category))).sort()];

  return (
    <div className="space-y-8">
      <div className="page-header">
        <div className="flex items-center gap-3">
          <img src="/assets/generated/icon-services.dim_128x128.png" alt="" className="w-10 h-10 rounded-xl" />
          <div>
            <h1 className="page-title">Services Catalog</h1>
            <p className="page-subtitle">{visibleServices.length} services across {availableCategories.length - 1} categories</p>
          </div>
        </div>
      </div>

      {/* Master Plans */}
      <div>
        <h2 className="font-display font-bold text-xl text-white mb-4 flex items-center gap-2">
          <Star size={20} style={{ color: '#00d4c8' }} /> Master Agency Plans
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {masterPlans.map(plan => (
            <MasterPlanCard key={plan.name} plan={plan} />
          ))}
        </div>
      </div>

      {/* Category Tabs */}
      <div>
        <div className="flex gap-2 flex-wrap mb-6">
          {availableCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                category === cat ? 'btn-teal' : 'border text-white/60 hover:text-teal'
              }`}
              style={category === cat ? {} : { borderColor: 'rgba(0,180,166,0.2)', background: 'transparent' }}
            >
              {cat}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="glass-card rounded-xl p-12 text-center">
            <div className="animate-spin w-8 h-8 border-2 rounded-full mx-auto mb-3" style={{ borderColor: 'rgba(0,180,166,0.3)', borderTopColor: '#00d4c8' }} />
            <p style={{ color: 'rgba(232,245,244,0.5)' }}>Loading services...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-card rounded-xl p-12 text-center">
            <p style={{ color: 'rgba(232,245,244,0.4)' }}>No services found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(service => (
              <ServiceCard key={service.id.toString()} service={service} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
