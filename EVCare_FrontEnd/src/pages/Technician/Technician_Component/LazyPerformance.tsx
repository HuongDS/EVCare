import { lazy, Suspense, type ComponentType } from "react";
import LoadingOverlay from "./LoadingOverlay";

export function LazyPerformance<P extends Record<string, unknown>>(
  importFn: () => Promise<{ default: ComponentType<P> }>
) {
  const LazyComponent = lazy(importFn);

  if (typeof window !== "undefined") {
    setTimeout(() => {
      importFn().catch(() => {});
    }, 2000);
  }

  return (props: P) => (
    <Suspense fallback={<LoadingOverlay />}>
      <LazyComponent {...props} />
    </Suspense>
  );
}
