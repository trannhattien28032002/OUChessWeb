import { createSlice } from "@reduxjs/toolkit";
import * as Types from "./Types";

const initialState: Types.OpponentState = {
    position: [0, 100, 0],
    mousePosition: [0, 0, 0],
    name: ``,
    avatar: ``,
    color: null,
    status: -1,
};

const opponentSlice = createSlice({
    name: "opponent",
    initialState,
    reducers: {
        setPosition: (state, action: Types.ActionSetPosition) => {
            state.position = action.payload.position;
        },
        setMousePosition: (state, action: Types.ActionSetMousePosition) => {
            state.mousePosition = action.payload.mousePosition;
        },
        setName: (state, action: Types.ActionSetName) => {
            state.name = action.payload.name;
        },
        setAvatar: (state, action: Types.ActionSetAvatar) => {
            state.avatar = action.payload.avatar;
        },
        setColor: (state, action: Types.ActionSetColor) => {
            state.color = action.payload.color;
        },
        setDetail: (state, action: Types.ActionSetDetail) => {
            const { name, avatar, color, status } = action.payload;
            state.color = color;
            state.name = name;
            state.avatar = avatar;
            state.status = status;
        },
        setStatus: (state, action: Types.ActionSetStatus) => {
            const {status} = action.payload;
            state.status = status;
        },
        clearDetail: (state) => {
            state.name = "";
            state.avatar = "";
            state.color = null;
            state.status = -1;
        }
    },
});

export const opponentActions = opponentSlice.actions;
export default opponentSlice.reducer;
