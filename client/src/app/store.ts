import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import createSagaMiddleware from "@redux-saga/core";
import rootSaga from "src/redux/saga/RootSaga";
import commonReducer from "src/redux/reducer/common/CommonReducer";
import authReducer from "src/redux/reducer/auth/AuthReducer";
import registerReducer from "src/redux/reducer/register/Register";
import historyReducer from "src/redux/reducer/history/HistoryReducer";
import matchReducer from "src/redux/reducer/match/MatchReducer";
import userReducer from "src/redux/reducer/user/UserReducer";
import messageReducer from "src/redux/reducer/messages/Messages";
import profileReducer from "src/redux/reducer/profile/Profile";
import messageMatchReducer from "src/redux/reducer/messageMatch/MessageMatchReducer";
import opponentReducer from "src/redux/reducer/opponent/OpponentReducer";
import playerReducer from "src/redux/reducer/player/PlayerReducer";
import gameSettingsReducer from "src/redux/reducer/gameSettings/GameSettingsReducer";
import PlayerListReducer from "src/redux/reducer/playersList/PlayerList";
import adminReducer from "src/redux/reducer/admin/AdminReducer";
import roomReducer from "src/redux/reducer/room/RoomReducer";

const sagaMiddleware = createSagaMiddleware();
export const store = configureStore({
    reducer: {
        commonReducer,
        authReducer,
        registerReducer,
        userReducer,
        historyReducer,
        matchReducer,
        messageReducer,
        profileReducer,
        messageMatchReducer,
        opponentReducer,
        playerReducer,
        gameSettingsReducer,
        PlayerListReducer,
        adminReducer,
        roomReducer
    },
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware)
    middleware: [sagaMiddleware],
});
sagaMiddleware.run(rootSaga);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
