import { getSalesConfig } from './salesConfig';
import { logWebhookCall } from './webhookLogger';

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function callAI(
  toolName: string,
  messages: AIMessage[],
  maxTokens = 1500
): Promise<string> {
  const config = getSalesConfig();

  if (!config.apiEndpoint || !config.apiKey || !config.apiEndpointEnabled || !config.apiKeyEnabled) {
    throw new Error('API credentials not configured. Please go to Sales Configuration to set up your API endpoint and key.');
  }

  const payload = {
    model: 'gpt-4o-mini',
    messages,
    max_tokens: maxTokens,
    temperature: 0.7,
  };

  try {
    const response = await fetch(config.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    logWebhookCall(toolName, config.apiEndpoint, payload, response.status, response.ok);

    if (!response.ok) {
      throw new Error(data.error?.message || `API error: ${response.status}`);
    }

    return data.choices?.[0]?.message?.content || '';
  } catch (err) {
    if (err instanceof Error && err.message.includes('API credentials')) throw err;
    logWebhookCall(toolName, config.apiEndpoint, payload, 0, false);
    throw err;
  }
}
