import { ROOT_URL, CONTENT_TYPE, COMMON } from "src/config/ApiConstants";
import * as Types from "src/services/auth/Types";

export const fetchLogin = async (username: string, password: string): Promise<Types.ResFetchGetDataLogin> => {
    const url = ROOT_URL + COMMON.API_LOGIN.URL;
    console.log(url);
    try {
        const res = await fetch(url, {
            method: COMMON.API_LOGIN.METHOD,
            body: JSON.stringify({ username, password }),
            headers: {
                "Content-type": CONTENT_TYPE,
            },
        });
        return await res.json();
    } catch (error) {
        console.log("error");
        return { code: 400, data: { token: "", refreshToken: "", errorMsg: "" }, message: "Lỗi" };
    }
};


