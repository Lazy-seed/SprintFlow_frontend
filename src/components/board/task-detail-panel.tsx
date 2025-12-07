'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import api from '@/lib/api';

interface TaskDetailPanelProps {
    taskId: string;
    isOpen: boolean;
    onClose: () => void;
    onUpdate?: () => void;
}

interface Subtask {
    id: string;
    title: string;
    isCompleted: boolean;
    position: number;
}

interface Comment {
    id: string;
    content: string;
    createdAt: string;
    user: {
        id: string;
        fullName: string;
        email: string;
        avatarUrl?: string;
    };
}

interface TaskDetail {
    id: string;
    title: string;
    description?: string;
    taskNumber: string;
    priority: string;
    columnId: string;
    subtasks: Subtask[];
    comments: Comment[];
    _count: {
        subtasks: number;
        comments: number;
    };
}

export function TaskDetailPanel({ taskId, isOpen, onClose, onUpdate }: TaskDetailPanelProps) {
    const [task, setTask] = useState<TaskDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState('');
    const [editedDescription, setEditedDescription] = useState('');
    const [newSubtask, setNewSubtask] = useState('');
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        if (isOpen && taskId) {
            loadTask();
        }
    }, [isOpen, taskId]);

    const loadTask = async () => {
        setIsLoading(true);
        try {
            const response = await api.get(`/boards/any/tasks/${taskId}`);
            setTask(response.data);
            setEditedTitle(response.data.title);
            setEditedDescription(response.data.description || '');
        } catch (error: any) {
            toast.error('Failed to load task details');
        } finally {
            setIsLoading(false);
        }
    };

    const updateTask = async (updates: Partial<TaskDetail>) => {
        try {
            await api.patch(`/boards/any/tasks/${taskId}`, updates);
            await loadTask();
            onUpdate?.();
            toast.success('Task updated!');
        } catch (error: any) {
            toast.error('Failed to update task');
        }
    };

    const handleSaveTitle = async () => {
        if (editedTitle.trim() && editedTitle !== task?.title) {
            await updateTask({ title: editedTitle });
        }
        setIsEditing(false);
    };

    const handleSaveDescription = async () => {
        if (editedDescription !== task?.description) {
            await updateTask({ description: editedDescription });
        }
    };

    const handlePriorityChange = async (priority: string) => {
        await updateTask({ priority });
    };

    const addSubtask = async () => {
        if (!newSubtask.trim()) return;

        try {
            await api.post(`/tasks/${taskId}/subtasks`, { title: newSubtask });
            setNewSubtask('');
            await loadTask();
            toast.success('Subtask added!');
        } catch (error: any) {
            toast.error('Failed to add subtask');
        }
    };

    const toggleSubtask = async (subtaskId: string, isCompleted: boolean) => {
        try {
            await api.patch(`/tasks/${taskId}/subtasks/${subtaskId}`, { isCompleted: !isCompleted });
            await loadTask();
        } catch (error: any) {
            toast.error('Failed to update subtask');
        }
    };

    const deleteSubtask = async (subtaskId: string) => {
        try {
            await api.delete(`/tasks/${taskId}/subtasks/${subtaskId}`);
            await loadTask();
            toast.success('Subtask deleted!');
        } catch (error: any) {
            toast.error('Failed to delete subtask');
        }
    };

    const addComment = async () => {
        if (!newComment.trim()) return;

        try {
            await api.post(`/tasks/${taskId}/comments`, { content: newComment });
            setNewComment('');
            await loadTask();
            toast.success('Comment added!');
        } catch (error: any) {
            toast.error('Failed to add comment');
        }
    };

    const deleteComment = async (commentId: string) => {
        try {
            await api.delete(`/tasks/${taskId}/comments/${commentId}`);
            await loadTask();
            toast.success('Comment deleted!');
        } catch (error: any) {
            toast.error('Failed to delete comment');
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'critical': return 'bg-red-500';
            case 'high': return 'bg-orange-500';
            case 'medium': return 'bg-yellow-500';
            case 'low': return 'bg-green-500';
            default: return 'bg-gray-500';
        }
    };

    const completedSubtasks = task?.subtasks.filter(s => s.isCompleted).length || 0;
    const totalSubtasks = task?.subtasks.length || 0;
    const progress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

    if (!task && !isLoading) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                {isLoading ? (
                    <div className="flex items-center justify-center p-8">
                        <p className="text-gray-500">Loading...</p>
                    </div>
                ) : task ? (
                    <div className="space-y-6">
                        {/* Header */}
                        <DialogHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge variant="outline" className="text-xs">
                                            {task.taskNumber}
                                        </Badge>
                                        <Badge className={getPriorityColor(task.priority)}>
                                            {task.priority}
                                        </Badge>
                                    </div>
                                    {isEditing ? (
                                        <Input
                                            value={editedTitle}
                                            onChange={(e) => setEditedTitle(e.target.value)}
                                            onBlur={handleSaveTitle}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
                                            className="text-2xl font-bold"
                                            autoFocus
                                        />
                                    ) : (
                                        <DialogTitle
                                            className="text-2xl cursor-pointer hover:text-gray-600"
                                            onClick={() => setIsEditing(true)}
                                        >
                                            {task.title}
                                        </DialogTitle>
                                    )}
                                </div>
                            </div>
                        </DialogHeader>

                        {/* Description */}
                        <div>
                            <h3 className="font-semibold mb-2">Description</h3>
                            <Textarea
                                value={editedDescription}
                                onChange={(e) => setEditedDescription(e.target.value)}
                                onBlur={handleSaveDescription}
                                placeholder="Add a description..."
                                className="min-h-[100px]"
                            />
                        </div>

                        {/* Priority */}
                        <div>
                            <h3 className="font-semibold mb-2">Priority</h3>
                            <Select value={task.priority} onValueChange={handlePriorityChange}>
                                <SelectTrigger className="w-40">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="critical">Critical</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Subtasks */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold">
                                    Subtasks ({completedSubtasks}/{totalSubtasks})
                                </h3>
                            </div>
                            {totalSubtasks > 0 && (
                                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                                    <div
                                        className="bg-blue-500 h-2 rounded-full transition-all"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            )}
                            <div className="space-y-2 mb-3">
                                {task.subtasks.map((subtask) => (
                                    <div key={subtask.id} className="flex items-center gap-2 group">
                                        <Checkbox
                                            checked={subtask.isCompleted}
                                            onCheckedChange={() => toggleSubtask(subtask.id, subtask.isCompleted)}
                                        />
                                        <span className={subtask.isCompleted ? 'line-through text-gray-500' : ''}>
                                            {subtask.title}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="ml-auto opacity-0 group-hover:opacity-100"
                                            onClick={() => deleteSubtask(subtask.id)}
                                        >
                                            ×
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    value={newSubtask}
                                    onChange={(e) => setNewSubtask(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addSubtask()}
                                    placeholder="Add a subtask..."
                                />
                                <Button onClick={addSubtask}>Add</Button>
                            </div>
                        </div>

                        {/* Comments */}
                        <div>
                            <h3 className="font-semibold mb-3">Comments ({task.comments.length})</h3>
                            <div className="space-y-3 mb-4">
                                {task.comments.map((comment) => (
                                    <div key={comment.id} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg group">
                                        <div className="flex items-start justify-between mb-1">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                                    {comment.user.fullName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-sm">{comment.user.fullName}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(comment.createdAt).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="opacity-0 group-hover:opacity-100"
                                                onClick={() => deleteComment(comment.id)}
                                            >
                                                ×
                                            </Button>
                                        </div>
                                        <p className="text-sm mt-2">{comment.content}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <Textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Add a comment..."
                                    className="min-h-[80px]"
                                />
                                <Button onClick={addComment}>Post</Button>
                            </div>
                        </div>
                    </div>
                ) : null}
            </DialogContent>
        </Dialog>
    );
}
