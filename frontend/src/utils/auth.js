import { jwtDecode } from 'jwt-decode';

export const getCurrentUser = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  // Decode the token to get user data
  const decoded = jwtDecode(token);
  return decoded; // { id, role, ... }
};

export const isArtisan = () => {
  const user = getCurrentUser();
  // console.log('User role:' + user?.role + ' is trying to access artisan route');
  return user?.role === 'artisan';
};