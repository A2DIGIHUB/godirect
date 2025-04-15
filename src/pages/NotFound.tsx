
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { HomeIcon, ArrowLeft, AlertTriangle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboardPath = location.pathname.includes("dashboard");

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const goBack = () => navigate(-1);
  const goHome = () => {
    if (isDashboardPath) {
      // Extract the dashboard type from the path
      const dashboardType = location.pathname.split('/')[1]?.split('-')[0] || 'user';
      navigate(`/${dashboardType}-dashboard`);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full shadow-lg">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-3 bg-destructive/20 rounded-full">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            
            <h1 className="text-4xl font-bold">404</h1>
            <p className="text-xl text-muted-foreground">Page not found</p>
            
            <Alert className="mt-4" variant="destructive">
              <AlertTitle>Page Not Available</AlertTitle>
              <AlertDescription>
                The page you are looking for doesn't exist or has been moved.
                <br />
                <code className="bg-muted/60 px-1 py-0.5 rounded text-xs mt-2 inline-block">
                  {location.pathname}
                </code>
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center pb-6">
          <Button variant="outline" onClick={goBack} className="flex gap-2 items-center w-full sm:w-auto">
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          <Button onClick={goHome} className="flex gap-2 items-center w-full sm:w-auto">
            <HomeIcon className="h-4 w-4" />
            {isDashboardPath ? "Return to Dashboard" : "Return Home"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NotFound;
