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
import { transitIcons, getTransitModeText } from "./TaskCard"; // Assuming transitIcons is exported or can be redefined here
import { Badge } from "@/components/ui/badge";
import { MapPin, CalendarDays, Edit3, Trash2, Info } from "lucide-react";
import Map from './Map';
import { useJsApiLoader } from '@react-google-maps/api';
import React from 'react';
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/use-toast";

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  tasks: Task[];
  homeAddress: string;
}

export default function TaskDetailModal({ task, isOpen, onClose, onEdit, onDelete, tasks, homeAddress }: TaskDetailModalProps) {
  const [homeLatLng, setHomeLatLng] = React.useState<{ lat: number; lng: number } | null>(null);
  const [geocodingStatus, setGeocodingStatus] = React.useState<string>('');
  const [isDeleting, setIsDeleting] = React.useState(false);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_MAPS_API_KEY,
    libraries: ['places'],
  });

  // Get home address from localStorage
  const homeAddressFromStorage = localStorage.getItem('calroute_home_address') || '';

  React.useEffect(() => {
    if (!isLoaded || !homeAddressFromStorage) return;
    // Only geocode if first task
    const idx = tasks.findIndex(t => t.id === task?.id);
    if (idx === 0 && homeAddressFromStorage) {
      if (!window.google || !window.google.maps || !window.google.maps.Geocoder) {
        setGeocodingStatus('Error: Google Maps Geocoder not available');
        return;
      }
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: homeAddressFromStorage }, (results, status) => {
        setGeocodingStatus(`Geocoding status: ${status}`);
        if (status === 'OK' && results && results[0]) {
          setHomeLatLng({
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng(),
          });
        }
      });
    }
  }, [isLoaded, homeAddressFromStorage, task, tasks]);

  if (!task) return null;

  // Find previous task (by order in tasks array)
  const idx = tasks.findIndex(t => t.id === task.id);
  let origin = '';
  let originLat = null, originLng = null;
  if (idx === 0) {
    origin = homeAddressFromStorage;
    if (homeLatLng) {
      originLat = homeLatLng.lat;
      originLng = homeLatLng.lng;
    }
  } else if (idx > 0) {
    const prev = tasks[idx - 1];
    origin = prev.locationAddress || prev.locationName || homeAddressFromStorage;
    originLat = prev.lat;
    originLng = prev.lng;
  }
  const destination = task.locationAddress || task.locationName || '';
  const destLat = task.lat;
  const destLng = task.lng;

  // Prepare locations for Map component
  const mapLocations = [];
  if (originLat && originLng) {
    mapLocations.push({ lat: originLat, lng: originLng, title: 'Start' });
  }
  if (destLat && destLng) {
    mapLocations.push({ lat: destLat, lng: destLng, title: 'Destination' });
  }

  // Google Maps click-through URL
  const clickUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`;

  const handleEdit = () => {
    // console.log("Edit task:", task.id);
    onEdit(task);
    // Implement actual edit logic or open edit form
    onClose(); // Close modal after initiating edit, or keep open for an inline edit form
  };

  const handleDelete = async () => {
    if (!task) return;
    setIsDeleting(true);
    try {
      await onDelete(task.id);
      onClose();
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[900px] bg-white flex flex-col md:flex-row">
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
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
                <span className="text-gray-700">{getTransitModeText(task.transitMode)}</span>
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
          </div>
          <DialogFooter className="w-full mt-6 flex flex-col gap-2">
            <div className="flex flex-row gap-2 w-full">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleEdit} 
                disabled={isDeleting}
                className="text-calroute-blue border-calroute-blue hover:bg-calroute-lightBlue hover:text-calroute-blue flex-1 flex justify-center items-center"
              >
                <Edit3 size={16} className="mr-2" />
                Edit
              </Button>
              <Button 
                type="button" 
                variant="destructive" 
                onClick={handleDelete} 
                disabled={isDeleting}
                className="flex-1 flex justify-center items-center"
              >
                {isDeleting ? (
                  <div className="flex items-center gap-2">
                    <Spinner className="h-4 w-4" />
                    Deleting...
                  </div>
                ) : (
                  <>
                    <Trash2 size={16} className="mr-2" />
                    Delete
                  </>
                )}
              </Button>
            </div>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isDeleting} className="w-full">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </div>
        <div className="md:w-1/2 w-full mt-6 md:mt-0 md:ml-6 flex flex-col items-center">
          <a href={clickUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-56 md:h-full rounded-lg overflow-hidden shadow-lg border border-gray-200 hover:ring-2 hover:ring-blue-400 transition-all">
            <div className="w-full h-56 md:h-72">
              {(originLat && originLng && destLat && destLng) ? (
                <Map routes={{ locations: mapLocations }} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <p>Loading map...</p>
                    {geocodingStatus && <p className="text-sm mt-2">{geocodingStatus}</p>}
                  </div>
                </div>
              )}
            </div>
          </a>
          <span className="text-xs text-gray-500 mt-2">Click map to open in Google Maps</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
