/**
 * EditColumnModal Component
 * 
 * PURPOSE:
 * Modal for editing an existing column's name and color.
 * Also allows deleting the column with confirmation.
 * 
 * DIFFERENCES FROM CreateColumnModal:
 * - Pre-fills form with existing column data
 * - Has delete button
 * - Updates existing column instead of creating new one
 * 
 * USEEFFECT HOOK:
 * - Runs side effects when component mounts or dependencies change
 * - Used here to update form when column prop changes
 */

'use client';

import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ColorPicker } from './color-picker';
import { Trash2 } from 'lucide-react';

/**
 * COLUMN TYPE
 * 
 * Defines the shape of a column object
 * This matches what we get from the backend API
 */
interface Column {
    id: string;
    name: string;
    color: string;
}

/**
 * PROPS INTERFACE
 * 
 * column: The column being edited (or null if modal closed)
 * isOpen: Whether modal is visible
 * onClose: Close modal callback
 * onUpdate: Update column callback
 * onDelete: Delete column callback
 */
interface EditColumnModalProps {
    column: Column | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (id: string, data: { name: string; color: string }) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
}

export function EditColumnModal({
    column,
    isOpen,
    onClose,
    onUpdate,
    onDelete,
}: EditColumnModalProps) {
    // Form state
    const [name, setName] = useState('');
    const [color, setColor] = useState('#6b7280');
    const [isLoading, setIsLoading] = useState(false);

    // Delete confirmation dialog state
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    /**
     * USEEFFECT - Sync form with column prop
     * 
     * WHEN DOES THIS RUN?
     * - When component first mounts
     * - Whenever 'column' prop changes
     * 
     * WHY?
     * - When user clicks edit on a different column
     * - We need to update the form with that column's data
     * 
     * DEPENDENCIES ARRAY [column]:
     * - Effect only re-runs when column changes
     * - Without it, effect would run on every render (bad performance)
     */
    useEffect(() => {
        if (column) {
            setName(column.name);
            setColor(column.color);
        }
    }, [column]); // Dependency array - run when column changes

    /**
     * HANDLE UPDATE
     * 
     * Similar to CreateColumnModal but calls onUpdate instead of onSubmit
     */
    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!column || !name.trim()) {
            return;
        }

        setIsLoading(true);

        try {
            await onUpdate(column.id, { name: name.trim(), color });
            onClose();
        } catch (error) {
            console.error('Failed to update column:', error);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * HANDLE DELETE
     * 
     * TWO-STEP PROCESS:
     * 1. Show confirmation dialog
     * 2. If confirmed, actually delete
     * 
     * This prevents accidental deletions
     */
    const handleDeleteClick = () => {
        setShowDeleteDialog(true);
    };

    const handleDeleteConfirm = async () => {
        if (!column) return;

        setIsLoading(true);

        try {
            await onDelete(column.id);
            setShowDeleteDialog(false);
            onClose();
        } catch (error) {
            console.error('Failed to delete column:', error);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * EARLY RETURN
     * 
     * If no column is selected, don't render anything
     * This is a common pattern to avoid null errors
     */
    if (!column) {
        return null;
    }

    return (
        <>
            {/**
       * EDIT DIALOG
       */}
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Column</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Column Name</Label>
                            <Input
                                id="edit-name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={isLoading}
                                autoFocus
                                required
                            />
                        </div>

                        <ColorPicker value={color} onChange={setColor} />

                        <DialogFooter className="gap-2 sm:justify-between">
                            {/**
               * DELETE BUTTON (LEFT SIDE)
               * 
               * variant="destructive": Red color to indicate danger
               * type="button": Don't submit form
               */}
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={handleDeleteClick}
                                disabled={isLoading}
                                className="sm:mr-auto"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                            </Button>

                            {/**
               * ACTION BUTTONS (RIGHT SIDE)
               */}
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onClose}
                                    disabled={isLoading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isLoading || !name.trim()}
                                >
                                    {isLoading ? 'Saving...' : 'Save'}
                                </Button>
                            </div>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/**
       * DELETE CONFIRMATION DIALOG
       * 
       * SEPARATE DIALOG:
       * - AlertDialog is specifically for confirmations
       * - Has different styling (more prominent)
       * - Forces user to make a choice
       */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Column?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will delete the column "{column.name}" and move all its tasks to another column.
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isLoading}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            disabled={isLoading}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isLoading ? 'Deleting...' : 'Delete Column'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
