import { useState, useContext, useEffect } from 'react';
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  IconButton,
  FormControlLabel,
  Checkbox,
  useTheme,
  Divider,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/ru';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import EditIcon from '@mui/icons-material/Edit';
import { BudgetContext } from '../App';
import { BudgetItem } from '../types/budget';
import { getInitialAmount } from '../data/storage';

const PlannedBudget = () => {
  const { plannedItems, setPlannedItems } = useContext(BudgetContext);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [periodicity, setPeriodicity] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [date, setDate] = useState<Dayjs | null>(dayjs());
  const [initialAmount, setInitialAmount] = useState('0');
  const [targetDate, setTargetDate] = useState<Dayjs>(dayjs());
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const theme = useTheme();

  useEffect(() => {
    setInitialAmount(getInitialAmount());
  }, []);

  const calculateRecurringAmount = (item: BudgetItem, targetDate: Dayjs) => {
    const startDate = dayjs(item.date);
    if (!item.isRecurring || startDate.isAfter(targetDate)) {
      return 0;
    }

    const amount = Number(item.amount);
    const diffInDays = targetDate.diff(startDate, 'day');
    
    switch (item.periodicity) {
      case 'daily':
        return amount * (diffInDays + 1);
      case 'weekly':
        return amount * (Math.floor(diffInDays / 7) + 1);
      case 'monthly':
        return amount * (Math.floor(diffInDays / 30) + 1);
      case 'yearly':
        return amount * (Math.floor(diffInDays / 365) + 1);
      default:
        return amount;
    }
  };

  const calculateTotalAmount = (items: BudgetItem[], type: 'income' | 'expense') => {
    return items
      .filter(item => item.type === type)
      .reduce((sum, item) => {
        if (item.isRecurring) {
          return sum + calculateRecurringAmount(item, targetDate);
        }
        const itemDate = dayjs(item.date);
        return itemDate.isBefore(targetDate) || itemDate.isSame(targetDate)
          ? sum + Number(item.amount)
          : sum;
      }, 0);
  };

  const totalIncome = calculateTotalAmount(plannedItems, 'income');
  const totalExpenses = calculateTotalAmount(plannedItems, 'expense');
  const balance = Number(initialAmount) + totalIncome - totalExpenses;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !date) return;

    const newItem: BudgetItem = {
      id: editingItem || Date.now().toString(),
      description,
      amount,
      type,
      isRecurring,
      periodicity: isRecurring ? periodicity : undefined,
      date: date.toISOString(),
    };

    if (editingItem) {
      setPlannedItems(plannedItems.map(item => 
        item.id === editingItem ? newItem : item
      ));
      setEditingItem(null);
    } else {
      setPlannedItems([...plannedItems, newItem]);
    }

    setDescription('');
    setAmount('');
    setIsRecurring(false);
    setPeriodicity('monthly');
    setDate(dayjs());
    setType('income');
  };

  const handleEdit = (item: BudgetItem) => {
    setEditingItem(item.id);
    setDescription(item.description);
    setAmount(item.amount);
    setType(item.type);
    setIsRecurring(item.isRecurring || false);
    setPeriodicity(item.periodicity || 'monthly');
    setDate(dayjs(item.date));
  };

  const handleCancel = () => {
    setEditingItem(null);
    setDescription('');
    setAmount('');
    setIsRecurring(false);
    setPeriodicity('monthly');
    setDate(dayjs());
    setType('income');
  };

  const handleDelete = (id: string) => {
    if (editingItem === id) {
      handleCancel();
    }
    setPlannedItems(plannedItems.filter(item => item.id !== id));
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
          Планируемый бюджет
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Paper
                sx={{
                  p: 2,
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.08)' : 'rgba(144, 202, 249, 0.16)',
                  borderRadius: 2,
                  mb: 2,
                }}
              >
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Дата расчета баланса
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
                  <DatePicker
                    value={targetDate}
                    onChange={(newValue) => newValue && setTargetDate(newValue)}
                    sx={{
                      width: '100%',
                      '& .MuiOutlinedInput-root': {
                        transition: theme.transitions.create(['border-color', 'box-shadow']),
                        '&.Mui-focused': {
                          boxShadow: `${theme.palette.primary.main} 0 0 0 2px`,
                        },
                      },
                    }}
                  />
                </LocalizationProvider>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper
                sx={{
                  p: 2,
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.08)' : 'rgba(144, 202, 249, 0.16)',
                  borderRadius: 2,
                }}
              >
                <Typography variant="subtitle2" color="textSecondary">
                  Начальная сумма
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {Number(initialAmount).toLocaleString('ru-RU')} ₽
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper
                sx={{
                  p: 2,
                  bgcolor: theme.palette.success.main + '1A',
                  borderRadius: 2,
                }}
              >
                <Typography variant="subtitle2" color="textSecondary">
                  Общий доход
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.success.main }}>
                  {totalIncome.toLocaleString('ru-RU')} ₽
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper
                sx={{
                  p: 2,
                  bgcolor: theme.palette.error.main + '1A',
                  borderRadius: 2,
                }}
              >
                <Typography variant="subtitle2" color="textSecondary">
                  Общий расход
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.error.main }}>
                  {totalExpenses.toLocaleString('ru-RU')} ₽
                </Typography>
              </Paper>
            </Grid>
          </Grid>
          <Paper
            sx={{
              p: 2,
              mt: 2,
              bgcolor: balance >= 0 ? theme.palette.success.main + '1A' : theme.palette.error.main + '1A',
              borderRadius: 2,
            }}
          >
            <Typography variant="subtitle2" color="textSecondary">
              Итоговый баланс на {targetDate.format('DD.MM.YYYY')}
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 700,
                color: balance >= 0 ? theme.palette.success.main : theme.palette.error.main
              }}
            >
              {balance.toLocaleString('ru-RU')} ₽
            </Typography>
          </Paper>
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ color: editingItem ? theme.palette.primary.main : 'inherit' }}>
                {editingItem ? 'Редактирование записи' : 'Добавление новой записи'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Описание"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    transition: theme.transitions.create(['border-color', 'box-shadow']),
                    '&.Mui-focused': {
                      boxShadow: `${theme.palette.primary.main} 0 0 0 2px`,
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Сумма"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    transition: theme.transitions.create(['border-color', 'box-shadow']),
                    '&.Mui-focused': {
                      boxShadow: `${theme.palette.primary.main} 0 0 0 2px`,
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
                <DatePicker
                  label="Дата"
                  value={date}
                  onChange={(newValue) => setDate(newValue)}
                  sx={{
                    width: '100%',
                    '& .MuiOutlinedInput-root': {
                      transition: theme.transitions.create(['border-color', 'box-shadow']),
                      '&.Mui-focused': {
                        boxShadow: `${theme.palette.primary.main} 0 0 0 2px`,
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant={type === 'income' ? 'contained' : 'outlined'}
                  onClick={() => setType('income')}
                  startIcon={<TrendingUpIcon />}
                  fullWidth
                  sx={{
                    py: 1.5,
                    color: type === 'income' ? '#fff' : theme.palette.success.main,
                    borderColor: theme.palette.success.main,
                    bgcolor: type === 'income' ? theme.palette.success.main : 'transparent',
                    '&:hover': {
                      bgcolor: type === 'income' 
                        ? theme.palette.success.dark 
                        : theme.palette.success.main + '1A',
                    },
                  }}
                >
                  Доход
                </Button>
                <Button
                  variant={type === 'expense' ? 'contained' : 'outlined'}
                  onClick={() => setType('expense')}
                  startIcon={<TrendingDownIcon />}
                  fullWidth
                  sx={{
                    py: 1.5,
                    color: type === 'expense' ? '#fff' : theme.palette.error.main,
                    borderColor: theme.palette.error.main,
                    bgcolor: type === 'expense' ? theme.palette.error.main : 'transparent',
                    '&:hover': {
                      bgcolor: type === 'expense' 
                        ? theme.palette.error.dark 
                        : theme.palette.error.main + '1A',
                    },
                  }}
                >
                  Расход
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    color="primary"
                  />
                }
                label="Регулярный платеж"
                sx={{
                  '& .MuiFormControlLabel-label': {
                    color: theme.palette.text.primary,
                  },
                }}
              />
            </Grid>
            {isRecurring && (
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Периодичность</InputLabel>
                  <Select
                    value={periodicity}
                    onChange={(e) => setPeriodicity(e.target.value as 'daily' | 'weekly' | 'monthly' | 'yearly')}
                    label="Периодичность"
                  >
                    <MenuItem value="daily">Ежедневно</MenuItem>
                    <MenuItem value="weekly">Еженедельно</MenuItem>
                    <MenuItem value="monthly">Ежемесячно</MenuItem>
                    <MenuItem value="yearly">Ежегодно</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={editingItem ? <EditIcon /> : <AddIcon />}
                  sx={{
                    py: 1.5,
                    px: 4,
                    fontWeight: 600,
                    boxShadow: theme.palette.mode === 'dark' 
                      ? '0 4px 6px rgba(0, 0, 0, 0.4)' 
                      : '0 4px 6px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  {editingItem ? 'Сохранить' : 'Добавить'}
                </Button>
                {editingItem && (
                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={handleCancel}
                    sx={{ py: 1.5, px: 4 }}
                  >
                    Отмена
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={theme.palette.mode === 'dark' ? 2 : 1}
            sx={{
              p: 3,
              height: '100%',
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: theme.palette.success.main }}>
              Доходы
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {plannedItems
              .filter(item => item.type === 'income')
              .map(item => (
                <Box
                  key={item.id}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 1,
                    p: 1,
                    borderRadius: 1,
                    bgcolor: editingItem === item.id ? (theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.08)' : 'rgba(144, 202, 249, 0.16)') : 'transparent',
                    '&:hover': {
                      bgcolor: theme.palette.action.hover,
                    },
                  }}
                >
                  <Box>
                    <Typography sx={{ fontWeight: 500 }}>
                      {item.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {Number(item.amount).toLocaleString('ru-RU')} ₽
                      {item.isRecurring && ` (${
                        item.periodicity === 'daily' ? 'ежедневно' :
                        item.periodicity === 'weekly' ? 'еженедельно' :
                        item.periodicity === 'monthly' ? 'ежемесячно' :
                        'ежегодно'
                      })`}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {dayjs(item.date).format('DD.MM.YYYY')}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Редактировать">
                      <IconButton
                        onClick={() => handleEdit(item)}
                        size="small"
                        color="primary"
                        sx={{
                          '&:hover': {
                            bgcolor: theme.palette.primary.main + '1A',
                          },
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Удалить">
                      <IconButton
                        onClick={() => handleDelete(item.id)}
                        size="small"
                        sx={{
                          color: theme.palette.error.main,
                          '&:hover': {
                            bgcolor: theme.palette.error.main + '1A',
                          },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              ))}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={theme.palette.mode === 'dark' ? 2 : 1}
            sx={{
              p: 3,
              height: '100%',
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: theme.palette.error.main }}>
              Расходы
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {plannedItems
              .filter(item => item.type === 'expense')
              .map(item => (
                <Box
                  key={item.id}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 1,
                    p: 1,
                    borderRadius: 1,
                    bgcolor: editingItem === item.id ? (theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.08)' : 'rgba(144, 202, 249, 0.16)') : 'transparent',
                    '&:hover': {
                      bgcolor: theme.palette.action.hover,
                    },
                  }}
                >
                  <Box>
                    <Typography sx={{ fontWeight: 500 }}>
                      {item.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {Number(item.amount).toLocaleString('ru-RU')} ₽
                      {item.isRecurring && ` (${
                        item.periodicity === 'daily' ? 'ежедневно' :
                        item.periodicity === 'weekly' ? 'еженедельно' :
                        item.periodicity === 'monthly' ? 'ежемесячно' :
                        'ежегодно'
                      })`}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {dayjs(item.date).format('DD.MM.YYYY')}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Редактировать">
                      <IconButton
                        onClick={() => handleEdit(item)}
                        size="small"
                        color="primary"
                        sx={{
                          '&:hover': {
                            bgcolor: theme.palette.primary.main + '1A',
                          },
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Удалить">
                      <IconButton
                        onClick={() => handleDelete(item.id)}
                        size="small"
                        sx={{
                          color: theme.palette.error.main,
                          '&:hover': {
                            bgcolor: theme.palette.error.main + '1A',
                          },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PlannedBudget; 