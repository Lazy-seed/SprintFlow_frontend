/**
 * CreateColumnModal Component
 * 
 * PURPOSE:
 * Modal dialog for creating a new column on the board.
 * Contains a form with column name input and color picker.
 * 
 * REACT HOOKS USED:
 * - useState: Manages component state (form data)
 * - Form state includes: name and color
 * 
 * STATE MANAGEMENT:
 * - Local state for form inputs
 * - Parent component controls modal open/close
 * - On submit, calls parent's onSubmit function
 */

'use client';

import { useState } from 'react'; // Hook for managing state
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'; // Modal components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ColorPicker } from './color-picker';

/**
 * PROPS INTERFACE
 * 
 * isOpen: Boolean - whether modal is visible
 * onClose: Function - called when user wants to close modal
 * onSubmit: Function - called when user submits the form
 *   - Takes object with name and color
 *   - Returns Promise (async operation)
 */
interface CreateColumnModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { name: string; color: string }) => Promise<void>;
}

/**
 * COMPONENT
 * 
 * DESTRUCTURING PROPS:
 * - Extract isOpen, onClose, onSubmit from props object
 * - Makes code cleaner than writing props.isOpen everywhere
 */
export function CreateColumnModal({ isOpen, onClose, onSubmit }: CreateColumnModalProps) {
    /**
     * STATE HOOKS
     * 
     * USESTATE EXPLAINED:
     * - useState is a React Hook
     * - Returns array: [currentValue, functionToUpdateValue]
     * - We use array destructuring to name them
     * 
     * EXAMPLE:
     * const [name, setName] = useState('');
     * - name: current value (starts as empty string)
     * - setName: function to update name
     * - When you call setName('New Name'), React re-renders component
     */
    const [name, setName] = useState(''); // Column name
    const [color, setColor] = useState('#6b7280'); // Default gray
    const [isLoading, setIsLoading] = useState(false); // Loading state during submission

    /**
     * HANDLE SUBMIT
     * 
     * ASYNC/AWAIT:
     * - async: This function performs asynchronous operations
     * - await: Wait for promise to resolve before continuing
     * 
     * FLOW:
     * 1. Prevent default form submission (page reload)
     * 2. Validate name is not empty
     * 3. Set loading state to true (disables button, shows spinner)
     * 4. Call parent's onSubmit function with form data
     * 5. Wait for API call to complete
     * 6. Reset form and close modal
     * 7. If error occurs, catch it and show error
     * 8. Always set loading to false in finally block
     * 
     * TRY-CATCH-FINALLY:
     * - try: Code that might throw an error
     * - catch: Handle the error
     * - finally: Always runs, even if error occurred
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent page reload

        // Validation: Name must not be empty
        if (!name.trim()) {
            return; // Exit early if validation fails
        }

        setIsLoading(true); // Show loading state

        try {
            // Call parent's onSubmit function
            // await means "wait for this to finish"
            await onSubmit({ name: name.trim(), color });

            // If successful, reset form
            setName('');
            setColor('#6b7280');
            onClose(); // Close modal
        } catch (error) {
            // If error occurs, log it
            // In production, you'd show a toast notification
            console.error('Failed to create column:', error);
        } finally {
            // This runs whether success or error
            setIsLoading(false);
        }
    };

    /**
     * HANDLE CLOSE
     * 
     * When modal closes, reset form to default values
     * This ensures clean state when modal opens again
     */
    const handleClose = () => {
        setName('');
        setColor('#6b7280');
        onClose();
    };

    return (
        /**
         * DIALOG COMPONENT
         * 
         * PROPS:
         * - open: Controls visibility (from parent)
         * - onOpenChange: Called when user tries to close
         *   - Clicking backdrop, pressing ESC, etc.
         */
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                {/**
         * DIALOG HEADER
         * 
         * Contains the title of the modal
         */}
                <DialogHeader>
                    <DialogTitle>Create New Column</DialogTitle>
                </DialogHeader>

                {/**
         * FORM
         * 
         * onSubmit: Called when form is submitted
         * - User presses Enter in input
         * - User clicks Create button
         * 
         * space-y-4: Vertical spacing between form fields
         */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/**
           * NAME INPUT FIELD
           * 
           * CONTROLLED INPUT:
           * - value={name}: Input shows current state
           * - onChange: Updates state when user types
           * - This is called a "controlled component"
           * - React state is the "single source of truth"
           */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Column Name</Label>
                        <Input
                            id="name"
                            placeholder="e.g., In Review, Testing, Deployed"
                            value={name} // Controlled by React state
                            onChange={(e) => setName(e.target.value)} // Update state on change
                            disabled={isLoading} // Disable while submitting
                            autoFocus // Auto-focus when modal opens
                            required // HTML5 validation
                        />
                    </div>

                    {/**
           * COLOR PICKER
           * 
           * CONTROLLED COMPONENT:
           * - value: Current selected color
           * - onChange: Function to update color state
           * - ColorPicker is a "dumb" component
           * - It doesn't manage its own state
           */}
                    <ColorPicker value={color} onChange={setColor} />

                    {/**
           * DIALOG FOOTER
           * 
           * Contains action buttons (Cancel, Create)
           */}
                    <DialogFooter className="gap-2">
                        {/**
             * CANCEL BUTTON
             * 
             * type="button": Prevents form submission
             * variant="outline": Outline style
             * onClick: Close modal without submitting
             */}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>

                        {/**
             * CREATE BUTTON
             * 
             * type="submit": Triggers form submission
             * disabled: Disable if loading or name is empty
             * 
             * CONDITIONAL TEXT:
             * - {isLoading ? 'Creating...' : 'Create'}
             * - Ternary operator: condition ? ifTrue : ifFalse
             * - Shows different text based on loading state
             */}
                        <Button
                            type="submit"
                            disabled={isLoading || !name.trim()}
                        >
                            {isLoading ? 'Creating...' : 'Create'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
