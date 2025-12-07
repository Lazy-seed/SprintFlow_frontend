/**
 * ColorPicker Component
 * 
 * PURPOSE:
 * Allows users to select a color for their column from predefined options.
 * Shows a grid of color circles that users can click to select.
 * 
 * REACT HOOKS USED:
 * - None in this simple component (it's a "controlled component")
 * 
 * CONTROLLED COMPONENT:
 * - Parent component controls the selected value
 * - This component just displays and reports changes
 * - Parent holds the state, this component is "dumb" (presentational only)
 */

'use client';

import { Check } from 'lucide-react'; // Checkmark icon for selected color

/**
 * PREDEFINED COLORS
 * 
 * CONST - Value that never changes
 * Array of objects, each with:
 * - name: Human-readable name
 * - value: Hex color code (used in CSS)
 * 
 * WHY PREDEFINED?
 * - Ensures consistent color palette across the app
 * - Prevents users from choosing unreadable colors
 * - Makes the UI look professional
 */
const COLORS = [
    { name: 'Gray', value: '#6b7280' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Yellow', value: '#eab308' },
    { name: 'Green', value: '#10b981' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Pink', value: '#ec4899' },
];

/**
 * PROPS INTERFACE
 * 
 * value: Currently selected color (hex code)
 * onChange: Function to call when user selects a new color
 *   - Takes one parameter: the new color value (string)
 *   - Returns nothing (void)
 */
interface ColorPickerProps {
    value: string;
    onChange: (color: string) => void;
}

/**
 * COLOR PICKER COMPONENT
 * 
 * FLOW:
 * 1. Parent passes current color and onChange function
 * 2. Component displays all colors
 * 3. User clicks a color
 * 4. onClick calls onChange with new color
 * 5. Parent updates its state
 * 6. Component re-renders with new selected color
 */
export function ColorPicker({ value, onChange }: ColorPickerProps) {
    return (
        <div className="space-y-2">
            {/**
       * LABEL
       * 
       * - text-sm: Small text (14px)
       * - font-medium: Medium weight
       * - text-gray-700: Dark gray text
       * - dark:text-gray-300: Light gray in dark mode
       */}
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Column Color
            </label>

            {/**
       * COLOR GRID
       * 
       * GRID LAYOUT:
       * - grid: Enable CSS Grid
       * - grid-cols-4: 4 columns
       * - gap-3: 12px gap between items
       * 
       * This creates a 4x2 grid of color circles
       */}
            <div className="grid grid-cols-4 gap-3">
                {/**
         * MAP OVER COLORS
         * 
         * ARRAY.MAP():
         * - Loops through COLORS array
         * - For each color, creates a button
         * - Returns array of JSX elements
         * 
         * KEY PROP:
         * - React needs unique key for each item in a list
         * - Helps React efficiently update the DOM
         * - Use color.value since it's unique
         */}
                {COLORS.map((color) => {
                    /**
                     * CHECK IF THIS COLOR IS SELECTED
                     * 
                     * COMPARISON:
                     * - value === color.value
                     * - If true, isSelected = true
                     * - Used to show checkmark and different styling
                     */
                    const isSelected = value === color.value;

                    return (
                        /**
                         * COLOR BUTTON
                         * 
                         * KEY ATTRIBUTES:
                         * - key: Unique identifier for React
                         * - onClick: Call onChange with this color's value
                         * - style: Inline styles (backgroundColor from color.value)
                         * - className: Conditional classes based on isSelected
                         * 
                         * CONDITIONAL CLASSES:
                         * - ring-2 ring-offset-2: Only if selected
                         * - Uses template literal with ternary operator
                         */
                        <button
                            key={color.value}
                            type="button" // Prevent form submission
                            onClick={() => onChange(color.value)} // Arrow function to pass color
                            style={{ backgroundColor: color.value }} // Inline style for color
                            className={`
                w-10 h-10 rounded-full
                flex items-center justify-center
                transition-all duration-200
                hover:scale-110
                ${isSelected ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-gray-500' : ''}
              `}
                            title={color.name} // Tooltip on hover
                        >
                            {/**
               * CHECKMARK ICON
               * 
               * CONDITIONAL RENDERING:
               * - {isSelected && <Check />}
               * - && is logical AND
               * - If isSelected is true, render <Check />
               * - If isSelected is false, render nothing
               * 
               * This is a common React pattern for conditional rendering
               */}
                            {isSelected && (
                                <Check className="h-5 w-5 text-white drop-shadow-lg" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
