import { 
  BarChart3, 
  CalendarClock, 
  CheckCircle, 
  Clock, 
  UserPlus 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useKanban } from '@/contexts/KanbanContext';
import { subDays, isAfter } from 'date-fns';

export function DashboardStats() {
  const { leads, activities } = useKanban();
  
  const now = new Date();
  const sevenDaysAgo = subDays(now, 7);
  
  // Calculate statistics
  const newLeadsLastWeek = leads.filter(lead => 
    isAfter(new Date(lead.createdAt), sevenDaysAgo)
  ).length;
  
  const pendingActivities = activities.filter(activity => !activity.completed).length;
  
  const completedActivities = activities.filter(activity => activity.completed).length;
  
  const conversionRate = leads.length > 0 
    ? Math.round((leads.filter(lead => lead.stageId === '4').length / leads.length) * 100) 
    : 0;
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Novos Leads</CardTitle>
          <UserPlus className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{newLeadsLastWeek}</div>
          <p className="text-xs text-muted-foreground">
            nos últimos 7 dias
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Atividades Pendentes</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingActivities}</div>
          <p className="text-xs text-muted-foreground">
            {activities.length > 0 ? `${Math.round((pendingActivities / activities.length) * 100)}% do total` : '0% do total'}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Atividades Concluídas</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedActivities}</div>
          <p className="text-xs text-muted-foreground">
            {activities.length > 0 ? `${Math.round((completedActivities / activities.length) * 100)}% do total` : '0% do total'}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{conversionRate}%</div>
          <p className="text-xs text-muted-foreground">
            Leads que chegaram até o final
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
