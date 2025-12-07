'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { useBoardStore } from '@/store/board-store';
import { Navbar } from '@/components/layout/navbar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TaskCard } from '@/components/board/task-card';
import { CreateTaskModal } from '@/components/board/create-task-modal';
import { toast } from 'sonner';
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
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableTask({ task, isOverlay = false }: { task: any; isOverlay?: boolean }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id, disabled: isOverlay });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
        cursor: 'grab',
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <TaskCard task={task} />
        </div>
    );
}

function DroppableColumn({
    column,
    onAddTask,
    isOver,
    activeTaskId,
}: {
    column: any;
    onAddTask: () => void;
    isOver: boolean;
    activeTaskId: string | null;
}) {
    const taskIds = column.tasks?.map((t: any) => t.id) || [];

    return (
        <Card
            className={`p-4 transition-all ${isOver
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-400 dark:border-blue-500'
                    : 'bg-gray-100 dark:bg-gray-800 border-2 border-transparent'
                }`}
        >
            <div className="flex items-center justify-between mb-4">
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
                <Button size="sm" variant="ghost" onClick={onAddTask}>
                    +
                </Button>
            </div>

            <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
                <div className="min-h-[200px] space-y-2">
                    {column.tasks?.map((task: any, index: number) => (
                        <div key={task.id}>
                            <SortableTask task={task} />
                        </div>
                    ))}

                    {column.tasks?.length === 0 && (
                        <div
                            className={`text-center py-8 text-sm border-2 border-dashed rounded-lg transition-all ${isOver
                                    ? 'border-blue-400 dark:border-blue-500 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                    : 'border-gray-300 dark:border-gray-600 text-gray-400'
                                }`}
                        >
                            {isOver ? '📍 Drop here' : 'Drop tasks here or click + to add'}
                        </div>
                    )}

                    {/* Drop indicator at bottom when hovering over column with tasks */}
                    {isOver && column.tasks?.length > 0 && (
                        <div className="h-12 border-2 border-dashed border-blue-400 dark:border-blue-500 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-sm text-blue-600 dark:text-blue-400">
                            📍 Drop here
                        </div>
                    )}
                </div>
            </SortableContext>
        </Card>
    );
}

export default function BoardPage() {
    const router = useRouter();
    const params = useParams();
    const boardId = params.id as string;

    const { isAuthenticated } = useAuthStore();
    const { currentBoard, fetchBoardDetails, moveTask, reorderTasksInColumn, isLoading } = useBoardStore();

    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [selectedColumn, setSelectedColumn] = useState<{ id: string; name: string } | null>(null);
    const [activeTask, setActiveTask] = useState<any>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [overColumnId, setOverColumnId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    useEffect(() => {
        if (!isAuthenticated && !isDragging) {
            router.push('/login');
            return;
        }

        if (isAuthenticated && !currentBoard) {
            loadBoard();
        }
    }, [isAuthenticated, boardId, isDragging]);

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
        setIsDragging(true);
        const { active } = event;
        const task = currentBoard?.columns
            .flatMap((col: any) => col.tasks)
            .find((t: any) => t.id === active.id);
        setActiveTask(task);
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { over } = event;

        if (!over || !currentBoard) {
            setOverColumnId(null);
            return;
        }

        const overId = over.id as string;

        // Find which column we're over
        let columnId = null;

        // Check if over a task
        for (const col of currentBoard.columns) {
            if (col.tasks.some((t: any) => t.id === overId)) {
                columnId = col.id;
                break;
            }
        }

        // Check if over a column directly
        if (!columnId) {
            const column = currentBoard.columns.find((c: any) => c.id === overId);
            if (column) {
                columnId = column.id;
            }
        }

        setOverColumnId(columnId);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveTask(null);
        setIsDragging(false);
        setOverColumnId(null);

        if (!over || !currentBoard) return;

        const taskId = active.id as string;
        const overId = over.id as string;

        // Find source column
        let sourceColumn = null;
        let sourceTask = null;
        for (const col of currentBoard.columns) {
            const task = col.tasks.find((t: any) => t.id === taskId);
            if (task) {
                sourceColumn = col;
                sourceTask = task;
                break;
            }
        }

        if (!sourceColumn || !sourceTask) return;

        // Find destination column
        let destColumn = null;
        let overTask = null;

        // Check if dropped on a task
        for (const col of currentBoard.columns) {
            const task = col.tasks.find((t: any) => t.id === overId);
            if (task) {
                destColumn = col;
                overTask = task;
                break;
            }
        }

        // If not dropped on a task, check if dropped on column
        if (!destColumn) {
            destColumn = currentBoard.columns.find((c: any) => c.id === overId);
        }

        if (!destColumn) return;

        // Same column - reorder
        if (sourceColumn.id === destColumn.id) {
            const oldIndex = sourceColumn.tasks.findIndex((t: any) => t.id === taskId);
            const newIndex = overTask
                ? sourceColumn.tasks.findIndex((t: any) => t.id === overId)
                : sourceColumn.tasks.length;

            if (oldIndex !== newIndex) {
                reorderTasksInColumn(sourceColumn.id, taskId, newIndex);
                toast.success('Task reordered!');
            }
        } else {
            // Different column - move
            const newIndex = overTask
                ? destColumn.tasks.findIndex((t: any) => t.id === overId)
                : destColumn.tasks.length;

            moveTask(taskId, sourceColumn.id, destColumn.id, newIndex);
            toast.success(`Moved to ${destColumn.name}!`);
        }
    };

    const handleCreateTask = (columnId: string, columnName: string) => {
        setSelectedColumn({ id: columnId, name: columnName });
        setIsTaskModalOpen(true);
    };

    const handleTaskCreated = () => {
        loadBoard();
    };

    if (!isAuthenticated && !isDragging) {
        return null;
    }

    if (isLoading || !currentBoard) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Navbar title="Loading..." showBack backUrl="/dashboard" />
                <div className="flex items-center justify-center h-96">
                    <p className="text-gray-500">Loading board...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar
                title={currentBoard.name}
                showBack
                backUrl={`/workspace/${currentBoard.workspace.id}`}
            />

            <main className="p-6">
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
                    <div className="flex gap-4 overflow-x-auto pb-4">
                        {currentBoard.columns?.map((column: any) => (
                            <div key={column.id} className="flex-shrink-0 w-80">
                                <DroppableColumn
                                    column={column}
                                    onAddTask={() => handleCreateTask(column.id, column.name)}
                                    isOver={overColumnId === column.id}
                                    activeTaskId={activeTask?.id || null}
                                />
                            </div>
                        ))}
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
        </div>
    );
}
