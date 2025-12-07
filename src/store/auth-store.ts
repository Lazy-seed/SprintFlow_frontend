import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';

interface User {
    id: string;
    email: string;
    fullName: string;
    avatarUrl?: string;
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isInitialized: boolean;

    // Actions
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, fullName: string) => Promise<void>;
    logout: () => void;
    setTokens: (accessToken: string, refreshToken: string) => void;
    setUser: (user: User) => void;
    checkAuth: () => Promise<void>;
    initialize: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            isInitialized: false,

            initialize: () => {
                set({ isInitialized: true });
            },

            login: async (email: string, password: string) => {
                set({ isLoading: true });
                try {
                    const response = await api.post('/auth/login', { email, password });
                    const { user, accessToken, refreshToken } = response.data;

                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('refreshToken', refreshToken);

                    set({
                        user,
                        accessToken,
                        refreshToken,
                        isAuthenticated: true,
                        isLoading: false,
                        isInitialized: true,
                    });
                } catch (error) {
                    set({ isLoading: false });
                    throw error;
                }
            },

            register: async (email: string, password: string, fullName: string) => {
                set({ isLoading: true });
                try {
                    const response = await api.post('/auth/register', {
                        email,
                        password,
                        fullName,
                    });
                    const { user, accessToken, refreshToken } = response.data;

                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('refreshToken', refreshToken);

                    set({
                        user,
                        accessToken,
                        refreshToken,
                        isAuthenticated: true,
                        isLoading: false,
                        isInitialized: true,
                    });
                } catch (error) {
                    set({ isLoading: false });
                    throw error;
                }
            },

            logout: () => {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                set({
                    user: null,
                    accessToken: null,
                    refreshToken: null,
                    isAuthenticated: false,
                });
            },

            setTokens: (accessToken: string, refreshToken: string) => {
                set({ accessToken, refreshToken });
            },

            setUser: (user: User) => {
                set({ user });
            },

            checkAuth: async () => {
                const token = localStorage.getItem('accessToken');
                if (!token) {
                    set({ isAuthenticated: false, isInitialized: true });
                    return;
                }

                try {
                    const response = await api.get('/auth/me');
                    set({
                        user: response.data,
                        isAuthenticated: true,
                        isInitialized: true,
                    });
                } catch (error) {
                    set({ isAuthenticated: false, isInitialized: true });
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
