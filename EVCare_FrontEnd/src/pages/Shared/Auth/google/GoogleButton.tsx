import { loginWithGoogle, saveTokens } from "../../../../services/authService";
import { ERROR_MESSAGE } from "../../../../constants/messages/Message";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../../states/store";
import { loginSuccess } from "../../../../states/authSlice";
import type { User } from "../../../../models/AuthModel/authModel";
import { decodeJwt } from "../../../../token/jwtDecode";
import { GoogleLogin } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";
import HTTP_STATUS from "../../../../constants/Code/HttpStatusCode";

export default function GoogleButton() {
  const dispatch = useDispatch<AppDispatch>();
  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    const idToken = credentialResponse.credential;
    const response = await loginWithGoogle(idToken);
    if (response.statusCode != HTTP_STATUS.OK) {
      throw new Error(ERROR_MESSAGE.LOGIN_FAILED);
    }
    const accessToken = response.data?.accessToken;
    if (!accessToken) {
      throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
    }
    saveTokens(accessToken);
    const payload = decodeJwt(accessToken);
    const user: User = {
      accountId: payload.nameid,
      email: payload.email,
      role: payload.role,
    };
    dispatch(loginSuccess(user));
  };
  const handleError = () => console.log("Google login failed");
  return <GoogleLogin theme="outline" onSuccess={handleSuccess} onError={handleError} />;
}
