import React, { useState } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, AlertTriangle } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { useCart } from '../contexts/CartContext';
import { openRazorpayCheckout } from '../utils/razorpayCheckout';
import { getSalesConfig } from '../utils/salesConfig';

function formatINR(n: number) {
  return `₹${n.toLocaleString('en-IN')}`;
}

export function CheckoutPage() {
  const { items, removeFromCart, updateQuantity, grandTotal } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const config = getSalesConfig();
  const hasRazorpay = config.razorpayKeyId && config.razorpayKeyIdEnabled;

  const handlePayment = async () => {
    setLoading(true);
    setError('');
    try {
      await openRazorpayCheckout(
        grandTotal,
        `Quick Bee Services — ${items.length} item(s)`,
        (_paymentId) => {
          navigate({ to: '/payment-success' });
        },
        () => {
          navigate({ to: '/payment-failure' });
        }
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="space-y-6">
        <div className="page-header">
          <h1 className="page-title">Checkout</h1>
        </div>
        <div className="glass-card rounded-xl p-16 text-center">
          <ShoppingCart size={48} className="mx-auto mb-4" style={{ color: 'rgba(0,180,166,0.3)' }} />
          <h3 className="text-xl font-semibold text-white mb-2">Your cart is empty</h3>
          <p className="text-sm mb-6" style={{ color: 'rgba(232,245,244,0.5)' }}>Browse our services catalog to add items.</p>
          <Button onClick={() => navigate({ to: '/services' })} className="btn-teal">Browse Services</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="page-header">
        <div className="flex items-center gap-3">
          <img src="/assets/generated/icon-payment.dim_128x128.png" alt="" className="w-10 h-10 rounded-xl" />
          <div>
            <h1 className="page-title">Checkout</h1>
            <p className="page-subtitle">{items.length} item(s) in cart</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className="glass-card rounded-xl p-4 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-white">{item.serviceName}</div>
              <div className="text-xs mt-1" style={{ color: 'rgba(232,245,244,0.5)' }}>
                Tier: <span style={{ color: '#00d4c8' }}>{item.selectedTier}</span>
                {item.selectedAddons.length > 0 && (
                  <> · Add-ons: {item.selectedAddons.join(', ')}</>
                )}
              </div>
              <div className="text-sm font-semibold mt-1" style={{ color: '#00d4c8' }}>
                {formatINR(item.unitPrice)} × {item.quantity} = {formatINR(item.totalPrice)}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-teal/20 text-white font-bold transition-colors flex items-center justify-center">
                <Minus size={12} />
              </button>
              <span className="text-white font-bold w-6 text-center">{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-teal/20 text-white font-bold transition-colors flex items-center justify-center">
                <Plus size={12} />
              </button>
            </div>
            <button onClick={() => removeFromCart(item.id)}
              className="p-2 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-colors">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-semibold text-white">Grand Total</span>
          <span className="text-3xl font-bold teal-gradient-text">{formatINR(grandTotal)}</span>
        </div>

        {!hasRazorpay && (
          <div className="flex items-center gap-2 p-3 rounded-lg mb-4" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <AlertTriangle size={14} style={{ color: '#fbbf24' }} />
            <span className="text-xs" style={{ color: '#fbbf24' }}>
              Razorpay Key ID not configured. <a href="/settings" className="underline">Configure in Sales Settings</a>
            </span>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-lg mb-4 text-xs" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
            {error}
          </div>
        )}

        <Button onClick={handlePayment} disabled={loading || !hasRazorpay} className="w-full btn-teal text-base py-3">
          {loading ? 'Processing...' : <><CreditCard size={18} className="mr-2" /> Pay {formatINR(grandTotal)} with Razorpay</>}
        </Button>
      </div>
    </div>
  );
}
