
import { useState } from 'react';
import { MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    timeRange: string;
    isActive?: boolean;
  };
  onClick: () => void;
}

export default function TaskCard({ task, onClick }: TaskCardProps) {
  const [showOptions, setShowOptions] = useState(false);
  
  return (
    <div 
      className={cn(
        "task-card flex justify-between items-center cursor-pointer", 
        task.isActive && "active"
      )}
      onClick={onClick}
    >
      <div>
        <h3 className="font-semibold">{task.title}</h3>
        <p className="text-sm text-gray-500">{task.timeRange}</p>
      </div>
      
      <div className="relative">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setShowOptions(!showOptions);
          }}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <MoreVertical size={20} />
        </button>
        
        {showOptions && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
            <div className="py-1">
              <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Edit Task
              </button>
              <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Delete Task
              </button>
              <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Mark as Complete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
