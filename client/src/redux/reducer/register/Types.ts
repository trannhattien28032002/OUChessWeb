import { PayloadAction } from "@reduxjs/toolkit";


export type registerState = {
    isLoading: boolean;
    isSuccess: boolean;
    verifyToken: string;
    msg: string;
    errors: { [key: string]: { [key: string]: any } };
};

export type ActionReqCheckDataRegister = PayloadAction<{}>;
export type ActionResCheckDataRegister = PayloadAction<{
    msg: registerState["msg"];
}>;

export type ActionReqSendDataVerify = PayloadAction<{}>;
export type ActionResSendDataVerify = PayloadAction<{
    verifyToken: registerState["verifyToken"];
}>;
export type ActionReqSetDataRegister = PayloadAction<{}>;
export type ActionResSetDataRegister = PayloadAction<{
    msg: registerState["msg"];
}>;
export type ActionReqChangePassword = PayloadAction<{}>;
export type ActionResChangePassword = PayloadAction<{
    msg: registerState["msg"];
}>;

export type ActionReqCheckExist = PayloadAction<{}>;
export type ActionResCheckExist = PayloadAction<{
    errors: registerState["errors"]
}>
