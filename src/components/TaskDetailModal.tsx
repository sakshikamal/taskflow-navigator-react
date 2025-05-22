
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Task } from "@/pages/Homepage"; // Assuming Task interface is exported from Homepage
import { transitIcons } from "./TaskCard"; // Assuming transitIcons is exported or can be redefined here
import { Badge } from "@/components/ui/badge";
import { MapPin, CalendarDays, Edit3, Trash2, Info } from "lucide-react";

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (task: Task) => void; // Placeholder for edit functionality
  onDelete: (taskId: string) => void; // Placeholder for delete functionality
}

export default function TaskDetailModal({ task, isOpen, onClose, onEdit, onDelete }: TaskDetailModalProps) {
  if (!task) return null;

  const handleEdit = () => {
    // console.log("Edit task:", task.id);
    onEdit(task);
    // Implement actual edit logic or open edit form
    onClose(); // Close modal after initiating edit, or keep open for an inline edit form
  };

  const handleDelete = () => {
    // console.log("Delete task:", task.id);
    onDelete(task.id);
    // Implement actual delete logic
    onClose(); // Close modal after delete
  };


  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[525px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">{task.title}</DialogTitle>
          <DialogDescription className="flex items-center text-gray-600 pt-1">
            <CalendarDays size={16} className="mr-2 text-calroute-blue" />
            {task.timeRange}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          {task.description && (
            <div className="flex items-start">
              <Info size={18} className="mr-3 mt-1 text-calroute-blue flex-shrink-0" />
              <p className="text-gray-700">{task.description}</p>
            </div>
          )}

          <div className="flex items-center">
            {transitIcons[task.transitMode]}
            <span className="text-gray-700">{task.transitMode.charAt(0).toUpperCase() + task.transitMode.slice(1)}</span>
          </div>

          {task.locationName && (
            <div className="flex items-start">
              <MapPin size={18} className="mr-3 mt-1 text-calroute-blue flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-800">{task.locationName}</p>
                {task.locationAddress && <p className="text-sm text-gray-500">{task.locationAddress}</p>}
              </div>
            </div>
          )}
          
          <div className="pt-2">
            <Badge variant={task.isCompleted ? "secondary" : "outline"} className={task.isCompleted ? "bg-calroute-green text-white" : "border-calroute-blue text-calroute-blue"}>
              {task.isCompleted ? "Completed" : "Pending"}
            </Badge>
          </div>

        </div>
        
        <DialogFooter className="sm:justify-between">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Close
            </Button>
          </DialogClose>
          <div className="space-x-2">
            <Button type="button" variant="outline" onClick={handleEdit} className="text-calroute-blue border-calroute-blue hover:bg-calroute-lightBlue hover:text-calroute-blue">
              <Edit3 size={16} className="mr-2" /> Edit
            </Button>
            <Button type="button" variant="destructive" onClick={handleDelete}>
              <Trash2 size={16} className="mr-2" /> Delete
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
