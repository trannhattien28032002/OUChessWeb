import { call, put, takeLatest } from "redux-saga/effects";
import httpHandler from "src/util/HttpHandler";
import { commonAction } from "src/redux/reducer/common/CommonReducer";
import { userActions } from "src/redux/reducer/user/UserReducer";
import * as UserService from "src/services/user/UserService";
import * as TypesAction from "src/redux/reducer/user/Types";
import * as TypesFetch from "src/services/user/Types";

interface PayLoad {
    changedUser: TypesAction.userState["currentUser"];
    changedPassword: {
        username: string;
        password: string;
    };
    changedAvatar: {
        username: string;
        form: FormData;
    };
}

function* getCurrentUser(action: TypesAction.ActionReqGetCurrentUser) {
    try {
        const response: TypesFetch.ResFetchGetCurrrentUser = yield call(UserService.fetchGetCurrrentUser);
        const statusCode = response.code;
        switch (statusCode) {
            case httpHandler.SUCCESS: {
                const { currentUser, friends } = response.data;
                yield put(userActions.resGetCurrrentUser({ currentUser, friends }));
                break;
            }
            case httpHandler.FAIL: {
                yield put(commonAction.displayError({ errorMsg: response.message }));
                break;
            }
            case httpHandler.UNAUTHORIZED: {
                yield put(commonAction.displayError({ errorMsg: response.message }));
                break;
            }
            case httpHandler.SERVER_ERROR: {
                yield put(commonAction.displayError({ errorMsg: response.message }));
                break;
            }
            default:
                yield put(commonAction.displayError({ errorMsg: response.message }));
                break;
        }
    } catch (error) {
        yield put(commonAction.displayError({ errorMsg: (error as Error).message }));
    }
}

function* patchUpdateUser(action: TypesAction.ActionReqPatchUpdateUser) {
    try {
        const { changedUser } = action.payload as PayLoad;
        const response: TypesFetch.ResFetchPatchUpdateUser = yield call(UserService.fetchPatchUpdateUser, changedUser);
        const statusCode = response.code;
        switch (statusCode) {
            case httpHandler.SUCCESS: {
                const { currentUser } = response.data;
                yield put(userActions.resPatchUpdateUser({ currentUser }));
                break;
            }
            case httpHandler.FAIL: {
                yield put(commonAction.displayError({ errorMsg: response.message }));
                break;
            }
            case httpHandler.UNAUTHORIZED: {
                yield put(commonAction.displayError({ errorMsg: response.message }));
                break;
            }
            case httpHandler.SERVER_ERROR: {
                yield put(commonAction.displayError({ errorMsg: response.message }));
                break;
            }
            default:
                yield put(commonAction.displayError({ errorMsg: response.message }));
                break;
        }
    } catch (error) {
        yield put(commonAction.displayError({ errorMsg: (error as Error).message }));
    }
}

function* patchChangePassword(action: TypesAction.ActionReqPatchChangePassword) {
    try {
        const { changedPassword } = action.payload as PayLoad;
        const { username, password } = changedPassword;
        const response: TypesFetch.ResFetchPatchChangePassword = yield call(
            UserService.fetchPatchChangePassword,
            username,
            password,
        );

        const statusCode = response.code;
        switch (statusCode) {
            case httpHandler.SUCCESS: {
                yield put(userActions.resPatchChangePassword({}));
                yield put(commonAction.displayError({ errorMsg: response.message }));
                break;
            }
            case httpHandler.FAIL: {
                yield put(commonAction.displayError({ errorMsg: response.message }));
                break;
            }
            case httpHandler.UNAUTHORIZED: {
                yield put(commonAction.displayError({ errorMsg: response.message }));
                break;
            }
            case httpHandler.SERVER_ERROR: {
                yield put(commonAction.displayError({ errorMsg: response.message }));
                break;
            }
            default:
                yield put(commonAction.displayError({ errorMsg: response.message }));
                break;
        }
    } catch (error) {
        yield put(commonAction.displayError({ errorMsg: (error as Error).message }));
    }
}

function* patchChangeAvatar(action: TypesAction.ActionReqChangeAvatar) {
    try {
        const { changedAvatar } = action.payload as PayLoad;
        console.log(action.payload);
        const { username, form } = changedAvatar;

        const response: TypesFetch.ResFetchPatchChangeAvatar = yield call(
            UserService.fetchPatchChangeAvatar,
            username,
            form,
        );
        const statusCode = response.code;
        switch (statusCode) {
            case httpHandler.SUCCESS: {
                const { newAvatar } = response.data;
                yield put(userActions.resPatchChangeAvatar({ newAvatar }));
                break;
            }
            case httpHandler.FAIL: {
                yield put(commonAction.displayError({ errorMsg: response.message }));
                break;
            }
            case httpHandler.UNAUTHORIZED: {
                yield put(commonAction.displayError({ errorMsg: response.message }));
                break;
            }
            case httpHandler.SERVER_ERROR: {
                yield put(commonAction.displayError({ errorMsg: response.message }));
                break;
            }
            default:
                yield put(commonAction.displayError({ errorMsg: response.message }));
                break;
        }
    } catch (error) {
        yield put(commonAction.displayError({ errorMsg: (error as Error).message }));
    }
}

function* patchUpdateElo(action: TypesAction.ActionReqPatchUpdateElo) {
    try {
        const { elo, username } = action.payload;
        const response: TypesFetch.ResFetchPatchUpdateUser = yield call(UserService.fetchPatchUpdateElo, username, elo);
        const statusCode = response.code;
        switch (statusCode) {
            case httpHandler.SUCCESS: {
                const { currentUser } = response.data;
                yield put(userActions.reqPatchUpdateElo({ currentUser }));
                break;
            }
            case httpHandler.FAIL: {
                yield put(commonAction.displayError({ errorMsg: response.message }));
                break;
            }
            case httpHandler.UNAUTHORIZED: {
                yield put(commonAction.displayError({ errorMsg: response.message }));
                break;
            }
            case httpHandler.SERVER_ERROR: {
                yield put(commonAction.displayError({ errorMsg: response.message }));
                break;
            }
            default:
                yield put(commonAction.displayError({ errorMsg: response.message }));
                break;
        }
    } catch (error) {
        yield put(commonAction.displayError({ errorMsg: (error as Error).message }));
    }
}

export function* watchUserFunction() {
    yield takeLatest(userActions.reqGetCurrentUser.type, getCurrentUser);
    yield takeLatest(userActions.reqPatchUpdateUser.type, patchUpdateUser);
    yield takeLatest(userActions.reqPatchChangPassword.type, patchChangePassword);
    yield takeLatest(userActions.reqPatchChangeAvatar.type, patchChangeAvatar);
    yield takeLatest(userActions.resPatchUpdateElo.type, patchUpdateElo);
}
