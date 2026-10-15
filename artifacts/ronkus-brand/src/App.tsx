import { useEffect, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { ShopProvider } from '@/components/shop-provider';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import Homepage from '@/components/homepage';
import NotFound from '@/pages/not-found';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

function VisualViewportMetrics() {
  useEffect(() => {
    const viewport = window.visualViewport;
    const root = document.documentElement;

    const updateMetrics = () => {
      const width = viewport?.width || root.clientWidth || window.innerWidth;
      const height = viewport?.height || window.innerHeight;
      const left = viewport?.offsetLeft ?? 0;
      const top = viewport?.offsetTop ?? 0;

      root.style.setProperty('--visible-viewport-width', `${width}px`);
      root.style.setProperty('--visible-viewport-height', `${height}px`);
      root.style.setProperty('--visible-viewport-center-x', `${left + width / 2}px`);
      root.style.setProperty('--visible-viewport-center-y', `${top + height / 2}px`);
    };

    updateMetrics();
    window.addEventListener('resize', updateMetrics);
    viewport?.addEventListener('resize', updateMetrics);
    viewport?.addEventListener('scroll', updateMetrics);

    return () => {
      window.removeEventListener('resize', updateMetrics);
      viewport?.removeEventListener('resize', updateMetrics);
      viewport?.removeEventListener('scroll', updateMetrics);
      root.style.removeProperty('--visible-viewport-width');
      root.style.removeProperty('--visible-viewport-height');
      root.style.removeProperty('--visible-viewport-center-x');
      root.style.removeProperty('--visible-viewport-center-y');
    };
  }, []);

  return null;
}

function Home() {
  return (
    <ShopProvider>
      <Homepage />
    </ShopProvider>
  );
}

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <VisualViewportMetrics />
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
