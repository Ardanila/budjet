export const checkCredentials = (login: string, password: string): boolean => {
  return login === import.meta.env.VITE_REACT_APP_LOGIN && password === import.meta.env.VITE_REACT_APP_PASSWORD;
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