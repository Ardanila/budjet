import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@vercel/edge-config';

const edgeConfig = createClient(process.env.EDGE_CONFIG_TOKEN as string);

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method === 'GET') {
    try {
      const data = await edgeConfig.get('budget');
      return response.status(200).json(data || {
        plannedBudget: [],
        actualBudget: [],
        initialAmount: '0'
      });
    } catch (error) {
      console.error('Error fetching budget data:', error);
      return response.status(500).json({ error: 'Failed to fetch budget data' });
    }
  }

  if (request.method === 'POST') {
    try {
      const { plannedBudget, actualBudget, initialAmount } = request.body;
      await edgeConfig.set('budget', {
        plannedBudget,
        actualBudget,
        initialAmount
      });
      return response.status(200).json({ success: true });
    } catch (error) {
      console.error('Error saving budget data:', error);
      return response.status(500).json({ error: 'Failed to save budget data' });
    }
  }

  return response.status(405).json({ error: 'Method not allowed' });
} 