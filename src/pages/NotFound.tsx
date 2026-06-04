import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <Layout>
      <div className="container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <p className="font-display text-8xl font-bold text-accent/30">404</p>
        <h1 className="mt-4 font-display text-2xl font-bold text-foreground md:text-3xl">
          Η σελίδα δεν βρέθηκε
        </h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          Η διεύθυνση <code className="rounded bg-muted px-1.5 py-0.5 text-sm">{location.pathname}</code> δεν υπάρχει.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild className="cursor-pointer">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Αρχική σελίδα
            </Link>
          </Button>
          <Button variant="outline" className="cursor-pointer" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Πίσω
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
