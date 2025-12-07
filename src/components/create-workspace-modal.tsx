'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { useWorkspaceStore } from '@/store/workspace-store';
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

const workspaceSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    description: z.string().max(500).optional(),
});

type WorkspaceFormData = z.infer<typeof workspaceSchema>;

interface CreateWorkspaceModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export function CreateWorkspaceModal({
    open,
    onOpenChange,
    onSuccess,
}: CreateWorkspaceModalProps) {
    const { createWorkspace, isLoading } = useWorkspaceStore();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<WorkspaceFormData>({
        resolver: zodResolver(workspaceSchema),
    });

    const onSubmit = async (data: WorkspaceFormData) => {
        setIsSubmitting(true);
        try {
            await createWorkspace(data.name, data.description);
            toast.success('Workspace created successfully!');
            reset();
            onOpenChange(false);
            onSuccess?.();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create workspace');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Workspace</DialogTitle>
                    <DialogDescription>
                        Create a new workspace to organize your projects and teams.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Workspace Name *</Label>
                            <Input
                                id="name"
                                placeholder="My Awesome Workspace"
                                {...register('name')}
                                disabled={isSubmitting || isLoading}
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500">{errors.name.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description (Optional)</Label>
                            <Input
                                id="description"
                                placeholder="What's this workspace for?"
                                {...register('description')}
                                disabled={isSubmitting || isLoading}
                            />
                            {errors.description && (
                                <p className="text-sm text-red-500">{errors.description.message}</p>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting || isLoading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting || isLoading}>
                            {isSubmitting ? 'Creating...' : 'Create Workspace'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
