import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface TaskCardProps {
    task: {
        id: string;
        title: string;
        description?: string;
        taskNumber: string;
        priority: string;
    };
    onClick?: () => void;
}

export function TaskCard({ task, onClick }: TaskCardProps) {
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'critical':
                return 'bg-red-500';
            case 'high':
                return 'bg-orange-500';
            case 'medium':
                return 'bg-yellow-500';
            case 'low':
                return 'bg-green-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <Card
            className="p-4 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={onClick}
        >
            <div className="flex items-start justify-between mb-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                    {task.taskNumber}
                </span>
                <Badge className={`${getPriorityColor(task.priority)} text-white`}>
                    {task.priority}
                </Badge>
            </div>

            <h4 className="font-medium text-sm mb-2 text-gray-900 dark:text-white">
                {task.title}
            </h4>

            {task.description && (
                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                    {task.description}
                </p>
            )}
        </Card>
    );
}
