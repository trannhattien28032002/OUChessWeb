import type { Board, Position, MoveTypes, Piece } from "src/interfaces/gameplay/chess"
import { PayloadAction } from "@reduxjs/toolkit";

export type History = {
    from: Position
    to: Position
    capture: Piece | null
    type: MoveTypes
    steps: Position
    piece: Piece
}

export type HistoryState = {
    history: History[]
    isLoading: boolean
}

export type ActionReqAddHistory = PayloadAction<{}>;
export type ActionResAddHistory = PayloadAction<{
    history: HistoryState["history"];
}>;
export type ActionResUndoHistory = PayloadAction<{}>;
export type ActionResResetHistory = PayloadAction<{}>;