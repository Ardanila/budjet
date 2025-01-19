import express from 'express';
import cors from 'cors';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { BudgetItem } from './src/types/budget';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const DATA_DIR = join(process.cwd(), 'data');

// Убедимся, что папка существует
if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true });
}

interface UserData {
  login: string;
  initialAmount: string;
  plannedBudget: BudgetItem[];
  actualBudget: BudgetItem[];
}

const getUserFilePath = (login: string): string => {
  return join(DATA_DIR, `${login}.json`);
};

const readUserData = (login: string): UserData | null => {
  const filePath = getUserFilePath(login);
  if (!existsSync(filePath)) {
    return null;
  }

  try {
    const data = readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading user data:', error);
    return null;
  }
};

const writeUserData = (login: string, data: UserData): void => {
  const filePath = getUserFilePath(login);
  try {
    writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing user data:', error);
  }
};

// Маршруты API
app.get('/api/user/:login', (req, res) => {
  const { login } = req.params;
  const userData = readUserData(login);
  
  if (!userData) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  
  res.json(userData);
});

app.post('/api/user/:login', (req, res) => {
  const { login } = req.params;
  const userData = req.body;
  
  writeUserData(login, userData);
  res.json({ success: true });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 