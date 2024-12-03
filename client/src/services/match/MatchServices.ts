import { Match, SaveMatch } from "src/redux/reducer/match/Types";
import { ROOT_URL, CONTENT_TYPE, MATCH } from "src/config/ApiConstants";
import * as Types from "src/services/match/Types";
import Cookies from "js-cookie";

export const fetchGetMatch = async (): Promise<Types.ResFetchGetMatch> => {
    const url = ROOT_URL + MATCH.API_GET_MATCH.URL;
    const response = await fetch(url, {
        method: MATCH.API_GET_MATCH.METHOD,
        headers: {
            "Content-type": CONTENT_TYPE,
        },
    });
    return await response.json();
}

export const fetchPostAddMatch = async (match: Match): Promise<Types.ResFetchPostAddMatch> => {
    const url = ROOT_URL + MATCH.API_ADD_MATCH.URL;
    console.log(match)
    const response = await fetch(url, {
        method: MATCH.API_ADD_MATCH.METHOD,
        body: JSON.stringify(match),
        headers: {
            "Content-type": CONTENT_TYPE,
        },
    });
    return await response.json();
}

export const fetchGetMatchById = async (matchId: string): Promise<Types.ResFetchGetMatchById> => {
    const url = `${ROOT_URL}${MATCH.API_GET_MATCH_BY_ID(matchId).URL}`;
    const response = await fetch(url, {
        method: MATCH.API_GET_MATCH_BY_ID(matchId).METHOD,
        headers: {
            "Content-type": CONTENT_TYPE,
        },
    });
    return await response.json();
}

export const fetchPutMatchById = async (matchId: string, match: Match): Promise<Types.ResFetchPutMatchById> => {
    const url = `${ROOT_URL}${MATCH.API_PUT_MATCH_BY_ID(matchId).URL}`;
    const response = await fetch(url, {
        method: MATCH.API_PUT_MATCH_BY_ID(matchId).METHOD,
        body: JSON.stringify({ matchId, match }),
        headers: {
            "Content-type": CONTENT_TYPE,
        }
    });
    return await response.json();
}

export const fetchSaveMatch = async (detail: SaveMatch): Promise<any> => {
    console.log("Match Service", detail);
    const url = `${ROOT_URL}${MATCH.API_SAVE_MATCH.URL}`;
    console.log(url);
    try {
        const response = await fetch(url, {
            method: MATCH.API_SAVE_MATCH.METHOD,
            body: JSON.stringify(detail),
            headers: {
                "Content-type": CONTENT_TYPE,
                Authorization: "Bearer " + Cookies.get("token")
            }
        })
        return await response.json();
    } catch (error) {
        console.log(error)
        return null;
    }

}
