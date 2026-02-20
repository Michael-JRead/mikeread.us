import { AlertCircle, Home } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="not-found-screen">
      <div className="not-found-card">
        <AlertCircle size={48} className="not-found-icon" />
        <p className="section-eyebrow">404</p>
        <h1 className="section-title">Page Not Found</h1>
        <p className="body-copy">
          The page you requested does not exist or has moved.
        </p>
        <button
          type="button"
          className="button button-primary"
          onClick={() => setLocation("/")}
        >
          <Home size={16} />
          Back To Home
        </button>
      </div>
    </div>
  );
}