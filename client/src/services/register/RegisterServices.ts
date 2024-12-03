import { ROOT_URL, CONTENT_TYPE, COMMON } from "src/config/ApiConstants";
import * as Type from "src/services/register/Types";

export const checkExist = async (username: string, email: string, phone: number): Promise<Type.ResCheckExist> => {
    const url = ROOT_URL + COMMON.API_CHECK_EXIST.URL;
    const res = await fetch(url, {
        method: COMMON.API_CHECK_EXIST.METHOD,
        body: JSON.stringify({
            username: username,
            email: email,
            phone: phone,
        }),
        headers: {
            "content-type": CONTENT_TYPE
        }
    });
    return await res.json();
};

export const sendVerify = async (emailVerify: string): Promise<Type.ResFetchSendDataVerify> => {
    const url = ROOT_URL + COMMON.API_SEND_VERIFY.URL;
    const res = await fetch(url, {
        method: COMMON.API_SEND_VERIFY.METHOD,
        body: JSON.stringify({ emailVerify }),
        headers: {
            "content-type": CONTENT_TYPE,
        },
    });
    return await res.json();
};

export const checkDataRegister = async (): Promise<Type.ResFetchCheckDataRegister> => {
    const url = ROOT_URL;
    const res = await fetch(url, {});
    return await res.json();
};

export const sendDataRegister = async (information: object): Promise<Type.ResFetchSendDataRegister> => {
    const url = ROOT_URL + COMMON.API_REGISTER.URL;
    console.log(information);
    const res = await fetch(url, {
        method: COMMON.API_REGISTER.METHOD,
        body: JSON.stringify(information),
        headers: {
            "content-type": CONTENT_TYPE,
        },
    });
    return await res.json();
};

export const resetPassword = async (
    emailReset: string,
    passwordReset: string,
): Promise<Type.ResFetchChangePassword> => {
    const url = ROOT_URL + COMMON.API_RESET_PASSWORD.URL;
    const res = await fetch(url, {
        method: COMMON.API_RESET_PASSWORD.METHOD,
        body: JSON.stringify({ emailReset, newPassword: passwordReset }),
        headers: {
            "content-type": CONTENT_TYPE,
        },
    });
    return await res.json();
};
