import { jwtDecode } from 'jwt-decode';

export interface JWTPayload {
  sub: string;
  email: string;
  exp: number;
  iat: number;
}

export const decodeToken = (token: string): JWTPayload | null => {
  try {
    return jwtDecode<JWTPayload>(token);
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded) return true;
  
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};

export const getTokenFromStorage = (): string | null => {
  return localStorage.getItem('token');
};

export const setTokenInStorage = (token: string): void => {
  localStorage.setItem('token', token);
};

export const removeTokenFromStorage = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};