import { useState, useRef } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, CheckCircle, Clock, MessageCircle, Phone, Plus, Send, X } from 'lucide-react';
import { useKanban } from '@/contexts/KanbanContext';
import { useAuth } from '@/contexts/AuthContext';
import { Lead, Note, Activity } from '@/types';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LeadDetailsDialogProps {
  lead: Lead;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LeadDetailsDialog({ lead, open, onOpenChange }: LeadDetailsDialogProps) {
  const { 
    interests,
    stages,
    getNotesByLeadId,
    addNote,
    getActivitiesByLeadId,
    addActivity,
    updateActivity
  } = useKanban();
  const { user } = useAuth();
  
  // State
  const [noteContent, setNoteContent] = useState('');
  const noteInputRef = useRef<HTMLTextAreaElement>(null);

  // Scheduled activities
  const [newActivityTitle, setNewActivityTitle] = useState('');
  const [newActivityDescription, setNewActivityDescription] = useState('');
  const [newActivityType, setNewActivityType] = useState<Activity['type']>('follow_up');
  const [newActivityDate, setNewActivityDate] = useState<Date | undefined>(new Date());
  const [isAddingActivity, setIsAddingActivity] = useState(false);

  // Get data
  const notes = getNotesByLeadId(lead.id);
  const activities = getActivitiesByLeadId(lead.id);
  const interest = interests.find(i => i.id === lead.interestId);
  const stage = stages.find(s => s.id === lead.stageId);

  const handleAddNote = () => {
    if (noteContent.trim()) {
      addNote(lead.id, noteContent);
      setNoteContent('');
    }
  };

  const handleAddActivity = () => {
    if (!newActivityTitle || !newActivityDate || !user) return;

    addActivity({
      title: newActivityTitle,
      description: newActivityDescription || undefined,
      leadId: lead.id,
      userId: user.id, // Add the userId from the auth context
      dueDate: newActivityDate.toISOString(),
      completed: false,
      type: newActivityType,
    });
    
    setIsAddingActivity(false);
    setNewActivityTitle('');
    setNewActivityDescription('');
    setNewActivityType('follow_up');
    setNewActivityDate(new Date());
  };

  const toggleActivityComplete = (activity: Activity) => {
    updateActivity(activity.id, { completed: !activity.completed });
  };

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'call': return <Phone className="h-4 w-4" />;
      case 'meeting': return <Calendar className="h-4 w-4" />;
      case 'email': return <MessageCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getActivityTypeLabel = (type: Activity['type']) => {
    switch (type) {
      case 'call': return 'Ligação';
      case 'meeting': return 'Reunião';
      case 'email': return 'Email';
      case 'follow_up': return 'Acompanhamento';
      default: return 'Outro';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{lead.name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-3 gap-4 py-2">
          {lead.email && (
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{lead.email}</p>
            </div>
          )}
          
          {lead.phone && (
            <div>
              <p className="text-sm text-gray-500">Telefone</p>
              <p className="font-medium">{lead.phone}</p>
            </div>
          )}
          
          <div>
            <p className="text-sm text-gray-500">Criado em</p>
            <p className="font-medium">
              {format(new Date(lead.createdAt), "dd 'de' MMMM", { locale: ptBR })}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Estágio</p>
            <Badge variant="outline" className="mt-1">
              {stage?.name || "Desconhecido"}
            </Badge>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Interesse</p>
            {interest ? (
              <Badge className="mt-1 bg-primary/10 text-primary border-primary/20">
                {interest.name}
              </Badge>
            ) : (
              <Badge variant="outline" className="mt-1">
                Nenhum interesse definido
              </Badge>
            )}
          </div>
        </div>
        
        <Separator className="my-2" />
        
        <Tabs defaultValue="notes">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="notes">Anotações</TabsTrigger>
            <TabsTrigger value="activities">Atividades</TabsTrigger>
          </TabsList>
          
          <TabsContent value="notes" className="space-y-4">
            <div className="flex gap-2">
              <Textarea 
                ref={noteInputRef}
                placeholder="Adicionar uma nova anotação..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="resize-none flex-1"
              />
              <Button 
                onClick={handleAddNote} 
                disabled={!noteContent.trim()}
                className="self-end"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            {notes.length > 0 ? (
              <div className="space-y-3">
                {notes.map(note => (
                  <div key={note.id} className="bg-gray-50 p-3 rounded-lg">
                    <p>{note.content}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {format(new Date(note.createdAt), "dd MMM, HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <MessageCircle className="mx-auto h-10 w-10 opacity-20 mb-2" />
                <p>Nenhuma anotação adicionada.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="activities" className="space-y-4">
            {!isAddingActivity ? (
              <Button 
                variant="outline" 
                className="w-full border-dashed" 
                onClick={() => setIsAddingActivity(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Agendar nova atividade
              </Button>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <h3 className="font-medium">Nova atividade</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0"
                    onClick={() => setIsAddingActivity(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <Input 
                  placeholder="Título da atividade" 
                  value={newActivityTitle}
                  onChange={(e) => setNewActivityTitle(e.target.value)}
                  className="w-full"
                />
                
                <Textarea 
                  placeholder="Descrição (opcional)" 
                  value={newActivityDescription}
                  onChange={(e) => setNewActivityDescription(e.target.value)}
                  className="resize-none"
                  rows={2}
                />
                
                <div className="flex gap-2">
                  <Select 
                    value={newActivityType} 
                    onValueChange={(value: Activity['type']) => setNewActivityType(value)}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="follow_up">Acompanhamento</SelectItem>
                      <SelectItem value="meeting">Reunião</SelectItem>
                      <SelectItem value="call">Ligação</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="other">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline">
                        {newActivityDate ? (
                          format(newActivityDate, "dd/MM/yyyy")
                        ) : (
                          "Selecionar data"
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={newActivityDate}
                        onSelect={setNewActivityDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="flex justify-end mt-2">
                  <Button 
                    onClick={handleAddActivity}
                    disabled={!newActivityTitle || !newActivityDate}
                  >
                    Salvar
                  </Button>
                </div>
              </div>
            )}
            
            <div className="space-y-3">
              {activities.length > 0 ? (
                activities.map(activity => (
                  <div 
                    key={activity.id} 
                    className={`p-3 rounded-lg border flex items-start justify-between ${
                      activity.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-full bg-primary/10">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div>
                          <h4 className={`font-medium ${activity.completed ? 'line-through text-gray-500' : ''}`}>
                            {activity.title}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>{getActivityTypeLabel(activity.type)}</span>
                            <span>•</span>
                            <span>
                              {format(new Date(activity.dueDate), "dd MMM, HH:mm", { locale: ptBR })}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {activity.description && (
                        <p className="text-sm text-gray-600 mt-2 ml-8">
                          {activity.description}
                        </p>
                      )}
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => toggleActivityComplete(activity)}
                    >
                      <div className={`h-5 w-5 rounded-full border ${
                        activity.completed 
                          ? 'bg-green-500 border-green-500' 
                          : 'border-gray-300'
                      }`}>
                        {activity.completed && <CheckCircle className="h-5 w-5 text-white" />}
                      </div>
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <Calendar className="mx-auto h-10 w-10 opacity-20 mb-2" />
                  <p>Nenhuma atividade agendada.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
