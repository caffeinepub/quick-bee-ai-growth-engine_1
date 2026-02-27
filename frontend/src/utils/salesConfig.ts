export interface SalesConfig {
  apiEndpoint: string;
  apiKey: string;
  whatsappToken: string;
  razorpayKeyId: string;
  razorpaySecret: string;
  emailApiKey: string;
  crmWebhookUrl: string;
  automationWebhookUrl: string;
  calendlyUrl: string;
  // toggles
  apiEndpointEnabled: boolean;
  apiKeyEnabled: boolean;
  whatsappTokenEnabled: boolean;
  razorpayKeyIdEnabled: boolean;
  razorpaySecretEnabled: boolean;
  emailApiKeyEnabled: boolean;
  crmWebhookUrlEnabled: boolean;
  automationWebhookUrlEnabled: boolean;
  calendlyUrlEnabled: boolean;
}

const STORAGE_KEY = 'quickbee_sales_config';

export const defaultConfig: SalesConfig = {
  apiEndpoint: '',
  apiKey: '',
  whatsappToken: '',
  razorpayKeyId: '',
  razorpaySecret: '',
  emailApiKey: '',
  crmWebhookUrl: '',
  automationWebhookUrl: '',
  calendlyUrl: '',
  apiEndpointEnabled: true,
  apiKeyEnabled: true,
  whatsappTokenEnabled: true,
  razorpayKeyIdEnabled: true,
  razorpaySecretEnabled: true,
  emailApiKeyEnabled: true,
  crmWebhookUrlEnabled: true,
  automationWebhookUrlEnabled: true,
  calendlyUrlEnabled: true,
};

export function getSalesConfig(): SalesConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultConfig };
    return { ...defaultConfig, ...JSON.parse(raw) };
  } catch {
    return { ...defaultConfig };
  }
}

export function saveSalesConfig(config: SalesConfig): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}
