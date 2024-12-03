using JetBrains.Annotations;
using System;
using System.Collections.Generic;
using static LobbyManager;

[Serializable]
public class CurrentUserResponse
{
    public User currentUser;
    public List<Friend> friends;
}

[Serializable]
public class Users
{
    public string _id { get; set; }
    public string username { get; set; }
    public string password { get; set; }
    public string firstname { get; set; }
    public string lastname { get; set; }
    public DateTime dateOfBirth { get; set; }
    public string email { get; set; }
    public string phone { get; set; }
    public string nation { get; set; }
    public string avatar { get; set; }
    public int elo { get; set; }
    public string role { get; set; }
    public string[] friends { get; set; }
    public DateTime createdAt { get; set; }
    public DateTime updatedAt { get; set; }
    public int __v { get; set; }
}

[Serializable]
public class User {
    public string _id { get; set; }
    public string username { get; set; }
    public string firstName { get; set; }
    public string lastName { get; set; }
    public DateTime dateOfBirth { get; set; }
    public string email { get; set; }
    public long phone { get; set; }
    public string nation { get; set; }
    public string avatar { get; set; }
    public int elo { get; set; }
    public string role { get; set; }
    public DateTime updatedAt { get; set; }
}

[Serializable]
public class Friend
{
    public string _id { get; set; }
    public Requester requester { get; set; }
    public Recipient recipient { get; set; }
    public int status { get; set; }
    public DateTime createdAt { get; set; }
    public DateTime updatedAt { get; set; }
    public int __v { get; set; }
}

[Serializable]
public class Requester
{
    public string _id { get; set; }
    public string username { get; set; }
    public string avatar { get; set; }
}

[Serializable]
public class Recipient
{
    public string _id { get; set; }
    public string username { get; set; }
    public string avatar { get; set; }
}

[Serializable]
public struct UserInfo
{
    public string _id { get; set; }
    public string username { get; set; }
    public string firstName { get; set; }
    public string lastName { get; set; }
    public string phone { get; set; }
    public DateTime dateOfBirth { get; set; }
    public string email { get; set; }
    public int elo { get; set; }
    public string nation { get; set; }
    public string avatar { get; set; }
    public string role { get; set; }
}