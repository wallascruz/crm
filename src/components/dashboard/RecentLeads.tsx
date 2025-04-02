import { format, isAfter, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useKanban } from '@/contexts/KanbanContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function RecentLeads() {
  const { leads, interests, stages } = useKanban();
  
  // Get recent leads (last 7 days)
  const sevenDaysAgo = subDays(new Date(), 7);
  
  const recentLeads = leads
    .filter(lead => isAfter(new Date(lead.createdAt), sevenDaysAgo))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5); // Only show 5 leads

  const getInterestName = (interestId: string | undefined) => {
    if (!interestId) return 'Sem interesse';
    const interest = interests.find(i => i.id === interestId);
    return interest ? interest.name : 'Interesse não encontrado';
  };

  const getStageName = (stageId: string) => {
    const stage = stages.find(s => s.id === stageId);
    return stage ? stage.name : 'Estágio não encontrado';
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Leads recentes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentLeads.length > 0 ? (
          recentLeads.map(lead => (
            <div key={lead.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {lead.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{lead.name}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{getInterestName(lead.interestId)}</span>
                    <Badge variant="secondary" className="text-xs">
                      {getStageName(lead.stageId)}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                {format(new Date(lead.createdAt), "dd MMM", { locale: ptBR })}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-gray-500">
            <UserPlus className="h-8 w-8 opacity-40 mb-2" />
            <p>Nenhum lead nos últimos 7 dias</p>
          </div>
        )}
        {leads.length > 5 && (
          <Button variant="ghost" className="w-full text-primary" asChild>
            <a href="/pipeline">Ver todos os leads</a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
