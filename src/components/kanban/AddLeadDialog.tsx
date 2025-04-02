import { useState } from 'react';
import { useKanban } from '@/contexts/KanbanContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface AddLeadDialogProps {
  stageId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddLeadDialog({ stageId, open, onOpenChange }: AddLeadDialogProps) {
  const { addLead, interests } = useKanban();
  const { user } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [interestId, setInterestId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Nome do lead é obrigatório");
      return;
    }
    
    if (!user) {
      toast.error("Usuário não autenticado");
      return;
    }

    try {
      addLead({
        name,
        email: email || undefined,
        phone: phone || undefined,
        stageId,
        interestId: interestId || undefined,
        assignedTo: user.id,
        companyId: user.companyId || '',
      });

      // Reset form
      setName('');
      setEmail('');
      setPhone('');
      setInterestId('');
      
      // Close dialog
      onOpenChange(false);
      
      toast.success(`Lead "${name}" adicionado com sucesso!`);
    } catch (error) {
      console.error("Erro ao adicionar lead:", error);
      toast.error("Erro ao adicionar lead. Tente novamente.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar novo lead</DialogTitle>
          <DialogDescription>
            Preencha os dados do novo lead. Clique em salvar quando terminar.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome do lead"
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@exemplo.com"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="phone">Telefone (WhatsApp)</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(99) 99999-9999"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="interest">Interesse principal</Label>
            <Select value={interestId} onValueChange={setInterestId}>
              <SelectTrigger id="interest">
                <SelectValue placeholder="Selecione o interesse" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhum</SelectItem>
                {interests.map((interest) => (
                  <SelectItem key={interest.id} value={interest.id}>
                    {interest.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button type="submit" disabled={!name.trim()}>
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
