// src/contexts/CompanyContext.tsx

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { supabase } from "@/lib/supabase";
import { Company } from "@/types";

interface CompanyContextType {
  companies: Company[];
  currentCompany: Company | null;
  setCurrentCompany: (company: Company) => void;
  // ... other functions
  isLoading: boolean;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider = ({ children }: { children: ReactNode }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(AuthContext); // Import AuthContext

  // ... (rest of your CompanyProvider code)

  // ... (rest of your CompanyProvider code)

  const fetchCompanies = async () => {
    // ... (your fetchCompanies function)
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      // ... (your fetchCompanies function)
    };

    fetchCompanies();
  }, []);

  // ... (rest of your CompanyProvider code)

  return (
    <CompanyContext.Provider
      value={{
        companies,
        currentCompany,
        setCurrentCompany,
        isLoading,
        // ... other functions
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error("useCompany must be used within a CompanyProvider");
  }
  return context;
};

export default CompanyContext; // Export the context itself
