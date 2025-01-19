import { useState, useContext } from 'react';
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  IconButton,
  useTheme,
  Divider,
  Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { BudgetContext } from '../App';
import dayjs, { Dayjs } from 'dayjs';

interface BudgetItem {
  id: string;
  description: string;
  amount: string;
  type: 'income' | 'expense';
  date: string;
}

const ActualBudget = () => {
  const { actualItems, setActualItems } = useContext(BudgetContext);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [date, setDate] = useState<Dayjs | null>(dayjs());

  const theme = useTheme();

  const totalIncome = actualItems
    .filter(item => item.type === 'income')
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const totalExpenses = actualItems
    .filter(item => item.type === 'expense')
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const balance = totalIncome - totalExpenses;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !date) return;

    const newItem: BudgetItem = {
      id: Date.now().toString(),
      description,
      amount,
      type,
      date: date.toISOString(),
    };

    setActualItems([...actualItems, newItem]);
    setDescription('');
    setAmount('');
    setDate(dayjs());
  };

  const handleDelete = (id: string) => {
    setActualItems(actualItems.filter(item => item.id !== id));
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
          Фактический бюджет
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
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
              <TextField
                fullWidth
                label="Дата"
                type="date"
                value={date?.format('YYYY-MM-DD')}
                onChange={(e) => setDate(dayjs(e.target.value))}
                required
                InputProps={{
                  startAdornment: (
                    <CalendarTodayIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
                  ),
                }}
                InputLabelProps={{
                  shrink: true,
                }}
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
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                sx={{
                  py: 1.5,
                  px: 4,
                  fontWeight: 600,
                  boxShadow: theme.palette.mode === 'dark' 
                    ? '0 4px 6px rgba(0, 0, 0, 0.4)' 
                    : '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
              >
                Добавить
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Box sx={{ mb: 4 }}>
        <Paper
          elevation={theme.palette.mode === 'dark' ? 2 : 1}
          sx={{
            p: 3,
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: balance >= 0 ? theme.palette.success.main + '1A' : theme.palette.error.main + '1A',
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
            Общий баланс: {balance.toLocaleString()}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography color="success.main">
                Доходы: {totalIncome.toLocaleString()}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography color="error.main">
                Расходы: {totalExpenses.toLocaleString()}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Box>

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
            {actualItems
              .filter(item => item.type === 'income')
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
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
                      {Number(item.amount).toLocaleString()} • {new Date(item.date).toLocaleDateString()}
                    </Typography>
                  </Box>
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
            {actualItems
              .filter(item => item.type === 'expense')
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
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
                      {Number(item.amount).toLocaleString()} • {new Date(item.date).toLocaleDateString()}
                    </Typography>
                  </Box>
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
              ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ActualBudget; 