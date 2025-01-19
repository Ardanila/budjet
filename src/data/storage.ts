import { BudgetItem } from '../types/budget';
import fs from 'fs';
import { DATA_PATH } from './config';

interface BudgetData {
    initialAmount: string;
    plannedBudget: BudgetItem[];
    actualBudget: BudgetItem[];
}

const defaultData: BudgetData = {
    initialAmount: '0',
    plannedBudget: [],
    actualBudget: []
};

// Функции для работы с данными в sessionStorage
const isAuthenticated = (): boolean => {
    return sessionStorage.getItem('isAuthenticated') === 'true';
};

const setAuthenticated = (value: boolean): void => {
    sessionStorage.setItem('isAuthenticated', String(value));
};

// Функции для работы с начальной суммой
export const getInitialAmount = (): string => {
    return defaultData.initialAmount;
};

export const setInitialAmount = (amount: string): void => {
    defaultData.initialAmount = amount;
};

// Функции для работы с планируемым бюджетом
export const getPlannedBudget = (): BudgetItem[] => {
    return defaultData.plannedBudget;
};

export const setPlannedBudget = (items: BudgetItem[]): void => {
    defaultData.plannedBudget = items;
};

// Функции для работы с фактическим бюджетом
export const getActualBudget = (): BudgetItem[] => {
    return defaultData.actualBudget;
};

export const setActualBudget = (items: BudgetItem[]): void => {
    defaultData.actualBudget = items;
};

// Функция для очистки всех данных
export const clearAllData = (): void => {
    defaultData.initialAmount = '0';
    defaultData.plannedBudget = [];
    defaultData.actualBudget = [];
};

export { isAuthenticated, setAuthenticated };

export const readData = (): BudgetData => {
    try {
        if (!fs.existsSync(DATA_PATH)) {
            const initialData: BudgetData = {
                initialAmount: '0',
                plannedBudget: [],
                actualBudget: []
            };
            fs.writeFileSync(DATA_PATH, JSON.stringify(initialData, null, 2));
            return initialData;
        }
        const data = fs.readFileSync(DATA_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading data:', error);
        return { initialAmount: '0', plannedBudget: [], actualBudget: [] };
    }
};

export const writeData = (data: BudgetData): void => {
    try {
        fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error writing data:', error);
    }
}; 