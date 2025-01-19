import { setCurrentUser } from './storage';

export const checkCredentials = (login: string, password: string): boolean => {
  return login === import.meta.env.VITE_REACT_APP_LOGIN && password === import.meta.env.VITE_REACT_APP_PASSWORD;
};

export const isAuthenticated = (): boolean => {
  const sessionAuth = sessionStorage.getItem('isAuthenticated');
  return sessionAuth === 'true';
};

export const setAuthenticated = (value: boolean): void => {
  sessionStorage.setItem('isAuthenticated', value.toString());
  if (value) {
    setCurrentUser({ login: import.meta.env.VITE_REACT_APP_LOGIN });
  }
};

export const clearAuth = (): void => {
  sessionStorage.removeItem('isAuthenticated');
  setCurrentUser(null);
}; 