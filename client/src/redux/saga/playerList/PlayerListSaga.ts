import { call, put, takeLatest } from "redux-saga/effects";
import httpHandler from "src/util/HttpHandler";
import { playerListActions } from "src/redux/reducer/playersList/PlayerList";
import * as ProfileServices from "src/services/profile/ProfileServices";
import * as TypesAction from "src/redux/reducer/playersList/Types";
import * as TypesFetch from "src/services/profile/Types";

interface Payload {
    kw: string;
}

function* getListUser(action: TypesAction.ActionReqGetListUser) {
    try {
        const { kw } = action.payload as Payload;
        const response: TypesFetch.ResGetListUser = yield call(ProfileServices.fetchGetListUser, kw);
        const statusCode = response.code;

        switch (statusCode) {
            case httpHandler.SUCCESS: {
                const { list } = response.data;
                console.log(list);
                yield put(playerListActions.resGetListUser({ list }));
                break;
            }
            case httpHandler.FAIL:
                yield put(playerListActions.reqSetNotify({ notify: { msg: response.message, type: "error" } }));
                break;
            case httpHandler.SERVER_ERROR:
                yield put(playerListActions.reqSetNotify({ notify: { msg: response.message, type: "error" } }));
                break;
            default:
                yield put(playerListActions.reqSetNotify({ notify: { msg: response.message, type: "error" } }));
                break;
        }
    } catch (error) {
        yield put(playerListActions.reqSetNotify({ notify: { msg: "Đã có lỗi xảy ra", type: "error" } }));
    }
}

export function* watchPlayerList() {
    yield takeLatest(playerListActions.reqGetListUser.type, getListUser);
}
