import { createSlice } from "@reduxjs/toolkit";
import * as Type from "src/redux/reducer/register/Types";

const initialState: Type.registerState = {
    isLoading: false,
    isSuccess: false,
    verifyToken: "",
    msg: "",
    errors: {}
};

const registerSlice = createSlice({
    name: "register",
    initialState,
    reducers: {
        reqCheckDataRegister: (state, action) => {

        },
        reqSendDataVerify: (state, action: Type.ActionReqSendDataVerify): void => {
            state.isLoading = true;
        },
        resSendDataVerify: (state, action: Type.ActionResSendDataVerify): void => {
            const { verifyToken } = action.payload;
            state.isLoading = false;
            state.verifyToken = verifyToken;
        },
        reqSendDataRegister: (state, action: Type.ActionReqSetDataRegister): void => {
            state.isLoading = true;
            state.isSuccess = false;
        },
        resSendDataRegister: (state, action: Type.ActionResSetDataRegister): void => {
            state.isLoading = false;
            state.isSuccess = true;
        },
        reqChangePassword: (state, action: Type.ActionReqChangePassword): void => {
            state.isLoading = true;
            state.isSuccess = false;
        },
        resChangePasswrod: (state, action:Type.ActionResChangePassword): void => {
            state.isLoading = false;
            state.isSuccess = true;
        },
        reqCheckExist: (state, action: Type.ActionReqCheckExist): void => {
            state.isLoading = true;
        },
        resCheckExist: (state, action: Type.ActionResCheckExist): void => {
            const {errors} = action.payload
            state.isLoading = false;
            state.errors = errors;
        }
    },
});

export const registerActions = registerSlice.actions;
export default registerSlice.reducer;
