export interface WebhookLogEntry {
  id: string;
  timestamp: string;
  toolName: string;
  url: string;
  payloadSummary: string;
  statusCode: number;
  success: boolean;
}

const STORAGE_KEY = 'quickbee_webhook_logs';

export function logWebhookCall(
  toolName: string,
  url: string,
  payload: unknown,
  statusCode: number,
  success: boolean
): void {
  try {
    const existing = getLogs();
    const entry: WebhookLogEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      toolName,
      url,
      payloadSummary: JSON.stringify(payload).substring(0, 100),
      statusCode,
      success,
    };
    const updated = [entry, ...existing].slice(0, 500); // keep last 500
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // silently fail
  }
}

export function getLogs(): WebhookLogEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as WebhookLogEntry[];
  } catch {
    return [];
  }
}

export function clearLogs(): void {
  localStorage.removeItem(STORAGE_KEY);
}
