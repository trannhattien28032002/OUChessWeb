import { ROOT_URL, CONTENT_TYPE, PROFILE } from "src/config/ApiConstants";
import * as Types from "src/services/profile/Types";

export const fetchProfile = async (username: string): Promise<Types.ResFetchGetProfile> => {
    const url = ROOT_URL + PROFILE.API_GET_PROFILE(username).URL;

    const res = await fetch(url, {
        method: PROFILE.API_GET_PROFILE(username).METHOD,
        headers: {
            "content-type": CONTENT_TYPE,
        },
    });

    return await res.json();
};

export const fetchCommentInfo = async (username: string, params: any): Promise<Types.ResFetchGetCommentInfoUser> => {
    const url = ROOT_URL + PROFILE.API_GET_COMMENT_INFO(username).URL;
    const res = await fetch(url, {
        method: PROFILE.API_GET_COMMENT_INFO(username).METHOD,
        headers: {
            "content-type": CONTENT_TYPE
        }
    });

    return await res.json();
};

export const fetchGetListUser = async (kw: string):Promise<Types.ResGetListUser> => {
    const {URL, METHOD} = PROFILE.API_GET_LIST_USER;
    const url = `${ROOT_URL}${URL}/?username=${kw}`;
    const res = await fetch(url, {
        method: METHOD,
        headers: {
            "Content-type": CONTENT_TYPE
        }
    })

    return await res.json();
};

export const fetchMatches = async (_id: string): Promise<Types.ResFetchGetMatchesOfUser> => {
    const {URL, METHOD} = PROFILE.API_GET_MATCHES(_id);
    const url = `${ROOT_URL}${URL}`;
    const res = await fetch(url, {
        method: METHOD,
        headers: {
            "Content-type": CONTENT_TYPE
        }
    })

    return await res.json();
}