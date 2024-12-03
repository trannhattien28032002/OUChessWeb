import { createSlice } from "@reduxjs/toolkit";
import * as Types from "./Types";

const initialState: Types.PlayerState = {
    userId: "",
    playerColor: "white",
    mode: "",
    joinedRoom: false,
    roomId: null,
}

const playerSlice = createSlice({
    name: "player",
    initialState,
    reducers: {
        setUserId: (state, action: Types.ActionSetUserId) => {
            state.userId = action.payload.userId;
        },
        setPlayerColor: (state, action: Types.ActionSetPlayerColor) => {
            state.playerColor = action.payload.playerColor;
        },
        setMode: (state, action: Types.ActionSetMode) => {
            state.mode = action.payload.mode;
        },
        setJoinedRoom: (state, action: Types.ActionSetJoinedRoom) => {
            state.joinedRoom = action.payload.joinedRoom;
        },
        setRoomId: (state, action: Types.ActionSetRoomId) => {
            state.roomId = action.payload.roomId;
        },
    }
})

export const playerActions = playerSlice.actions;
export default playerSlice.reducer;