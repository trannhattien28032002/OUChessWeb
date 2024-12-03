import { call, put, takeLatest } from "redux-saga/effects";
import httpHandler from "src/util/HttpHandler";
import { commonAction } from "src/redux/reducer/common/CommonReducer";
import { authActions } from "src/redux/reducer/auth/AuthReducer";
import * as LoginService from "src/services/auth/AuthService";
import * as TypesAction from "src/redux/reducer/auth/Types";
import * as TypesFetch from "src/services/auth/Types";

/**
 * Get data sample
 * @param {object} action
 * @return {void}
 */
interface Payload {
    username: string;
    password: string;
}
// eslint-disable-next-line require-jsdoc
function* getLogin(action: TypesAction.ActionReqGetDataLogin) {
    try {
        const { username, password } = action.payload as Payload;
        const response: TypesFetch.ResFetchGetDataLogin = yield call(LoginService.fetchLogin, username, password);
        const statusCode = response.code;
        switch (statusCode) {
            case httpHandler.SUCCESS: {
                const { token, refreshToken } = response.data;
                yield put(authActions.resGetDataLogin({ token, refreshToken }));
                break;
            }
            case httpHandler.FAIL:
                yield put(commonAction.displayError({ errorMsg: response.message }));
                break;
            case httpHandler.UNAUTHORIZED:
                yield put(commonAction.displayError({ errorMsg: response.message }));
                break;
            case httpHandler.SERVER_ERROR:
                yield put(commonAction.displayError({ errorMsg: response.message }));
                break;
            default:
                yield put(commonAction.displayError({ errorMsg: response.message }));
                break;
        }
    } catch (error) {
        yield put(commonAction.displayError({ errorMsg: (error as Error).message }));
    }
}

/**
 * Watch get data sample
 * @return {void}
 */
export function* watchGetDataLogin() {
    yield takeLatest(authActions.reqGetDataLogin.type, getLogin);
}
