import { useEffect } from "react";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function useAnalytics() {
  useEffect(() => {
    const endpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT;
    const websiteId = import.meta.env.VITE_ANALYTICS_WEBSITE_ID;

    if (!endpoint || !websiteId) {
      return;
    }

    const script = document.createElement("script");
    script.defer = true;
    script.src = `${endpoint.replace(/\/$/, "")}/umami`;
    script.dataset.websiteId = websiteId;

    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);
}

function App() {
  useAnalytics();

  return (
    <ErrorBoundary>
      <Router />
    </ErrorBoundary>
  );
}

export default App;