import { RouterProvider } from "react-router-dom";
import router from "./utils/router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { clearToken, getAccessToken, getUser } from "./token/tokenStore";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "./states/store";
import { loginSuccess, logoutRedux } from "./states/authSlice";
import GloabalErrorToast from "./components/GlobalErrorToast";
import { getMe } from "./services/authService";
import HTTP_STATUS from "./constants/Code/HttpStatusCode";
import { useEffect } from "react";
import { handleError } from "./utils/errorHandler";

const queryClient = new QueryClient();
function App() {
  const dispatch = useDispatch<AppDispatch>();
  const token = getAccessToken();
  const user = getUser();

  useEffect(() => {
    const initAuth = async () => {
      if (token && user) {
        try {
          const response = await getMe();
          if (response.statusCode === HTTP_STATUS.OK) {
            dispatch(loginSuccess(user));
          } else {
            dispatch(logoutRedux());
            clearToken();
          }
        } catch (error) {
          handleError(error);
          dispatch(logoutRedux());
          clearToken();
        }
      }
    };
    initAuth();
  }, [dispatch, token, user]);

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={true} />
      <RouterProvider router={router} />
      <GloabalErrorToast />
    </QueryClientProvider>
  );
}

export default App;
