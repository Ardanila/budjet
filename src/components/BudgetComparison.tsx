import { useState, useContext, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Grid,
  useTheme,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Tooltip,
  Tab,
  Tabs,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import 'dayjs/locale/ru';
import InfoIcon from '@mui/icons-material/Info';
import { BudgetContext } from '../App';

dayjs.extend(isBetween);

interface BudgetItem {
  id: string;
  description: string;
  amount: string;
  type: 'income' | 'expense';
  date?: string;
  isRecurring?: boolean;
}

interface ChartData {
  name: string;
  plannedIncome: number;
  plannedExpenses: number;
  actualIncome: number;
  actualExpenses: number;
  plannedBalance: number;
  actualBalance: number;
}

const BudgetComparison = () => {
  const { plannedItems, actualItems } = useContext(BudgetContext);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(dayjs());
  const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(dayjs().add(1, 'month'));
  const [selectedTab, setSelectedTab] = useState(0);
  const theme = useTheme();

  useEffect(() => {
    const processData = () => {
      if (!startDate || !endDate) return;

      const days: { [key: string]: ChartData } = {};
      const initialAmount = Number(localStorage.getItem('initialAmount')) || 0;

      // Создаем массив всех дней в выбранном периоде
      const allDays = new Set<string>();
      let currentDate = startDate.startOf('day');
      while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'day')) {
        const dayKey = currentDate.format('DD.MM.YYYY');
        allDays.add(dayKey);
        currentDate = currentDate.add(1, 'day');
      }

      // Сортируем дни
      const sortedDays = Array.from(allDays).sort((a, b) => {
        return dayjs(a, 'DD.MM.YYYY').valueOf() - dayjs(b, 'DD.MM.YYYY').valueOf();
      });

      // Инициализируем все дни
      sortedDays.forEach(day => {
        days[day] = {
          name: day,
          plannedIncome: 0,
          plannedExpenses: 0,
          actualIncome: 0,
          actualExpenses: 0,
          plannedBalance: initialAmount,
          actualBalance: initialAmount,
        };
      });

      // Обработка планируемых транзакций
      let plannedBalance = initialAmount;
      sortedDays.forEach(currentDay => {
        days[currentDay].plannedBalance = plannedBalance;

        // Обрабатываем регулярные платежи
        plannedItems
          .filter(item => item.isRecurring && item.date)
          .forEach(item => {
            const itemDate = dayjs(item.date);
            const currentDayObj = dayjs(currentDay, 'DD.MM.YYYY');
            
            let shouldAddPayment = false;

            switch (item.periodicity) {
              case 'daily':
                shouldAddPayment = true;
                break;
              case 'weekly':
                shouldAddPayment = currentDayObj.day() === itemDate.day() &&
                  (currentDayObj.isAfter(itemDate) || currentDayObj.isSame(itemDate, 'day'));
                break;
              case 'monthly':
                shouldAddPayment = currentDayObj.date() === itemDate.date() &&
                  (currentDayObj.isAfter(itemDate) || currentDayObj.isSame(itemDate, 'day'));
                break;
              case 'yearly':
                shouldAddPayment = currentDayObj.date() === itemDate.date() &&
                  currentDayObj.month() === itemDate.month() &&
                  (currentDayObj.isAfter(itemDate) || currentDayObj.isSame(itemDate, 'day'));
                break;
              default:
                shouldAddPayment = currentDayObj.date() === itemDate.date() &&
                  (currentDayObj.isAfter(itemDate) || currentDayObj.isSame(itemDate, 'day'));
            }

            if (shouldAddPayment) {
              const amount = Number(item.amount);
              if (item.type === 'income') {
                days[currentDay].plannedIncome += amount;
                plannedBalance += amount;
              } else {
                days[currentDay].plannedExpenses += amount;
                plannedBalance -= amount;
              }
            }
          });

        // Обрабатываем разовые платежи
        plannedItems
          .filter(item => !item.isRecurring && item.date)
          .forEach(item => {
            const itemDate = dayjs(item.date);
            const currentDayObj = dayjs(currentDay, 'DD.MM.YYYY');
            
            if (currentDayObj.isSame(itemDate, 'day')) {
              const amount = Number(item.amount);
              if (item.type === 'income') {
                days[currentDay].plannedIncome += amount;
                plannedBalance += amount;
              } else {
                days[currentDay].plannedExpenses += amount;
                plannedBalance -= amount;
              }
            }
          });

        days[currentDay].plannedBalance = plannedBalance;
      });

      // Обработка фактических транзакций
      let actualBalance = initialAmount;
      sortedDays.forEach(currentDay => {
        days[currentDay].actualBalance = actualBalance;
        const currentDayObj = dayjs(currentDay, 'DD.MM.YYYY');
        
        actualItems.forEach(item => {
          if (!item.date) return;
          
          const itemDate = dayjs(item.date);
          if (currentDayObj.isSame(itemDate, 'day')) {
            const amount = Number(item.amount);
            if (item.type === 'income') {
              days[currentDay].actualIncome += amount;
              actualBalance += amount;
            } else {
              days[currentDay].actualExpenses += amount;
              actualBalance -= amount;
            }
          }
        });
        
        days[currentDay].actualBalance = actualBalance;
      });

      setChartData(Object.values(days));
    };

    processData();
  }, [plannedItems, actualItems, startDate, endDate]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Paper
          elevation={theme.palette.mode === 'dark' ? 2 : 1}
          sx={{
            p: 2,
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: 'background.paper',
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            {label}
          </Typography>
          {payload.map((entry: any) => (
            <Box key={entry.name} sx={{ mb: 0.5 }}>
              <Typography
                variant="body2"
                sx={{ color: entry.color, display: 'flex', alignItems: 'center' }}
              >
                <Box
                  component="span"
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: entry.color,
                    mr: 1,
                  }}
                />
                {entry.name}: {entry.value.toLocaleString()}
              </Typography>
            </Box>
          ))}
        </Paper>
      );
    }
    return null;
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const renderTransactionList = (items: BudgetItem[], type: 'income' | 'expense') => {
    return (
      <List>
        {items
          .filter(item => item.type === type)
          .sort((a, b) => {
            if (!a.date || !b.date) return 0;
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          })
          .map(item => (
            <ListItem
              key={item.id}
              sx={{
                borderBottom: `1px solid ${theme.palette.divider}`,
                '&:last-child': {
                  borderBottom: 'none',
                },
              }}
            >
              <ListItemText
                primary={item.description}
                secondary={
                  <Typography variant="body2" color="text.secondary">
                    {Number(item.amount).toLocaleString()}
                    {item.date && ` • ${new Date(item.date).toLocaleDateString()}`}
                  </Typography>
                }
              />
              {item.isRecurring && (
                <ListItemSecondaryAction>
                  <Tooltip title="Регулярный платеж">
                    <IconButton edge="end" size="small">
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              )}
            </ListItem>
          ))}
      </List>
    );
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Paper
        elevation={theme.palette.mode === 'dark' ? 2 : 1}
        sx={{
          p: 4,
          mb: 4,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
          Сравнение бюджетов
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Paper
            elevation={theme.palette.mode === 'dark' ? 2 : 1}
            sx={{
              p: 2,
              border: `1px solid ${theme.palette.divider}`,
              bgcolor: theme.palette.background.paper,
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Начальная сумма: {(Number(localStorage.getItem('initialAmount')) || 0).toLocaleString()}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
                  <DatePicker
                    label="Начало периода"
                    value={startDate}
                    onChange={setStartDate}
                    sx={{ width: '100%' }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
                  <DatePicker
                    label="Конец периода"
                    value={endDate}
                    onChange={setEndDate}
                    sx={{ width: '100%' }}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </Paper>
        </Box>
        
        <Box 
          sx={{ 
            width: '100%', 
            height: 400,
            bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : 'transparent',
            p: 2,
            borderRadius: 1,
          }}
        >
          <ResponsiveContainer>
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={theme.palette.divider}
              />
              <XAxis 
                dataKey="name" 
                stroke={theme.palette.text.secondary}
                tick={{ fill: theme.palette.text.secondary }}
              />
              <YAxis 
                stroke={theme.palette.text.secondary}
                tick={{ fill: theme.palette.text.secondary }}
              />
              <ChartTooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="plannedIncome"
                name="План. доходы"
                stroke={theme.palette.success.light}
                strokeWidth={2}
                dot={false}
                activeDot={false}
              />
              <Line
                type="monotone"
                dataKey="actualIncome"
                name="Факт. доходы"
                stroke={theme.palette.success.main}
                strokeWidth={2}
                dot={false}
                activeDot={false}
              />
              <Line
                type="monotone"
                dataKey="plannedExpenses"
                name="План. расходы"
                stroke={theme.palette.error.light}
                strokeWidth={2}
                dot={false}
                activeDot={false}
              />
              <Line
                type="monotone"
                dataKey="actualExpenses"
                name="Факт. расходы"
                stroke={theme.palette.error.main}
                strokeWidth={2}
                dot={false}
                activeDot={false}
              />
              <Line
                type="monotone"
                dataKey="plannedBalance"
                name="План. баланс"
                stroke={theme.palette.secondary.light}
                strokeWidth={2}
                dot={false}
                activeDot={false}
                connectNulls={true}
              />
              <Line
                type="monotone"
                dataKey="actualBalance"
                name="Факт. баланс"
                stroke={theme.palette.primary.main}
                strokeWidth={2}
                dot={false}
                activeDot={false}
                connectNulls={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={theme.palette.mode === 'dark' ? 2 : 1}
            sx={{
              p: 3,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
              Итоги по доходам
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Планируемые:
                </Typography>
                <Typography variant="h6" color="success.main" sx={{ fontWeight: 600 }}>
                  {plannedItems
                    .filter(item => item.type === 'income')
                    .reduce((sum, item) => sum + Number(item.amount), 0)
                    .toLocaleString()}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Фактические:
                </Typography>
                <Typography variant="h6" color="success.main" sx={{ fontWeight: 600 }}>
                  {actualItems
                    .filter(item => item.type === 'income')
                    .reduce((sum, item) => sum + Number(item.amount), 0)
                    .toLocaleString()}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={theme.palette.mode === 'dark' ? 2 : 1}
            sx={{
              p: 3,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
              Итоги по расходам
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Планируемые:
                </Typography>
                <Typography variant="h6" color="error.main" sx={{ fontWeight: 600 }}>
                  {plannedItems
                    .filter(item => item.type === 'expense')
                    .reduce((sum, item) => sum + Number(item.amount), 0)
                    .toLocaleString()}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Фактические:
                </Typography>
                <Typography variant="h6" color="error.main" sx={{ fontWeight: 600 }}>
                  {actualItems
                    .filter(item => item.type === 'expense')
                    .reduce((sum, item) => sum + Number(item.amount), 0)
                    .toLocaleString()}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <Paper
        elevation={theme.palette.mode === 'dark' ? 2 : 1}
        sx={{
          mt: 3,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          sx={{
            borderBottom: `1px solid ${theme.palette.divider}`,
            '& .MuiTab-root': {
              minWidth: 150,
            },
          }}
        >
          <Tab label="Планируемые доходы" />
          <Tab label="Планируемые расходы" />
          <Tab label="Фактические доходы" />
          <Tab label="Фактические расходы" />
        </Tabs>
        <Box sx={{ p: 3 }}>
          {selectedTab === 0 && renderTransactionList(plannedItems, 'income')}
          {selectedTab === 1 && renderTransactionList(plannedItems, 'expense')}
          {selectedTab === 2 && renderTransactionList(actualItems, 'income')}
          {selectedTab === 3 && renderTransactionList(actualItems, 'expense')}
        </Box>
      </Paper>
    </Box>
  );
};

export default BudgetComparison; 