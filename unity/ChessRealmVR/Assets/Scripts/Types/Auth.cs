using System;

[Serializable]
public class Token
{
    public string token;
    public string refreshToken;
}

[Serializable]
public class AuthData
{
    public string token;
    public UserInfo userInfo;
    public string type;
}