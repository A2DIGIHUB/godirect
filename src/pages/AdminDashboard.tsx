
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AdminDashboardOverview from "@/components/dashboard/admin/AdminDashboardOverview";
import AdminAgents from "@/components/dashboard/admin/AdminAgents";
import AdminProperties from "@/components/dashboard/admin/AdminProperties";
import AdminSales from "@/components/dashboard/admin/AdminSales";
import AdminUsers from "@/components/dashboard/admin/AdminUsers";
import AdminSettings from "@/components/dashboard/admin/AdminSettings";
import AdminProfile from "@/components/dashboard/admin/AdminProfile";
import AnalyticsPanel from "@/components/dashboard/analytics/AnalyticsPanel";
import { FinancialManagement } from "@/components/dashboard/financial/FinancialManagement";
import PaymentProcessing from "@/components/dashboard/admin/PaymentProcessing";
import { PaymentConfiguration } from "@/components/dashboard/admin/PaymentConfiguration";
import PaymentMethodSetup from "@/components/dashboard/admin/PaymentMethodSetup";
import LegalCompliance from "@/components/dashboard/legal/LegalCompliance";
import SupportCenter from "@/components/dashboard/admin/SupportCenter";
import SystemConfiguration from "@/components/dashboard/admin/SystemConfiguration";
import UserNotFound from "@/components/dashboard/user/UserNotFound";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { refreshDashboardStats } from "@/utils/dashboardUtils";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export default function AdminDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [connectionError, setConnectionError] = useState(false);

  // Extract section from path instead of query parameters
  const pathSegments = location.pathname.split('/');
  let currentSection = pathSegments[pathSegments.length - 1];
  
  // If we're at the root of admin-dashboard, set default section
  if (currentSection === "admin-dashboard") {
    currentSection = "overview";
  }

  // Check connection status to Supabase
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { error } = await supabase.from('dashboard_stats').select('id').limit(1);
        setConnectionError(!!error);
        if (error) {
          console.error("Connection error:", error);
          toast({
            title: "Connection issue detected",
            description: "There seems to be a problem connecting to the database",
            variant: "destructive"
          });
        }
      } catch (err) {
        console.error("Connection check failed:", err);
        setConnectionError(true);
      }
    };
    
    checkConnection();
  }, [toast]);

  useEffect(() => {
    const refreshData = async () => {
      setIsLoading(true);
      try {
        const result = await refreshDashboardStats();
        
        if (!result.success) {
          console.error("Error refreshing dashboard stats:", result.message);
          toast({
            title: "Error refreshing data",
            description: "Failed to fetch the latest dashboard statistics",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Dashboard refreshed",
            description: "Latest statistics have been loaded",
          });
        }
      } catch (err) {
        console.error("Failed to refresh dashboard stats:", err);
        toast({
          title: "Error refreshing data", 
          description: "An unexpected error occurred",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Refresh dashboard stats when overview or analytics section is loaded
    if (currentSection === "overview" || currentSection === "analytics" || currentSection === "financial") {
      refreshData();
    }
  }, [currentSection, toast]);

  // Define available sections
  const sections = {
    overview: <AdminDashboardOverview />,
    analytics: <AnalyticsPanel />,
    properties: <AdminProperties />,
    users: <AdminUsers />,
    agents: <AdminAgents />,
    sales: <AdminSales />,
    financial: <FinancialManagement />,
    payments: <PaymentProcessing />,
    "payment-config": <PaymentConfiguration />,
    "payment-methods": <PaymentMethodSetup />,
    legal: <LegalCompliance />,
    settings: <AdminSettings />,
    profile: <AdminProfile />,
    support: <SupportCenter />,
    system: <SystemConfiguration />,
    // Improved placeholders for missing routes
    "email-templates": <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Email Templates</h1>
      <p className="mb-4">Email template management interface will be available soon.</p>
      <p className="text-muted-foreground">This page is currently under development. We're working to bring you a comprehensive email template management system soon.</p>
    </div>,
    "platform-settings": <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Platform Settings</h1>
      <p className="mb-4">Platform configuration settings will be available soon.</p>
      <p className="text-muted-foreground">We're currently working on implementing global platform settings. Check back soon for updates.</p>
    </div>,
    "maintenance": <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">System Maintenance</h1>
      <p className="mb-4">System maintenance tools will be available soon.</p>
      <p className="text-muted-foreground">Our team is developing system maintenance tools to help you manage your platform effectively.</p>
    </div>,
    "support-tickets": <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Support Tickets</h1>
      <p className="mb-4">Support ticket management will be available soon.</p>
      <p className="text-muted-foreground">We're implementing a comprehensive support ticket system to help you manage customer inquiries.</p>
    </div>,
    "knowledge-base": <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Knowledge Base</h1>
      <p className="mb-4">Knowledge base articles will be available soon.</p>
      <p className="text-muted-foreground">We're working on a knowledge base system to help your users find information quickly and easily.</p>
    </div>,
    "team-chat": <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Team Chat</h1>
      <p className="mb-4">Team chat interface will be available soon.</p>
      <p className="text-muted-foreground">Our developers are implementing a comprehensive team communication system.</p>
    </div>,
    "reports": <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Reports</h1>
      <p className="mb-4">Reporting dashboard will be available soon.</p>
      <p className="text-muted-foreground">We're developing advanced reporting capabilities to give you insights into your business.</p>
    </div>,
    "notifications": <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Notifications</h1>
      <p className="mb-4">Notification settings and history will be available soon.</p>
      <p className="text-muted-foreground">We're working on a comprehensive notification system to keep users informed.</p>
    </div>,
  };

  // Show connection error if there's a problem
  if (connectionError) {
    return (
      <DashboardLayout userType="admin">
        <div className="p-6 space-y-4">
          <Alert variant="destructive" className="mb-6">
            <AlertTitle className="flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Connection Error
            </AlertTitle>
            <AlertDescription>
              Could not connect to the database. Please check your connection and try again.
            </AlertDescription>
          </Alert>
          <Button onClick={() => window.location.reload()} variant="default">
            Retry Connection
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      userType="admin"
      children={sections[currentSection as keyof typeof sections] || <UserNotFound />}
    />
  );
}
