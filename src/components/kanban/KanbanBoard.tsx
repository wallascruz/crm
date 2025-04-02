import { useRef, useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useKanban } from '@/contexts/KanbanContext';
import { KanbanColumn } from './KanbanColumn';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Loader } from '@/components/auth/Loader';
import { InterestFilter } from './InterestFilter';

export function KanbanBoard() {
  const { 
    stages = [], 
    leads = [], 
    addStage, 
    moveLeadToStage, 
    isLoading,
    filteredInterestId 
  } = useKanban();
  
  const [newStageName, setNewStageName] = useState('');
  const [isAddingStage, setIsAddingStage] = useState(false);
  const [mounted, setMounted] = useState(false);
  const newStageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Small delay to ensure everything is ready
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Sort stages by order
  const sortedStages = Array.isArray(stages) 
    ? [...stages].sort((a, b) => a.order - b.order) 
    : [];

  // Filter leads by interest if a filter is set
  const filteredLeads = filteredInterestId && Array.isArray(leads)
    ? leads.filter(lead => lead.interestId === filteredInterestId)
    : leads;

  const handleAddStage = () => {
    if (newStageName.trim()) {
      addStage(newStageName);
      setNewStageName('');
      setIsAddingStage(false);
    }
  };

  const handleStartAddStage = () => {
    setIsAddingStage(true);
    setTimeout(() => newStageInputRef.current?.focus(), 100);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStageId: string) => {
    e.preventDefault();
    
    const leadId = e.dataTransfer.getData('text/plain');
    moveLeadToStage(leadId, targetStageId);
  };

  if (isLoading || !mounted) {
    return <Loader />;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Pipeline de vendas</h2>
        <div className="flex items-center gap-2">
          <InterestFilter />
        </div>
      </div>
      
      <div 
        className="flex-1 overflow-x-auto pb-4 kanban-board"
        style={{ minHeight: '200px' }}
      >
        <div className="flex h-full gap-4">
          {sortedStages.map((stage) => {
            // Get leads for this stage
            const stageLeads = Array.isArray(filteredLeads) 
              ? filteredLeads.filter(lead => lead.stageId === stage.id)
              : [];
            
            return (
              <KanbanColumn 
                key={stage.id} 
                stage={stage} 
                leads={stageLeads} 
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage.id)}
              />
            );
          })}
          
          {isAddingStage ? (
            <Card className="shrink-0 w-80 bg-gray-50 border-dashed border-2 border-gray-300">
              <CardContent className="p-3">
                <div className="flex flex-col gap-2">
                  <Input
                    ref={newStageInputRef}
                    value={newStageName}
                    onChange={(e) => setNewStageName(e.target.value)}
                    placeholder="Nome do estágio"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddStage();
                      if (e.key === 'Escape') setIsAddingStage(false);
                    }}
                    className="border-gray-300"
                  />
                  <div className="flex justify-between gap-2">
                    <Button variant="outline" size="sm" onClick={() => setIsAddingStage(false)}>
                      Cancelar
                    </Button>
                    <Button size="sm" onClick={handleAddStage} disabled={!newStageName.trim()}>
                      Adicionar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Button 
              variant="outline" 
              className="h-12 shrink-0 border-dashed border-2 border-gray-300"
              onClick={handleStartAddStage}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar estágio
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
