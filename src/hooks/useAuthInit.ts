'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import authService from '@/services/authService';

// Helper function to get cookie value
const getCookie = (name: string): string | null => {
  if (typeof window === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
};

export const useAuthInit = () => {
  useEffect(() => {
    // Run once on app startup to restore auth state
    const restoreAuthState = async () => {
      if (typeof window === 'undefined') return;

      // Check both cookie and localStorage for token
      const cookieToken = getCookie('authToken');
      const storedToken = localStorage.getItem('authToken');
      const token = cookieToken || storedToken;
      
      const currentState = useAuthStore.getState();

      if (token && !currentState.isAuthenticated) {
        console.log('Restoring authentication state from storage...');
        
        try {
          // Validate token with API and get current user
          const user = await authService.getCurrentUser(token);
          
          // If token exists in localStorage but not in cookie, sync it
          if (storedToken && !cookieToken) {
            document.cookie = `authToken=${storedToken}; path=/; max-age=${7 * 24 * 60 * 60}; samesite=strict`;
          }

          // Restore auth state with real user data
          useAuthStore.setState({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
        } catch (error) {
          console.error('Token validation failed:', error);
          // Token is invalid, clear auth state
          useAuthStore.getState().logout();
        }
      } else if (!token) {
        // No token found, ensure auth state is cleared
        useAuthStore.setState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null
        });
      }
    };

    restoreAuthState();
  }, []); // Run only once on mount
};
