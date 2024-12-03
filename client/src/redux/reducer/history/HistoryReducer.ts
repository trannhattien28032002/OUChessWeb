import { createSlice } from "@reduxjs/toolkit";
import * as Types from "src/redux/reducer/history/Types";

const initialState: Types.HistoryState = {
    history: [],
    isLoading: false,
};

const historySlice = createSlice({
    name: "history",
    initialState,
    reducers: {
        reqAddHistory: (state, action: Types.ActionReqAddHistory): void => {
            state.isLoading = true;
        },
        resAddHistory: (state, action: Types.ActionResAddHistory): void => {
            state.isLoading = false;
        },
    },
});

export const historyActions = historySlice.actions;
export default historySlice.reducer;