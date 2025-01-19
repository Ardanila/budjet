import { createClient } from '@vercel/edge-config';
import { BudgetItem } from '../types/budget';

const client = createClient(process.env.EDGE_CONFIG);

export const getBudgetData = async () => {
  try {
    const initialAmount = await client.get('initialAmount') || '0';
    const plannedBudget = await client.get('plannedBudget') || [];
    const actualBudget = await client.get('actualBudget') || [];
    
    return {
      initialAmount,
      plannedBudget,
      actualBudget,
    };
  } catch (error) {
    console.error('Error fetching budget data:', error);
    return {
      initialAmount: '0',
      plannedBudget: [],
      actualBudget: [],
    };
  }
};

export const setBudgetData = async (
  data: {
    initialAmount?: string;
    plannedBudget?: BudgetItem[];
    actualBudget?: BudgetItem[];
  }
) => {
  try {
    // Получаем текущие данные
    const currentData = await getBudgetData();
    
    // Обновляем только те поля, которые были переданы
    const updatedData = {
      ...currentData,
      ...data
    };
    
    // Сохраняем все данные одним вызовом
    await client.set('budgetData', updatedData);
  } catch (error) {
    console.error('Error saving budget data:', error);
    throw error;
  }
}; 