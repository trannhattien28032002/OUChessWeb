import type { Response } from "src/config/Constants";
import { userState } from "src/redux/reducer/user/Types";
import { CommonState } from "src/redux/reducer/common/Types";

export type ResFetchGetCurrrentUser = Response<{
    currentUser: userState["currentUser"];
    friends: userState["friends"];
    errorMsg: CommonState["errorMsg"];
}>;

export type ResFetchPatchUpdateUser = Response<{
    currentUser: userState["currentUser"];
    errorMsg: CommonState["errorMsg"];
}>;

export type ResFetchPatchChangePassword = Response<{
    newPassword: userState["password"];
    errorMsg: CommonState["errorMsg"];
}>;

export type ResFetchPatchChangeAvatar = Response<{
    newAvatar: userState["currentUser"]["avatar"];
    errorMsg: CommonState["errorMsg"];
}>;

