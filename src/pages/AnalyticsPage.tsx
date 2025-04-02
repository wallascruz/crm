import React from 'react';
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, PieChart } from "lucide-react";
import { useKanban } from "@/contexts/KanbanContext";
import { 
  BarChart as RechartsBarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line, 
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export default function AnalyticsPage() {
  const { stages, leads, interests } = useKanban();

  // Prepare data for stage distribution chart
  const stageData = stages.map(stage => {
    const count = leads.filter(lead => lead.stageId === stage.id).length;
    return {
      name: stage.name,
      value: count,
      color: stage.color || '#8884d8'
    };
  });

  // Prepare data for interest distribution chart
  const interestData = interests.map(interest => {
    const count = leads.filter(lead => lead.interestId === interest.id).length;
    return {
      name: interest.name,
      value: count,
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`
    };
  });

  // Mock performance data
  const performanceData = [
    { month: 'Jan', leads: 4, conversions: 1 },
    { month: 'Fev', leads: 7, conversions: 2 },
    { month: 'Mar', leads: 5, conversions: 2 },
    { month: 'Abr', leads: 8, conversions: 3 },
    { month: 'Mai', leads: 12, conversions: 4 },
    { month: 'Jun', leads: 10, conversions: 3 },
  ];

  // Mock conversion rate data
  const conversionData = stages.map((stage, index) => {
    // Create decreasing conversion rates as we move through stages
    const conversionRate = 100 - (index * (100 / (stages.length + 1)));
    return {
      name: stage.name,
      rate: conversionRate,
      color: stage.color || '#8884d8'
    };
  });

  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Análises</h1>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center">
              <BarChart className="mr-2 h-4 w-4" />
              <span>Visão Geral</span>
            </TabsTrigger>
            <TabsTrigger value="conversion" className="flex items-center">
              <LineChart className="mr-2 h-4 w-4" />
              <span>Conversão</span>
            </TabsTrigger>
            <TabsTrigger value="distribution" className="flex items-center">
              <PieChart className="mr-2 h-4 w-4" />
              <span>Distribuição</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Leads Totais</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{leads.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">+12% em relação ao mês passado</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24.3%</div>
                  <p className="text-xs text-muted-foreground mt-1">+2.1% em relação ao mês passado</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Leads Estagnados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">18</div>
                  <p className="text-xs text-muted-foreground mt-1">-5% em relação ao mês passado</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Estágios do Pipeline</CardTitle>
                  <CardDescription>Distribuição de leads por estágio</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={stageData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Leads">
                        {stageData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Performance por Período</CardTitle>
                  <CardDescription>Comparativo mensal</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart
                      data={performanceData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="leads" stroke="#8884d8" activeDot={{ r: 8 }} name="Leads" />
                      <Line type="monotone" dataKey="conversions" stroke="#82ca9d" name="Conversões" />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="conversion" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Taxa de Conversão por Estágio</CardTitle>
                <CardDescription>Análise detalhada do progresso dos leads</CardDescription>
              </CardHeader>
              <CardContent className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={conversionData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis unit="%" />
                    <Tooltip formatter={(value) => [`${value}%`, 'Taxa de Conversão']} />
                    <Legend />
                    <Bar dataKey="rate" name="Taxa de Conversão">
                      {conversionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </RechartsBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="distribution" className="space-y-4 mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição por Interesse</CardTitle>
                  <CardDescription>Segmentação de leads</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={interestData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {interestData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name, props) => [value, props.payload.name]} />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição por Origem</CardTitle>
                  <CardDescription>Fonte de captação</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={[
                          { name: 'Website', value: 35, color: '#FF6384' },
                          { name: 'Redes Sociais', value: 25, color: '#36A2EB' },
                          { name: 'Indicação', value: 20, color: '#FFCE56' },
                          { name: 'Email', value: 15, color: '#4BC0C0' },
                          { name: 'Outros', value: 5, color: '#9966FF' }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {[
                          { name: 'Website', value: 35, color: '#FF6384' },
                          { name: 'Redes Sociais', value: 25, color: '#36A2EB' },
                          { name: 'Indicação', value: 20, color: '#FFCE56' },
                          { name: 'Email', value: 15, color: '#4BC0C0' },
                          { name: 'Outros', value: 5, color: '#9966FF' }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}
