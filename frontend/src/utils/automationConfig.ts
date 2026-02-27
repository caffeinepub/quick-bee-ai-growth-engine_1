export interface AutomationConfig {
  whatsappAutoReply: boolean;
  proposalAutoSend: boolean;
  leadFollowUp: boolean;
  paymentConfirmation: boolean;
  projectOnboarding: boolean;
}

const STORAGE_KEY = 'quickbee_automation_config';

export const defaultAutomationConfig: AutomationConfig = {
  whatsappAutoReply: false,
  proposalAutoSend: false,
  leadFollowUp: false,
  paymentConfirmation: false,
  projectOnboarding: false,
};

export function getAutomationConfig(): AutomationConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultAutomationConfig };
    return { ...defaultAutomationConfig, ...JSON.parse(raw) };
  } catch {
    return { ...defaultAutomationConfig };
  }
}

export function saveAutomationConfig(config: AutomationConfig): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}
