import type { Color, PieceType } from "src/interfaces/gameplay/chess";
import { PayloadAction } from "@reduxjs/toolkit";
import { MovingTo } from "src/components/game/Game";

export type GameSettingsState = {
    gameType: "local" | "online";
    turn: Color;
    gameStarted: boolean;
    movingTo: MovingTo | null;
    promotePawn: PieceType;
    isPromotePawn: boolean;
}

export type ActionSetGameType = PayloadAction<{
    gameType: GameSettingsState["gameType"];
}>

export type ActionSetGameStarted = PayloadAction<{
    gameStarted: GameSettingsState["gameStarted"];
}>

export type ActionSetMovingTo = PayloadAction<{
    movingTo: GameSettingsState["movingTo"];
}>

export type ActionSetPromotePawn = PayloadAction<{
    promotePawn: GameSettingsState["promotePawn"];
}>

export type ActionSetIsPromotePawn = PayloadAction<{
    isPromotePawn: GameSettingsState["isPromotePawn"];
}>