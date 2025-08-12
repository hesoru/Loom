import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  registerStart, 
  registerSuccess, 
  registerFailure, 
  logout,
  clearError 
} from '../redux/authSlice';
import { loginUser, registerUser } from '../services/api';
import { useNotification } from './useNotification';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { showNotification } = useNotification();
  const { user, isAuthenticated, loading, error } = useSelector(state => state.auth);

  const login = useCallback(async (email, password) => {
    try {
      dispatch(loginStart());
      const userData = await loginUser({ email, password });
      dispatch(loginSuccess(userData));
      showNotification('Login successful!', 'success');
      return userData;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch(loginFailure(errorMessage));
      showNotification(errorMessage, 'error');
      throw error;
    }
  }, [dispatch, showNotification]);

  const register = useCallback(async (name, email, password) => {
    try {
      dispatch(registerStart());
      const userData = await registerUser({ name, email, password });
      dispatch(registerSuccess(userData));
      showNotification('Registration successful!', 'success');
      return userData;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      dispatch(registerFailure(errorMessage));
      showNotification(errorMessage, 'error');
      throw error;
    }
  }, [dispatch, showNotification]);

  const logoutUser = useCallback(() => {
    dispatch(logout());
    showNotification('You have been logged out', 'info');
  }, [dispatch, showNotification]);

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout: logoutUser,
    clearError: clearAuthError
  };
};
