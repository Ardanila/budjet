import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';

config(); // Загружаем переменные среды

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Временное хранилище для разработки
let budgetData = {
  plannedBudget: [],
  actualBudget: [],
  initialAmount: '0'
};

app.get('/api/budget', (req, res) => {
  res.json(budgetData);
});

app.post('/api/budget', (req, res) => {
  const { plannedBudget, actualBudget, initialAmount } = req.body;
  budgetData = {
    plannedBudget,
    actualBudget,
    initialAmount
  };
  res.json({ success: true });
});

app.listen(port, () => {
  console.log(`Development server running at http://localhost:${port}`);
}); 