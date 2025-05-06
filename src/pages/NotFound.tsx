
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-5xl font-bold mb-6">404</h1>
      <p className="text-2xl font-semibold mb-2">Page Not Found</p>
      <p className="text-muted-foreground mb-8 max-w-md">
        Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild>
          <Link to="/">Return to Home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/blog">Browse Articles</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
