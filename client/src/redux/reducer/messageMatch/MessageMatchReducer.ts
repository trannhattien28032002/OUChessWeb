import { createSlice } from "@reduxjs/toolkit";
import * as Types from "src/redux/reducer/messageMatch/Types";

const initialState: Types.messageMatchState = {
    messages: []
}

const messageMatchSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {
        addMessage: (state, action: Types.ActionAddMessage) => {
            const { messages } = action.payload;
            state.messages.push(messages);
        },
    },
});

export const messageMatchActions = messageMatchSlice.actions;
export default messageMatchSlice.reducer;