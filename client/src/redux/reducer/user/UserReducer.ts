import { createSlice } from "@reduxjs/toolkit";
import * as Types from "src/redux/reducer/user/Types";
import Cookies from "js-cookie";

const currentState = Cookies.get("user") || "";

const initialState: Types.userState = {
    currentUser:
        currentState !== ""
            ? JSON.parse(currentState)
            : {
                  _id: "",
                  username: "",
                  firstName: "",
                  lastName: "",
                  phone: "",
                  dateOfBirth: new Date(),
                  email: "",
                  elo: 0,
                  nation: "",
                  avatar: "",
              },
    friends: [],
    password: "",
    isLoading: false,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        reqGetCurrentUser: (state, action: Types.ActionReqGetCurrentUser) => {
            state.isLoading = true;
        },
        resGetCurrrentUser: (state, action: Types.ActionResGetCurrentUser) => {
            const { currentUser, friends } = action.payload;
            state.friends = friends;
            state.currentUser = currentUser;
            state.isLoading = false;
        },
        reqPatchUpdateUser: (state, action: Types.ActionReqPatchUpdateUser) => {
            state.isLoading = true;
        },
        resPatchUpdateUser: (state, action: Types.ActionResPatchUpdateUser) => {
            const { currentUser } = action.payload;
            state.currentUser = currentUser;
            state.isLoading = false;
        },
        reqPatchChangPassword: (state, action: Types.ActionReqPatchChangePassword) => {
            state.isLoading = true;
        },
        resPatchChangePassword: (state, action: Types.ActionResPatchChangePassword) => {
            state.isLoading = false;
        },
        reqPatchChangeAvatar: (state, action: Types.ActionReqChangeAvatar) => {
            state.isLoading = true;
        },
        resPatchChangeAvatar: (state, action: Types.ActionResChangeAvatar) => {
            const { newAvatar } = action.payload;
            state.currentUser.avatar = newAvatar;
            state.isLoading = false;
        },
        reqSetFriends: (state, action: Types.ActionReqSetFriends) => {
            const { friends } = action.payload;
            state.friends = friends;
        },
        clearUser: (state, action: Types.ActionClearUser) => {
            state.currentUser = initialState.currentUser;
        },
        resPatchUpdateElo: (state, action: Types.ActionReqPatchUpdateElo) => {
            state.isLoading = true;
        },
        reqPatchUpdateElo: (state, action: Types.ActionResPatchUpdateUser) => {
            state.isLoading = false;
            const { elo } = action.payload.currentUser;
            state.currentUser.elo = elo;
            Cookies.set("user", JSON.stringify(action.payload.currentUser));
        },
    },
});

export const userActions = userSlice.actions;
export default userSlice.reducer;
