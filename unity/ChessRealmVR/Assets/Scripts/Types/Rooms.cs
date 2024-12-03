using System.Collections.Generic;
using System;

[Serializable]
public class ListRoomJSON : List<Room> { }

public class Room
{
    public string id { get; set; }
    public string title { get; set; }
    public List<PlayerRoom> player { get; set; }
}

public class PlayerRoom
{
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
    public int color { get; set; }
}

[Serializable]
public class ResJoinRoom
{
    public Room detail { get; set; }
    public int status { get; set; }
    public int color { get; set; }
}