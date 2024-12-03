import { all, fork } from "redux-saga/effects";
// import * as commonSaga from "src/redux/saga/common/CommonSaga";
// import * as historySaga from "src/redux/saga/history/HistorySaga";
import * as matchSaga from "src/redux/saga/match/MatchSaga";
import * as authSaga from "src/redux/saga/auth/AuthSaga";
import * as registerSaga from "src/redux/saga/register/RegisterSaga";
import * as userSaga from "src/redux/saga/user/UserSaga";
import * as profileSaga from "src/redux/saga/profile/ProfileSaga";
import * as playerListSaga from "src/redux/saga/playerList/PlayerListSaga";
import * as adminSaga from "src/redux/saga/admin/AdminSaga";
import * as roomSaga from "src/redux/saga/room/RoomSaga";


/**
 * Root saga
 * @return {void}
 */
export default function* rootSaga() {
    yield all([
        fork(authSaga.watchGetDataLogin),
        fork(registerSaga.watchRegister),
        fork(userSaga.watchUserFunction),
        // fork(historySaga.watchHistoryFunction),
        fork(matchSaga.watchMatchFunction),
        fork(profileSaga.watchProfle),
        fork(playerListSaga.watchPlayerList),
        fork(adminSaga.watchAdminFunction),
        fork(roomSaga.watchRoom)
    ]);
}
