import { PayloadAction } from "@reduxjs/toolkit";

export type authState = {
    isLoading: boolean;
    isLoadingBlock: boolean;
    isLoggedIn: boolean;
    isLoggedOut: boolean;
    payload :{
        username : string;
        password : string;
    }
    token: string;
    refreshToken: string;
    msg: string;
};

export type ActionReqGetDataLogin = PayloadAction<object>;
export type ActionResGetDataLogin = PayloadAction<{
    token: authState["token"];
    refreshToken: authState["refreshToken"];
}>;
export type ActionResGetDataRefreshToken = PayloadAction<{
    token: authState["token"];
}>

export type ActionResLogOut = PayloadAction<{
    msg: authState["msg"];
}>;

export type ActionReqLogOut = PayloadAction<{
}>;

