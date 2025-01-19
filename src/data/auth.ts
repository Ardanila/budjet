export const login = (username: string, password: string): boolean => {
  return username === process.env.ADMIN_LOGIN && password === process.env.ADMIN_PASSWORD;
};

export const isAuthenticated = (): boolean => {
  return localStorage.getItem('isAuthenticated') === 'true';
};

export const setAuthenticated = (value: boolean): void => {
  localStorage.setItem('isAuthenticated', value.toString());
};

export const logout = (): void => {
  localStorage.removeItem('isAuthenticated');
}; 