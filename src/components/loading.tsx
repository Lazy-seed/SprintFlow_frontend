export function LoadingSpinner() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <div className="text-center">
                {/* Animated Logo */}
                <div className="mb-8 flex justify-center">
                    <div className="relative">
                        <div className="w-20 h-20 bg-gray-900 dark:bg-white rounded-2xl flex items-center justify-center animate-pulse">
                            <span className="text-white dark:text-gray-900 font-bold text-4xl">S</span>
                        </div>
                        {/* Spinning Ring */}
                        <div className="absolute inset-0 border-4 border-gray-900 dark:border-white border-t-transparent rounded-2xl animate-spin"></div>
                    </div>
                </div>

                {/* Loading Text */}
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    SprintFlow
                </h2>
                <p className="text-gray-600 dark:text-gray-400 animate-pulse">Loading your workspace...</p>

                {/* Animated Dots */}
                <div className="flex justify-center gap-2 mt-6">
                    <div className="w-3 h-3 bg-gray-900 dark:bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-3 h-3 bg-gray-700 dark:bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-3 h-3 bg-gray-500 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
            </div>
        </div>
    );
}

export function LoadingPage() {
    return <LoadingSpinner />;
}
