import { createSlice } from "@reduxjs/toolkit";
import * as Types from "src/redux/reducer/playersList/Types";

const initialState: Types.PlayerListState = {
    players: [],
    isLoadding: false,
    notify: {
        msg: "",
        type: "",
    },
};

const playerListSlice = createSlice({
    name: "playerList",
    initialState,
    reducers: {
        reqGetListUser: (state, action: Types.ActionReqGetListUser) => {
            state.isLoadding = true;
            state.players = initialState.players;
            state.notify = initialState.notify;
        },
        resGetListUser: (state, action: Types.ActionResGetListUser) => {
            const { list } = action.payload;
            state.players = list;
            state.isLoadding = false;
        },
        reqSetNotify: (state, action: Types.ActionReqSetNotify) => {
            const { notify } = action.payload;
            state.isLoadding = false;
            state.notify = notify;
        },
    },
});

export const playerListActions = playerListSlice.actions;
export default playerListSlice.reducer;

