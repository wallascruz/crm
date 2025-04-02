import { format } from 'date-fns';
import { Check, Clock, Calendar as CalendarIcon, MessageCircle, Phone } from 'lucide-react';
import { Activity } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useKanban } from '@/contexts/KanbanContext';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { ActivityForm } from './ActivityForm';

interface CalendarEventProps {
  activity: Activity;
  leadName: string;
}

export function CalendarEvent({ activity, leadName }: CalendarEventProps) {
  const { updateActivity } = useKanban();
  const [showEditForm, setShowEditForm] = useState(false);

  const handleToggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateActivity(activity.id, { completed: !activity.completed });
  };

  const handleEventClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling up to day click
    setShowEditForm(true);
  };

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'call':
        return <Phone className="h-3 w-3" />;
      case 'meeting':
        return <CalendarIcon className="h-3 w-3" />;
      case 'email':
        return <MessageCircle className="h-3 w-3" />;
      case 'follow_up':
        return <Clock className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const getActivityTypeLabel = (type: Activity['type']) => {
    switch (type) {
      case 'call':
        return 'Ligação';
      case 'meeting':
        return 'Reunião';
      case 'email':
        return 'Email';
      case 'follow_up':
        return 'Acompanhamento';
      default:
        return 'Outro';
    }
  };

  return (
    <>
      <Card
        className={cn(
          "shadow-sm transition-all cursor-pointer hover:shadow-md",
          activity.completed ? "bg-gray-50" : "bg-white",
          new Date(activity.dueDate) < new Date() && !activity.completed ? "border-red-300" : ""
        )}
        onClick={handleEventClick}
      >
        <CardContent className="p-2">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className={cn(
                  "font-medium text-sm truncate",
                  activity.completed ? "line-through text-gray-500" : ""
                )}>
                  {activity.title}
                </p>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <Badge variant="outline" className="text-xs px-1 py-0 h-5">
                  {getActivityIcon(activity.type)}
                  <span className="ml-1">{getActivityTypeLabel(activity.type)}</span>
                </Badge>
              </div>
              <p className="text-xs text-gray-500 mt-1 truncate">
                {leadName} • {format(new Date(activity.dueDate), "HH:mm")}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 ml-1"
              onClick={handleToggleComplete}
            >
              <div className={cn(
                "h-4 w-4 rounded-full border",
                activity.completed ? "bg-green-500 border-green-500" : "border-gray-300"
              )}>
                {activity.completed && <Check className="h-3 w-3 text-white" />}
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {showEditForm && (
        <ActivityForm
          open={showEditForm}
          onOpenChange={setShowEditForm}
          initialDate={new Date(activity.dueDate)}
          existingActivity={activity}
        />
      )}
    </>
  );
}
