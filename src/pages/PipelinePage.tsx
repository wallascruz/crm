import { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { useKanban } from '@/contexts/KanbanContext';
import { Loader } from '@/components/auth/Loader';

export default function PipelinePage() {
  const { isLoading } = useKanban();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    // Small delay to ensure context is fully initialized
    const timer = setTimeout(() => {
      setMounted(true);
    }, 300); // Increased timeout to ensure loading is complete
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <PageLayout>
      {(!mounted || isLoading) ? (
        <div className="flex justify-center items-center h-full">
          <Loader />
        </div>
      ) : (
        <KanbanBoard />
      )}
    </PageLayout>
  );
}
