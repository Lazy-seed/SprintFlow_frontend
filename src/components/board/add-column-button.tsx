/**
 * AddColumnButton Component
 * 
 * PURPOSE:
 * This component renders a button that allows users to add new columns to their board.
 * It appears at the end of all existing columns.
 * 
 * REACT CONCEPTS USED:
 * - Functional Component - Modern React component using function syntax
 * - Props - Data passed from parent component
 * - Event Handlers - Functions that respond to user actions (onClick)
 * 
 * TYPESCRIPT CONCEPTS:
 * - Interface - Defines the shape of props this component expects
 * - Void - Function returns nothing
 */

'use client'; // This is a Next.js directive - means this component uses client-side features

import { Plus } from 'lucide-react'; // Icon library for the + icon
import { Button } from '@/components/ui/button'; // Reusable button component

/**
 * INTERFACE - Defines what props this component accepts
 * 
 * Think of an interface as a contract:
 * - Any component using AddColumnButton MUST provide an onClick function
 * - The onClick function takes no parameters and returns nothing (void)
 * - TypeScript will error if you forget to pass onClick or pass wrong type
 */
interface AddColumnButtonProps {
    onClick: () => void; // Function that gets called when button is clicked
}

/**
 * COMPONENT DEFINITION
 * 
 * DESTRUCTURING:
 * - { onClick }: AddColumnButtonProps means "extract onClick from props"
 * - Instead of writing props.onClick everywhere, we can just use onClick
 * 
 * RETURN:
 * - Components must return JSX (looks like HTML but is JavaScript)
 * - JSX gets compiled to React.createElement() calls
 */
export function AddColumnButton({ onClick }: AddColumnButtonProps) {
    return (
        /**
         * OUTER DIV - Container for the button
         * 
         * CLASSES EXPLAINED:
         * - flex-shrink-0: Don't shrink this element when space is tight
         * - w-80: Width of 320px (80 * 4px, Tailwind's spacing scale)
         * - p-4: Padding of 16px on all sides
         */
        <div className="flex-shrink-0 w-80 p-4">
            {/**
       * BUTTON COMPONENT
       * 
       * PROPS:
       * - variant="outline": Uses outline style (border, no fill)
       * - onClick={onClick}: When clicked, call the onClick function from props
       * - className: Additional CSS classes for styling
       * 
       * CLASSES:
       * - w-full: Width 100% of parent
       * - h-12: Height of 48px
       * - border-2: 2px border
       * - border-dashed: Dashed border style
       * - border-gray-300: Light gray color
       * - dark:border-gray-600: Darker gray in dark mode
       * - hover:border-gray-400: Slightly darker on hover
       * - hover:bg-gray-50: Light background on hover
       * - dark:hover:bg-gray-800: Dark background on hover in dark mode
       * - transition-colors: Smooth color transitions
       * - flex items-center justify-center: Center content
       * - gap-2: 8px gap between icon and text
       */}
            <Button
                variant="outline"
                onClick={onClick}
                className="w-full h-12 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
                {/**
         * ICON
         * 
         * - Plus: Icon component from lucide-react
         * - className="h-5 w-5": 20px x 20px size
         */}
                <Plus className="h-5 w-5" />

                {/**
         * TEXT
         * 
         * - font-medium: Medium font weight (500)
         */}
                <span className="font-medium">Add Column</span>
            </Button>
        </div>
    );
}
