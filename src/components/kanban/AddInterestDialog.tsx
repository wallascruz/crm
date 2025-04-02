import { useState, useEffect } from 'react';
import { useKanban } from '@/contexts/KanbanContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AddInterestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingInterestId?: string | null;
  existingInterestName?: string;
  onSave?: () => void;
}

export function AddInterestDialog({ open, onOpenChange, existingInterestId, existingInterestName, onSave }: AddInterestDialogProps) {
  const { addInterest } = useKanban();
  const [name, setName] = useState('');
  const isEditing = !!existingInterestId;

  useEffect(() => {
    if (existingInterestName) {
      setName(existingInterestName);
    } else {
      setName('');
    }
  }, [existingInterestName]);


  const handleSubmit = () => {
    if (name.trim()) {
      if (isEditing && onSave) {
        onSave(); // Call the onSave prop for editing
      } else {
        addInterest(name); // Call addInterest for new interest
      }
      setName('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar interesse' : 'Adicionar novo interesse'}</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <Label htmlFor="interestName">Nome do interesse</Label>
          <Input
            id="interestName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite o nome do interesse"
            className="mt-1"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit();
            }}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!name.trim()}
          >
            {isEditing ? 'Salvar Edição' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
