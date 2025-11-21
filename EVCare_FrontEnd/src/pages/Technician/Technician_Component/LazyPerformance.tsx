import { lazy, Suspense, type ComponentType } from "react";

export function LazyPerformance<P extends Record<string, unknown>>(
  importFn: () => Promise<{ default: ComponentType<P> }>
) {
  const LazyComponent = lazy(importFn);

  return (props: P) => (
    <Suspense>
      <LazyComponent {...props} />
    </Suspense>
  );
}
