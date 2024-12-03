import { PayloadAction } from "@reduxjs/toolkit";

export type messageState = {
    isLoading: boolean,
    selectedChat: string,
    selectedUser: {
        _id: string,
        username: string,
        avatar: string
    }
}

export type setSelectedChat = PayloadAction<{
    selectedChat: messageState["selectedChat"],
    selectedUser: messageState["selectedUser"]
}>