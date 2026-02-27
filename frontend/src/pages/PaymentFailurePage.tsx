import React from 'react';
import { XCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

export function PaymentFailurePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="glass-card rounded-2xl p-10 text-center max-w-md w-full">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: 'rgba(239,68,68,0.15)', border: '2px solid rgba(239,68,68,0.3)' }}>
          <XCircle size={40} style={{ color: '#f87171' }} />
        </div>
        <h1 className="text-2xl font-display font-bold text-white mb-2">Payment Failed</h1>
        <p className="text-sm mb-8" style={{ color: 'rgba(232,245,244,0.6)' }}>
          Your payment could not be processed. Please check your payment details and try again.
        </p>
        <div className="flex gap-3">
          <Link to="/" className="flex-1">
            <Button variant="ghost" className="w-full border border-white/10 text-white/60 hover:text-white">
              <ArrowLeft size={14} className="mr-2" /> Go Home
            </Button>
          </Link>
          <Button onClick={() => navigate({ to: '/checkout' })} className="flex-1 btn-teal">
            <RefreshCw size={14} className="mr-2" /> Retry Payment
          </Button>
        </div>
      </div>
    </div>
  );
}
