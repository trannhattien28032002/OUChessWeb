const apiConstant = {
    API_SIGN_UP: "/authapi-signup",
    API_SIGN_IN: "/authapi-signin",
    API_CHECK_EXIST: "/authapi-checkexist",
    API_SEND_VERIFY: "/authapi-sendverify",
    API_RESET_PASSWORD: "/authapi-resetpassword",
    API_GET_CURRENT_USER: "/userapi-getcurrent",
    API_GET_USER_BY_ID: "/:id",
    API_GET_USER_PROFILE: "/:username/userapi-getprofile",
    API_LOAD_COMMENT_USER: "/:username/userapi-getcommentinfo",
    API_LOAD_MATCH_USER: "/:_id/userapi-getmatches",
    API_GET_MATCH: "/matchapi-getmatch",
    API_ADD_MATCH: "/matchapi-addmatch",
    API_UPDATE_MATCH_BY_ID: "/matchapi-updatematch/:matchId",
    API_DELETE_MATCH: "/matchapi-deletematch",
    API_GET_MATCH_BY_ID: "/matchapi-getmatchbyid/:matchId",
    API_GET_LIST_USER: "/userapi-getlistuser/",
    API_GOOGLE_AUTHENTICATED: "/authapi-google-auth",
    API_SAVE_MATCH: "/matchapi-savematch",

    API_UPDATE_USER_PROFILE: "/:username/userapi-updateuser",
    API_UPDATE_USER_PASSWORD: "/:username/userapi-changepassword",
    API_UPDATE_USER_AVATAR: "/:username/userapi-changeavatar",

    API_ADMIN_GET_LIST_USER: "/adminapi-getlistuser",
    API_ADMIN_ADD_USER: "/adminapi-adduser",
    API_ADMIN_UPDATE_USER: "/adminapi-updateuser",
    API_ADMIN_DELETE_USER: "/adminapi-deleteuser/:username"
};

module.exports = apiConstant;