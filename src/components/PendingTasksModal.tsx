import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

interface Task {
  id: string;
  title: string;
  timeRange?: string;
  locationName?: string;
}

interface PendingTasksModalProps {
  open: boolean;
  onClose: () => void;
  onTasksCompleted?: () => void;
}

export default function PendingTasksModal({ open, onClose, onTasksCompleted }: PendingTasksModalProps) {
  const { toast } = useToast();
  const [pendingTasks, setPendingTasks] = useState<Task[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetch('http://localhost:8888/api/pending_tasks', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setPendingTasks(data.tasks || []);
        setSelected(new Set());
      })
      .catch(() => {
        toast({ title: 'Error', description: 'Failed to load pending tasks.', variant: 'destructive' });
      })
      .finally(() => setLoading(false));
  }, [open, toast]);

  const handleToggle = (taskId: string) => {
    setSelected(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  const handleMarkCompleted = async () => {
    if (selected.size === 0) return;
    setSubmitting(true);
    try {
      const response = await fetch('http://localhost:8888/api/complete_tasks', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_ids: Array.from(selected) })
      });
      if (!response.ok) throw new Error('Failed to mark tasks as completed');
      toast({ title: 'Success', description: 'Tasks marked as completed!' });
      onClose();
      if (onTasksCompleted) onTasksCompleted();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to mark tasks as completed.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[rgb(0,74,173)]">
            Mark Tasks as Completed
          </DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="py-8 text-center text-gray-500">Loading pending tasks...</div>
        ) : pendingTasks.length === 0 ? (
          <div className="py-8 text-center text-gray-500">No pending tasks! 🎉</div>
        ) : (
          <div className="space-y-4 max-h-72 overflow-y-auto">
            {pendingTasks.map(task => (
              <div key={task.id} className="flex items-center gap-3 p-2 rounded hover:bg-gray-50">
                <Checkbox
                  checked={selected.has(task.id)}
                  onCheckedChange={() => handleToggle(task.id)}
                  id={`pending-task-${task.id}`}
                />
                <label htmlFor={`pending-task-${task.id}`} className="flex-1 cursor-pointer">
                  <span className="font-medium text-gray-800">{task.title}</span>
                  {task.timeRange && <span className="ml-2 text-gray-500 text-sm">{task.timeRange}</span>}
                  {task.locationName && <span className="ml-2 text-gray-400 text-xs">@ {task.locationName}</span>}
                </label>
              </div>
            ))}
          </div>
        )}
        <DialogFooter className="gap-2 mt-4">
          <Button variant="outline" onClick={onClose} disabled={submitting}>Close</Button>
          <Button onClick={handleMarkCompleted} disabled={selected.size === 0 || submitting} className="bg-[rgb(0,74,173)] text-white">
            Mark as Completed
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 