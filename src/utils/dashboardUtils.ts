
import { supabase } from "@/integrations/supabase/client";

export interface DashboardStat {
  id: string;
  stat_name: string;
  stat_value: string;
  stat_change: number;
  trend?: string;
  compare_text?: string;
  updated_at: string;
}

export const fetchDashboardStats = async (): Promise<DashboardStat[]> => {
  try {
    const { data, error } = await supabase
      .from('dashboard_stats')
      .select('*');
    
    if (error) {
      console.error("Error fetching dashboard stats:", error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in fetchDashboardStats:", error);
    throw error;
  }
};

export const refreshDashboardStats = async (): Promise<{ success: boolean, message: string }> => {
  try {
    // Instead of relying on an Edge Function that's failing, 
    // let's calculate new stats directly from the database tables
    
    // Fetch current stats to use as a baseline
    const { data: currentStats, error: statsError } = await supabase
      .from('dashboard_stats')
      .select('*');
      
    if (statsError) throw statsError;
    
    // Get counts from relevant tables for basic stats
    const { count: activeListingsCount, error: listingError } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'For Sale');
      
    if (listingError) throw listingError;
    
    const { count: usersCount, error: usersError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
      
    if (usersError) throw usersError;
    
    const { count: salesCount, error: salesError } = await supabase
      .from('sales')
      .select('*', { count: 'exact', head: true });
      
    if (salesError) throw salesError;
    
    // Update stats if they exist, or insert new ones if they don't
    const statsToUpdate = [
      {
        stat_name: 'active_listings',
        stat_value: activeListingsCount.toString(),
        stat_change: 0, // Calculate change later if needed
      },
      {
        stat_name: 'users_agents',
        stat_value: usersCount.toString(),
        stat_change: 0,
      },
      {
        stat_name: 'properties_sold',
        stat_value: salesCount.toString(),
        stat_change: 0,
      },
    ];
    
    // Update each stat in the database
    for (const stat of statsToUpdate) {
      const existingStat = currentStats?.find(s => s.stat_name === stat.stat_name);
      
      if (existingStat) {
        // Calculate percentage change
        const oldValue = parseInt(existingStat.stat_value) || 0;
        const newValue = parseInt(stat.stat_value) || 0;
        const percentChange = oldValue > 0 ? 
          Math.round(((newValue - oldValue) / oldValue) * 100) : 0;
        
        // Update existing stat
        const { error: updateError } = await supabase
          .from('dashboard_stats')
          .update({ 
            stat_value: stat.stat_value, 
            stat_change: percentChange,
            updated_at: new Date().toISOString() 
          })
          .eq('id', existingStat.id);
          
        if (updateError) throw updateError;
      } else {
        // Insert new stat
        const { error: insertError } = await supabase
          .from('dashboard_stats')
          .insert({ 
            ...stat,
            updated_at: new Date().toISOString() 
          });
          
        if (insertError) throw insertError;
      }
    }
    
    return { 
      success: true, 
      message: "Dashboard statistics refreshed successfully"
    };
  } catch (error: any) {
    console.error("Error in refreshDashboardStats:", error);
    return { 
      success: false, 
      message: error.message || "An unexpected error occurred"
    };
  }
};

export const findStatByName = (stats: DashboardStat[] | undefined, name: string): DashboardStat => {
  if (!stats) return { id: '', stat_name: name, stat_value: '0', stat_change: 0, updated_at: '' };
  const stat = stats.find(s => s.stat_name === name);
  return stat || { id: '', stat_name: name, stat_value: '0', stat_change: 0, updated_at: '' };
};

export const formatTrendClass = (change: number): string => {
  if (change > 0) return "text-green-500";
  if (change < 0) return "text-red-500";
  return "text-muted-foreground";
};

export const getTrendClass = (trend?: string): string => {
  switch (trend) {
    case "positive":
      return "text-green-500";
    case "negative":
      return "text-red-500";
    case "warning":
      return "text-amber-500";
    default:
      return "text-blue-500";
  }
};
