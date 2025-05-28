// src/pages/NotFoundPage.jsx
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <h1 className="text-9xl font-bold text-blue-600">404</h1>
      <h2 className="text-3xl font-bold text-slate-900 mt-4 mb-6">Page Not Found</h2>
      <p className="text-slate-600 max-w-md mb-8">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link to="/">
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Home className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </Link>
    </div>
  );
}