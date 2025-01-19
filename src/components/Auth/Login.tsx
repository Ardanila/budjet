import { useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { checkCredentials, setAuthenticated } from '../../data/auth';

const Login = () => {
  const [formData, setFormData] = useState({
    login: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.login || !formData.password) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    if (checkCredentials(formData.login, formData.password)) {
      setAuthenticated(true);
      navigate('/profile');
    } else {
      setError('Неверный логин или пароль');
    }
  };

  return (
    <Box sx={{ mt: 8 }}>
      <Paper
        elevation={theme.palette.mode === 'dark' ? 2 : 1}
        sx={{
          p: 4,
          maxWidth: 400,
          mx: 'auto',
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: 700 }}>
          Вход в систему
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Логин"
            value={formData.login}
            onChange={(e) => setFormData({ ...formData, login: e.target.value })}
            margin="normal"
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
          <TextField
            fullWidth
            label="Пароль"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            margin="normal"
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              boxShadow: theme.palette.mode === 'dark' ? '0 4px 6px rgba(0, 0, 0, 0.4)' : '0 4px 6px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                boxShadow: theme.palette.mode === 'dark' ? '0 6px 8px rgba(0, 0, 0, 0.5)' : '0 6px 8px rgba(0, 0, 0, 0.15)',
              },
            }}
          >
            Войти
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Login; 