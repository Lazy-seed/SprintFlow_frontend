'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { useWorkspaceStore } from '@/store/workspace-store';
import { Navbar } from '@/components/layout/navbar';
import { LoadingSpinner } from '@/components/loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateWorkspaceModal } from '@/components/create-workspace-modal';
import { toast } from 'sonner';

export default function DashboardPage() {
    const router = useRouter();
    const { user, isAuthenticated, isInitialized, initialize } = useAuthStore();
    const { workspaces, fetchWorkspaces, isLoading } = useWorkspaceStore();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        // Initialize auth store on mount
        initialize();
    }, []);

    useEffect(() => {
        // Only redirect after store is initialized
        if (isInitialized && !isAuthenticated) {
            router.push('/login');
        } else if (isInitialized && isAuthenticated) {
            loadWorkspaces();
        }
    }, [isAuthenticated, isInitialized, router]);

    const loadWorkspaces = async () => {
        try {
            await fetchWorkspaces();
        } catch (error: any) {
            toast.error('Failed to load workspaces');
        }
    };

    const handleWorkspaceCreated = () => {
        loadWorkspaces();
    };

    // Show loading spinner while initializing
    if (!isInitialized) {
        return <LoadingSpinner />;
    }

    if (!isAuthenticated || !user) {
        return null;
    }

    const totalBoards = workspaces.reduce((sum, ws) => sum + (ws._count?.boards || 0), 0);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar title="SprintFlow" />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Welcome back, {user.fullName}! 👋
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Here's what's happening with your projects today.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Total Workspaces</CardTitle>
                            <CardDescription>Your active workspaces</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{workspaces.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Total Boards</CardTitle>
                            <CardDescription>Across all workspaces</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{totalBoards}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Total Tasks</CardTitle>
                            <CardDescription>Active tasks</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">0</div>
                        </CardContent>
                    </Card>
                </div>

                {workspaces.length === 0 ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>Getting Started</CardTitle>
                            <CardDescription>
                                Follow these steps to set up your first project
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 font-semibold">
                                    1
                                </div>
                                <div>
                                    <h4 className="font-semibold">Create a Workspace</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Organize your projects by creating a workspace
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 font-semibold">
                                    2
                                </div>
                                <div>
                                    <h4 className="font-semibold">Create a Board</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Set up your first Kanban board with custom columns
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 font-semibold">
                                    3
                                </div>
                                <div>
                                    <h4 className="font-semibold">Add Tasks</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Start adding tasks and managing your workflow
                                    </p>
                                </div>
                            </div>
                            <div className="pt-4">
                                <Button className="w-full md:w-auto" onClick={() => setIsModalOpen(true)}>
                                    Create Your First Workspace
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Your Workspaces
                            </h3>
                            <Button onClick={() => setIsModalOpen(true)}>
                                + New Workspace
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {workspaces.map((workspace) => (
                                <Card
                                    key={workspace.id}
                                    className="hover:shadow-lg transition-shadow cursor-pointer"
                                    onClick={() => router.push(`/workspace/${workspace.id}`)}
                                >
                                    <CardHeader>
                                        <CardTitle>{workspace.name}</CardTitle>
                                        <CardDescription>
                                            {workspace.description || 'No description'}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                            <span>{workspace._count?.boards || 0} boards</span>
                                            <span>{workspace._count?.members || 0} members</span>
                                        </div>
                                        <div className="mt-4">
                                            <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                {workspace.planTier}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            <CreateWorkspaceModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                onSuccess={handleWorkspaceCreated}
            />
        </div>
    );
}
