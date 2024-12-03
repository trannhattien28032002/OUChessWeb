import { call, put, takeLatest } from "redux-saga/effects";
import httpHandler from "src/util/HttpHandler";
import { commonAction } from "src/redux/reducer/common/CommonReducer";
import { registerActions } from "src/redux/reducer/register/Register";
import * as RegisterService from "src/services/register/RegisterServices";
import * as TypesAction from "src/redux/reducer/register/Types";
import * as TypesFetch from "src/services/register/Types";

interface PayLoad {
    information: {
        username?: string;
        password?: string;
        firstName?: string;
        lastName?: string;
        phone?: number;
        dOb?: string;
        nation?: string;
        email?: string;
    };
    emailVerify: string;
    emailReset: string;
    passwordReset: string;

    fieldCheck: {
        username: string;
        email: string;
        phone: number;
    };
}

function* checkExist(action: TypesAction.ActionReqCheckExist) {
    try {
        const { fieldCheck } = action.payload as PayLoad;
        console.log(fieldCheck);
        const { username, email, phone } = fieldCheck;
        const response: TypesFetch.ResCheckExist = yield call(RegisterService.checkExist, username, email, phone);
        const statusCode = response.code;
        switch (statusCode) {
            case httpHandler.SUCCESS: {
                const { errors } = response.data;
                yield put(registerActions.resCheckExist({errors}));
                break;
            }
            case httpHandler.SERVER_ERROR: {
                yield put(commonAction.displayError({ errorMsg: response.message }));
                break;
            }
            default:
                break;
        }
    } catch (error) {
        yield put(commonAction.displayError({ errorMsg: (error as Error).message }));
    }
}

function* sendVerify(action: TypesAction.ActionReqSendDataVerify) {
    try {
        const { emailVerify } = action.payload as PayLoad;
        const response: TypesFetch.ResFetchSendDataVerify = yield call(RegisterService.sendVerify, emailVerify);
        switch (response.code) {
            case httpHandler.SUCCESS: {
                const { verifyToken } = response.data;
                yield put(registerActions.resSendDataVerify({ verifyToken }));
                break;
            }
            case httpHandler.FAIL:
                yield put(commonAction.displayError({ errorMsg: response.message }));
                break;
            case httpHandler.SERVER_ERROR:
                yield put(commonAction.displayError({ errorMsg: response.message }));
                break;
            default:
                break;
        }
    } catch (error) {
        yield put(commonAction.displayError({ errorMsg: (error as Error).message }));
    }
}

function* setDataRegister(action: TypesAction.ActionReqSetDataRegister) {
    try {
        const { information } = action.payload as PayLoad;
        // console.log(info)
        const response: TypesFetch.ResFetchSendDataRegister = yield call(RegisterService.sendDataRegister, {
            information: information,
        });

        switch (response.code) {
            case httpHandler.SUCCESS: {
                const msg = response.message;
                yield put(registerActions.resSendDataRegister({ msg }));
                break;
            }
            case httpHandler.FAIL: {
                yield put(commonAction.displayError({ errorMsg: response.message }));
                break;
            }
            case httpHandler.SERVER_ERROR: {
                yield put(commonAction.displayError({ errorMsg: response.message }));
                break;
            }
            default:
                break;
        }
    } catch (error) {
        yield put(commonAction.displayError({ errorMsg: (error as Error).message }));
    }
}

function* resetPassword(action: TypesAction.ActionReqChangePassword) {
    try {
        const { emailReset, passwordReset } = action.payload as PayLoad;
        const response: TypesFetch.ResFetchChangePassword = yield call(
            RegisterService.resetPassword,
            emailReset,
            passwordReset,
        );

        switch (response.code) {
            case httpHandler.SUCCESS: {
                const msg = response.message;
                yield put(registerActions.resChangePasswrod({ msg }));
                break;
            }
            case httpHandler.FAIL: {
                yield put(commonAction.displayError({ errorMsg: response.message }));
                break;
            }
            case httpHandler.SERVER_ERROR: {
                yield put(commonAction.displayError({ errorMsg: response.message }));
                break;
            }
            default:
                break;
        }
    } catch (error) {
        yield put(commonAction.displayError({ errorMsg: (error as Error).message }));
    }
}

export function* watchRegister() {
    yield takeLatest(registerActions.reqSendDataVerify.type, sendVerify);
    yield takeLatest(registerActions.reqSendDataRegister.type, setDataRegister);
    yield takeLatest(registerActions.reqChangePassword.type, resetPassword);
    yield takeLatest(registerActions.reqCheckExist.type, checkExist)
}
