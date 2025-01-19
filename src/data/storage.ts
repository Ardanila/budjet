import { BudgetItem } from '../types/budget';

// Ключи для sessionStorage
const STORAGE_KEYS = {
  INITIAL_AMOUNT: 'initialAmount',
  PLANNED_BUDGET: 'plannedBudget',
  ACTUAL_BUDGET: 'actualBudget',
  CURRENT_USER: 'currentUser',
} as const;

// Функции для работы с начальной суммой
export const getInitialAmount = (): string => {
  return sessionStorage.getItem(STORAGE_KEYS.INITIAL_AMOUNT) || '0';
};

export const setInitialAmount = (amount: string): void => {
  sessionStorage.setItem(STORAGE_KEYS.INITIAL_AMOUNT, amount);
};

// Функции для работы с планируемым бюджетом
export const getPlannedBudget = (): BudgetItem[] => {
  try {
    const items = sessionStorage.getItem(STORAGE_KEYS.PLANNED_BUDGET);
    return items ? JSON.parse(items) : [];
  } catch (e) {
    console.error('Error parsing plannedBudget:', e);
    return [];
  }
};

export const setPlannedBudget = (items: BudgetItem[]): void => {
  sessionStorage.setItem(STORAGE_KEYS.PLANNED_BUDGET, JSON.stringify(items));
};

// Функции для работы с фактическим бюджетом
export const getActualBudget = (): BudgetItem[] => {
  try {
    const items = sessionStorage.getItem(STORAGE_KEYS.ACTUAL_BUDGET);
    return items ? JSON.parse(items) : [];
  } catch (e) {
    console.error('Error parsing actualBudget:', e);
    return [];
  }
};

export const setActualBudget = (items: BudgetItem[]): void => {
  sessionStorage.setItem(STORAGE_KEYS.ACTUAL_BUDGET, JSON.stringify(items));
};

// Функции для работы с данными пользователя
export const getCurrentUser = () => {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEYS.CURRENT_USER) || 'null');
  } catch (e) {
    console.error('Error parsing currentUser:', e);
    return null;
  }
};

export const setCurrentUser = (user: any): void => {
  sessionStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
};

// Функция для очистки всех данных
export const clearAllData = (): void => {
  Object.values(STORAGE_KEYS).forEach(key => sessionStorage.removeItem(key));
}; 