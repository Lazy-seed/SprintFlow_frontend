'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { useWorkspaceStore } from '@/store/workspace-store';
import { useBoardStore } from '@/store/board-store';
import { Navbar } from '@/components/layout/navbar';
import { LoadingSpinner } from '@/components/loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const boardSchema = z.object({
    name: z.string().min(2).max(100),
    description: z.string().max(500).optional(),
});

type BoardFormData = z.infer<typeof boardSchema>;

export default function WorkspacePage() {
    const router = useRouter();
    const params = useParams();
    const workspaceId = params.id as string;

    const { isAuthenticated, isInitialized, initialize } = useAuthStore();
    const { workspaces, fetchWorkspaces } = useWorkspaceStore();
    const { boards, fetchBoards, createBoard, isLoading } = useBoardStore();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const workspace = workspaces.find(w => w.id === workspaceId);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<BoardFormData>({
        resolver: zodResolver(boardSchema),
    });

    useEffect(() => {
        // Initialize auth store on mount
        initialize();
    }, []);

    useEffect(() => {
        // Only redirect after store is initialized
        if (isInitialized && !isAuthenticated) {
            router.push('/login');
            return;
        }

        if (isInitialized && !workspace) {
            fetchWorkspaces();
        }

        if (isInitialized) {
            loadBoards();
        }
    }, [isAuthenticated, isInitialized, workspaceId]);

    const loadBoards = async () => {
        try {
            await fetchBoards(workspaceId);
        } catch (error: any) {
            toast.error('Failed to load boards');
        }
    };

    const onSubmit = async (data: BoardFormData) => {
        setIsSubmitting(true);
        try {
            await createBoard(workspaceId, data.name, data.description);
            toast.success('Board created successfully!');
            reset();
            setIsModalOpen(false);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create board');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Show loading spinner while initializing
    if (!isInitialized || isLoading) return <LoadingSpinner />;

    if (!isAuthenticated) return null;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar
                title={workspace?.name || 'Workspace'}
                showBack
                backUrl="/dashboard"
            />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Boards</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            {workspace?.description || 'Manage your boards'}
                        </p>
                    </div>
                    <Button onClick={() => setIsModalOpen(true)}>
                        + New Board
                    </Button>
                </div>

                {boards.length === 0 ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>No boards yet</CardTitle>
                            <CardDescription>Create your first board to get started</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button onClick={() => setIsModalOpen(true)}>Create Board</Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {boards.map((board) => (
                            <Card
                                key={board.id}
                                className="hover:shadow-lg transition-shadow cursor-pointer"
                                onClick={() => router.push(`/board/${board.id}`)}
                            >
                                <CardHeader>
                                    <CardTitle>{board.name}</CardTitle>
                                    <CardDescription>
                                        {board.description || 'No description'}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                        <span>{board._count?.tasks || 0} tasks</span>
                                        <span>{board._count?.columns || 0} columns</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </main>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create Board</DialogTitle>
                        <DialogDescription>Create a new Kanban board for your workspace</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Board Name *</Label>
                                <Input
                                    id="name"
                                    placeholder="Sprint 1"
                                    {...register('name')}
                                    disabled={isSubmitting}
                                />
                                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description (Optional)</Label>
                                <Textarea
                                    id="description"
                                    placeholder="What's this board for?"
                                    {...register('description')}
                                    disabled={isSubmitting}
                                />
                                {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Creating...' : 'Create Board'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
