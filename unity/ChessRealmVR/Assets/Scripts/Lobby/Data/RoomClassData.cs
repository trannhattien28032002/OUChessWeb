using System;

[Serializable]
public class ReqCreateRoom
{
    public string type;
    public string title;
    public string id;
    public int color;
}

public class ResRoomResult
{
    //public Room detail; // object cho phép lưu trữ bất kỳ kiểu dữ liệu nào
    public int status;
    public int color;
}

//public class RoomData
//{
//    public string id;
//    public string title;
//    public Users[] players;
//}
