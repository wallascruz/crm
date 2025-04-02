// src/contexts/KanbanContext.tsx

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from "@/lib/supabase";
import { Stage, Lead, Interest, Note, Activity, LogEntry } from '@/types';
import { useCompany } from './CompanyContext';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

// ... (other imports)

interface KanbanContextType {
  // ... (your interface)
  stages: Stage[];
  interests: Interest[];
  leads: Lead[];
  // ... other properties
  isLoading: boolean;

  // ... (your functions)
}

const KanbanContext = createContext<KanbanContextType | undefined>(undefined);

export const KanbanProvider = ({ children }: { children: ReactNode }) => {
  // ... (your state variables)

  return (
    <KanbanContext.Provider
      value={{
        stages,
        interests,
        leads,
        // ... other properties
        isLoading,
        // ... other functions
      }}
    >
      {children}
    </KanbanContext.Provider>
  );
};

// Correctly export the custom hook
export const useKanban = () => {
  const context = useContext(KanbanContext);
  if (!context) {
    throw new Error("useKanban must be used within a KanbanProvider");
  }
  return context;
};

export default KanbanContext; // Export the context itself
