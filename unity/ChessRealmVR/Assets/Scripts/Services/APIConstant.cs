public static class APIConstants
{
    public const string API_SIGN_UP = "/auth/authapi-signup";
    public const string API_SIGN_IN = "/auth/authapi-signin";
    public const string API_CHECK_EXIST = "/auth/authapi-checkexist";
    public const string API_SEND_VERIFY = "/auth/authapi-sendverify";
    public const string API_RESET_PASSWORD = "/auth/authapi-resetpassword";
    public const string API_GET_CURRENT_USER = "/user/userapi-getcurrent";
    public const string API_GET_USER_BY_ID = "/user/:id";
    public const string API_GET_USER_PROFILE = "/user/:username/userapi-getprofile";
    public const string API_LOAD_COMMENT_USER = "/user/:username/userapi-getcommentinfo";
    public const string API_LOAD_MATCH_USER = "/:_id/userapi-getmatches";
    public const string API_GET_MATCH = "/matchapi-getmatch";
    public const string API_ADD_MATCH = "/matchapi-addmatch";
    public const string API_UPDATE_MATCH_BY_ID = "/matchapi-updatematch/:matchId";
    public const string API_DELETE_MATCH = "/matchapi-deletematch";
    public const string API_GET_MATCH_BY_ID = "/matchapi-getmatchbyid/:matchId";
    public const string API_GET_LIST_USER = "/user/userapi-getlistuser/";
    public const string API_GOOGLE_AUTHENTICATED = "/authapi-google-auth";

    public const string API_UPDATE_USER_PROFILE = "/:username/userapi-updateuser";
    public const string API_UPDATE_USER_PASSWORD = "/:username/userapi-changepassword";
    public const string API_UPDATE_USER_AVATAR = "/:username/userapi-changeavatar";

    public const string API_ADMIN_GET_LIST_USER = "/adminapi-getlistuser";
    public const string API_ADMIN_ADD_USER = "/adminapi-adduser";
    public const string API_ADMIN_UPDATE_USER = "/adminapi-updateuser";
    public const string API_ADMIN_DELETE_USER = "/adminapi-deleteuser/:username";
}