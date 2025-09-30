import * as Sentry from "@sentry/browser";
import { setGlobalError } from "../states/errorSlice";
import { store } from "../states/store";
import { AxiosError } from "axios";

export function handleError(error: unknown) {
  let message = "Unexpected Error.";
  if (error instanceof AxiosError) {
    message = error.response?.data?.message || error.message || "Unexpected Error.";
  } else if (error instanceof Error) {
    message = error.message;
  }
  Sentry.captureException(error);
  store.dispatch(setGlobalError(message));
}
