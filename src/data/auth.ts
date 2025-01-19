import config from '../config/auth.json';

export const checkCredentials = (login: string, password: string): boolean => {
  return login === process.env.REACT_APP_LOGIN && password === process.env.REACT_APP_PASSWORD;
};

export const isAuthenticated = (): boolean => {
  const sessionAuth = sessionStorage.getItem('isAuthenticated');
  return sessionAuth === 'true';
};

export const setAuthenticated = (value: boolean): void => {
  sessionStorage.setItem('isAuthenticated', value.toString());
};

export const clearAuth = (): void => {
  sessionStorage.removeItem('isAuthenticated');
}; 