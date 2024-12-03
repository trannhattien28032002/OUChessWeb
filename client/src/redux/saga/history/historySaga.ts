// import { call, put, takeLatest } from "redux-saga/effects";
// import httpHandler from "src/util/HttpHandler";
// import { commonAction } from "src/redux/reducer/common/CommonReducer";
// import { historyActions } from "src/redux/reducer/history/HistoryReducer";
// import * as HistoryServices from "src/services/history/HistoryServices";
// import * as TypesAction from "src/redux/reducer/history/Types";
// import * as TypesFetch from "src/services/history/Types";

// interface Payload {
//     history: TypesAction.History[]
// }

// function* addHistory(action: TypesAction.ActionReqAddHistory) {
//     try {
//         const { history } = action.payload as Payload;
//         const response: TypesFetch.ResFetchAddHistory = yield call(HistoryServices.fetchAddHistory, history);
//         const statusCode = response.code;
//         switch (statusCode) {
//             case httpHandler.SUCCESS: {
//                 const { history } = response.data;
//                 yield put(historyActions.resAddHistory({ history }));
//                 break;
//             }
//             case httpHandler.FAIL: {
//                 yield put(commonAction.displayError({ errorMsg: response.message }));
//                 break;
//             }
//             case httpHandler.UNAUTHORIZED: {
//                 yield put(commonAction.displayError({ errorMsg: response.message }));
//                 break;
//             }
//             case httpHandler.SERVER_ERROR: {
//                 yield put(commonAction.displayError({ errorMsg: response.message }));
//                 break;
//             }
//             default:
//                 yield put(commonAction.displayError({ errorMsg: response.message }));
//                 break;
//         }
//     } catch (error) {
//         yield put(commonAction.displayError({ errorMsg: (error as Error).message }));
//     }
// }

// export function* watchHistoryFunction() {
//     yield takeLatest(historyActions.reqAddHistory.type, addHistory);
// }

const Example = () => {
    return;
}

export default Example;