import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Building2, 
  Users, 
  DollarSign, 
  CheckSquare, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Landmark,
  BarChart3,
  PieChart,
  Calendar,
  RefreshCw
} from 'lucide-react';
import { formatCurrency } from '@/utils/formatUtils';

export default function AnalyticsPanel() {
  // Fetch dashboard stats from Supabase
  const { 
    data: dashboardStats, 
    isLoading: statsLoading, 
    error: statsError,
    refetch: refetchStats
  } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dashboard_stats')
        .select('*');
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data;
    }
  });
  
  // Fetch revenue metrics
  const { 
    data: revenueMetrics, 
    isLoading: isLoadingRevenue 
  } = useQuery({
    queryKey: ['revenueMetrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('revenue_metrics')
        .select('*')
        .order('metric_date', { ascending: false })
        .limit(30);
      
      if (error) throw error;
      
      const metrics = data?.[0] || {};
      return {
        totalRevenue: formatCurrency(metrics.revenue || 0),
        commissions: formatCurrency((metrics.revenue || 0) * 0.09),
        expenses: formatCurrency((metrics.revenue || 0) * 0.03),
        profitMargin: `${metrics.completion_percentage?.toFixed(1) || 0}%`,
        revenueChange: metrics.change_percentage || 0,
        commissionChange: (metrics.change_percentage || 0) * 0.9,
        expenseChange: (metrics.change_percentage || 0) * 0.4,
        marginChange: (metrics.change_percentage || 0) * 0.2
      };
    }
  });

  // Fetch payment method stats
  const { 
    data: paymentMethodStats, 
    isLoading: paymentsLoading 
  } = useQuery({
    queryKey: ['paymentMethodStats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payment_method_stats')
        .select('*, payment_methods(display_name, icon_name)')
        .order('transaction_count', { ascending: false });
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data;
    }
  });

  // Fetch sold properties
  const { 
    data: soldProperties,
    isLoading: propertiesLoading 
  } = useQuery({
    queryKey: ['soldProperties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sales')
        .select('*, properties(*), agents(name)')
        .eq('status', 'Completed')
        .order('sale_date', { ascending: false })
        .limit(5);
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data;
    }
  });

  const isLoading = statsLoading || revenueLoading || paymentsLoading || propertiesLoading;
  const hasError = statsError;

  // Find specific stats by name
  const findStatByName = (name) => {
    if (!dashboardStats) return { stat_value: '0', stat_change: 0 };
    const stat = dashboardStats.find(s => s.stat_name === name);
    return stat || { stat_value: '0', stat_change: 0 };
  };

  // Format stats with the right icons and colors
  const totalRevenue = findStatByName('total_revenue');
  const activeListings = findStatByName('active_listings');
  const usersAgents = findStatByName('users_agents');
  const paymentApprovals = findStatByName('payment_approvals');
  const propertiesSold = findStatByName('properties_sold');

  const formatTrendIcon = (change) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return null;
  };

  const formatTrendClass = (change) => {
    if (change > 0) return "text-green-500";
    if (change < 0) return "text-red-500";
    return "text-muted-foreground";
  };

  // Handle refresh button click
  const handleRefresh = async () => {
    try {
      // Invoke edge function to refresh stats
      await supabase.functions.invoke('calculate-dashboard-stats');
      // Refetch the data
      refetchStats();
    } catch (error) {
      console.error("Error refreshing dashboard:", error);
    }
  };

  const DailyMetricsContent = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-muted/30 p-4 rounded-lg">
        <p className="text-sm text-muted-foreground">Today's Revenue</p>
        <p className="text-2xl font-bold">{formatCurrency(24500)}</p>
        <div className="flex items-center mt-2 text-xs text-green-500">
          <TrendingUp className="h-3 w-3 mr-1" />
          <span>+12% from yesterday</span>
        </div>
      </div>
      
      <div className="bg-muted/30 p-4 rounded-lg">
        <p className="text-sm text-muted-foreground">Properties Viewed</p>
        <p className="text-2xl font-bold">342</p>
        <div className="flex items-center mt-2 text-xs text-green-500">
          <TrendingUp className="h-3 w-3 mr-1" />
          <span>+5% from yesterday</span>
        </div>
      </div>
      
      <div className="bg-muted/30 p-4 rounded-lg">
        <p className="text-sm text-muted-foreground">New Inquiries</p>
        <p className="text-2xl font-bold">28</p>
        <div className="flex items-center mt-2 text-xs text-red-500">
          <TrendingDown className="h-3 w-3 mr-1" />
          <span>-3% from yesterday</span>
        </div>
      </div>
    </div>
  );

  const MonthlyMetricsContent = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-muted/30 p-4 rounded-lg">
        <p className="text-sm text-muted-foreground">Month Revenue</p>
        <p className="text-2xl font-bold">{formatCurrency(493200)}</p>
        <div className="flex items-center mt-2 text-xs text-green-500">
          <TrendingUp className="h-3 w-3 mr-1" />
          <span>+8% from last month</span>
        </div>
      </div>
      
      <div className="bg-muted/30 p-4 rounded-lg">
        <p className="text-sm text-muted-foreground">Properties Sold</p>
        <p className="text-2xl font-bold">42</p>
        <div className="flex items-center mt-2 text-xs text-green-500">
          <TrendingUp className="h-3 w-3 mr-1" />
          <span>+12% from last month</span>
        </div>
      </div>
      
      <div className="bg-muted/30 p-4 rounded-lg">
        <p className="text-sm text-muted-foreground">Average Price</p>
        <p className="text-2xl font-bold">{formatCurrency(383000)}</p>
        <div className="flex items-center mt-2 text-xs text-red-500">
          <TrendingDown className="h-3 w-3 mr-1" />
          <span>-2% from last month</span>
        </div>
      </div>
    </div>
  );

  const YearlyMetricsContent = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-muted/30 p-4 rounded-lg">
        <p className="text-sm text-muted-foreground">Annual Revenue</p>
        <p className="text-2xl font-bold">{formatCurrency(5200000)}</p>
        <div className="flex items-center mt-2 text-xs text-green-500">
          <TrendingUp className="h-3 w-3 mr-1" />
          <span>+15% from last year</span>
        </div>
      </div>
      
      <div className="bg-muted/30 p-4 rounded-lg">
        <p className="text-sm text-muted-foreground">Total Properties Sold</p>
        <p className="text-2xl font-bold">482</p>
        <div className="flex items-center mt-2 text-xs text-green-500">
          <TrendingUp className="h-3 w-3 mr-1" />
          <span>+9% from last year</span>
        </div>
      </div>
      
      <div className="bg-muted/30 p-4 rounded-lg">
        <p className="text-sm text-muted-foreground">Market Share</p>
        <p className="text-2xl font-bold">24.3%</p>
        <div className="flex items-center mt-2 text-xs text-green-500">
          <TrendingUp className="h-3 w-3 mr-1" />
          <span>+2.1% from last year</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground">
            Welcome to your admin dashboard, here's what's happening with your properties.
          </p>
        </div>
        <Button onClick={handleRefresh} disabled={isLoading} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh Data
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-2">
              <div className="flex flex-col">
                <span className="text-muted-foreground text-sm">Total Revenue</span>
                {isLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold">{totalRevenue.stat_value}</span>
                    <span className={`text-xs flex items-center ${formatTrendClass(totalRevenue.stat_change)}`}>
                      {formatTrendIcon(totalRevenue.stat_change)} {totalRevenue.stat_change}%
                    </span>
                  </div>
                )}
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-2">
              <div className="flex flex-col">
                <span className="text-muted-foreground text-sm">Active Listings</span>
                {isLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold">{activeListings.stat_value}</span>
                    <span className={`text-xs flex items-center ${formatTrendClass(activeListings.stat_change)}`}>
                      {formatTrendIcon(activeListings.stat_change)} {activeListings.stat_change}%
                    </span>
                  </div>
                )}
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-2">
              <div className="flex flex-col">
                <span className="text-muted-foreground text-sm">Users & Agents</span>
                {isLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold">{usersAgents.stat_value}</span>
                    <span className={`text-xs flex items-center ${formatTrendClass(usersAgents.stat_change)}`}>
                      {formatTrendIcon(usersAgents.stat_change)} {usersAgents.stat_change}%
                    </span>
                  </div>
                )}
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-2">
              <div className="flex flex-col">
                <span className="text-muted-foreground text-sm">Payment Approvals</span>
                {isLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold">{paymentApprovals.stat_value}</span>
                    <span className={`text-xs flex items-center ${formatTrendClass(paymentApprovals.stat_change)}`}>
                      {formatTrendIcon(paymentApprovals.stat_change)} {paymentApprovals.stat_change}%
                    </span>
                  </div>
                )}
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <CheckSquare className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-2">
              <div className="flex flex-col">
                <span className="text-muted-foreground text-sm">Properties Sold</span>
                {isLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold">{propertiesSold.stat_value}</span>
                    <span className={`text-xs flex items-center ${formatTrendClass(propertiesSold.stat_change)}`}>
                      {formatTrendIcon(propertiesSold.stat_change)} {propertiesSold.stat_change}%
                    </span>
                  </div>
                )}
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Landmark className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {hasError && (
        <Card className="bg-destructive/10 border-destructive">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="text-destructive h-5 w-5" />
            <p className="text-destructive">Failed to load dashboard data. Please try refreshing.</p>
          </CardContent>
        </Card>
      )}

      {/* Revenue Analysis */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Revenue Analysis</CardTitle>
            <CardDescription>Breakdown of revenue sources and trends</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-[200px] w-full" />
                <div className="flex gap-2 mt-4">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="h-[200px] w-full flex items-center justify-center bg-muted/20 rounded-md">
                  <BarChart3 className="h-10 w-10 text-muted" />
                  <span className="ml-2 text-muted-foreground">Revenue chart visualization</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Residential Sales</span>
                    <span>58.5%</span>
                  </div>
                  <Progress value={58.5} className="h-2" />
                  
                  <div className="flex justify-between text-sm">
                    <span>Commercial Sales</span>
                    <span>26.3%</span>
                  </div>
                  <Progress value={26.3} className="h-2" />
                  
                  <div className="flex justify-between text-sm">
                    <span>Land Sales</span>
                    <span>15.2%</span>
                  </div>
                  <Progress value={15.2} className="h-2" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>Latest property transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading || !soldProperties ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <div className="space-y-4">
                {soldProperties.length > 0 ? (
                  <div className="divide-y">
                    {soldProperties.map((sale) => (
                      <div key={sale.id} className="py-3 flex justify-between items-center">
                        <div>
                          <p className="font-medium">{sale.properties?.title || 'Unknown Property'}</p>
                          <p className="text-sm text-muted-foreground">
                            Agent: {sale.agents?.name || 'Unassigned'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${(sale.sale_price / 1000).toFixed(1)}k</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(sale.sale_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-6">No recent sales found</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="daily">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="daily" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Daily</span>
            </TabsTrigger>
            <TabsTrigger value="monthly" className="flex items-center gap-1">
              <BarChart3 className="h-4 w-4" />
              <span>Monthly</span>
            </TabsTrigger>
            <TabsTrigger value="yearly" className="flex items-center gap-1">
              <PieChart className="h-4 w-4" />
              <span>Yearly</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="daily" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Metrics</CardTitle>
              <CardDescription>Performance for the current day</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <div className="space-y-8">
                  <DailyMetricsContent />
                  
                  <div className="h-[200px] w-full flex items-center justify-center bg-muted/20 rounded-md">
                    <BarChart3 className="h-10 w-10 text-muted" />
                    <span className="ml-2 text-muted-foreground">Daily traffic chart visualization</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue</CardTitle>
              <CardDescription>Performance for the current month</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <div className="space-y-8">
                  <MonthlyMetricsContent />
                  
                  <div className="h-[200px] w-full flex items-center justify-center bg-muted/20 rounded-md">
                    <BarChart3 className="h-10 w-10 text-muted" />
                    <span className="ml-2 text-muted-foreground">Monthly sales chart visualization</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="yearly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Yearly Overview</CardTitle>
              <CardDescription>Annual performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <div className="space-y-8">
                  <YearlyMetricsContent />
                  
                  <div className="h-[200px] w-full flex items-center justify-center bg-muted/20 rounded-md">
                    <PieChart className="h-10 w-10 text-muted" />
                    <span className="ml-2 text-muted-foreground">Yearly performance chart visualization</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
