import { loginWithGoogle, saveTokens } from "../../../services/authService.ts";
import {
  ERROR_MESSAGE,
  MSG_TITLE,
} from "../../../constants/messages/Message.ts";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../states/store.ts";
import { loginSuccess } from "../../../states/authSlice.ts";
import { toUseFromJwt } from "../../../token/jwtDecode.ts";
import type { CredentialResponse } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import HTTP_STATUS from "../../../constants/Code/HttpStatusCode.ts";
import { saveUser } from "../../../token/tokenStore.ts";
import { closeLogin } from "../../../states/uiSlice.ts";
import { RoleEnum } from "../../../models/enums/index.tsx";
import { useNavigate } from "react-router";
import { useNotification } from "../../../context/useNotification.ts";

export default function GoogleButton() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const notification = useNotification();
  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    const idToken = credentialResponse.credential;
    const response = await loginWithGoogle(idToken);
    if (!response) {
      handleError();
      return;
    }
    if (response.statusCode != HTTP_STATUS.OK) {
      throw new Error(ERROR_MESSAGE.LOGIN_FAILED);
    }
    const accessToken = response.data?.accessToken;
    if (!accessToken) {
      throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
    }
    saveTokens(accessToken);
    const user = toUseFromJwt(accessToken);
    saveUser(user);
    dispatch(loginSuccess(user));
    dispatch(closeLogin());
    // Author
    switch (user.role) {
      case RoleEnum.ADMIN:
        navigate("/admin/general");
        break;
      case RoleEnum.STAFF:
        navigate("/staff");
        break;
      case RoleEnum.TECHNICIAN:
        navigate("/technician");
        break;
    }
  };
  const handleError = () =>
    notification.error({
      message: MSG_TITLE.LOGIN,
      description: ERROR_MESSAGE.LOGIN_FAILED,
      showProgress: true,
    });
  return (
    <GoogleLogin
      text="signin_with"
      shape="pill"
      theme="outline"
      width={100}
      onSuccess={handleSuccess}
      onError={handleError}
    />
  );
}
