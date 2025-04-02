import { PageLayout } from '@/components/layout/PageLayout';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { StageProgressChart } from '@/components/dashboard/StageProgressChart';
import { InterestDistributionChart } from '@/components/dashboard/InterestDistributionChart';
import { RecentLeads } from '@/components/dashboard/RecentLeads';
import { RecentActivities } from '@/components/dashboard/RecentActivities';

export default function DashboardPage() {
  return (
    <PageLayout>
      <div className="flex flex-col space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        
        <DashboardStats />
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-medium mb-4">Estágios do Pipeline</h2>
              <StageProgressChart />
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-medium mb-4">Distribuição por Interesse</h2>
              <InterestDistributionChart />
            </div>
          </div>
          
          <div className="space-y-6">
            <RecentActivities />
            <RecentLeads />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
