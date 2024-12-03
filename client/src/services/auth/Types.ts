import type { Response } from "src/config/Constants";
import { authState } from "src/redux/reducer/auth/Types";
import { CommonState } from "src/redux/reducer/common/Types";

export type ResFetchGetDataLogin = Response<{
    token: authState["token"];
    refreshToken: authState["refreshToken"];
    errorMsg: CommonState["errorMsg"];
}>;

export type ResFetchGetDataTokenRefresh = Response<{
    token: authState["token"];
    errorMsg: CommonState["errorMsg"];
}>;

export type ResFetchLogOut = Response<{
    msg: authState["msg"];
    errorMsg: CommonState["errorMsg"];
}>;
