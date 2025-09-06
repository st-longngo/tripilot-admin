import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { User } from '@/types/api';
import { 
  UserProfile, 
  SecuritySettings, 
  NotificationSettings,
  UpdateProfileRequest
} from '@/types/settings';

export const useSettings = () => {
  const { user: authUser, setUser } = useAuthStore();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings | null>(null);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Convert Auth User to UserProfile format
  const convertAuthUserToProfile = (authUser: User): UserProfile => {
    return {
      id: authUser.id,
      name: authUser.fullName || 'Người dùng',
      email: authUser.email,
      role: authUser.role === 'admin' ? 'Administrator' : 
            authUser.role === 'tour_operator' ? 'Tour Operator' :
            authUser.role === 'tour_guide' ? 'Tour Guide' : 'User',
      avatar: authUser.avatarUrl,
      phone: authUser.phone,
      department: authUser.role === 'admin' ? 'Quản trị hệ thống' :
                 authUser.role === 'tour_operator' ? 'Vận hành Tour' :
                 authUser.role === 'tour_guide' ? 'Hướng dẫn viên' : 'Khách hàng',
      joinDate: authUser.createdAt || new Date().toISOString(),
    };
  };

  // Load settings from localStorage and auth store
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        setError(null);

        // Simulate loading delay for better UX
        await new Promise(resolve => setTimeout(resolve, 800));

        // Load user profile from auth store
        if (authUser) {
          const profile = convertAuthUserToProfile(authUser);
          setUserProfile(profile);
        } else {
          // Try to load from localStorage as fallback
          const storedAuth = localStorage.getItem('auth-storage');
          if (storedAuth) {
            const authData = JSON.parse(storedAuth);
            if (authData?.state?.user) {
              const profile = convertAuthUserToProfile(authData.state.user);
              setUserProfile(profile);
            }
          }
        }

        // Load security settings from localStorage
        const storedSecuritySettings = localStorage.getItem('security-settings');
        if (storedSecuritySettings) {
          setSecuritySettings(JSON.parse(storedSecuritySettings));
        } else {
          // Default security settings
          setSecuritySettings({
            twoFactorEnabled: false,
            lastPasswordChange: '2024-08-15',
            loginHistory: [
              {
                id: '1',
                timestamp: new Date().toISOString(),
                ipAddress: '192.168.1.100',
                userAgent: navigator.userAgent,
                location: 'Ho Chi Minh City, Vietnam'
              }
            ]
          });
        }

        // Load notification settings from localStorage
        const storedNotificationSettings = localStorage.getItem('notification-settings');
        if (storedNotificationSettings) {
          setNotificationSettings(JSON.parse(storedNotificationSettings));
        } else {
          // Default notification settings
          const defaultNotifications = {
            emailNotifications: true,
            pushNotifications: true,
            tourUpdates: true,
            userRegistrations: false,
            systemAlerts: true,
          };
          setNotificationSettings(defaultNotifications);
          localStorage.setItem('notification-settings', JSON.stringify(defaultNotifications));
        }

      } catch (err) {
        console.error('Error loading settings:', err);
        setError('Không thể tải cài đặt. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [authUser]);

  const updateProfile = async (data: UpdateProfileRequest): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (userProfile) {
        const updatedProfile = {
          ...userProfile,
          ...data,
        };
        setUserProfile(updatedProfile);

        // Update auth store if user data changed
        if (authUser && (data.name || data.email)) {
          const updatedAuthUser = {
            ...authUser,
            fullName: data.name || authUser.fullName,
            email: data.email || authUser.email,
            phone: data.phone || authUser.phone,
          };
          setUser(updatedAuthUser);
        }

        // Save to localStorage
        const currentAuth = localStorage.getItem('auth-storage');
        if (currentAuth) {
          const authData = JSON.parse(currentAuth);
          if (authData?.state?.user) {
            authData.state.user = {
              ...authData.state.user,
              fullName: data.name || authData.state.user.fullName,
              email: data.email || authData.state.user.email,
              phone: data.phone || authData.state.user.phone,
            };
            localStorage.setItem('auth-storage', JSON.stringify(authData));
          }
        }
      }
      
      return true;
    } catch {
      setError('Không thể cập nhật thông tin. Vui lòng thử lại.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (): Promise<boolean> => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (securitySettings) {
        setSecuritySettings({
          ...securitySettings,
          lastPasswordChange: new Date().toISOString(),
        });
      }
      
      return true;
    } catch {
      setError('Failed to change password');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateNotificationSettings = async (data: Partial<NotificationSettings>): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (notificationSettings) {
        const updatedSettings = {
          ...notificationSettings,
          ...data,
        };
        setNotificationSettings(updatedSettings);
        
        // Save to localStorage
        localStorage.setItem('notification-settings', JSON.stringify(updatedSettings));
      }
      
      return true;
    } catch {
      setError('Không thể cập nhật cài đặt thông báo. Vui lòng thử lại.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const enableTwoFactor = async (): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (securitySettings) {
        const updatedSettings = {
          ...securitySettings,
          twoFactorEnabled: true,
        };
        setSecuritySettings(updatedSettings);
        
        // Save to localStorage
        localStorage.setItem('security-settings', JSON.stringify(updatedSettings));
      }
      
      return true;
    } catch {
      setError('Không thể bật xác thực 2 yếu tố. Vui lòng thử lại.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const disableTwoFactor = async (): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (securitySettings) {
        const updatedSettings = {
          ...securitySettings,
          twoFactorEnabled: false,
        };
        setSecuritySettings(updatedSettings);
        
        // Save to localStorage
        localStorage.setItem('security-settings', JSON.stringify(updatedSettings));
      }
      
      return true;
    } catch {
      setError('Không thể tắt xác thực 2 yếu tố. Vui lòng thử lại.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    userProfile,
    securitySettings,
    notificationSettings,
    loading,
    error,
    updateProfile,
    changePassword,
    updateNotificationSettings,
    enableTwoFactor,
    disableTwoFactor,
  };
};
