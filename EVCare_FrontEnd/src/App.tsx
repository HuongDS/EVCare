import { RouterProvider } from "react-router-dom";
import router from "./utils/router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { getAccessToken, getUser } from "./token/tokenStore";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "./states/store";
import { loginSuccess } from "./states/authSlice";
import GloabalErrorToast from "./components/GlobalErrorToast";

const queryClient = new QueryClient();
function App() {
  const dispatch = useDispatch<AppDispatch>();
  const token = getAccessToken();
  const user = getUser();
  if (token && user) {
    dispatch(loginSuccess(user));
  }
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={true} />
      <RouterProvider router={router} />
      <GloabalErrorToast />
    </QueryClientProvider>
  );
}

export default App;
