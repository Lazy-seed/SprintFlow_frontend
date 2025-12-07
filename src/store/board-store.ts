import { create } from 'zustand';
import api from '@/lib/api';

interface Board {
    id: string;
    name: string;
    description?: string;
    workspaceId: string;
    _count?: {
        tasks: number;
        columns: number;
    };
}

interface Column {
    id: string;
    name: string;
    position: number;
    color: string;
    tasks: Task[];
}

interface Task {
    id: string;
    title: string;
    description?: string;
    taskNumber: string;
    priority: string;
    columnId: string;
    position: number;
    assignee?: {
        id: string;
        fullName: string;
        avatarUrl?: string;
    };
    _count?: {
        subtasks: number;
        comments: number;
    };
}

interface BoardState {
    boards: Board[];
    currentBoard: any | null;
    isLoading: boolean;

    fetchBoards: (workspaceId: string) => Promise<void>;
    createBoard: (workspaceId: string, name: string, description?: string) => Promise<Board>;
    fetchBoardDetails: (boardId: string) => Promise<void>;
    createTask: (boardId: string, columnId: string, title: string, description?: string, priority?: string) => Promise<void>;
    updateTask: (taskId: string, updates: any) => Promise<void>;
    updateTaskOptimistic: (taskId: string, updates: any) => void;
    deleteTask: (taskId: string) => Promise<void>;
    moveTask: (taskId: string, sourceColumnId: string, destColumnId: string, newPosition: number) => void;
    reorderTasksInColumn: (columnId: string, taskId: string, newPosition: number) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
    boards: [],
    currentBoard: null,
    isLoading: false,

    fetchBoards: async (workspaceId: string) => {
        set({ isLoading: true });
        try {
            const response = await api.get(`/workspaces/${workspaceId}/boards`);
            set({ boards: response.data, isLoading: false });
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    createBoard: async (workspaceId: string, name: string, description?: string) => {
        set({ isLoading: true });
        try {
            const response = await api.post(`/workspaces/${workspaceId}/boards`, {
                name,
                description,
            });
            const newBoard = response.data;
            set((state) => ({
                boards: [...state.boards, newBoard],
                isLoading: false,
            }));
            return newBoard;
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    fetchBoardDetails: async (boardId: string) => {
        set({ isLoading: true });
        try {
            const response = await api.get(`/workspaces/any/boards/${boardId}`);
            set({ currentBoard: response.data, isLoading: false });
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    createTask: async (boardId: string, columnId: string, title: string, description?: string, priority?: string) => {
        try {
            const response = await api.post(`/boards/${boardId}/tasks`, {
                columnId,
                title,
                description,
                priority: priority || 'medium',
            });

            // Update current board with new task
            const { currentBoard } = get();
            if (currentBoard) {
                const updatedColumns = currentBoard.columns.map((col: Column) => {
                    if (col.id === columnId) {
                        return {
                            ...col,
                            tasks: [...col.tasks, response.data],
                        };
                    }
                    return col;
                });
                set({ currentBoard: { ...currentBoard, columns: updatedColumns } });
            }
        } catch (error) {
            throw error;
        }
    },

    // Optimistic update - instant UI change
    updateTaskOptimistic: (taskId: string, updates: any) => {
        const { currentBoard } = get();
        if (!currentBoard) return;

        const updatedColumns = currentBoard.columns.map((col: Column) => ({
            ...col,
            tasks: col.tasks.map((task: Task) =>
                task.id === taskId ? { ...task, ...updates } : task
            ),
        }));

        set({ currentBoard: { ...currentBoard, columns: updatedColumns } });
    },

    updateTask: async (taskId: string, updates: any) => {
        try {
            await api.patch(`/boards/any/tasks/${taskId}`, updates);
        } catch (error) {
            // Revert on error
            const { fetchBoardDetails, currentBoard } = get();
            if (currentBoard) {
                await fetchBoardDetails(currentBoard.id);
            }
            throw error;
        }
    },

    deleteTask: async (taskId: string) => {
        try {
            await api.delete(`/boards/any/tasks/${taskId}`);

            // Remove task from current board
            const { currentBoard } = get();
            if (currentBoard) {
                const updatedColumns = currentBoard.columns.map((col: Column) => ({
                    ...col,
                    tasks: col.tasks.filter((task: Task) => task.id !== taskId),
                }));
                set({ currentBoard: { ...currentBoard, columns: updatedColumns } });
            }
        } catch (error) {
            throw error;
        }
    },

    // Move task between columns with optimistic update
    moveTask: (taskId: string, sourceColumnId: string, destColumnId: string, newPosition: number) => {
        const { currentBoard, updateTask } = get();
        if (!currentBoard) return;

        // Find the task
        let taskToMove: Task | null = null;
        const updatedColumns = currentBoard.columns.map((col: Column) => {
            if (col.id === sourceColumnId) {
                taskToMove = col.tasks.find((t: Task) => t.id === taskId) || null;
                return {
                    ...col,
                    tasks: col.tasks.filter((t: Task) => t.id !== taskId),
                };
            }
            return col;
        });

        if (!taskToMove) return;

        // Add to destination column
        const finalColumns = updatedColumns.map((col: Column) => {
            if (col.id === destColumnId) {
                const newTasks = [...col.tasks];
                newTasks.splice(newPosition, 0, { ...taskToMove!, columnId: destColumnId });
                return { ...col, tasks: newTasks };
            }
            return col;
        });

        // Update UI immediately
        set({ currentBoard: { ...currentBoard, columns: finalColumns } });

        // Update backend in background
        updateTask(taskId, { columnId: destColumnId, position: newPosition }).catch(() => {
            // Silently fail - user already sees the change
        });
    },

    // Reorder within same column
    reorderTasksInColumn: (columnId: string, taskId: string, newPosition: number) => {
        const { currentBoard } = get();
        if (!currentBoard) return;

        const updatedColumns = currentBoard.columns.map((col: Column) => {
            if (col.id === columnId) {
                const tasks = [...col.tasks];
                const oldIndex = tasks.findIndex((t: Task) => t.id === taskId);
                if (oldIndex === -1) return col;

                const [movedTask] = tasks.splice(oldIndex, 1);
                tasks.splice(newPosition, 0, movedTask);

                return { ...col, tasks };
            }
            return col;
        });

        set({ currentBoard: { ...currentBoard, columns: updatedColumns } });
    },
}));
