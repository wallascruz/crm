import { useState, useMemo } from 'react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useKanban } from '@/contexts/KanbanContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarEvent } from './CalendarEvent';
import { ActivityForm } from './ActivityForm';
import { Activity } from '@/types';

export function CalendarView() {
  const { activities, leads } = useKanban();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  // Create calendar days for current week
  const calendarDays = useMemo(() => {
    const startDate = startOfWeek(currentDate, { weekStartsOn: 1 }); // Start on Monday
    return Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));
  }, [currentDate]);

  // Group activities by day
  const activitiesByDay = useMemo(() => {
    const result = new Map();
    
    if (Array.isArray(activities)) {
      activities.forEach(activity => {
        const activityDate = new Date(activity.dueDate);
        const dateStr = format(activityDate, 'yyyy-MM-dd');
        
        if (!result.has(dateStr)) {
          result.set(dateStr, []);
        }
        
        result.get(dateStr).push(activity);
      });
    }
    
    return result;
  }, [activities]);

  const previousWeek = () => {
    setCurrentDate(prev => addDays(prev, -7));
  };

  const nextWeek = () => {
    setCurrentDate(prev => addDays(prev, 7));
  };

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    setSelectedActivity(null);
    setShowActivityForm(true);
  };

  const getActivitiesForDay = (day: Date) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    return activitiesByDay.get(dateStr) || [];
  };

  const getLeadName = (leadId: string) => {
    const lead = leads.find(l => l.id === leadId);
    return lead ? lead.name : 'Lead não encontrado';
  };

  const isToday = (day: Date) => isSameDay(day, new Date());

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Calendário</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={previousWeek} size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-medium">
            {format(calendarDays[0], "dd MMM", { locale: ptBR })} - {format(calendarDays[6], "dd MMM", { locale: ptBR })}
          </span>
          <Button variant="outline" onClick={nextWeek} size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button onClick={() => {
          setSelectedActivity(null);
          setSelectedDate(new Date());
          setShowActivityForm(true);
        }}>
          <Plus className="h-4 w-4 mr-2" /> Nova atividade
        </Button>
      </div>
      
      <div className="flex-1 overflow-auto">
        {/* Calendar header (day names) */}
        <div className="grid grid-cols-7 gap-4 mb-2">
          {calendarDays.map((day, i) => (
            <div key={i} className="text-center py-2 font-medium">
              <div>{format(day, 'EEEE', { locale: ptBR })}</div>
              <div 
                className={`text-lg ${isToday(day) ? 'bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto' : ''}`}
              >
                {format(day, 'd')}
              </div>
            </div>
          ))}
        </div>
        
        {/* Calendar body */}
        <div className="grid grid-cols-7 gap-4 h-[600px]">
          {calendarDays.map((day, i) => {
            const dayActivities = getActivitiesForDay(day);
            
            return (
              <div 
                key={i} 
                className={`border rounded-lg overflow-y-auto p-2 cursor-pointer ${isToday(day) ? 'bg-primary/5 border-primary/20' : ''}`}
                onClick={() => handleDayClick(day)}
              >
                {dayActivities.length > 0 ? (
                  <div className="space-y-2">
                    {dayActivities.map(activity => (
                      <CalendarEvent 
                        key={activity.id} 
                        activity={activity}
                        leadName={getLeadName(activity.leadId)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Badge
                      variant="outline"
                      className="bg-transparent border-dashed cursor-pointer hover:bg-secondary/50"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Adicionar
                    </Badge>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {showActivityForm && (
        <ActivityForm 
          open={showActivityForm} 
          onOpenChange={setShowActivityForm}
          initialDate={selectedDate}
          existingActivity={selectedActivity}
        />
      )}
    </div>
  );
}
