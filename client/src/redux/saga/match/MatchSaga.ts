import httpHandler from "src/util/HttpHandler";
import { all, call, put, takeLatest } from "redux-saga/effects";
import { socket } from "src";
import { commonAction } from "src/redux/reducer/common/CommonReducer";
import { matchActions } from "src/redux/reducer/match/MatchReducer";
import * as MatchService from "src/services/match/MatchServices";
import * as TypesAction from "src/redux/reducer/match/Types";
import * as TypesFetch from "src/services/match/Types";
import { Room } from "src/util/Socket";

interface Payload {
    match: TypesAction.Match;
    matchId: string;
}

function* getMatch(action: TypesAction.ActionReqGetMatch) {
    try {
        const response: TypesFetch.ResFetchGetMatch = yield call(MatchService.fetchGetMatch);
        const statusCode = response.code;
        switch (statusCode) {
            case httpHandler.SUCCESS: {
                const { matches } = response.data;
                yield put(matchActions.resGetMatch({ matches }));
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

function* postAddMatch(action: TypesAction.ActionReqPostAddMatch) {
    try {
        const { match } = action.payload as Payload;
        const response: TypesFetch.ResFetchPostAddMatch = yield call(MatchService.fetchPostAddMatch, match);
        const statusCode = response.code;
        switch (statusCode) {
            case httpHandler.SUCCESS: {
                const { match } = response.data;
                yield put(matchActions.resPostAddMatch({ match }));
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

function* getMatchById(action: TypesAction.ActionReqGetMatchById) {
    try {
        const { matchId } = action.payload as Payload;
        const response: TypesFetch.ResFetchGetMatchById = yield call(MatchService.fetchGetMatchById, matchId);
        const statusCode = response.code;
        switch (statusCode) {
            case httpHandler.SUCCESS: {
                const { matches } = response.data;
                yield put(matchActions.resGetMatchById({ matches }));
                break;
            }
            case httpHandler.FAIL: {
                yield all([
                    put(matchActions.resGetMatchById({ matches: [] })),
                    put(commonAction.displayError({ errorMsg: response.message })),
                ]);
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

function* putMatchById(action: TypesAction.ActionReqGetMatchById) {
    try {
        const { matchId, match } = action.payload as Payload;
        const response: TypesFetch.ResFetchPutMatchById = yield call(MatchService.fetchPutMatchById, matchId, match);
        const statusCode = response.code;
        switch (statusCode) {
            case httpHandler.SUCCESS: {
                const { match } = response.data;
                yield put(matchActions.resPutMatchById({ match }));
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

function* getRoom() {
    yield socket.emit("get-rooms");
}

function* saveMatch(action: TypesAction.MatchDetail) {
    try {
        console.log(action.payload);
        const { detail, history, state, mode } = action.payload;
        const whiteId = detail?.player.filter((p) => p.color === 0)[0]._id;
        const blackId = detail?.player.filter((p) => p.color === 1)[0]._id;
        const moves = [] as string[];

        for (let i = 0; i < history.length; i++) {
            if (history[i].moveString && history[i].moveString !== "") moves[i] = history[i].moveString || "";
        }
        const matchDetail: TypesAction.SaveMatch = {
            whiteId: whiteId ? whiteId : "",
            blackId: blackId ? blackId : "",
            moves: moves,
            state: state,
            mode: mode,
        };

        const response: TypesFetch.ResFetchPatchSaveMatch = yield call(MatchService.fetchSaveMatch, matchDetail);

        const statusCode = response.code;
        switch (statusCode) {
            case httpHandler.SUCCESS: {
                yield put(matchActions.responseSaveMatch());
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

export function* watchMatchFunction() {
    yield takeLatest(matchActions.reqGetMatch.type, getMatch);
    yield takeLatest(matchActions.reqPostAddMatch.type, postAddMatch);
    yield takeLatest(matchActions.reqGetMatchById.type, getMatchById);
    yield takeLatest(matchActions.reqPutMatchById.type, putMatchById);
    yield takeLatest(matchActions.requestGettingRoom.type, getRoom);
    yield takeLatest(matchActions.requestSaveMatch.type, saveMatch);
}
