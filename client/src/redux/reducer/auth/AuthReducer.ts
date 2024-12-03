import { createSlice } from "@reduxjs/toolkit";
import * as Types from "src/redux/reducer/auth/Types";

const initialState: Types.authState = {
    isLoading: false,
    isLoadingBlock: false,
    isLoggedIn: false,
    isLoggedOut: false,
    payload: {
        username: "",
        password: "",
    },
    token: "",
    refreshToken: "",
    msg: "",
};
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reqGetDataLogin: (state, action: Types.ActionReqGetDataLogin) => {
            state.isLoading = true;
            state.isLoadingBlock = false;
        },
        resGetDataLogin: (state, action: Types.ActionResGetDataLogin) => {
            console.log(action.payload)
            const { token, refreshToken } = action.payload;
            state.isLoading = false;
            state.isLoggedIn = true;
            state.isLoggedOut = false;
            state.token = token;
            state.refreshToken = refreshToken;
            state.msg = "";
        },
        resGetDataRefreshToken: (state, action: Types.ActionResGetDataRefreshToken) => {
            const { token } = action.payload;
            state.isLoggedOut = false;
            state.token = token;
        },
        reqDataLogOut: (state, action: Types.ActionReqGetDataLogin): void => {
            state.isLoggedOut = true;
            state.isLoggedIn = false;
        },
        resDataLogOut: (state, action: Types.ActionResLogOut): void => {
            const { msg } = action.payload;
            state.isLoading = true;
            state.msg = msg;
            state.isLoggedOut = true;
            state.isLoggedIn = false;
        },
        reqLogOut: (state, action: Types.ActionReqLogOut) => {
            state.isLoggedIn = false;
            state.isLoggedOut = true;
            state.token = "";
        }

    },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
