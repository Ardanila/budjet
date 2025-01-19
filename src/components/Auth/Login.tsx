import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import LoginIcon from '@mui/icons-material/Login';
import { useTheme, Paper } from '@mui/material';

interface User {
  login: string;
  password: string;
}

const Login = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    console.log('Начало процесса входа');
    console.log('Введенные данные:', { login, password });

    if (!login || !password) {
      console.log('Ошибка: пустые поля');
      setError('Пожалуйста, заполните все поля');
      return;
    }

    try {
      const usersRaw = localStorage.getItem('users');
      console.log('Данные из localStorage (raw):', usersRaw);
      
      const users = JSON.parse(usersRaw || '[]');
      console.log('Распарсенные пользователи:', users);

      if (!Array.isArray(users)) {
        console.error('Ошибка: данные пользователей не являются массивом');
        setError('Ошибка в данных пользователей');
        return;
      }

      const user = users.find((u: User) => {
        console.log('Сравнение с пользователем:', {
          storedLogin: u.login,
          storedPassword: u.password,
          inputLogin: login,
          inputPassword: password,
          loginMatch: u.login === login,
          passwordMatch: u.password === password
        });
        return u.login === login && u.password === password;
      });
      
      console.log('Найденный пользователь:', user);

      if (!user) {
        console.log('Пользователь не найден');
        setError('Неверный логин или пароль');
        return;
      }

      localStorage.setItem('currentUser', JSON.stringify(user));
      console.log('Пользователь успешно вошел в систему:', user);
      navigate('/initial');
    } catch (err) {
      console.error('Ошибка при входе:', err);
      setError('Произошла ошибка при входе');
    }
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
        <LoginIcon
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
          Вход в систему
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Логин"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  transition: theme.transitions.create(['border-color', 'box-shadow']),
                  '&.Mui-focused': {
                    boxShadow: `${theme.palette.primary.main} 0 0 0 2px`,
                  },
                },
              }}
            />
            <TextField
              fullWidth
              label="Пароль"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              mb: 2,
              boxShadow: theme.palette.mode === 'dark' ? '0 4px 6px rgba(0, 0, 0, 0.4)' : '0 4px 6px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                boxShadow: theme.palette.mode === 'dark' ? '0 6px 8px rgba(0, 0, 0, 0.5)' : '0 6px 8px rgba(0, 0, 0, 0.15)',
              },
            }}
          >
            Войти
          </Button>
        </form>
        <Typography variant="body2" color="text.secondary">
          Нет аккаунта?{' '}
          <Button
            onClick={() => navigate('/register')}
            sx={{
              textTransform: 'none',
              color: theme.palette.primary.main,
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            Зарегистрироваться
          </Button>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login; 