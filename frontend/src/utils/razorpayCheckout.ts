import { getSalesConfig } from './salesConfig';

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
  modal?: { ondismiss?: () => void };
}

interface RazorpayInstance {
  open(): void;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
    document.head.appendChild(script);
  });
}

export async function openRazorpayCheckout(
  amountINR: number,
  description: string,
  onSuccess: (paymentId: string) => void,
  onFailure: () => void
): Promise<void> {
  const config = getSalesConfig();

  if (!config.razorpayKeyId || !config.razorpayKeyIdEnabled) {
    throw new Error('Razorpay Key ID not configured. Please go to Sales Configuration.');
  }

  await loadRazorpayScript();

  const options: RazorpayOptions = {
    key: config.razorpayKeyId,
    amount: amountINR * 100, // paise
    currency: 'INR',
    name: 'Quick Bee AI Growth Engine',
    description,
    handler: (response: RazorpayResponse) => {
      onSuccess(response.razorpay_payment_id);
    },
    theme: { color: '#00b4a6' },
    modal: {
      ondismiss: () => {
        onFailure();
      },
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
}
