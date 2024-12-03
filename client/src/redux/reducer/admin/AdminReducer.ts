import { createSlice } from "@reduxjs/toolkit";
import * as Types from "src/redux/reducer/admin/Types";

const initialState: Types.adminState = {
    userList: [],
    isLoading: false,
    notify: {
        msg: "",
        type: "",
    },
};

const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        reqGetListUser: (state, action: Types.ActionReqGetListUser) => {
            state.userList = [];
            state.isLoading = true;
            state.notify = initialState["notify"];
        },
        resGetListUser: (state, action: Types.ActionResGetListUser) => {
            const { list } = action.payload;
            state.userList = list;
            state.isLoading = false;
        },
        reqAddUser: (state, action: Types.ActionReqAddUser) => {
            state.isLoading = true;
            state.notify = initialState["notify"];
        },
        resAddUser: (state, action: Types.ActionResAddUser) => {
            const { newUser } = action.payload;
            state.isLoading = false;
            state.userList = [newUser, ...state.userList];
        },
        reqUpdateUser: (state, action: Types.ActionReqUpdateUser) => {
            state.isLoading = true;
            state.notify = initialState["notify"];
        },
        resUpdateUser: (state, action: Types.ActionResUpdateUser) => {
            const { updatedUser } = action.payload;
            state.isLoading = false;
            const i = state.userList.map((u: Types.userDataForm) => u._id).indexOf(updatedUser._id);
            state.userList.splice(i, 1, updatedUser);
        },
        reqDeletedUser: (state, action: Types.ActionReqDeleteUser) => {
            state.isLoading = true;
            state.notify = initialState["notify"];
        },
        resDeletedUser: (state, action: Types.ActionResDeleteUser) => {
            const { deletedUser } = action.payload;
            console.log(deletedUser);
            state.isLoading = false;
            const i = state.userList.map((u: Types.userDataForm) => u._id).indexOf(deletedUser._id);
            state.userList.splice(i, 1, deletedUser);
        },
        reqSetNotify: (state, action: Types.ActionSetNotify) => {
            const { notify } = action.payload;
            state.notify = notify;
            state.isLoading = false;
        },
    },
});

export const adminActions = adminSlice.actions;
export default adminSlice.reducer;
