import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, LoginRequest } from '@/types/api';
import authService from '@/services/authService';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: User['role']) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials: LoginRequest) => {
        set({ isLoading: true, error: null });
        try {
          const authResponse = await authService.login(credentials);
          const { user, tokens } = authResponse;
          
          // Store tokens in cookies for middleware access
          if (typeof window !== 'undefined') {
            // Set access token cookie with proper options for security
            document.cookie = `authToken=${tokens.accessToken}; path=/; max-age=${tokens.expiresIn}; samesite=strict`;
            // Set refresh token cookie (note: can't set httponly from client-side)
            document.cookie = `refreshToken=${tokens.refreshToken}; path=/; max-age=${7 * 24 * 60 * 60}; samesite=strict`;
            // Also keep in localStorage for backward compatibility
            localStorage.setItem('authToken', tokens.accessToken);
            localStorage.setItem('refreshToken', tokens.refreshToken);
          }
          
          set({
            user,
            token: tokens.accessToken,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Login failed';
          set({
            isLoading: false,
            error: errorMessage
          });
          throw error;
        }
      },

      logout: () => {
        // Get refresh token for logout API call
        let refreshToken = '';
        if (typeof window !== 'undefined') {
          refreshToken = localStorage.getItem('refreshToken') || '';
          
          // Remove from both localStorage and cookies
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          // Clear cookies by setting expired date
          document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
        
        // Call logout API in background (don't wait for response)
        if (refreshToken) {
          authService.logout(refreshToken).catch(console.error);
        }
        
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null
        });
      },

      clearError: () => {
        set({ error: null });
      },

      setUser: (user: User) => {
        set({ user });
      },

      setToken: (token: string) => {
        set({ token });
        if (typeof window !== 'undefined') {
          localStorage.setItem('authToken', token);
          // Update cookie as well
          document.cookie = `authToken=${token}; path=/; max-age=${24 * 60 * 60}; samesite=strict`;
        }
      },

      hasPermission: (permission: string) => {
        const { user } = get();
        return user?.permissions?.includes(permission) || false;
      },

      hasRole: (role: User['role']) => {
        const { user } = get();
        return user?.role === role;
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
