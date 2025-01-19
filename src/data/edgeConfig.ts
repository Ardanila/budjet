import { BudgetItem } from '../types/budget';

const API_URL = import.meta.env.PROD ? '/api/budget' : 'http://localhost:3000/api/budget';

export const getBudgetData = async () => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    return {
      plannedBudget: data?.plannedBudget || [],
      actualBudget: data?.actualBudget || [],
      initialAmount: data?.initialAmount || '0'
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
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        plannedBudget,
        actualBudget,
        initialAmount
      })
    });
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error saving budget data:', error);
    return false;
  }
}; 