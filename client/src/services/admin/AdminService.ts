import Cookies from "js-cookie";
import { ROOT_URL, CONTENT_TYPE, ADMIN } from "src/config/ApiConstants";
import * as Types from "src/services/admin/Types";

export const fetchGetListUser = async (kw: string): Promise<Types.resFetchGetListUserFromAdmin> => {
    const { URL, METHOD } = ADMIN.API_GET_LIST_USER;
    const url = `${ROOT_URL}${URL}/?username=${kw}`;
    const res = await fetch(url, {
        method: METHOD,
        headers: {
            "Content-type": CONTENT_TYPE,
            Authorization: "Bearer " + Cookies.get("token"),
        },
    });

    return await res.json();
};

export const fetchAddUser = async (newUser: FormData): Promise<Types.resAddUserFromAdmin> => {
    const { URL, METHOD } = ADMIN.API_ADD_USER;
    const url = ROOT_URL + URL;
    const res = await fetch(url, {
        method: METHOD,
        body: newUser,
        headers: {
            Authorization: "Bearer " + Cookies.get("token"),
        },
    });

    return await res.json();
};

export const fetchUpdateUser = async (updateUser: FormData): Promise<Types.resUpdateUserFromAdmin> => {
    const { URL, METHOD } = ADMIN.API_UPDATE_USER;
    const url = ROOT_URL + URL;
    const res = await fetch(url, {
        method: METHOD,
        body: updateUser,
        headers: {
            Authorization: "Bearer " + Cookies.get("token"),
        },
    });
    return await res.json();
};

export const fetchDeletedUser = async (username: string): Promise<Types.resDeletedUserFromAdmin> => {
    const { URL, METHOD } = ADMIN.API_DELETE_USER(username);
    const url = ROOT_URL + URL;
    const res = await fetch(url, {
        method: METHOD,
        headers: {
            Authorization: "Bearer " + Cookies.get("token"),
        },
    });
    return await res.json();
}
