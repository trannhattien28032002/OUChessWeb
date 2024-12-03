import type { Response } from "src/config/Constants"
import { registerState } from "src/redux/reducer/register/Types"

export type ResFetchSendDataVerify = Response<{
    verifyToken: registerState["verifyToken"];
}>

export type ResFetchCheckDataRegister = Response<{
    msg: registerState["msg"];
}>

export type ResFetchSendDataRegister = Response<{
    msg: registerState["msg"];
}>

export type ResFetchChangePassword = Response<{
    msg: registerState["msg"];
}>

export type ResCheckExist = Response<{
    errors: registerState["errors"]
}>