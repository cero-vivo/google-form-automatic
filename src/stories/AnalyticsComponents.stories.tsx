import type { Meta, StoryObj } from '@storybook/react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  FileText, 
  CheckCircle, 
  Clock, 
  BarChart3, 
  PieChart,
  Activity,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const meta: Meta = {
  title: 'Form Creation/Analytics',
  parameters: {
    docs: {
      description: {
        component: 'Componentes de análisis y estadísticas para formularios',
      },
    },
  },
};

export default meta;

// Datos de ejemplo
const analyticsData = {
  totalResponses: 1247,
  completionRate: 78.5,
  averageTime: '3:42',
  dailyResponses: [
    { day: 'Lun', responses: 89 },
    { day: 'Mar', responses: 156 },
    { day: 'Mié', responses: 134 },
    { day: 'Jue', responses: 198 },
    { day: 'Vie', responses: 245 },
    { day: 'Sáb', responses: 312 },
    { day: 'Dom', responses: 213 },
  ],
  questionStats: [
    { question: '¿Recomendarías nuestro servicio?', responses: 1247, completion: 95.2 },
    { question: '¿Cuál es tu edad?', responses: 1189, completion: 90.7 },
    { question: '¿Cómo nos conociste?', responses: 1123, completion: 85.8 },
    { question: '¿Qué tan satisfecho estás?', responses: 1098, completion: 83.9 },
  ],
  responseSources: [
    { source: 'Directo', percentage: 45, color: 'bg-velocity-500' },
    { source: 'Email', percentage: 32, color: 'bg-forms-500' },
    { source: 'Redes sociales', percentage: 15, color: 'bg-excel-500' },
    { source: 'Otros', percentage: 8, color: 'bg-neutral-500' },
  ],
};

const StatCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  trend 
}: { 
  title: string; 
  value: string | number; 
  change?: string; 
  icon: any; 
  trend?: 'up' | 'down' | 'neutral';
}) => (
  <Card className="border-border bg-background">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium font-poppins text-muted-foreground">
        {title}
      </CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold font-poppins text-foreground">{value}</div>
      {change && (
        <div className="flex items-center text-xs text-muted-foreground font-inter">
          {trend === 'up' && <TrendingUp className="h-3 w-3 mr-1 text-excel-500" />}
          {trend === 'down' && <TrendingDown className="h-3 w-3 mr-1 text-velocity-500" />}
          <span className={trend === 'up' ? 'text-excel-500' : trend === 'down' ? 'text-velocity-500' : ''}>
            {change}
          </span>
        </div>
      )}
    </CardContent>
  </Card>
);

const ProgressBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-sm">
      <span className="font-medium text-foreground font-inter">{label}</span>
      <span className="text-muted-foreground font-inter">{value}%</span>
    </div>
    <Progress value={value} className={`h-2 ${color}`} />
  </div>
);

export const Overview: StoryObj = {
  render: () => (
    <div className="space-y-6 font-sans max-w-7xl">
      <div>
        <h2 className="text-2xl font-bold text-foreground font-poppins mb-4">Resumen de métricas</h2>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Total respuestas" 
            value={analyticsData.totalResponses} 
            change="+12.5% vs semana pasada" 
            icon={Users} 
            trend="up" 
          />
          <StatCard 
            title="Tasa de finalización" 
            value={`${analyticsData.completionRate}%`} 
            change="+5.2% vs semana pasada" 
            icon={CheckCircle} 
            trend="up" 
          />
          <StatCard 
            title="Tiempo promedio" 
            value={analyticsData.averageTime} 
            change="-0:45 vs semana pasada" 
            icon={Clock} 
            trend="up" 
          />
          <StatCard 
            title="Respuestas hoy" 
            value="89" 
            change="+23 vs ayer" 
            icon={Activity} 
            trend="up" 
          />
        </div>
      </div>
    </div>
  ),
};

