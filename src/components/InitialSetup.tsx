import { useState } from 'react';
import { Paper, TextField, Button, Typography, Box, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { setInitialAmount } from '../data/storage';

const InitialSetup = () => {
  const [initialAmount, setInitialAmountState] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInitialAmount(initialAmount);
    navigate('/planned');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mt: 8,
      }}
    >
      <Paper
        elevation={theme.palette.mode === 'dark' ? 2 : 1}
        sx={{
          p: 4,
          maxWidth: 400,
          width: '100%',
          textAlign: 'center',
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <AccountBalanceWalletIcon
          sx={{
            fontSize: 48,
            color: theme.palette.primary.main,
            mb: 2,
          }}
        />
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{
            fontWeight: 700,
            mb: 3,
          }}
        >
          Начальная сумма бюджета
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 4 }}>
            <TextField
              fullWidth
              label="Введите начальную сумму"
              type="number"
              value={initialAmount}
              onChange={(e) => setInitialAmountState(e.target.value)}
              required
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  transition: theme.transitions.create(['border-color', 'box-shadow']),
                  '&.Mui-focused': {
                    boxShadow: `${theme.palette.primary.main} 0 0 0 2px`,
                  },
                },
              }}
            />
          </Box>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              boxShadow: theme.palette.mode === 'dark' ? '0 4px 6px rgba(0, 0, 0, 0.4)' : '0 4px 6px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                boxShadow: theme.palette.mode === 'dark' ? '0 6px 8px rgba(0, 0, 0, 0.5)' : '0 6px 8px rgba(0, 0, 0, 0.15)',
              },
            }}
          >
            Продолжить
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default InitialSetup; 