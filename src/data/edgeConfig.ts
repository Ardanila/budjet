import { createClient } from '@vercel/edge-config';
import { BudgetItem } from '../types/budget';

const edgeConfig = createClient(import.meta.env.VITE_EDGE_CONFIG_TOKEN);

export const getBudgetData = async () => {
  try {
    const data = await edgeConfig.get('budget');
    return {
      plannedBudget: (data as any)?.plannedBudget || [],
      actualBudget: (data as any)?.actualBudget || [],
      initialAmount: (data as any)?.initialAmount || '0'
    };
  } catch (error) {
    console.error('Error fetching budget data:', error);
    return {
      plannedBudget: [],
      actualBudget: [],
      initialAmount: '0'
    };
  }
};

export const setBudgetData = async (
  plannedBudget: BudgetItem[],
  actualBudget: BudgetItem[],
  initialAmount: string
) => {
  try {
    await edgeConfig.set('budget', {
      plannedBudget,
      actualBudget,
      initialAmount
    });
    return true;
  } catch (error) {
    console.error('Error saving budget data:', error);
    return false;
  }
}; 