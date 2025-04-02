import { useMemo } from 'react';
import { useKanban } from '@/contexts/KanbanContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';

export function StageProgressChart() {
  const { stages, leads } = useKanban();

  const chartData = useMemo(() => {
    // Sort stages by order
    const sortedStages = [...stages].sort((a, b) => a.order - b.order);
    
    // Create chart data
    return sortedStages.map(stage => {
      const stageLeads = leads.filter(lead => lead.stageId === stage.id);
      
      return {
        name: stage.name,
        value: stageLeads.length,
        color: stage.color || '#64748b'
      };
    });
  }, [stages, leads]);

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
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <XAxis 
            dataKey="name"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            hide={true}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
            <LabelList dataKey="value" position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
