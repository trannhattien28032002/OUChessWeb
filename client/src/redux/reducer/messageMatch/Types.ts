import { PayloadAction } from "@reduxjs/toolkit";

export type Message = {
    author: string;
    message: string;
}

export type messageMatchState = {
    messages: Message[];
}

export type ActionAddMessage = PayloadAction<{
    messages: Message;
}>;