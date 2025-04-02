import { useMemo } from 'react';
import { useKanban } from '@/contexts/KanbanContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export function InterestDistributionChart() {
  const { interests, leads } = useKanban();

  const chartData = useMemo(() => {
    // Create distribution data
    const interestsData = interests.map(interest => {
      const interestLeads = leads.filter(lead => lead.interestId === interest.id);
      
      return {
        name: interest.name,
        value: interestLeads.length,
      };
    }).filter(item => item.value > 0); // Only include interests with leads
    
    // Add "Sem interesse" category for leads without interest
    const noInterestLeads = leads.filter(lead => !lead.interestId);
    
    if (noInterestLeads.length > 0) {
      interestsData.push({
        name: 'Sem interesse',
        value: noInterestLeads.length
      });
    }
    
    return interestsData;
  }, [interests, leads]);

  const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', 
    '#8884D8', '#82CA9D', '#FFC658', '#FF6B6B'
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-sm rounded-md">
          <p className="font-medium">{payload[0].name}: {payload[0].value} leads</p>
        </div>
      );
    }
  
    return null;
  };

  return (
    <div className="h-64 w-full">
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={1}
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-full flex items-center justify-center text-gray-500">
          Nenhum dado disponível
        </div>
      )}
    </div>
  );
}
