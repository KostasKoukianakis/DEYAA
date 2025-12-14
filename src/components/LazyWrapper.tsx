import { lazy, Suspense, ComponentType } from 'react';

// Loading component for lazy loaded components
const LazySpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
  </div>
);

/**
 * Higher-order component that wraps lazy loaded components with Suspense
 * This ensures optimal code splitting and loading performance
 */
export function withLazyLoading<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback: React.ComponentType = LazySpinner
) {
  const LazyComponent = lazy(importFunc);

  return (props: React.ComponentProps<T>) => (
    <Suspense fallback={<fallback />}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

/**
 * Hook wrapper that loads hooks only when needed
 * This prevents unnecessary API calls and improves performance
 */
export function useLazyHook<T>(
  hookImport: () => Promise<{ default: T }>,
  dependencies: any[] = []
): T | null {
  const [hook, setHook] = React.useState<T | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (dependencies.some(dep => dep)) {
      setIsLoading(true);
      hookImport().then(({ default: hookModule }) => {
        setHook(hookModule);
        setIsLoading(false);
      });
    }
  }, dependencies);

  return isLoading ? null : hook;
}
