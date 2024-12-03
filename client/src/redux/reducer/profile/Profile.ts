import { createSlice } from "@reduxjs/toolkit";
import * as Types from "src/redux/reducer/profile/Types";

const initialState: Types.profileState = {
    profile: {
        _id: "",
        username: "",
        avatar: "",
        friends: [],
        createdAt: new Date(),
        elo: 0,
    },
    comments: [],
    matches: [],
    isLoading: false,
};

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        reqGetProfile: (state, action: Types.ActionReqGetProfile): void => {
            state.isLoading = true;
        },
        resGetProfile: (state, action: Types.ActionResGetProfile): void => {
            const { profile } = action.payload;
            state.profile = profile;
            state.isLoading = false;
        },
        reqGetCommentInfoesUser: (state, action: Types.ActionReqGetCommentInfoesUser): void => {
            state.comments = [];
        },
        resGetCommentInfoesUser: (state, action: Types.ActionResGetCommentInfoesUser): void => {
            const { comments } = action.payload;
            state.comments = comments;
        },
        postAddCommentInfo: (state, action: Types.ActionPostAddCommentInfo): void => {
            const { comment } = action.payload;
            state.comments = [...state.comments, comment];
        },
        reqGetMatchesOfUser: (state, action: Types.ActionReqGetMatchesOfUser) => {
            state.matches = [];
        },
        resGetMatchesOfUser: (state, action: Types.ActionResGetMatchesOfUser): void => {
            const { matches } = action.payload;
            state.matches = matches;
        },
    },
});

export const profileActions = profileSlice.actions;
export default profileSlice.reducer;
