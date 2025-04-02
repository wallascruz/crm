import { useState } from 'react';
import { Phone, MoreVertical } from 'lucide-react';
import { Lead } from '@/types';
import { cn } from '@/lib/utils';
import { useKanban } from '@/contexts/KanbanContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LeadDetailsDialog } from './LeadDetailsDialog';

interface LeadCardProps {
  lead: Lead;
}

export function LeadCard({ lead }: LeadCardProps) {
  const { interests, deleteLead } = useKanban();
  const [showDetails, setShowDetails] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const interest = Array.isArray(interests) 
    ? interests.find((i) => i.id === lead.interestId) 
    : undefined;
  
  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (lead.phone) {
      // Format phone for WhatsApp URL
      const formattedPhone = lead.phone.replace(/\D/g, '');
      window.open(`https://wa.me/${formattedPhone}`, '_blank');
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (window.confirm(`Tem certeza que deseja excluir o lead ${lead.name}?`)) {
      deleteLead(lead.id);
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', lead.id);
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <>
      <Card
        className={cn(
          "cursor-pointer hover:shadow transition-all duration-200 bg-white border-l-4",
          isDragging ? "opacity-50" : "opacity-100"
        )}
        style={{ borderLeftColor: interest?.id ? '#0EA5E9' : '#64748b' }}
        onClick={() => setShowDetails(true)}
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <CardContent className="p-3 space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium line-clamp-1">{lead.name}</h3>
              {lead.email && (
                <p className="text-xs text-gray-500 line-clamp-1">{lead.email}</p>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleDelete}>
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {interest && (
                <Badge variant="outline" className="text-xs font-normal">
                  {interest.name}
                </Badge>
              )}
            </div>
            {lead.phone && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full bg-green-50 hover:bg-green-100 text-green-600"
                onClick={handleWhatsAppClick}
              >
                <Phone className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      {showDetails && (
        <LeadDetailsDialog lead={lead} open={showDetails} onOpenChange={setShowDetails} />
      )}
    </>
  );
}
