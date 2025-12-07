'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar-custom';
import { CustomDropdownMenu } from '@/components/ui/dropdown-menu-custom';
import { LogOut, User, Settings, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

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

    const userMenuItems = [
        {
            label: 'Profile & Settings',
            icon: <Settings className="w-4 h-4" />,
            onClick: () => router.push('/settings'),
        },
        {
            label: 'Logout',
            icon: <LogOut className="w-4 h-4" />,
            variant: 'danger' as const,
            onClick: handleLogout,
        },
    ];

    return (
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-4">
                        {showBack && (
                            <Button variant="ghost" size="sm" onClick={() => router.push(backUrl)} className="-ml-3 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                                ← Back
                            </Button>
                        )}
                        <Link href="/dashboard" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hover:opacity-90 transition-opacity">
                            SprintFlow
                        </Link>
                    </div>

                    {/* Navigation Links (Desktop) */}
                    <nav className="hidden md:flex items-center gap-1">
                        <Link href="/dashboard">
                            <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-300">
                                <LayoutDashboard className="w-4 h-4 mr-2" />
                                Dashboard
                            </Button>
                        </Link>
                        <Link href="/settings">
                            <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-300">
                                <Settings className="w-4 h-4 mr-2" />
                                Settings
                            </Button>
                        </Link>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-3">
                            <div className="hidden sm:block text-right">
                                <p className="text-sm font-medium text-gray-900 dark:text-white leading-none">{user.fullName}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{user.email}</p>
                            </div>

                            <CustomDropdownMenu
                                trigger={
                                    <div className="ring-2 ring-transparent hover:ring-blue-500 rounded-full transition-all cursor-pointer">
                                        <Avatar
                                            src={user.avatarUrl}
                                            fallback={user.fullName || 'User'}
                                            size="md"
                                        />
                                    </div>
                                }
                                items={userMenuItems}
                            />
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <Button variant="ghost" onClick={() => router.push('/login')}>Login</Button>
                            <Button onClick={() => router.push('/register')}>Sign Up</Button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
