import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./states/store.ts";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ProviderLib } from "./components/ui/provider.jsx";
import * as Sentry from "@sentry/browser";
import { stopAdminDashboardConnection } from "./signalr/adminConnection.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <ProviderLib>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <App />
        </GoogleOAuthProvider>
      </ProviderLib>
    </Provider>
  </StrictMode>
);

Sentry.init({
  dsn: "https://eb2a9201c2ed4443958d8ac69086e4b3@app.glitchtip.com/13023",
  release: import.meta.env.VITE_APP_VERSION,
  environment: import.meta.env.VITE_APP_ENV,
  tracesSampleRate: import.meta.env.VITE_APP_ENV === "production" ? 0.2 : 1.0,
});

window.addEventListener("beforeunload", () => {
  stopAdminDashboardConnection();
});
