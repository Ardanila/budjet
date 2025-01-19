import { useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  useTheme,
  Link,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

interface User {
  login: string;
  password: string;
}

const Register = () => {
  const [formData, setFormData] = useState({
    login: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const theme = useTheme();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.login || !formData.password) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      console.log('Текущие пользователи:', users);

      const existingUser = users.find((user: User) => user.login === formData.login);

      if (existingUser) {
        setError('Пользователь с таким логином уже существует');
        return;
      }

      const newUser: User = {
        login: formData.login,
        password: formData.password,
      };

      users.push(newUser);
      console.log('Обновленный список пользователей:', users);

      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      console.log('Новый пользователь зарегистрирован:', newUser);

      navigate('/initial');
    } catch (err) {
      console.error('Ошибка при регистрации:', err);
      setError('Произошла ошибка при регистрации');
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
        <PersonAddIcon
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
          Регистрация
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
              value={formData.login}
              onChange={(e) => setFormData({ ...formData, login: e.target.value })}
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
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
              label="Подтвердите пароль"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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
            Зарегистрироваться
          </Button>
        </form>
        <Typography variant="body2" color="text.secondary">
          Уже есть аккаунт?{' '}
          <Link
            component="button"
            onClick={() => navigate('/login')}
            sx={{
              color: theme.palette.primary.main,
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            Войти
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Register; 