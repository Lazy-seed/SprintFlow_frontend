'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function LandingPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Static Background - No animations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
                <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
            </div>

            {/* Navbar */}
            <nav className="relative z-10 bg-white/10 backdrop-blur-md border-b border-white/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">S</span>
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            SprintFlow
                        </span>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="ghost" className="text-white hover:bg-white/10" onClick={() => router.push('/login')}>
                            Login
                        </Button>
                        <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white" onClick={() => router.push('/register')}>
                            Get Started Free
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative z-10 pt-20 pb-32 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <Badge className="mb-6 bg-purple-500/20 text-purple-300 border-purple-500/50 px-4 py-1 text-sm">
                        ✨ The Future of Project Management
                    </Badge>

                    <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                        Manage Projects at
                        <br />
                        <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                            Lightning Speed ⚡
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
                        The most beautiful and powerful Kanban board. Drag, drop, and ship faster than ever before.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                        <Button
                            size="lg"
                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-lg px-8 py-6 rounded-xl shadow-xl transition-all"
                            onClick={() => router.push('/register')}
                        >
                            🚀 Start Free Trial
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-2 border-purple-400 text-purple-300 hover:bg-purple-500/20 text-lg px-8 py-6 rounded-xl transition-all"
                            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            See Features →
                        </Button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-16">
                        <div className="text-center">
                            <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">10x</div>
                            <div className="text-gray-400 mt-2">Faster</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">100%</div>
                            <div className="text-gray-400 mt-2">Free</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">∞</div>
                            <div className="text-gray-400 mt-2">Boards</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="relative z-10 py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                            Powerful Features
                        </h2>
                        <p className="text-xl text-gray-400">Everything you need to manage projects like a pro</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20 backdrop-blur-sm hover:border-purple-500/40 transition-colors">
                            <CardContent className="p-8">
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
                                    <span className="text-3xl">🎯</span>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">Drag & Drop Magic</h3>
                                <p className="text-gray-400">
                                    Intuitive drag-and-drop interface with instant updates. Move tasks between columns effortlessly.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Feature 2 */}
                        <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20 backdrop-blur-sm hover:border-blue-500/40 transition-colors">
                            <CardContent className="p-8">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6">
                                    <span className="text-3xl">⚡</span>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">Lightning Fast</h3>
                                <p className="text-gray-400">
                                    Optimistic updates mean instant feedback. No waiting, no lag, just pure speed.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Feature 3 */}
                        <Card className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 border-pink-500/20 backdrop-blur-sm hover:border-pink-500/40 transition-colors">
                            <CardContent className="p-8">
                                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6">
                                    <span className="text-3xl">🎨</span>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">Beautiful Design</h3>
                                <p className="text-gray-400">
                                    Stunning UI that makes work feel like play. Dark mode, animations, and more.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Feature 4 */}
                        <Card className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border-green-500/20 backdrop-blur-sm hover:border-green-500/40 transition-colors">
                            <CardContent className="p-8">
                                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6">
                                    <span className="text-3xl">🏢</span>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">Unlimited Workspaces</h3>
                                <p className="text-gray-400">
                                    Create unlimited workspaces and boards. Organize projects your way.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Feature 5 */}
                        <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20 backdrop-blur-sm hover:border-yellow-500/40 transition-colors">
                            <CardContent className="p-8">
                                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6">
                                    <span className="text-3xl">🔒</span>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">Secure & Private</h3>
                                <p className="text-gray-400">
                                    Bank-level security with JWT authentication. Your data is always safe.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Feature 6 */}
                        <Card className="bg-gradient-to-br from-red-500/10 to-pink-500/10 border-red-500/20 backdrop-blur-sm hover:border-red-500/40 transition-colors">
                            <CardContent className="p-8">
                                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
                                    <span className="text-3xl">📱</span>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">Fully Responsive</h3>
                                <p className="text-gray-400">
                                    Works perfectly on desktop, tablet, and mobile. Manage tasks anywhere.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative z-10 py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/30 rounded-3xl p-12">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                            Ready to Transform Your Workflow?
                        </h2>
                        <p className="text-xl text-gray-300 mb-8">
                            Join thousands of teams already using SprintFlow to ship faster.
                        </p>
                        <Button
                            size="lg"
                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-xl px-12 py-7 rounded-xl shadow-xl transition-all"
                            onClick={() => router.push('/register')}
                        >
                            🚀 Get Started - It's Free!
                        </Button>
                        <p className="text-sm text-gray-400 mt-4">No credit card required • Free forever</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-sm py-8">
                <div className="max-w-7xl mx-auto px-4 text-center text-gray-400">
                    <p>© 2025 SprintFlow. Built with ❤️ for productive teams.</p>
                </div>
            </footer>
        </div>
    );
}
