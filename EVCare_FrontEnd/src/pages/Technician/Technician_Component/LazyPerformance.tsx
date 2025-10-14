import { lazy, Suspense, type ComponentType } from "react";
import LoadingOverlay from "./LoadingOverlay";

export function LazyPerformance<P extends Record<string, unknown>>(
  importFn: () => Promise<{ default: ComponentType<P> }>
) {
  const LazyComponent = lazy(importFn);

  return (props: P) => (
    <Suspense fallback={<LoadingOverlay />}>
      <LazyComponent {...props} />
    </Suspense>
  );
}
