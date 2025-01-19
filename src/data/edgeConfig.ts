import { createClient } from '@vercel/edge-config';
import { BudgetItem } from '../types/budget';

if (!process.env.EDGE_CONFIG) {
  throw new Error('EDGE_CONFIG is not defined');
}

if (!process.env.EDGE_CONFIG_ID) {
  throw new Error('EDGE_CONFIG_ID is not defined');
}

if (!process.env.VERCEL_ACCESS_TOKEN) {
  throw new Error('VERCEL_ACCESS_TOKEN is not defined');
}

const config = createClient(process.env.EDGE_CONFIG);

interface UserBudgetData {
  plannedItems: BudgetItem[];
  actualItems: BudgetItem[];
}

export const saveUserBudgetData = async (userId: string, data: UserBudgetData) => {
  try {
    const key = `budget_${userId}`;
    
    console.log('Saving budget data:', {
      key,
      data,
      configId: process.env.EDGE_CONFIG_ID
    });

    // Используем Vercel API для обновления данных
    const response = await fetch(`https://api.vercel.com/v1/edge-config/${process.env.EDGE_CONFIG_ID}/items`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${process.env.VERCEL_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [
          {
            operation: 'upsert',
            key,
            value: data
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to update Edge Config:', errorData);
      throw new Error('Failed to update Edge Config');
    }

    console.log('Budget data saved successfully');
    return true;
  } catch (error) {
    console.error('Error saving budget data:', error);
    return false;
  }
};

export const getUserBudgetData = async (userId: string): Promise<UserBudgetData> => {
  try {
    const key = `budget_${userId}`;
    console.log('Getting budget data for key:', key);
    
    const data = await config.get<UserBudgetData>(key);
    console.log('Retrieved budget data:', data);
    
    if (data) {
      return data;
    }
    
    return { plannedItems: [], actualItems: [] };
  } catch (error) {
    console.error('Error getting budget data:', error);
    return { plannedItems: [], actualItems: [] };
  }
}; 