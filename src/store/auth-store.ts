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
    isAuthenticated: boolean;
    isLoading: boolean;

    // Actions
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, fullName: string) => Promise<void>;
    logout: () => void;
    setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isLoading: false,

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
                        isAuthenticated: true,
                        isLoading: false,
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
                        isAuthenticated: true,
                        isLoading: false,
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
                    isAuthenticated: false,
                });
            },

            setUser: (user: User) => {
                set({ user });
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
