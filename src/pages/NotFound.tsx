import { Link } from "react-router-dom";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="text-brand-orange font-bold tracking-widest text-sm uppercase">
          404 — Page not found
        </p>
        <h1 className="mt-2 text-3xl font-extrabold text-foreground">
          We couldn't find that page
        </h1>
        <p className="mt-3 text-muted-foreground">
          The page you're looking for doesn't exist. Head back to the NEXORA attendance portal.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-teal px-5 py-3 text-sm font-semibold text-white hover:bg-brand-teal-dark transition"
        >
          <Home className="h-4 w-4" />
          Go Home
        </Link>
      </div>
    </div>
  );
}
