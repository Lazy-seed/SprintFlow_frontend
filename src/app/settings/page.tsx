'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { Navbar } from '@/components/layout/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar-custom';
import { toast } from 'sonner';
import { User, Mail, Moon, Sun, Shield } from 'lucide-react';

export default function SettingsPage() {
    const { user } = useAuthStore();
    const [name, setName] = useState(user?.fullName || '');
    const [isLoading, setIsLoading] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false); // Placeholder for theme state

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            toast.success('Profile updated successfully');
        }, 1000);
    };

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle('dark');
        toast.info(`Theme switched to ${!isDarkMode ? 'Dark' : 'Light'} mode`);
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar title="Settings" showBack backUrl="/dashboard" />

            <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
                <div className="flex items-center gap-4 mb-8">
                    <Avatar src={user.avatarUrl} fallback={user.fullName} size="lg" className="h-24 w-24 text-2xl" />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.fullName}</h1>
                        <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
                        <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">Free Plan</p>
                    </div>
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                    {/* Profile Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="w-5 h-5" />
                                Profile Information
                            </CardTitle>
                            <CardDescription>
                                Update your account details and public profile.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleUpdateProfile} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="email"
                                            value={user.email}
                                            disabled
                                            className="pl-10 bg-gray-50 dark:bg-gray-800"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500">Email cannot be changed.</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="fullName">Full Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="fullName"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>

                                <Button type="submit" disabled={isLoading} className="w-full">
                                    {isLoading ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Appearance & Security */}
                    <div className="space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Moon className="w-5 h-5" />
                                    Appearance
                                </CardTitle>
                                <CardDescription>
                                    Customize how SprintFlow looks on your device.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                    <div className="space-y-1">
                                        <p className="font-medium">Dark Mode</p>
                                        <p className="text-sm text-gray-500">Enable dark theme for better night viewing.</p>
                                    </div>
                                    <Button variant="outline" size="icon" onClick={toggleTheme}>
                                        {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="w-5 h-5" />
                                    Security
                                </CardTitle>
                                <CardDescription>
                                    Manage your password and security preferences.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Button variant="outline" className="w-full justify-start">
                                    Change Password
                                </Button>
                                <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
                                    Delete Account
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
