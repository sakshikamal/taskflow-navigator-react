import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Clock, Info, Star } from 'lucide-react';
import { Autocomplete } from '@react-google-maps/api';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: TaskData, taskId?: string) => void;
  initialData?: TaskData;
  taskId?: string;
  error?: string | null;
}

interface TaskData {
  title: string;
  duration: string;
  location: string;
  lat?: number;
  lng?: number;
  startTime?: string;
  endTime?: string;
  description?: string;
  priority: number;
}

export default function NewTaskModal({ isOpen, onClose, onSubmit, initialData, taskId, error }: NewTaskModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<TaskData>({
    title: '',
    duration: '',
    location: '',
    lat: undefined,
    lng: undefined,
    startTime: '',
    endTime: '',
    description: '',
    priority: 2, // Default priority
  });

  const [errors, setErrors] = useState<Partial<Record<keyof TaskData, string>>>({});
  const locationAutoRef = useRef<google.maps.places.Autocomplete | null>(null);
  const hasInitialized = useRef(false);

  // Populate form with initialData only when modal first opens
  useEffect(() => {
    if (isOpen && !hasInitialized.current && initialData) {
      setFormData(initialData);
      hasInitialized.current = true;
    } else if (!isOpen) {
      hasInitialized.current = false;
    }
  }, [isOpen, initialData]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        title: '',
        duration: '',
        location: '',
        lat: undefined,
        lng: undefined,
        startTime: '',
        endTime: '',
        description: '',
        priority: 2,
      });
      setErrors({});
    }
  }, [isOpen]);

  const onLoadLocation = (autocomplete: google.maps.places.Autocomplete) => {
    locationAutoRef.current = autocomplete;
  };

  const onPlaceChangedLocation = () => {
    if (locationAutoRef.current) {
      const place = locationAutoRef.current.getPlace();
      if (place.geometry?.location) {
        setFormData(prev => ({
          ...prev,
          location: place.formatted_address || place.name || '',
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        }));
        // Clear error when location is selected
        if (errors.location) {
          setErrors(prev => ({ ...prev, location: '' }));
        }
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when field is modified
    if (errors[name as keyof TaskData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof TaskData, string>> = {};

    // Required fields validation
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.duration.trim()) {
      newErrors.duration = 'Duration is required';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    if (!formData.lat || !formData.lng) {
      newErrors.location = 'Please select a valid location from the dropdown';
    }

    // Time validation if both start and end times are provided
    if (formData.startTime && formData.endTime) {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Create Date objects for start and end times
      const [startHours, startMinutes] = formData.startTime.split(':').map(Number);
      const [endHours, endMinutes] = formData.endTime.split(':').map(Number);

      const start = new Date(today.setHours(startHours, startMinutes, 0));
      let end = new Date(today.setHours(endHours, endMinutes, 0));

      // If end time is earlier than start time, assume it's the next day
      if (end <= start) {
        end = new Date(tomorrow.setHours(endHours, endMinutes, 0));
      }

      if (end <= start) {
        newErrors.endTime = 'End time must be after start time';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData, taskId);
      // Do NOT call onClose() here; parent will close modal on success
      // setFormData({ ... }); // Optionally reset form here if needed
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()} modal={false}>
      <DialogContent className="sm:max-w-[550px] w-full bg-white max-h-[90vh] overflow-y-auto"
        onInteractOutside={event => {
          if (
            event.target instanceof HTMLElement &&
            (event.target.closest('.pac-container') || event.target.classList.contains('pac-item'))
          ) {
            event.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[rgb(0,74,173)]">
            {taskId ? 'Edit Task' : 'Add New Task'}
          </DialogTitle>
        </DialogHeader>
        
        {error && (
          <div className="text-red-600 mb-2 text-sm font-medium">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Title Field */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base font-semibold text-gray-700">
              Title *
            </Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.title ? 'border-red-500' : 'border-gray-200'
              } focus:ring-2 focus:ring-[rgb(93,224,230)] focus:border-[rgb(93,224,230)]`}
              placeholder="Enter task title"
            />
            {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
          </div>

          {/* Duration and Location Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-base font-semibold text-gray-700 flex items-center gap-2">
                <Clock size={16} className="text-[rgb(0,74,173)]" /> Duration (in minutes) *
              </Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                min="1"
                value={formData.duration}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.duration ? 'border-red-500' : 'border-gray-200'
                } focus:ring-2 focus:ring-[rgb(93,224,230)] focus:border-[rgb(93,224,230)]`}
                placeholder="e.g., 30"
              />
              {errors.duration && <p className="text-sm text-red-500">{errors.duration}</p>}
            </div>

            {/* Location Field */}
            <div className="space-y-2">
              <Label htmlFor="location" className="text-base font-semibold text-gray-700 flex items-center gap-2">
                <MapPin size={16} className="text-[rgb(0,74,173)]" /> Location *
              </Label>
              <Autocomplete
                onLoad={onLoadLocation}
                onPlaceChanged={onPlaceChangedLocation}
              >
                <input
                  id="location"
                  name="location"
                  value={formData.location || ''}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.location ? 'border-red-500' : 'border-gray-200'
                  } focus:ring-2 focus:ring-[rgb(93,224,230)] focus:border-[rgb(93,224,230)]`}
                  placeholder="Enter location"
                  autoComplete="off"
                />
              </Autocomplete>
              {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
            </div>
          </div>

          {/* Optional Time Range Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime" className="text-base font-semibold text-gray-700">
                Start Time
              </Label>
              <Input
                type="time"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[rgb(93,224,230)] focus:border-[rgb(93,224,230)]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime" className="text-base font-semibold text-gray-700">
                End Time
              </Label>
              <Input
                type="time"
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.endTime ? 'border-red-500' : 'border-gray-200'
                } focus:ring-2 focus:ring-[rgb(93,224,230)] focus:border-[rgb(93,224,230)]`}
              />
              {errors.endTime && <p className="text-sm text-red-500">{errors.endTime}</p>}
            </div>
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-base font-semibold text-gray-700 flex items-center gap-2">
              <Info size={16} className="text-[rgb(0,74,173)]" /> Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[rgb(93,224,230)] focus:border-[rgb(93,224,230)] min-h-[100px]"
              placeholder="Add any additional details..."
            />
          </div>

          {/* Priority Selection */}
          <div className="space-y-2">
            <Label className="text-base font-semibold text-gray-700 flex items-center gap-2">
              <Star size={16} className="text-[rgb(0,74,173)]" /> Priority Level
            </Label>
            <div className="flex gap-2">
              {[1, 2, 3].map((level) => (
                <Button
                  key={level}
                  type="button"
                  variant={formData.priority === level ? "default" : "outline"}
                  className={`flex-1 ${
                    formData.priority === level
                      ? "bg-[rgb(0,74,173)] hover:bg-[rgb(93,224,230)] text-white"
                      : "border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, priority: level }))}
                >
                  {level === 1 ? "High" : level === 2 ? "Medium" : "Low"}
                </Button>
              ))}
            </div>
          </div>

          <DialogFooter className="sm:justify-between gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[rgb(0,74,173)] hover:bg-[rgb(93,224,230)] text-white"
            >
              {taskId ? 'Update Task' : 'Add Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 