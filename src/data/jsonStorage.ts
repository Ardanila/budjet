import { BudgetItem } from '../types/budget';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

// Убедимся, что папка существует
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface UserData {
  login: string;
  initialAmount: string;
  plannedBudget: BudgetItem[];
  actualBudget: BudgetItem[];
}

const getUserFilePath = (login: string): string => {
  return path.join(DATA_DIR, `${login}.json`);
};

const readUserData = (login: string): UserData | null => {
  const filePath = getUserFilePath(login);
  if (!fs.existsSync(filePath)) {
    return null;
  }

  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading user data:', error);
    return null;
  }
};

const writeUserData = (login: string, data: UserData): void => {
  const filePath = getUserFilePath(login);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing user data:', error);
  }
};

export const getInitialAmount = (login: string): string => {
  const userData = readUserData(login);
  return userData?.initialAmount || '0';
};

export const setInitialAmount = (login: string, amount: string): void => {
  const userData = readUserData(login) || {
    login,
    initialAmount: '0',
    plannedBudget: [],
    actualBudget: [],
  };
  
  userData.initialAmount = amount;
  writeUserData(login, userData);
};

export const getPlannedBudget = (login: string): BudgetItem[] => {
  const userData = readUserData(login);
  return userData?.plannedBudget || [];
};

export const setPlannedBudget = (login: string, items: BudgetItem[]): void => {
  const userData = readUserData(login) || {
    login,
    initialAmount: '0',
    plannedBudget: [],
    actualBudget: [],
  };
  
  userData.plannedBudget = items;
  writeUserData(login, userData);
};

export const getActualBudget = (login: string): BudgetItem[] => {
  const userData = readUserData(login);
  return userData?.actualBudget || [];
};

export const setActualBudget = (login: string, items: BudgetItem[]): void => {
  const userData = readUserData(login) || {
    login,
    initialAmount: '0',
    plannedBudget: [],
    actualBudget: [],
  };
  
  userData.actualBudget = items;
  writeUserData(login, userData);
}; 