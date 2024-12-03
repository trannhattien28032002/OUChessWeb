import Board from "src/interfaces/gamecore/board/Board";
import { PayloadAction } from "@reduxjs/toolkit";
import * as UserType from "src/redux/reducer/user/Types";
import * as RoomTypes from "src/redux/reducer/room/Types";
import { GameResult } from "src/interfaces/gamecore/result/GameResult";

export interface Moving {
    startPiece: number;
    targetPiece: number;
    start: number;
    target: number;
    flag?: number;
    promotionPiece?: string;
    moveString?: string;
}

export interface Room {
    detail: {
        id: string;
        title: string;
        player: (UserType.User & { color: number })[];
        owner: string;
    } | null;
    gameState: {
        turn: number;
        isStarted: boolean;
        playerColor: number;
        whiteTimer: number;
        blackTimer: number;
    };
    gameAction: {
        move: {
            start: number | null;
            target: number | null;
            flag?: number;
        };
        isPromotion: boolean;
        promotionPiece: string;
        isAction: boolean;
    };
    history: Moving[];
    type: number;
    lastTime: number;
    isProcessing: boolean;
    board?: Board;
    endGame?: GameResult;
    isDraw: boolean;
}

export type CreateRoomRequest = PayloadAction<{
    title: string;
    own: string;
    color: number
}>;
export type CreatRoomResponse = PayloadAction<{
    detail: RoomTypes.Room["detail"];
    color: number;
}>;
export type JoinRoomRequest = PayloadAction<{
    rId: string;
    uId: string;
}>;
export type JoinRoomResponse = PayloadAction<{
    detail: RoomTypes.Room["detail"];
    color: number;
    board?: Board;
    history?: Moving[];
}>;
export type LeaveRoomRequest = PayloadAction<{
    rId: string,
    uId: string
}>
export type MovingRequest = PayloadAction<{
    rId: string;
    moving: Moving;
}>;
export type MovingResponse = PayloadAction<{
    moving: Moving;
}>;
export type Reconnected = PayloadAction<{
    detail: RoomTypes.Room["detail"],
    gameState: {
        turn: number;
        isStarted: boolean;
        playerColor: number;
        whiteTimer: number;
        blackTimer: number;
    },
    history: Moving[],
}>;
export type GameEnd = PayloadAction<{
    EndType: GameResult
}>
export type RoomDetai = PayloadAction<{
    detail: RoomTypes.Room["detail"];
}>
export type MatchDetail = PayloadAction<{
    detail: RoomTypes.Room["detail"];
    history: RoomTypes.Room["history"];
    result: number;
}>

