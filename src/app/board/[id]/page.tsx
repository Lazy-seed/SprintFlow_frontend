'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { useBoardStore } from '@/store/board-store';
import { Navbar } from '@/components/layout/navbar';
import { LoadingSpinner } from '@/components/loading';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TaskCard } from '@/components/board/task-card';
import { CreateTaskModal } from '@/components/board/create-task-modal';
import { TaskDetailPanel } from '@/components/board/task-detail-panel';
import { AddColumnButton } from '@/components/board/add-column-button';
import { CreateColumnModal } from '@/components/board/create-column-modal';
import { EditColumnModal } from '@/components/board/edit-column-modal';
import { toast } from 'sonner';
import api from '@/lib/api';
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    closestCorners,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverEvent,
} from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MoreVertical, Edit } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Column {
    id: string;
    name: string;
    color: string;
    tasks: any[];
}

function SortableTask({ task, isOverlay = false, onClick }: { task: any; isOverlay?: boolean; onClick?: () => void }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
        data: {
            type: 'Task',
            task,
        },
        disabled: isOverlay
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
        cursor: 'grab',
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <TaskCard task={task} onClick={onClick} />
        </div>
    );
}

function SortableColumn({
    column,
    onAddTask,
    onTaskClick,
    isOver,
    activeTaskId,
    onEditColumn,
}: {
    column: any;
    onAddTask: () => void;
    onTaskClick: (taskId: string) => void;
    isOver: boolean;
    activeTaskId: string | null;
    onEditColumn: () => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: column.id,
        data: {
            type: 'Column',
            column,
        },
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const taskIds = column.tasks?.map((t: any) => t.id) || [];

    return (
        <div ref={setNodeRef} style={style} className="flex-shrink-0 w-80 h-full">
            <Card
                className={`p-4 transition-all h-full max-h-[calc(100vh-12rem)] flex flex-col ${isOver
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-400 dark:border-blue-500'
                    : 'bg-gray-100 dark:bg-gray-800 border-2 border-transparent'
                    }`}
            >
                {/* Column Header - Drag Handle Area */}
                <div
                    className="flex items-center justify-between mb-4 cursor-grab active:cursor-grabbing"
                    {...attributes}
                    {...listeners}
                >
                    <div className="flex items-center gap-2">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: column.color }}
                        />
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                            {column.name}
                        </h3>
                        <span className="text-sm text-gray-500">
                            ({column.tasks?.length || 0})
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={(e) => {
                            e.stopPropagation(); // Prevent drag start when clicking add
                            onAddTask();
                        }}>
                            <span className="text-lg">+</span>
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={onEditColumn}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Column
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
                    <div className="flex-1 overflow-y-auto space-y-2 min-h-[100px] scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
                        {column.tasks?.map((task: any) => (
                            <SortableTask key={task.id} task={task} onClick={() => onTaskClick(task.id)} />
                        ))}

                        {column.tasks?.length === 0 && (
                            <div
                                className={`text-center py-8 text-sm border-2 border-dashed rounded-lg transition-all ${isOver
                                    ? 'border-blue-400 dark:border-blue-500 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                    : 'border-gray-300 dark:border-gray-600 text-gray-400'
                                    }`}
                            >
                                {isOver ? '📍 Drop here' : 'Drop tasks here'}
                            </div>
                        )}

                        {/* Drop zone expansion when dragging over */}
                        {isOver && column.tasks?.length > 0 && (
                            <div className="h-12 border-2 border-dashed border-blue-400 dark:border-blue-500 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-sm text-blue-600 dark:text-blue-400">
                                📍 Drop here
                            </div>
                        )}
                    </div>
                </SortableContext>
            </Card>
        </div>
    );
}

