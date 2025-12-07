'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { useBoardStore } from '@/store/board-store';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const taskSchema = z.object({
    title: z.string().min(2).max(200),
    description: z.string().max(2000).optional(),
    priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface CreateTaskModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    boardId: string;
    columnId: string;
    columnName: string;
    onSuccess?: () => void;
}

export function CreateTaskModal({
    open,
    onOpenChange,
    boardId,
    columnId,
    columnName,
    onSuccess,
}: CreateTaskModalProps) {
    const { createTask } = useBoardStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [priority, setPriority] = useState<string>('medium');

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<TaskFormData>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            priority: 'medium',
        },
    });

    const onSubmit = async (data: TaskFormData) => {
        setIsSubmitting(true);
        try {
            await createTask(boardId, columnId, data.title, data.description, priority);
            toast.success('Task created successfully!');
            reset();
            onOpenChange(false);
            onSuccess?.();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create task');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create Task</DialogTitle>
                    <DialogDescription>
                        Add a new task to {columnName}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Task Title *</Label>
                            <Input
                                id="title"
                                placeholder="What needs to be done?"
                                {...register('title')}
                                disabled={isSubmitting}
                            />
                            {errors.title && (
                                <p className="text-sm text-red-500">{errors.title.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description (Optional)</Label>
                            <Textarea
                                id="description"
                                placeholder="Add more details..."
                                rows={4}
                                {...register('description')}
                                disabled={isSubmitting}
                            />
                            {errors.description && (
                                <p className="text-sm text-red-500">{errors.description.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="priority">Priority</Label>
                            <Select value={priority} onValueChange={setPriority} disabled={isSubmitting}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="critical">Critical</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Creating...' : 'Create Task'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
