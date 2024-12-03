using Players;
using SocketIOClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UnityEngine;
using static LobbyManager;

public class SocketReceiver : MonoBehaviour
{
    public delegate void ConnectAction(string connectionID);
    public static event ConnectAction OnConnected;

    public delegate void DisconnectAction();
    public static event DisconnectAction OnDisconnected;

    public delegate void GotRoomListAction(ListRoomJSON rooms);
    public static event GotRoomListAction OnGotRoomList;

    public delegate void RoomCreatedAction(Room room);
    public static event RoomCreatedAction OnRoomCreated;

    public delegate void ResJoinRoomAction(ResJoinRoom room);
    public static event ResJoinRoomAction OnResJoinRoom;

    public void SocketGotRoomList(ListRoomJSON rooms)
    {
       if (OnGotRoomList != null) OnGotRoomList(rooms);
    }

    public void SocketRoomCreated(Room room)
    {
        if (OnRoomCreated != null) OnRoomCreated(room);
    }

    public void SocketResJoinRoom(ResJoinRoom resJoinRoom)
    {
        if (OnResJoinRoom != null) OnResJoinRoom(resJoinRoom); 
    }
}
