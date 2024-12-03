export const ROOT_URL = process.env.REACT_APP_NODEJS_DOMAIN !== undefined ? process.env.REACT_APP_NODEJS_DOMAIN : "";
    // process.env.REACT_APP_NODEJS_HOST !== undefined && process.env.REACT_APP_NODEJS_PORT !== undefined
    //     ? process.env.REACT_APP_NODEJS_HOST + ":" + process.env.REACT_APP_NODEJS_PORT
    //     : "";
export const CONTENT_TYPE = "application/json; charset=UTF-8";

export const COMMON = {
    API_LOGIN: {
        URL: "/auth/authapi-signin",
        METHOD: "POST",
    },
    API_REGISTER: {
        URL: "/auth/authapi-signup",
        METHOD: "POST",
    },
    API_SEND_VERIFY: {
        URL: "/auth/authapi-sendverify",
        METHOD: "POST",
    },
    API_CHECK_EXIST: {
        URL: "/auth/authapi-checkexist",
        METHOD: "POST",
    },
    API_CHART: {
        URL: "/engines/chart",
        METHOD: "POST",
    },
    API_RESET_PASSWORD: {
        URL: "/auth/authapi-resetpassword",
        METHOD: "POST",
    },
};

export const USER = {
    API_CURRENT_USER: {
        URL: "/user/userapi-getcurrent",
        METHOD: "GET",
    },

    API_UPDATE_USER: (username: string) => {
        return {
            URL: `/user/${username}/userapi-updateuser`,
            METHOD: "PATCH",
        };
    },
    API_CHANGE_PASSWORD: (username: string) => {
        return {
            URL: `/user/${username}/userapi-changepassword`,
            METHOD: "PATCH",
        };
    },
    API_CHANGE_AVATAR: (username: string) => {
        return {
            URL: `/user/${username}/userapi-changeavatar`,
            METHOD: "PATCH",
        };
    },
    API_GET_FRIENDS: (username: string) => {
        return {
            URL: `/user/${username}/userapi-getfriends`,
            METHOD: "GET",
        };
    },
    API_UPDATE_ELO: (username: string) => {
        return {
            URL: `/user/${username}/userapi-updateelo`,
            METHOD: "PATCH"
        }
    }
};

export const HISTORY = {
    API_ADD_HISTORY: {
        URL: "/history/api-add",
        METHOD: "POST",
    },
};

export const MATCH = {
    API_GET_MATCH: {
        URL: "/match/matchapi-getmatch",
        METHOD: "GET",
    },
    API_ADD_MATCH: {
        URL: "/match/matchapi-addmatch",
        METHOD: "POST"
    },
    API_PUT_MATCH_BY_ID: (matchId: string) => {
        return {
            URL: `/match/matchapi-updatematch/${matchId}`,
            METHOD: "PATCH"
        }
    },
    API_GET_MATCH_BY_ID: (matchId: string) => {
        return {
            URL: `/match/matchapi-getmatchbyid/${matchId}`,
            METHOD: "GET"
        }
    },
    API_SAVE_MATCH: {
        URL: "/match/matchapi-savematch",
        METHOD: "POST"
    }
}

export const PROFILE = {
    API_GET_PROFILE: (username: string) => {
        return {
            URL: `/user/${username}/userapi-getprofile`,
            METHOD: "GET",
        };
    },
    API_GET_COMMENT_INFO: (username: string) => {
        return {
            URL: `/user/${username}/userapi-getcommentinfo`,
            METHOD: "GET",
        };
    },
    API_GET_LIST_USER: {
        URL: "/user/userapi-getlistuser",
        METHOD: "GET",
    },
    API_GET_MATCHES: (_id: string) => {
        return {
            URL: `/user/${_id}/userapi-getmatches`,
            METHOD: "GET"
        }
    }
};

export const ADMIN = {
    API_GET_LIST_USER: {
        URL: `/admin/adminapi-getlistuser`,
        METHOD: "GET",
    },
    API_ADD_USER: {
        URL: `/admin/adminapi-adduser`,
        METHOD: `POST`,
    },
    API_UPDATE_USER: {
        URL: `/admin/adminapi-updateuser/`,
        METHOD: `PUT`,
    },
    API_DELETE_USER: (username: string) => {
        return {
            URL: `/admin/adminapi-deleteuser/${username}`,
            METHOD: `DELETE`,
        };
    },
};
