import { createContext } from 'react';

export const UserContext = createContext({ isLoggedIn: null, email: null });
