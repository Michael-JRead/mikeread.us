import { cn } from "@/lib/utils";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="page-gradient flex items-center justify-center min-h-screen p-8 text-slate-100">
          <div className="flex flex-col items-center w-full max-w-2xl p-8 text-center">
            <AlertTriangle
              size={48}
              className="text-red-400 mb-6 flex-shrink-0"
            />

            <h2 className="text-2xl font-bold text-white mb-3">
              Something went wrong.
            </h2>
            <p className="text-slate-300 mb-6 max-w-md">
              An unexpected error interrupted this page. Reloading usually
              clears it — if it keeps happening, please let me know.
            </p>

            {import.meta.env.DEV && this.state.error?.stack && (
              <div className="p-4 w-full rounded bg-slate-900/70 border border-red-500/30 overflow-auto mb-6 text-left">
                <pre className="text-xs text-slate-400 whitespace-break-spaces">
                  {this.state.error.stack}
                </pre>
              </div>
            )}

            <button
              onClick={() => window.location.reload()}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold",
                "bg-red-600 text-white",
                "hover:bg-red-500 transition-colors cursor-pointer"
              )}
            >
              <RotateCcw size={16} />
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
