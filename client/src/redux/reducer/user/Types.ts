import { PayloadAction } from "@reduxjs/toolkit";
import { Friend } from "src/redux/reducer/profile/Types";

export type User = {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
    phone: string;
    dateOfBirth: Date;
    email: string;
    elo: number;
    nation: string;
    avatar: string;
    role?: string;
    // friends: { [key: string]: any }[]
}

export type userState = {
    currentUser: User;
    friends: Friend[];
    password: string;
    isLoading?: boolean;
};

export type ActionReqGetCurrentUser = PayloadAction<{}>;
export type ActionResGetCurrentUser = PayloadAction<{
    currentUser: userState["currentUser"];
    friends: userState["friends"];
}>;
export type ActionReqPatchUpdateUser = PayloadAction<{}>;
export type ActionResPatchUpdateUser = PayloadAction<{
    currentUser: userState["currentUser"];
}>;
export type ActionReqPatchChangePassword = PayloadAction<{}>;
export type ActionResPatchChangePassword = PayloadAction<{}>;
export type ActionReqChangeAvatar = PayloadAction<{}>;
export type ActionResChangeAvatar = PayloadAction<{
    newAvatar: userState["currentUser"]["avatar"];
}>;

export type ActionReqSetFriends = PayloadAction<{
    friends: Friend[];
}>;

export type ActionClearUser = PayloadAction<{}>

export type ActionReqPatchUpdateElo = PayloadAction<{
    username: string;
    elo: number;
}>