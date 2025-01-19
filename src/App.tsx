import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, Box } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { createContext, useState, useEffect } from 'react';
import { BudgetItem, BudgetContextType } from './types/budget';
import {
  getPlannedBudget,
  setPlannedBudget,
  getActualBudget,
  setActualBudget,
} from './data/storage';
import { isAuthenticated } from './data/auth';

import Navigation from './components/Navigation';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import InitialSetup from './components/InitialSetup';
import PlannedBudget from './components/PlannedBudget';
import ActualBudget from './components/ActualBudget';
import BudgetComparison from './components/BudgetComparison';
import SharedBudget from './components/SharedBudget/SharedBudget';
import Profile from './components/Profile';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
});

export const BudgetContext = createContext<BudgetContextType>({
  plannedItems: [],
  actualItems: [],
  setPlannedItems: () => {},
  setActualItems: () => {},
});

function App() {
  const [isAuth, setIsAuth] = useState(isAuthenticated());
  const [plannedItems, setPlannedItems] = useState<BudgetItem[]>(() => getPlannedBudget());
  const [actualItems, setActualItems] = useState<BudgetItem[]>(() => getActualBudget());

  useEffect(() => {
    const checkAuth = () => {
      setIsAuth(isAuthenticated());
    };
    
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  useEffect(() => {
    setPlannedBudget(plannedItems);
  }, [plannedItems]);

  useEffect(() => {
    setActualBudget(actualItems);
  }, [actualItems]);

  const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    return isAuth ? <>{children}</> : <Navigate to="/login" replace />;
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <BudgetContext.Provider value={{ plannedItems, actualItems, setPlannedItems, setActualItems }}>
        <Router>
          <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navigation />
            <Box sx={{ flex: 1, p: 3 }}>
              <Routes>
                <Route path="/login" element={!isAuth ? <Login /> : <Navigate to="/initial" replace />} />
                <Route path="/register" element={!isAuth ? <Register /> : <Navigate to="/initial" replace />} />
                <Route path="/initial" element={<PrivateRoute><InitialSetup /></PrivateRoute>} />
                <Route path="/planned" element={<PrivateRoute><PlannedBudget /></PrivateRoute>} />
                <Route path="/actual" element={<PrivateRoute><ActualBudget /></PrivateRoute>} />
                <Route path="/comparison" element={<PrivateRoute><BudgetComparison /></PrivateRoute>} />
                <Route path="/shared" element={<PrivateRoute><SharedBudget /></PrivateRoute>} />
                <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                <Route path="/" element={<Navigate to={isAuth ? "/initial" : "/login"} replace />} />
              </Routes>
            </Box>
          </Box>
        </Router>
      </BudgetContext.Provider>
    </ThemeProvider>
  );
}

export default App; 