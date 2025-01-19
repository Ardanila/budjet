import dotenv from 'dotenv';

dotenv.config();

export const AUTH_CONFIG = {
    login: process.env.REACT_APP_USER_LOGIN || 'admin',
    password: process.env.REACT_APP_USER_PASSWORD || 'admin'
};

export const DATA_PATH = 'data/budget-data.json'; 