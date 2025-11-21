import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { loginUser, registerUser, logout } from '@/store/slices/authSlice';
import { toast } from 'sonner';

export const useAuth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      await dispatch(loginUser(credentials)).unwrap();
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error || 'Login failed');
      throw error;
    }
  };

  const register = async (credentials: { email: string; password: string; fullName: string }) => {
    try {
      await dispatch(registerUser(credentials)).unwrap();
      toast.success('Account created successfully! Welcome!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error || 'Registration failed');
      throw error;
    }
  };

  const doLogout = () => {
    dispatch(logout());
    toast.info('Logged out successfully');
    navigate('/auth');
  };

  const isAuthenticated = Boolean(auth.token);

  return {
    login,
    register,
    logout: doLogout,
    isAuthenticated,
    user: auth.user,
    status: auth.status,
    error: auth.error,
    loading: auth.status === 'loading',
  };
};