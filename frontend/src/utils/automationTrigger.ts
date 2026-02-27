import { getSalesConfig } from './salesConfig';
import { getAutomationConfig } from './automationConfig';
import { logWebhookCall } from './webhookLogger';

export type AutomationKey =
  | 'whatsappAutoReply'
  | 'proposalAutoSend'
  | 'leadFollowUp'
  | 'paymentConfirmation'
  | 'projectOnboarding';

export async function triggerAutomation(
  automationKey: AutomationKey,
  eventType: string,
  data: Record<string, unknown>
): Promise<void> {
  const automationConfig = getAutomationConfig();
  const salesConfig = getSalesConfig();

  const isEnabled = automationConfig[automationKey];
  const webhookUrl = salesConfig.automationWebhookUrl;
  const isWebhookEnabled = salesConfig.automationWebhookUrlEnabled;

  if (!isEnabled || !webhookUrl || !isWebhookEnabled) {
    return;
  }

  const payload = {
    event: eventType,
    automation: automationKey,
    timestamp: new Date().toISOString(),
    data,
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${salesConfig.apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    logWebhookCall(
      `Automation: ${automationKey}`,
      webhookUrl,
      payload,
      response.status,
      response.ok
    );
  } catch (err) {
    logWebhookCall(
      `Automation: ${automationKey}`,
      webhookUrl,
      payload,
      0,
      false
    );
  }
}
