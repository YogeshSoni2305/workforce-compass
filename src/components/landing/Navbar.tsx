import { Link } from "react-router-dom";
import { Activity } from "lucide-react";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-foreground" />
          <span className="text-lg font-bold tracking-tight text-foreground">
            WorkforceIQ
          </span>
        </Link>
        <div className="flex items-center gap-8">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Features
          </a>
          <Link
            to="/dashboard"
            className="text-sm font-medium text-foreground hover:text-muted-foreground transition-colors"
          >
            Command Center
          </Link>
        </div>
      </div>
    </nav>
  );
}
