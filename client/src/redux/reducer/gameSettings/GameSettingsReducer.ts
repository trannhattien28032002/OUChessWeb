import { createSlice } from "@reduxjs/toolkit";
import * as Types from "./Types";

const initialState: Types.GameSettingsState = {
  gameType: "online",
  turn: "white",
  gameStarted: false,
  movingTo: null,
  promotePawn: "bishop",
  isPromotePawn: false,
}

const gameSettingsSlice = createSlice({
  name: "gameSettings",
  initialState,
  reducers: {
    setGameType: (state, action: Types.ActionSetGameType) => {
      state.gameType = action.payload.gameType;
    },
    setTurn: (state) => {
      state.turn = state.turn === "white" ? "black" : "white";
    },
    resetTurn: (state) => {
      state.turn = "white";
    },
    setGameStarted: (state, action: Types.ActionSetGameStarted) => {
      state.gameStarted = action.payload.gameStarted;
    },
    setMovingTo: (state, action: Types.ActionSetMovingTo) => {
      state.movingTo = action.payload.movingTo;
    },
    setPromotePawn: (state, action: Types.ActionSetPromotePawn) => {
      state.promotePawn = action.payload.promotePawn;
    },
    setIsPromotePawn: (state, action: Types.ActionSetIsPromotePawn) => {
      state.isPromotePawn = action.payload.isPromotePawn;
    }
  },
});

export const gameSettingActions = gameSettingsSlice.actions;
export default gameSettingsSlice.reducer;