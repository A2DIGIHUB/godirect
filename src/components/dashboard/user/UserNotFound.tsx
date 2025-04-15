
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HomeIcon, ArrowLeft, Search, AlertTriangle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

const UserNotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract the dashboard type from the URL
  const dashboardType = location.pathname.split('/')[1]?.split('-')[0] || 'user';
  
  // Create appropriate return paths based on user type
  const dashboardPath = `/${dashboardType}-dashboard`;
  
  // Get current route for display
  const currentRoute = location.pathname;
  
  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-3 bg-destructive/20 rounded-full">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            
            <h1 className="text-3xl font-bold">Page Not Found</h1>
            <p className="text-muted-foreground">
              The dashboard page <code className="bg-muted px-1 py-0.5 rounded">{currentRoute}</code> doesn't exist or is still under development.
            </p>
            
            <Alert className="mt-4" variant="destructive">
              <AlertTitle>Dashboard Page Not Available</AlertTitle>
              <AlertDescription>
                We're working on implementing this feature. Please check back later or contact support if you believe this is an error.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center pb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="flex gap-2 items-center w-full sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          
          <Button 
            onClick={() => navigate(dashboardPath)}
            className="flex gap-2 items-center w-full sm:w-auto"
          >
            <HomeIcon className="h-4 w-4" />
            Dashboard Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UserNotFound;
