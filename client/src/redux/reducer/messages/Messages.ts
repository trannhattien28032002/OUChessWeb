import { createSlice } from "@reduxjs/toolkit";
import * as Type from "src/redux/reducer/messages/Types";

const initialState = {
    isLoading: false,
    selectedChat: "",
    selectedUser: {
        _id: "",
        username: "",
        avatar: ""
    }
};

const messageSlice = createSlice({
    name: "message",
    initialState,
    reducers: {
        setSelectedChat: (state, action: Type.setSelectedChat) => {
            const { selectedChat } = action.payload;
            const { selectedUser } = action.payload as Type.messageState;
            state.selectedChat = selectedChat;
            state.selectedUser = selectedUser;
        },
    },
});

export const messageAction = messageSlice.actions;
export default messageSlice.reducer;
