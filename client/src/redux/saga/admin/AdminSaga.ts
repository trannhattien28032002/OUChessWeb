import httpHandler from "src/util/HttpHandler";
import { all, call, put, takeLatest } from "redux-saga/effects";
import { adminActions } from "src/redux/reducer/admin/AdminReducer";
import * as AdminService from "src/services/admin/AdminService";
import * as TypesAction from "src/redux/reducer/admin/Types";
import * as TypesFetch from "src/services/admin/Types";

interface Payload {
    kw: string;
    user: FormData;
    username: string;
}

function* getListUser(action: TypesAction.ActionReqGetListUser) {
    try {
        const { kw } = action.payload as Payload;
        const response: TypesFetch.resFetchGetListUserFromAdmin = yield call(AdminService.fetchGetListUser, kw);
        const statusCode = response.code;
        switch (statusCode) {
            case httpHandler.SUCCESS: {
                const { list } = response.data;
                yield put(adminActions.resGetListUser({ list }));
                break;
            }
            case httpHandler.FAIL:
                yield put(adminActions.reqSetNotify({ notify: { msg: response.message, type: "error" } }));
                break;
            case httpHandler.SERVER_ERROR:
                yield put(adminActions.reqSetNotify({ notify: { msg: response.message, type: "error" } }));
                break;
            default:
                yield put(adminActions.reqSetNotify({ notify: { msg: response.message, type: "error" } }));
                break;
        }
    } catch (error) {
        yield put(adminActions.reqSetNotify({ notify: { msg: "Đã có lỗi xảy ra", type: "error" } }));
    }
}

function* addUser(action: TypesAction.ActionReqAddUser) {
    try {
        const { user } = action.payload as Payload;
        const response: TypesFetch.resAddUserFromAdmin = yield call(AdminService.fetchAddUser, user);
        const statusCode = response.code;
        console.log(statusCode);
        switch (statusCode) {
            case httpHandler.CREATED: {
                const { newUser } = response.data;
                yield all([
                    put(adminActions.resAddUser({ newUser })),
                    put(adminActions.reqSetNotify({ notify: { msg: response.message, type: "success" } })),
                ]);
                break;
            }
            case httpHandler.FAIL:
                yield put(adminActions.reqSetNotify({ notify: { msg: response.message, type: "error" } }));
                break;
            case httpHandler.SERVER_ERROR:
                yield put(adminActions.reqSetNotify({ notify: { msg: response.message, type: "error" } }));
                break;
            default:
                yield put(adminActions.reqSetNotify({ notify: { msg: response.message, type: "error" } }));
                break;
        }
    } catch (error) {
        yield put(adminActions.reqSetNotify({ notify: { msg: "Đã có lỗi xảy ra", type: "error" } }));
    }
}

function* updateUser(action: TypesAction.ActionReqUpdateUser) {
    try {
        const { user } = action.payload as Payload;
        const response: TypesFetch.resUpdateUserFromAdmin = yield call(AdminService.fetchUpdateUser, user);
        const statusCode = response.code;
        switch (statusCode) {
            case httpHandler.SUCCESS: {
                const { updatedUser } = response.data;

                yield all([
                    put(adminActions.resUpdateUser({ updatedUser })),
                    put(adminActions.reqSetNotify({ notify: { msg: response.message, type: "success" } })),
                ]);
                break;
            }
            case httpHandler.FAIL:
                yield put(adminActions.reqSetNotify({ notify: { msg: response.message, type: "error" } }));
                break;
            case httpHandler.SERVER_ERROR:
                yield put(adminActions.reqSetNotify({ notify: { msg: response.message, type: "error" } }));
                break;
            default:
                yield put(adminActions.reqSetNotify({ notify: { msg: response.message, type: "error" } }));
                break;
        }
    } catch (error) {
        yield put(adminActions.reqSetNotify({ notify: { msg: "Đã có lỗi xảy ra", type: "error" } }));
    }
}

function* deleteUser(action: TypesAction.ActionReqDeleteUser) {
    try {
        const { username } = action.payload as Payload;
        const response: TypesFetch.resDeletedUserFromAdmin = yield call(AdminService.fetchDeletedUser, username);
        const statusCode = response.code;
        switch (statusCode) {
            case httpHandler.SUCCESS: {
                const { deletedUser } = response.data;

                yield all([
                    put(adminActions.resDeletedUser({ deletedUser })),
                    put(adminActions.reqSetNotify({ notify: { msg: response.message, type: "success" } })),
                ]);
                break;
            }
            case httpHandler.FAIL:
                yield put(adminActions.reqSetNotify({ notify: { msg: response.message, type: "error" } }));
                break;
            case httpHandler.SERVER_ERROR:
                yield put(adminActions.reqSetNotify({ notify: { msg: response.message, type: "error" } }));
                break;
            default:
                yield put(adminActions.reqSetNotify({ notify: { msg: response.message, type: "error" } }));
                break;
        }
    } catch (error) {
        yield put(adminActions.reqSetNotify({ notify: { msg: "Đã có lỗi xảy ra", type: "error" } }));
    }
}

export function* watchAdminFunction() {
    yield takeLatest(adminActions.reqGetListUser.type, getListUser);
    yield takeLatest(adminActions.reqAddUser.type, addUser);
    yield takeLatest(adminActions.reqUpdateUser.type, updateUser);
    yield takeLatest(adminActions.reqDeletedUser.type, deleteUser);
}
