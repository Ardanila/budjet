import { useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Avatar,
  Grid,
  Divider,
  Alert,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import SaveIcon from '@mui/icons-material/Save';
import LogoutIcon from '@mui/icons-material/Logout';
import { AUTH_CONFIG } from '../data/config';

const Profile = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();

  const handleLogout = () => {
    sessionStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.currentPassword) {
      setError('Введите текущий пароль');
      return;
    }

    if (formData.currentPassword !== AUTH_CONFIG.password) {
      setError('Неверный текущий пароль');
      return;
    }

    if (!formData.newPassword) {
      setError('Введите новый пароль');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Новые пароли не совпадают');
      return;
    }

    // В данном случае мы не можем изменить пароль, так как он хранится в env
    setError('Изменение пароля недоступно. Пароль установлен в переменных окружения.');

    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Paper
        elevation={theme.palette.mode === 'dark' ? 2 : 1}
        sx={{
          p: 4,
          maxWidth: 600,
          mx: 'auto',
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: 'primary.main',
              mb: 2,
            }}
          >
            <PersonIcon sx={{ fontSize: 40 }} />
          </Avatar>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
            Личный кабинет
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Логин: {AUTH_CONFIG.login}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Divider>
                <Typography color="text.secondary">
                  Изменить пароль
                </Typography>
              </Divider>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Текущий пароль"
                type="password"
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
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
                label="Новый пароль"
                type="password"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
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
                label="Подтвердите новый пароль"
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
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  sx={{
                    flex: 1,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                    boxShadow: theme.palette.mode === 'dark' ? '0 4px 6px rgba(0, 0, 0, 0.4)' : '0 4px 6px rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                      boxShadow: theme.palette.mode === 'dark' ? '0 6px 8px rgba(0, 0, 0, 0.5)' : '0 6px 8px rgba(0, 0, 0, 0.15)',
                    },
                  }}
                >
                  Сохранить пароль
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleLogout}
                  startIcon={<LogoutIcon />}
                  sx={{
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                  }}
                >
                  Выйти
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default Profile; 