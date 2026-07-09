import { Home } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [location, setLocation] = useLocation();

  return (
    <div className="page-gradient min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full rounded-lg overflow-hidden border border-red-500/40 bg-slate-950/80 backdrop-blur-sm shadow-[0_0_30px_rgba(239,68,68,0.15)]">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-900/70 border-b border-red-500/20">
          <span className="w-3 h-3 rounded-full bg-red-500" />
          <span className="w-3 h-3 rounded-full bg-amber-400" />
          <span className="w-3 h-3 rounded-full bg-emerald-400" />
          <span className="ml-3 text-xs text-slate-400 font-mono">mr@mikeread:~</span>
        </div>
        <div className="p-6 font-mono text-sm leading-7">
          <p className="text-emerald-300 break-all">
            <span className="text-red-400">$ </span>GET {location}
          </p>
          <p className="text-red-400 font-bold text-5xl my-4">404</p>
          <p className="text-slate-300 font-sans">
            Resource not found. The page you requested does not exist or has moved.
          </p>
          <button
            type="button"
            onClick={() => setLocation("/")}
            className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-all font-semibold shadow-lg shadow-red-600/40"
          >
            <Home size={16} />
            cd ~/
          </button>
        </div>
      </div>
    </div>
  );
}
