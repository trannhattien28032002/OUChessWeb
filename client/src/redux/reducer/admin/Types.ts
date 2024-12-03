import { PayloadAction } from "@reduxjs/toolkit";
import { Friend } from "src/redux/reducer/profile/Types";

export type userDataForm = {
    _id?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    dateOfBirth?: Date;
    nation?: string;
    elo?: number;
    username?: string;
    password?: string;
    confirmPassword?: string;
    createdAt?: Date;
    friends?: Friend[];
    avatar?: string;
    deletedAt?: Date;
    file?: object;
};

export type adminState = {
    userList: userDataForm[];
    isLoading: boolean;
    notify: {
        msg: string;
        type: string;
    };
};

export type ActionReqGetListUser = PayloadAction<{}>;
export type ActionResGetListUser = PayloadAction<{
    list: adminState["userList"];
}>;
export type ActionReqAddUser = PayloadAction<{}>;
export type ActionResAddUser = PayloadAction<{
    newUser: userDataForm;
}>
export type ActionReqUpdateUser = PayloadAction<{}>
export type ActionResUpdateUser = PayloadAction<{
    updatedUser: userDataForm;
}>
export type ActionReqDeleteUser = PayloadAction<{}>
export type ActionResDeleteUser = PayloadAction<{
    deletedUser: userDataForm;
}>


export type ActionSetNotify = PayloadAction<{
    notify: adminState["notify"];
}>;
