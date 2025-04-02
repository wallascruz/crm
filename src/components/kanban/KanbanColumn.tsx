import { useState, useRef } from 'react';
import { Edit, MoreVertical, Plus, Trash } from 'lucide-react';
import { useKanban } from '@/contexts/KanbanContext';
import { Lead, Stage } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { LeadCard } from './LeadCard';
import { AddLeadDialog } from './AddLeadDialog';

interface KanbanColumnProps {
  stage: Stage;
  leads: Lead[];
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

export function KanbanColumn({ stage, leads, onDragOver, onDrop }: KanbanColumnProps) {
  const { updateStage, deleteStage } = useKanban();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(stage.name);
  const [showAddLeadDialog, setShowAddLeadDialog] = useState(false);
  const [displayCount, setDisplayCount] = useState(10);
  
  const inputRef = useRef<HTMLInputElement>(null);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedName(stage.name);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleSave = () => {
    if (editedName.trim() && editedName !== stage.name) {
      updateStage(stage.id, editedName);
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir este estágio?')) {
      deleteStage(stage.id);
    }
  };

  const visibleLeads = leads.slice(0, displayCount);
  const hasMoreLeads = leads.length > displayCount;

  return (
    <Card 
      className="shrink-0 w-80 flex flex-col max-h-full bg-kanban-column"
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <CardHeader className="py-3 px-3 flex flex-row items-center justify-between space-y-0">
        {isEditing ? (
          <div className="flex w-full">
            <Input
              ref={inputRef}
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') setIsEditing(false);
              }}
              onBlur={handleSave}
              className="h-8"
            />
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: stage.color || '#64748b' }}
              />
              <CardTitle className="text-sm font-medium">{stage.name}</CardTitle>
              <span className="text-xs text-gray-500 bg-gray-200 rounded-full px-1.5 py-0.5">
                {leads.length}
              </span>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-7 w-7 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Editar</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleDelete}
                  className="text-red-600 hover:text-red-700 focus:text-red-700"
                >
                  <Trash className="mr-2 h-4 w-4" />
                  <span>Excluir</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto flex flex-col gap-2 p-2 kanban-column">
        {visibleLeads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} />
        ))}
        
        {hasMoreLeads && (
          <Button
            variant="ghost"
            className="w-full text-primary"
            onClick={() => setDisplayCount(prev => prev + 10)}
          >
            Carregar mais {Math.min(10, leads.length - displayCount)} leads
          </Button>
        )}
        
        <Button 
          variant="ghost" 
          className="flex items-center justify-center border border-dashed border-gray-300 hover:border-primary hover:bg-primary/5 mt-2"
          onClick={() => setShowAddLeadDialog(true)}
        >
          <Plus className="h-4 w-4 mr-1" />
          Adicionar lead
        </Button>
      </CardContent>
      
      <AddLeadDialog 
        stageId={stage.id} 
        open={showAddLeadDialog} 
        onOpenChange={setShowAddLeadDialog}
      />
    </Card>
  );
}
