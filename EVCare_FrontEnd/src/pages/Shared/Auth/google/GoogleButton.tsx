import {loginWithGoogle, saveTokens} from "../../../../services/authService";
import {ERROR_MESSAGE, MSG_TITLE} from "../../../../constants/messages/Message";
import {useDispatch} from "react-redux";
import type {AppDispatch} from "../../../../states/store";
import {loginSuccess} from "../../../../states/authSlice";
import {toUseFromJwt} from "../../../../token/jwtDecode";
import type {CredentialResponse} from "@react-oauth/google";
import {GoogleLogin} from "@react-oauth/google";
import HTTP_STATUS from "../../../../constants/Code/HttpStatusCode";
import {saveUser} from "../../../../token/tokenStore";
import {closeLogin} from "../../../../states/uiSlice";
import {RoleEnum} from "../../../../models/enums";
import {useNavigate} from "react-router";
import {useNotification} from "../../../../context/useNotification.ts";

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
    const handleError = () => notification.error({
        message: MSG_TITLE.LOGIN,
        description: ERROR_MESSAGE.LOGIN_FAILED,
        showProgress: true,
    });
    return (
        <GoogleLogin text="signin_with" shape="pill" theme="outline" onSuccess={handleSuccess} onError={handleError}/>
    );
}
