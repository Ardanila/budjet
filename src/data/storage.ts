import { BudgetItem } from '../types/budget';

const API_URL = 'http://localhost:3001/api';

interface UserData {
  login: string;
  initialAmount: string;
  plannedBudget: BudgetItem[];
  actualBudget: BudgetItem[];
}

let currentUserData: UserData | null = null;
let currentLogin: string | null = null;

const fetchUserData = async (login: string): Promise<UserData | null> => {
  try {
    const response = await fetch(`${API_URL}/user/${login}`);
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};

const saveUserData = async (login: string, data: UserData): Promise<void> => {
  try {
    await fetch(`${API_URL}/user/${login}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error('Error saving user data:', error);
  }
};

export const getCurrentUser = () => {
  return currentLogin ? { login: currentLogin } : null;
};

export const setCurrentUser = async (user: { login: string }) => {
  currentLogin = user.login;
  currentUserData = await fetchUserData(user.login) || {
    login: user.login,
    initialAmount: '0',
    plannedBudget: [],
    actualBudget: [],
  };
  await saveUserData(user.login, currentUserData);
};

export const getInitialAmount = (): string => {
  return currentUserData?.initialAmount || '0';
};

export const setInitialAmount = async (amount: string): Promise<void> => {
  if (!currentLogin || !currentUserData) return;
  
  currentUserData.initialAmount = amount;
  await saveUserData(currentLogin, currentUserData);
};

export const getPlannedBudget = (): BudgetItem[] => {
  return currentUserData?.plannedBudget || [];
};

export const setPlannedBudget = async (items: BudgetItem[]): Promise<void> => {
  if (!currentLogin || !currentUserData) return;
  
  currentUserData.plannedBudget = items;
  await saveUserData(currentLogin, currentUserData);
};

export const getActualBudget = (): BudgetItem[] => {
  return currentUserData?.actualBudget || [];
};

export const setActualBudget = async (items: BudgetItem[]): Promise<void> => {
  if (!currentLogin || !currentUserData) return;
  
  currentUserData.actualBudget = items;
  await saveUserData(currentLogin, currentUserData);
};

// Функция для очистки всех данных
export const clearAllData = (): void => {
  Object.values(STORAGE_KEYS).forEach(key => sessionStorage.removeItem(key));
}; 