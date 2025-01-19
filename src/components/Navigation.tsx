import { AppBar, Toolbar, Typography, useTheme, Box, IconButton, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TimelineIcon from '@mui/icons-material/Timeline';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CompareIcon from '@mui/icons-material/Compare';
import PersonIcon from '@mui/icons-material/Person';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { isAuthenticated } from '../data/auth';
import { useState, useEffect } from 'react';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [isAuth, setIsAuth] = useState(isAuthenticated());

  useEffect(() => {
    const checkAuth = () => {
      setIsAuth(isAuthenticated());
    };
    
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  return (
    <AppBar 
      position="sticky" 
      elevation={2}
      sx={{
        bgcolor: 'background.paper',
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar sx={{ minHeight: { xs: 48, sm: 64 } }}>
        <AccountBalanceWalletIcon 
          sx={{ 
            mr: 2, 
            color: theme.palette.primary.main,
            fontSize: { xs: 24, sm: 32 },
            cursor: 'pointer'
          }}
          onClick={() => navigate('/')}
        />
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1,
            color: theme.palette.text.primary,
            fontWeight: 700,
            fontSize: { xs: '1.1rem', sm: '1.25rem' },
            cursor: 'pointer'
          }}
          onClick={() => navigate('/')}
        >
          Бюджет
        </Typography>
        
        {isAuth ? (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button
              startIcon={<TimelineIcon />}
              onClick={() => navigate('/initial')}
              color={location.pathname === '/initial' ? 'primary' : 'inherit'}
            >
              Начальная сумма
            </Button>
            <Button
              startIcon={<ReceiptIcon />}
              onClick={() => navigate('/planned')}
              color={location.pathname === '/planned' ? 'primary' : 'inherit'}
            >
              План
            </Button>
            <Button
              startIcon={<ReceiptIcon />}
              onClick={() => navigate('/actual')}
              color={location.pathname === '/actual' ? 'primary' : 'inherit'}
            >
              Факт
            </Button>
            <Button
              startIcon={<CompareIcon />}
              onClick={() => navigate('/comparison')}
              color={location.pathname === '/comparison' ? 'primary' : 'inherit'}
            >
              Сравнение
            </Button>
            <IconButton
              onClick={() => navigate('/profile')}
              sx={{
                color: location.pathname === '/profile' ? theme.palette.primary.main : theme.palette.text.secondary,
                '&:hover': {
                  color: theme.palette.primary.main,
                },
              }}
            >
              <PersonIcon />
            </IconButton>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              startIcon={<LoginIcon />}
              onClick={() => navigate('/login')}
              color="inherit"
              variant={location.pathname === '/login' ? 'contained' : 'text'}
            >
              Войти
            </Button>
            <Button
              startIcon={<PersonAddIcon />}
              onClick={() => navigate('/register')}
              color="primary"
              variant="contained"
            >
              Регистрация
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navigation; 