export const ResponseChart: StoryObj = {
  render: () => (
    <div className="space-y-6 font-sans max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-foreground font-poppins mb-4">Respuestas por día</h2>
        
        <Card className="border-border bg-background">
          <CardHeader>
            <CardTitle className="text-lg font-poppins">Actividad de la última semana</CardTitle>
            <CardDescription className="font-inter">
              Respuestas recibidas cada día
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.dailyResponses.map((day, index) => {
                const maxResponses = Math.max(...analyticsData.dailyResponses.map(d => d.responses));
                const percentage = (day.responses / maxResponses) * 100;
                
                return (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-12 text-sm font-medium text-foreground font-inter">{day.day}</div>
                    <div className="flex-1">
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-velocity-500 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                    <div className="w-12 text-sm text-muted-foreground font-inter">{day.responses}</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  ),
};

export const QuestionPerformance: StoryObj = {
  render: () => (
    <div className="space-y-6 font-sans max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-foreground font-poppins mb-4">Desempeño por pregunta</h2>
        
        <Card className="border-border bg-background">
          <CardHeader>
            <CardTitle className="text-lg font-poppins">Tasa de respuesta por pregunta</CardTitle>
            <CardDescription className="font-inter">
              Identifica preguntas problemáticas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {analyticsData.questionStats.map((stat, index) => (
              <ProgressBar 
                key={index}
                label={stat.question}
                value={stat.completion}
                color={stat.completion > 90 ? 'bg-excel-500' : stat.completion > 80 ? 'bg-forms-500' : 'bg-velocity-500'}
              />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  ),
};

export const ResponseSources: StoryObj = {
  render: () => (
    <div className="space-y-6 font-sans max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-foreground font-poppins mb-4">Fuentes de respuesta</h2>
        
        <Card className="border-border bg-background">
          <CardHeader>
            <CardTitle className="text-lg font-poppins">Distribución de fuentes</CardTitle>
            <CardDescription className="font-inter">
              Cómo llegan los usuarios a tu formulario
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.responseSources.map((source, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-32 text-sm font-medium text-foreground font-inter">{source.source}</div>
                  <div className="flex-1">
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`${source.color} h-2 rounded-full transition-all duration-300`} 
                        style={{ width: `${source.percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-12 text-sm text-muted-foreground font-inter">{source.percentage}%</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  ),
};

export const RealTimeMetrics: StoryObj = {
  render: () => (
    <div className="space-y-6 font-sans max-w-7xl">
      <div>
        <h2 className="text-2xl font-bold text-foreground font-poppins mb-4">Métricas en tiempo real</h2>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview" className="font-poppins">Resumen</TabsTrigger>
            <TabsTrigger value="live" className="font-poppins">En vivo</TabsTrigger>
            <TabsTrigger value="trends" className="font-poppins">Tendencias</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="border-border bg-background">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-velocity-500 font-poppins">12</div>
                    <div className="text-sm text-muted-foreground font-inter">Respuestas última hora</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-border bg-background">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-forms-500 font-poppins">89%</div>
                    <div className="text-sm text-muted-foreground font-inter">Tasa actual</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-border bg-background">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-excel-500 font-poppins">2:34</div>
                    <div className="text-sm text-muted-foreground font-inter">Tiempo promedio</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-border bg-background">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-neutral-500 font-poppins">3</div>
                    <div className="text-sm text-muted-foreground font-inter">Abandonos</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="live" className="space-y-4">
            <Card className="border-border bg-background">
              <CardHeader>
                <CardTitle className="flex items-center text-lg font-poppins">
                  <Activity className="w-5 h-5 mr-2 text-velocity-500 animate-pulse" />
                  Actividad en tiempo real
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-velocity-50 rounded-lg">
                    <div className="w-2 h-2 bg-velocity-500 rounded-full animate-pulse" />
                    <span className="text-sm font-inter">Usuario #1248 completó el formulario (2:15)</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-forms-50 rounded-lg">
                    <div className="w-2 h-2 bg-forms-500 rounded-full animate-pulse" />
                    <span className="text-sm font-inter">Usuario #1249 en progreso (pregunta 3/5)</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-excel-50 rounded-lg">
                    <div className="w-2 h-2 bg-excel-500 rounded-full animate-pulse" />
                    <span className="text-sm font-inter">Usuario #1250 inició el formulario</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="trends" className="space-y-4">
            <Card className="border-border bg-background">
              <CardHeader>
                <CardTitle className="text-lg font-poppins">Tendencias semanales</CardTitle>
                <CardDescription className="font-inter">
                  Comparación con la semana anterior
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-excel-50 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-foreground font-inter">Respuestas totales</div>
                      <div className="text-2xl font-bold text-excel-600 font-poppins">+18.5%</div>
                    </div>
                    <TrendingUp className="w-8 h-8 text-excel-500" />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-forms-50 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-foreground font-inter">Tasa de finalización</div>
                      <div className="text-2xl font-bold text-forms-600 font-poppins">+7.2%</div>
                    </div>
                    <TrendingUp className="w-8 h-8 text-forms-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  ),
};