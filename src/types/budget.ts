export interface BudgetItem {
  id: string;
  description: string;
  amount: string;
  type: 'income' | 'expense';
  date: string;
  isRecurring?: boolean;
  periodicity?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export interface BudgetContextType {
  plannedItems: BudgetItem[];
  actualItems: BudgetItem[];
  setPlannedItems: (items: BudgetItem[]) => void;
  setActualItems: (items: BudgetItem[]) => void;
} 