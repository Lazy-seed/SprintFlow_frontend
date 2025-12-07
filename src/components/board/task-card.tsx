import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface TaskCardProps {
    task: {
        id: string;
        title: string;
        taskNumber: string;
        priority: string;
        description?: string;
        assignee?: {
            fullName: string;
            avatarUrl?: string;
        };
        _count?: {
            subtasks: number;
            comments: number;
        };
    };
    onClick?: () => void;
}

const priorityColors = {
    low: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    medium: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    critical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export function TaskCard({ task, onClick }: TaskCardProps) {
    return (
        <Card
            className="p-3 mb-2 cursor-pointer hover:shadow-md transition-shadow bg-white dark:bg-gray-800"
            onClick={onClick}
        >
            <div className="flex items-start justify-between mb-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">{task.taskNumber}</span>
                <Badge className={priorityColors[task.priority as keyof typeof priorityColors] || priorityColors.medium}>
                    {task.priority}
                </Badge>
            </div>

            <h4 className="font-medium text-sm mb-2 text-gray-900 dark:text-white">
                {task.title}
            </h4>

            {task.description && (
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                    {task.description}
                </p>
            )}

            <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    {task._count && task._count.subtasks > 0 && (
                        <span>☑ {task._count.subtasks}</span>
                    )}
                    {task._count && task._count.comments > 0 && (
                        <span>💬 {task._count.comments}</span>
                    )}
                </div>

                {task.assignee && (
                    <div className="flex items-center gap-1">
                        {task.assignee.avatarUrl ? (
                            <img
                                src={task.assignee.avatarUrl}
                                alt={task.assignee.fullName}
                                className="w-6 h-6 rounded-full"
                            />
                        ) : (
                            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                                {task.assignee.fullName.charAt(0)}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Card>
    );
}
