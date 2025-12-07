'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';

interface NavbarProps {
    title?: string;
    showBack?: boolean;
    backUrl?: string;
}

export function Navbar({ title = 'SprintFlow', showBack = false, backUrl = '/dashboard' }: NavbarProps) {
    const router = useRouter();
    const { user, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <header className="bg-white dark:bg-gray-800 shadow sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    {showBack && (
                        <Button variant="ghost" size="sm" onClick={() => router.push(backUrl)}>
                            ← Back
                        </Button>
                    )}
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white cursor-pointer" onClick={() => router.push('/dashboard')}>
                        {title}
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    {user && (
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                            {user.fullName}
                        </span>
                    )}
                    <Button variant="outline" size="sm" onClick={handleLogout}>
                        Logout
                    </Button>
                </div>
            </div>
        </header>
    );
}
