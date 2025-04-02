import { useState, useEffect } from 'react';
import { Check, ChevronsUpDown, X, Plus, Edit, Trash } from 'lucide-react';
import { useKanban } from '@/contexts/KanbanContext';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { AddInterestDialog } from './AddInterestDialog';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export function InterestFilter() {
  const { interests, filteredInterestId, setFilteredInterestId, isLoading, deleteInterest, updateInterest } = useKanban();
  const [open, setOpen] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [editInterestId, setEditInterestId] = useState<string | null>(null);
  const [editInterestName, setEditInterestName] = useState('');
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [interestToDelete, setInterestToDelete] = useState<string | null>(null);


  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Ensure interests is an array
  const safeInterests = Array.isArray(interests) ? interests : [];

  // Get the current interest name for display
  const currentInterestName = filteredInterestId
    ? safeInterests.find((interest) => interest.id === filteredInterestId)?.name || "Interesse não encontrado"
    : "Todos os interesses";

  const handleEditInterest = (interest) => {
    setEditInterestId(interest.id);
    setEditInterestName(interest.name);
    setOpen(false);
    setShowAddDialog(true); // Reusing the AddInterestDialog for editing
  };

  const handleUpdateInterest = () => {
    if (editInterestId && editInterestName.trim()) {
      updateInterest(editInterestId, editInterestName);
      setEditInterestId(null);
      setEditInterestName('');
      setShowAddDialog(false);
      toast.success('Interesse atualizado com sucesso!');
    }
  };


  const handleDeleteConfirmation = (interestId) => {
    setInterestToDelete(interestId);
    setShowAlertDialog(true);
  };

  const handleDeleteInterest = () => {
    if (interestToDelete) {
      deleteInterest(interestToDelete);
      setInterestToDelete(null);
      setShowAlertDialog(false);
      toast.success('Interesse deletado com sucesso!');
    }
  };


  if (!isMounted || isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="w-[200px] justify-between"
          disabled
        >
          Carregando...
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="gap-1"
          disabled
        >
          <Plus className="h-4 w-4" /> Interesse
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {currentInterestName}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Buscar interesse..." />
            <CommandEmpty>Nenhum interesse encontrado.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                key="all"
                onSelect={() => {
                  setFilteredInterestId(null);
                  setOpen(false);
                }}
                className="cursor-pointer"
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    !filteredInterestId ? "opacity-100" : "opacity-0"
                  )}
                />
                <span>Todos os interesses</span>
              </CommandItem>

              {safeInterests.map((interest) => (
                <CommandItem
                  key={interest.id}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      filteredInterestId === interest.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span>{interest.name}</span>
                  <Button variant="ghost" size="icon" className="ml-auto" onClick={(e) => {
                    e.stopPropagation();
                    handleEditInterest(interest);
                  }}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="ml-2" onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteConfirmation(interest.id);
                  }}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </CommandItem>
              ))}

              <CommandItem
                key="new"
                onSelect={() => {
                  setOpen(false);
                  setShowAddDialog(true);
                  setEditInterestId(null); // Reset edit interest ID when adding new
                  setEditInterestName('');
                }}
                className="cursor-pointer border-t mt-1 pt-1 text-primary"
              >
                <Plus className="mr-2 h-4 w-4" />
                <span>Adicionar novo interesse</span>
              </CommandItem>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {filteredInterestId && (
        <Badge
          variant="secondary"
          className="gap-1 cursor-pointer hover:bg-secondary/80"
          onClick={() => setFilteredInterestId(null)}
        >
          {safeInterests.find((interest) => interest.id === filteredInterestId)?.name || "Interesse"}
          <X className="h-3 w-3" />
        </Badge>
      )}

      <Button
        size="sm"
        variant="outline"
        className="gap-1"
        onClick={() => {
          setShowAddDialog(true);
          setEditInterestId(null); // Ensure add dialog is in add mode
          setEditInterestName('');
        }}
      >
        <Plus className="h-4 w-4" /> Interesse
      </Button>

      <AddInterestDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        existingInterestId={editInterestId}
        existingInterestName={editInterestName}
        onSave={handleUpdateInterest}
      />

      <AlertDialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza de que deseja excluir este interesse? Leads associados a este interesse ficarão sem categoria.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowAlertDialog(false);
              setInterestToDelete(null);
            }}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteInterest}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
