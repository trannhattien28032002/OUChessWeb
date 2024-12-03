import { call, put, takeLatest } from "redux-saga/effects";
import httpHandler from "src/util/HttpHandler";
import { commonAction } from "src/redux/reducer/common/CommonReducer";
import { profileActions } from "src/redux/reducer/profile/Profile";
import * as ProfileServices from "src/services/profile/ProfileServices";
import * as TypesAction from "src/redux/reducer/profile/Types";
import * as TypesFetch from "src/services/profile/Types";

interface Payload {
    username: string;
    _id: string;
    params: any;
}

function* getProfile(action: TypesAction.ActionReqGetProfile) {
    try {
        const { username } = action.payload as Payload;
        const response: TypesFetch.ResFetchGetProfile = yield call(ProfileServices.fetchProfile, username);
        const statusCode = response.code;

        switch (statusCode) {
            case httpHandler.SUCCESS: {
                const { profile }  = response.data;
                yield put(profileActions.resGetProfile({ profile }));
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

function* getCommentInfo(action: TypesAction.ActionReqGetCommentInfoesUser) {
    try {
        const { username, params } = action.payload as Payload;
        const response: TypesFetch.ResFetchGetCommentInfoUser = yield call(
            ProfileServices.fetchCommentInfo,
            username,
            params,
        );
        const statusCode = response.code;
        switch (statusCode) {
            case httpHandler.SUCCESS: {
                const { comments } = response.data;
                yield put(profileActions.resGetCommentInfoesUser({ comments }));
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
        console.log(error);
        yield put(commonAction.displayError({ errorMsg: (error as Error).message }));
    }
}

function* getMatches(action: TypesAction.ActionReqGetMatchesOfUser) {
    try {
        const { _id } = action.payload as Payload;
        const response: TypesFetch.ResFetchGetMatchesOfUser = yield call(ProfileServices.fetchMatches, _id);
        const statusCode = response.code;
        switch (statusCode) {
            case httpHandler.SUCCESS: {
                const { matches } = response.data;
                yield put(profileActions.resGetMatchesOfUser({ matches }));
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
        console.log(error);
        yield put(commonAction.displayError({ errorMsg: (error as Error).message }));
    }
}

export function* watchProfle() {
    yield takeLatest(profileActions.reqGetProfile.type, getProfile);
    yield takeLatest(profileActions.reqGetCommentInfoesUser.type, getCommentInfo);
    yield takeLatest(profileActions.reqGetMatchesOfUser.type, getMatches);
}
