import { create } from 'zustand';
import { Notification } from '@/types';

interface UIState {
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark';
  notifications: Notification[];
  isLoading: boolean;
  modal: {
    isOpen: boolean;
    title?: string;
    content?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  };
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  setLoading: (loading: boolean) => void;
  openModal: (modal: Omit<UIState['modal'], 'isOpen'>) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  sidebarCollapsed: false,
  theme: 'light',
  notifications: [],
  isLoading: false,
  modal: {
    isOpen: false,
  },

  toggleSidebar: () =>
    set((state) => ({
      sidebarCollapsed: !state.sidebarCollapsed,
    })),

  setSidebarCollapsed: (collapsed: boolean) =>
    set({ sidebarCollapsed: collapsed }),

  setTheme: (theme: 'light' | 'dark') => {
    set({ theme });
    // Update document class for theme
    if (typeof window !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark');
      localStorage.setItem('theme', theme);
    }
  },

  addNotification: (notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substring(2);
    const newNotification: Notification = {
      ...notification,
      id,
      read: false,
      createdAt: new Date(),
    };

    set((state) => ({
      notifications: [newNotification, ...state.notifications],
    }));

    // Auto-remove notification after 5 seconds for success/info types
    if (notification.type === 'success' || notification.type === 'info') {
      setTimeout(() => {
        get().removeNotification(id);
      }, 5000);
    }
  },

  removeNotification: (id: string) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  markNotificationAsRead: (id: string) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),

  clearAllNotifications: () => set({ notifications: [] }),

  setLoading: (loading: boolean) => set({ isLoading: loading }),

  openModal: (modal: Omit<UIState['modal'], 'isOpen'>) =>
    set({ modal: { ...modal, isOpen: true } }),

  closeModal: () =>
    set({ modal: { isOpen: false } }),
}));

// Custom hooks for specific UI actions
export const useNotifications = () => {
  const { notifications, addNotification, removeNotification, markNotificationAsRead, clearAllNotifications } = useUIStore();
  
  const showSuccess = (title: string, message?: string) => {
    addNotification({ type: 'success', title, message });
  };

  const showError = (title: string, message?: string) => {
    addNotification({ type: 'error', title, message });
  };

  const showWarning = (title: string, message?: string) => {
    addNotification({ type: 'warning', title, message });
  };

  const showInfo = (title: string, message?: string) => {
    addNotification({ type: 'info', title, message });
  };

  return {
    notifications,
    removeNotification,
    markNotificationAsRead,
    clearAllNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};

export const useModal = () => {
  const { modal, openModal, closeModal } = useUIStore();
  return { modal, openModal, closeModal };
};

export const useTheme = () => {
  const { theme, setTheme } = useUIStore();
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return { theme, setTheme, toggleTheme };
};
