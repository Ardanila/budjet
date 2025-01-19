import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, Box } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { createContext, useState, useEffect } from 'react';
import { BudgetItem, BudgetContextType } from './types/budget';
import { isAuthenticated } from './data/auth';
import { getBudgetData, setBudgetData } from './data/edgeConfig';

import Navigation from './components/Navigation';
import Login from './components/Auth/Login';
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
  const [plannedItems, setPlannedItems] = useState<BudgetItem[]>([]);
  const [actualItems, setActualItems] = useState<BudgetItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка данных при старте
  useEffect(() => {
    const loadData = async () => {
      const data = await getBudgetData();
      setPlannedItems(data.plannedBudget);
      setActualItems(data.actualBudget);
      setIsLoading(false);
    };
    loadData();
  }, []);

  // Сохранение данных при изменении
  useEffect(() => {
    if (!isLoading) {
      setBudgetData(plannedItems, actualItems, '0');
    }
  }, [plannedItems, actualItems, isLoading]);

  const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    return isAuthenticated() ? <>{children}</> : <Navigate to="/login" replace />;
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Загрузка...
      </Box>
    );
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <BudgetContext.Provider value={{ plannedItems, actualItems, setPlannedItems, setActualItems }}>
        <Router>
          <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navigation />
            <Box sx={{ flex: 1, p: 3 }}>
              <Routes>
                <Route path="/login" element={!isAuthenticated() ? <Login /> : <Navigate to="/initial" replace />} />
                <Route path="/initial" element={<PrivateRoute><InitialSetup /></PrivateRoute>} />
                <Route path="/planned" element={<PrivateRoute><PlannedBudget /></PrivateRoute>} />
                <Route path="/actual" element={<PrivateRoute><ActualBudget /></PrivateRoute>} />
                <Route path="/comparison" element={<PrivateRoute><BudgetComparison /></PrivateRoute>} />
                <Route path="/shared" element={<PrivateRoute><SharedBudget /></PrivateRoute>} />
                <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                <Route path="/" element={<Navigate to={isAuthenticated() ? "/initial" : "/login"} replace />} />
              </Routes>
            </Box>
          </Box>
        </Router>
      </BudgetContext.Provider>
    </ThemeProvider>
  );
}

export default App; 