export default function BoardPage() {
    const router = useRouter();
    const params = useParams();
    const boardId = params.id as string;

    const { isAuthenticated, isInitialized, initialize } = useAuthStore();
    const {
        currentBoard,
        fetchBoardDetails,
        moveTask,
        reorderTasksInColumn,
        isLoading,
        addColumn,
        updateColumn,
        deleteColumn,
        reorderColumns
    } = useBoardStore();

    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [selectedColumn, setSelectedColumn] = useState<{ id: string; name: string } | null>(null);
    const [activeTask, setActiveTask] = useState<any>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [overColumnId, setOverColumnId] = useState<string | null>(null);
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);

    // Column Management State
    const [isCreateColumnOpen, setIsCreateColumnOpen] = useState(false);
    const [editingColumn, setEditingColumn] = useState<Column | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    useEffect(() => {
        initialize();
    }, []);

    useEffect(() => {
        if (isInitialized && !isAuthenticated && !isDragging) {
            router.push('/login');
            return;
        }

        if (isInitialized && isAuthenticated && !currentBoard) {
            loadBoard();
        }
    }, [isAuthenticated, isInitialized, boardId, isDragging]);

    const loadBoard = async () => {
        try {
            await fetchBoardDetails(boardId);
        } catch (error: any) {
            if (!isDragging) {
                toast.error('Failed to load board');
                router.push('/dashboard');
            }
        }
    };

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const activeType = active.data.current?.type;

        setIsDragging(true);

        if (activeType === 'Column') {
            setActiveTask(null);
            return;
        }

        if (activeType === 'Task') {
            const task = active.data.current?.task;
            setActiveTask(task);
        }
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveTask = active.data.current?.type === 'Task';
        const isOverTask = over.data.current?.type === 'Task';
        const isOverColumn = over.data.current?.type === 'Column';

        if (!isActiveTask) return;

        let columnId = null;
        if (isOverColumn) {
            columnId = overId;
        } else if (isOverTask) {
            for (const col of currentBoard?.columns || []) {
                if (col.tasks.some((t: any) => t.id === overId)) {
                    columnId = col.id;
                    break;
                }
            }
        }

        setOverColumnId(columnId as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        setIsDragging(false);
        setOverColumnId(null);
        setActiveTask(null);

        const { active, over } = event;
        if (!over || !currentBoard) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        if (activeId === overId) return;

        const isActiveColumn = active.data.current?.type === 'Column';

        // --- COLUMN REORDERING ---
        if (isActiveColumn) {
            const oldIndex = currentBoard.columns.findIndex((col: any) => col.id === activeId);
            const newIndex = currentBoard.columns.findIndex((col: any) => col.id === overId);

            if (oldIndex !== newIndex) {
                const newColumns = [...currentBoard.columns];
                const [movedColumn] = newColumns.splice(oldIndex, 1);
                newColumns.splice(newIndex, 0, movedColumn);

                const newColumnIds = newColumns.map(c => c.id);
                // Optimistic update
                reorderColumns(boardId, newColumnIds);

                // API call
                api.patch(`/workspaces/any/boards/${boardId}/columns/reorder`, { columnIds: newColumnIds })
                    .catch(() => {
                        toast.error('Failed to save column order');
                        loadBoard(); // Revert
                    });
            }
            return;
        }

        // --- TASK REORDERING ---
        let sourceColumn = null;
        for (const col of currentBoard.columns) {
            const task = col.tasks.find((t: any) => t.id === activeId);
            if (task) { sourceColumn = col; break; }
        }

        let destColumn = null;
        for (const col of currentBoard.columns) {
            if (col.tasks.some((t: any) => t.id === overId)) {
                destColumn = col; break;
            }
        }
        if (!destColumn) {
            destColumn = currentBoard.columns.find((c: any) => c.id === overId);
        }

        if (!sourceColumn || !destColumn) return;

        if (sourceColumn.id === destColumn.id) {
            const oldIndex = sourceColumn.tasks.findIndex((t: any) => t.id === activeId);
            const newIndex = over.data.current?.type === 'Task'
                ? sourceColumn.tasks.findIndex((t: any) => t.id === overId)
                : sourceColumn.tasks.length;

            if (oldIndex !== newIndex) {
                reorderTasksInColumn(sourceColumn.id, activeId, newIndex);
            }
        } else {
            const newIndex = over.data.current?.type === 'Task'
                ? destColumn.tasks.findIndex((t: any) => t.id === overId)
                : destColumn.tasks.length;
            moveTask(activeId, sourceColumn.id, destColumn.id, newIndex);
        }
    };

    // COLUMN MANAGEMENT HANDLERS
    const handleCreateColumn = async (data: { name: string; color: string }) => {
        try {
            // Updated URL to match backend controller: /workspaces/:workspaceId/boards/:boardId/columns
            const response = await api.post(`/workspaces/any/boards/${boardId}/columns`, data);
            addColumn(boardId, response.data);
            toast.success('Column created successfully');
        } catch (error) {
            toast.error('Failed to create column');
            console.error(error);
        }
    };

    const handleUpdateColumn = async (columnId: string, data: { name: string; color: string }) => {
        try {
            const response = await api.patch(`/workspaces/any/boards/${boardId}/columns/${columnId}`, data);
            updateColumn(columnId, response.data);
            toast.success('Column updated successfully');
        } catch (error) {
            toast.error('Failed to update column');
            console.error(error);
        }
    };

    const handleDeleteColumn = async (columnId: string) => {
        try {
            await api.delete(`/workspaces/any/boards/${boardId}/columns/${columnId}`);
            deleteColumn(columnId);
            toast.success('Column deleted successfully');
        } catch (error: any) {
            // Check if error message is about last column
            const message = error.response?.data?.message || 'Failed to delete column';
            toast.error(message);
        }
    };

    const handleCreateTask = (columnId: string, columnName: string) => {
        setSelectedColumn({ id: columnId, name: columnName });
        setIsTaskModalOpen(true);
    };

    const handleTaskCreated = () => {
        loadBoard();
    };

    const handleTaskClick = (taskId: string) => {
        setSelectedTaskId(taskId);
        setIsTaskDetailOpen(true);
    };

    const handleTaskDetailClose = () => {
        setIsTaskDetailOpen(false);
        setSelectedTaskId(null);
    };

    const handleTaskUpdate = () => {
        loadBoard();
    };

    if (!isInitialized) return <LoadingSpinner />;
    if (!isAuthenticated && !isDragging) return <LoadingSpinner />;
    if (isLoading || !currentBoard) return <LoadingSpinner />;

    const columnIds = currentBoard?.columns?.map((c: any) => c.id) || [];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden flex flex-col">
            <Navbar
                title={currentBoard.name}
                showBack
                backUrl={`/workspace/${currentBoard.workspace.id}`}
            />

            <main className="flex-1 overflow-x-auto overflow-y-hidden p-6">
                <div className="mb-4">
                    <p className="text-gray-600 dark:text-gray-400">
                        {currentBoard.description || 'No description'}
                    </p>
                </div>

                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                >
                    <div className="flex gap-4 items-start h-full">
                        <SortableContext items={columnIds} strategy={horizontalListSortingStrategy}>
                            {currentBoard.columns?.map((column: any) => (
                                <SortableColumn
                                    key={column.id}
                                    column={column}
                                    onAddTask={() => handleCreateTask(column.id, column.name)}
                                    onTaskClick={handleTaskClick}
                                    isOver={overColumnId === column.id}
                                    activeTaskId={activeTask?.id || null}
                                    onEditColumn={() => setEditingColumn(column)}
                                />
                            ))}
                        </SortableContext>

                        <AddColumnButton onClick={() => setIsCreateColumnOpen(true)} />
                    </div>

                    <DragOverlay>
                        {activeTask ? (
                            <div className="rotate-2 scale-105 shadow-2xl opacity-90">
                                <TaskCard task={activeTask} />
                            </div>
                        ) : null}
                    </DragOverlay>
                </DndContext>
            </main>

            <CreateColumnModal
                isOpen={isCreateColumnOpen}
                onClose={() => setIsCreateColumnOpen(false)}
                onSubmit={handleCreateColumn}
            />

            <EditColumnModal
                column={editingColumn}
                isOpen={!!editingColumn}
                onClose={() => setEditingColumn(null)}
                onUpdate={handleUpdateColumn}
                onDelete={handleDeleteColumn}
            />

            {selectedColumn && (
                <CreateTaskModal
                    open={isTaskModalOpen}
                    onOpenChange={setIsTaskModalOpen}
                    boardId={boardId}
                    columnId={selectedColumn.id}
                    columnName={selectedColumn.name}
                    onSuccess={handleTaskCreated}
                />
            )}

            {selectedTaskId && (
                <TaskDetailPanel
                    taskId={selectedTaskId}
                    isOpen={isTaskDetailOpen}
                    onClose={handleTaskDetailClose}
                    onUpdate={handleTaskUpdate}
                />
            )}
        </div>
    );
}
