import { useState, useEffect } from 'react';
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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import PersonIcon from '@mui/icons-material/Person';
import { getCurrentUser } from '../../data/storage';

interface User {
  email: string;
  name: string;
}

interface SharedBudget {
  id: string;
  name: string;
  members: User[];
  owner: string;
  initialAmount: string;
}

const SharedBudget = () => {
  const [budgets, setBudgets] = useState<SharedBudget[]>([]);
  const [newBudgetName, setNewBudgetName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [selectedBudget, setSelectedBudget] = useState<SharedBudget | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [error, setError] = useState('');
  const theme = useTheme();

  const currentUser = getCurrentUser();

  useEffect(() => {
    const savedBudgets = sessionStorage.getItem('sharedBudgets');
    if (savedBudgets) {
      setBudgets(JSON.parse(savedBudgets));
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('sharedBudgets', JSON.stringify(budgets));
  }, [budgets]);

  const handleCreateBudget = () => {
    if (!newBudgetName.trim()) {
      setError('Введите название бюджета');
      return;
    }

    const newBudget: SharedBudget = {
      id: Date.now().toString(),
      name: newBudgetName,
      members: [{ email: currentUser.email, name: currentUser.name }],
      owner: currentUser.email,
      initialAmount: '0',
    };

    setBudgets([...budgets, newBudget]);
    setNewBudgetName('');
    setError('');
  };

  const handleAddMember = () => {
    if (!selectedBudget) return;
    if (!newMemberEmail.trim()) {
      setError('Введите email пользователя');
      return;
    }

    const users = JSON.parse(sessionStorage.getItem('users') || '[]');
    const newMember = users.find((user: User) => user.email === newMemberEmail);

    if (!newMember) {
      setError('Пользователь не найден');
      return;
    }

    if (selectedBudget.members.some(member => member.email === newMemberEmail)) {
      setError('Пользователь уже добавлен в бюджет');
      return;
    }

    const updatedBudgets = budgets.map(budget => {
      if (budget.id === selectedBudget.id) {
        return {
          ...budget,
          members: [...budget.members, { email: newMember.email, name: newMember.name }],
        };
      }
      return budget;
    });

    setBudgets(updatedBudgets);
    setNewMemberEmail('');
    setError('');
    setDialogOpen(false);
  };

  const handleRemoveMember = (budgetId: string, memberEmail: string) => {
    const budget = budgets.find(b => b.id === budgetId);
    if (!budget || budget.owner === memberEmail) return;

    const updatedBudgets = budgets.map(budget => {
      if (budget.id === budgetId) {
        return {
          ...budget,
          members: budget.members.filter(member => member.email !== memberEmail),
        };
      }
      return budget;
    });

    setBudgets(updatedBudgets);
  };

  const handleDeleteBudget = (budgetId: string) => {
    setBudgets(budgets.filter(budget => budget.id !== budgetId));
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
          Общие бюджеты
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs>
            <TextField
              fullWidth
              label="Название нового бюджета"
              value={newBudgetName}
              onChange={(e) => setNewBudgetName(e.target.value)}
              error={!!error}
              helperText={error}
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
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateBudget}
              startIcon={<AddIcon />}
              sx={{
                py: 1.5,
                px: 3,
                fontWeight: 600,
                boxShadow: theme.palette.mode === 'dark' ? '0 4px 6px rgba(0, 0, 0, 0.4)' : '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}
            >
              Создать
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {budgets.map(budget => (
          <Grid item xs={12} md={6} key={budget.id}>
            <Paper
              elevation={theme.palette.mode === 'dark' ? 2 : 1}
              sx={{
                p: 3,
                height: '100%',
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {budget.name}
                </Typography>
                {budget.owner === currentUser.email && (
                  <Tooltip title="Удалить бюджет">
                    <IconButton
                      onClick={() => handleDeleteBudget(budget.id)}
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
                )}
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Участники:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {budget.members.map(member => (
                  <Chip
                    key={member.email}
                    label={member.name}
                    icon={<PersonIcon />}
                    variant="outlined"
                    onDelete={
                      budget.owner === currentUser.email && member.email !== currentUser.email
                        ? () => handleRemoveMember(budget.id, member.email)
                        : undefined
                    }
                  />
                ))}
              </Box>
              {budget.owner === currentUser.email && (
                <Button
                  variant="outlined"
                  startIcon={<GroupAddIcon />}
                  onClick={() => {
                    setSelectedBudget(budget);
                    setDialogOpen(true);
                  }}
                  sx={{ mt: 1 }}
                >
                  Добавить участника
                </Button>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Добавить участника</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Email участника"
            type="email"
            fullWidth
            value={newMemberEmail}
            onChange={(e) => setNewMemberEmail(e.target.value)}
            error={!!error}
            helperText={error}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Отмена</Button>
          <Button onClick={handleAddMember} variant="contained">
            Добавить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SharedBudget; 