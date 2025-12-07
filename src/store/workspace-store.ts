import { create } from 'zustand';
import api from '@/lib/api';

interface Workspace {
    id: string;
    name: string;
    slug: string;
    description?: string;
    planTier: string;
    ownerId: string;
    createdAt: string;
    _count?: {
        members: number;
        boards: number;
    };
}

interface WorkspaceState {
    workspaces: Workspace[];
    currentWorkspace: Workspace | null;
    isLoading: boolean;

    // Actions
    fetchWorkspaces: () => Promise<void>;
    createWorkspace: (name: string, description?: string) => Promise<Workspace>;
    setCurrentWorkspace: (workspace: Workspace | null) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
    workspaces: [],
    currentWorkspace: null,
    isLoading: false,

    fetchWorkspaces: async () => {
        set({ isLoading: true });
        try {
            const response = await api.get('/workspaces');
            set({ workspaces: response.data, isLoading: false });
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    createWorkspace: async (name: string, description?: string) => {
        set({ isLoading: true });
        try {
            const response = await api.post('/workspaces', { name, description });
            const newWorkspace = response.data;
            set((state) => ({
                workspaces: [newWorkspace, ...state.workspaces],
                currentWorkspace: newWorkspace,
                isLoading: false,
            }));
            return newWorkspace;
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    setCurrentWorkspace: (workspace: Workspace | null) => {
        set({ currentWorkspace: workspace });
    },
}));
