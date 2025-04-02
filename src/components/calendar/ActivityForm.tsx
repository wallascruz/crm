import { useState, useEffect } from 'react';
import { format, parse } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useKanban } from '@/contexts/KanbanContext';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Activity } from '@/types';
import { cn } from '@/lib/utils';

interface ActivityFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialDate: Date | null;
  existingActivity?: Activity;
}

export function ActivityForm({ open, onOpenChange, initialDate, existingActivity }: ActivityFormProps) {
  const { leads, addActivity, updateActivity } = useKanban();
  const { user } = useAuth();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [leadId, setLeadId] = useState('');
  const [activityType, setActivityType] = useState<Activity['type']>('follow_up');
  const [date, setDate] = useState<Date | undefined>(initialDate || new Date());
  const [time, setTime] = useState(format(new Date(), "HH:mm"));
  
  // Load existing activity data if provided
  useEffect(() => {
    if (existingActivity) {
      setTitle(existingActivity.title);
      setDescription(existingActivity.description || '');
      setLeadId(existingActivity.leadId);
      setActivityType(existingActivity.type);
      
      const activityDate = new Date(existingActivity.dueDate);
      setDate(activityDate);
      setTime(format(activityDate, "HH:mm"));
    }
  }, [existingActivity]);

  const handleSubmit = () => {
    if (!title || !leadId || !date || !user) return;

    // Create a date object with the selected date and time
    const [hours, minutes] = time.split(':').map(Number);
    const activityDate = new Date(date);
    activityDate.setHours(hours);
    activityDate.setMinutes(minutes);

    // If editing an existing activity
    if (existingActivity) {
      updateActivity(existingActivity.id, {
        title,
        description: description || undefined,
        leadId,
        type: activityType,
        dueDate: activityDate.toISOString(),
      });
    } else {
      // Create a new activity
      addActivity({
        title,
        description: description || undefined,
        leadId,
        userId: user.id, // Add the userId from the auth context
        type: activityType,
        dueDate: activityDate.toISOString(),
        completed: false,
      });
    }

    // Reset form and close dialog
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {existingActivity ? 'Editar atividade' : 'Agendar nova atividade'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Título*</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nome da atividade"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="lead">Lead*</Label>
            <Select value={leadId} onValueChange={setLeadId}>
              <SelectTrigger id="lead">
                <SelectValue placeholder="Selecione um lead" />
              </SelectTrigger>
              <SelectContent>
                {leads.map((lead) => (
                  <SelectItem key={lead.id} value={lead.id}>
                    {lead.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="type">Tipo</Label>
            <Select value={activityType} onValueChange={(value: Activity['type']) => setActivityType(value)}>
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="follow_up">Acompanhamento</SelectItem>
                <SelectItem value="meeting">Reunião</SelectItem>
                <SelectItem value="call">Ligação</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="other">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label>Data e hora*</Label>
            <div className="grid grid-cols-2 gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "dd/MM/yyyy") : "Selecione uma data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalhes adicionais (opcional)"
              className="resize-none"
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!title || !leadId || !date || !user}
            >
              {existingActivity ? 'Atualizar' : 'Salvar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
