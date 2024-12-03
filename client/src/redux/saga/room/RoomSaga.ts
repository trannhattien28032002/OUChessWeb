import Cookies from "js-cookie";
import { takeLatest } from "redux-saga/effects";
import { socket } from "src";
import { roomAction } from "src/redux/reducer/room/RoomReducer";
import * as TypesAction from "src/redux/reducer/room/Types";

function* createRoom(action: TypesAction.CreateRoomRequest) {
    yield socket.emit("join-room", {
        type: "new",
        title: action.payload.title,
        id: action.payload.own,
        color: action.payload.color,
    });
}

function* joinRoom(action: TypesAction.JoinRoomRequest) {
    yield socket.emit("join-room", {
        type: "join",
        rID: action.payload.rId,
        id: action.payload.uId,
    });
}

function* leavingRoom(action: TypesAction.LeaveRoomRequest) {
    yield socket.emit("leave-room", {
        type: "End",
        rId: action.payload.rId,
        uId: action.payload.uId,
    });
}

function* moving(action: TypesAction.MovingRequest) {
    yield socket.emit("send-move", {
        rId: action.payload.rId,
        moving: action.payload.moving,
    });
}

function* initializingRoom(action: TypesAction.Reconnected) {
    let detail = Cookies.get("room");
    let gameState = sessionStorage.getItem("state");
    let history = sessionStorage.getItem("history");

    detail = detail ? JSON.parse(detail) : null;
    gameState = gameState !== null ? JSON.parse(gameState) : null;
    history = history !== null ? JSON.parse(history) : null;

    yield socket.emit("initializing-detail", {
        detail: detail,
        gameState: gameState,
        history: history,
    });
}

function* continueGame(action: TypesAction.Reconnected) {
    yield socket.emit("request-continue-game", { roomID: action.payload.detail?.id });
}

export function* watchRoom() {
    yield takeLatest(roomAction.requestCreateRoom.type, createRoom);
    yield takeLatest(roomAction.requestJoinRoom.type, joinRoom);
    yield takeLatest(roomAction.requestLeaveRoom.type, leavingRoom);
    yield takeLatest(roomAction.requestMoving.type, moving);
    yield takeLatest(roomAction.initializing.type, initializingRoom);
    yield takeLatest(roomAction.opponentReconneccted.type, continueGame);
}
