/**
 * Avatar Component
 * 
 * Displays a user's image or fallback initials if no image is available.
 */

'use client';

interface AvatarProps {
    src?: string | null;
    alt?: string;
    fallback: string;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

export function Avatar({ src, alt, fallback, className = '', size = 'md' }: AvatarProps) {
    // Size classes
    const sizeClasses = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-20 h-20 text-xl',
    };

    const baseClasses = `rounded-full flex items-center justify-center overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 ${sizeClasses[size]} ${className}`;

    if (src) {
        return (
            <div className={baseClasses}>
                <img
                    src={src}
                    alt={alt || 'Avatar'}
                    className="w-full h-full object-cover"
                />
            </div>
        );
    }

    return (
        <div className={`${baseClasses} font-medium text-gray-600 dark:text-gray-300`}>
            {fallback.substring(0, 2).toUpperCase()}
        </div>
    );
}
