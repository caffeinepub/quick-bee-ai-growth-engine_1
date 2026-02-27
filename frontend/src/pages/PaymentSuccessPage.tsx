import React, { useEffect, useRef } from 'react';
import { CheckCircle, Download, ArrowRight } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { useCart } from '../contexts/CartContext';
import { triggerAutomation } from '../utils/automationTrigger';

export function PaymentSuccessPage() {
  const { clearCart } = useCart();
  const invoiceRef = useRef(`QBA-${Date.now()}`);
  const triggered = useRef(false);

  useEffect(() => {
    if (!triggered.current) {
      triggered.current = true;
      clearCart();
      triggerAutomation('paymentConfirmation', 'payment.completed', {
        invoiceRef: invoiceRef.current,
        timestamp: new Date().toISOString(),
      });
    }
  }, [clearCart]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="glass-card rounded-2xl p-10 text-center max-w-md w-full">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: 'rgba(34,197,94,0.15)', border: '2px solid rgba(34,197,94,0.3)' }}>
          <CheckCircle size={40} style={{ color: '#4ade80' }} />
        </div>
        <h1 className="text-2xl font-display font-bold text-white mb-2">Payment Successful!</h1>
        <p className="text-sm mb-6" style={{ color: 'rgba(232,245,244,0.6)' }}>
          Thank you for your purchase. Your order has been confirmed.
        </p>
        <div className="p-4 rounded-xl mb-6" style={{ background: 'rgba(0,180,166,0.08)', border: '1px solid rgba(0,180,166,0.2)' }}>
          <div className="text-xs mb-1" style={{ color: 'rgba(232,245,244,0.5)' }}>Invoice Reference</div>
          <div className="text-xl font-mono font-bold teal-gradient-text">{invoiceRef.current}</div>
        </div>
        <div className="flex gap-3">
          <Link to="/services" className="flex-1">
            <Button variant="ghost" className="w-full border border-teal/20 text-white/60 hover:text-teal" style={{ borderColor: 'rgba(0,180,166,0.2)' }}>
              Browse More
            </Button>
          </Link>
          <Link to="/" className="flex-1">
            <Button className="w-full btn-teal">
              Dashboard <ArrowRight size={14} className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
