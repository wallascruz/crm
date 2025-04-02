import { useState, useMemo } from 'react';
import { format, isAfter } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useKanban } from '@/contexts/KanbanContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCheck, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function RecentActivities() {
  const { activities, updateActivity, leads } = useKanban();
  const [showCompleted, setShowCompleted] = useState(false);
  
  const sortedActivities = useMemo(() => {
    const today = new Date();
    
    return [...activities]
      .filter(a => showCompleted ? true : !a.completed)
      .sort((a, b) => {
        // Sort by completed status first
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }
        
        // For non-completed, sort by due date ascending
        if (!a.completed && !b.completed) {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        
        // For completed, sort by completion date (using createdAt as proxy) descending
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      })
      .slice(0, 5); // Only show 5 activities
  }, [activities, showCompleted]);

  const handleToggleComplete = (id: string, completed: boolean) => {
    updateActivity(id, { completed: !completed });
  };
  
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'meeting':
        return <Calendar className="h-4 w-4" />;
      case 'call':
        return <Calendar className="h-4 w-4" />;
      case 'follow_up':
        return <Clock className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getLeadName = (leadId: string) => {
    const lead = leads.find(l => l.id === leadId);
    return lead ? lead.name : 'Lead não encontrado';
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>Próximas atividades</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowCompleted(!showCompleted)}
            className="h-7"
          >
            {showCompleted ? (
              <><Clock className="h-4 w-4 mr-1" /> Pendentes</>
            ) : (
              <><CheckCheck className="h-4 w-4 mr-1" /> Todas</>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {sortedActivities.length > 0 ? (
          sortedActivities.map(activity => {
            const isPast = isAfter(new Date(), new Date(activity.dueDate));
            const isToday = new Date(activity.dueDate).toDateString() === new Date().toDateString();
            
            return (
              <div key={activity.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="rounded-full h-8 w-8 p-0"
                    onClick={() => handleToggleComplete(activity.id, activity.completed)}
                  >
                    {activity.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <div className={`h-5 w-5 border-2 rounded-full ${isPast ? 'border-red-400' : 'border-gray-300'}`}>
                      </div>
                    )}
                  </Button>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className={`font-medium ${activity.completed ? 'line-through text-gray-500' : ''}`}>
                        {activity.title}
                      </p>
                      {(isPast && !activity.completed) && (
                        <Badge variant="destructive" className="text-xs">
                          Atrasada
                        </Badge>
                      )}
                      {(isToday && !activity.completed) && (
                        <Badge variant="outline" className="text-xs text-orange-500 border-orange-300 bg-orange-50">
                          Hoje
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      {getLeadName(activity.leadId)} • 
                      {format(new Date(activity.dueDate), " dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                </div>
                <div className={`rounded-full p-1.5 ${activity.completed ? 'bg-green-100' : 'bg-blue-100'}`}>
                  {getActivityIcon(activity.type)}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-6 text-gray-500">
            Nenhuma atividade agendada.
          </div>
        )}
        {activities.length > 5 && (
          <Button variant="ghost" className="w-full text-primary" asChild>
            <a href="/calendar">Ver todas as atividades</a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
