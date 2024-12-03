using PimDeWitte.UnityMainThreadDispatcher;
using SocketIOClient;
using System;
using Unity.Services.Lobbies.Models;
using UnityEngine;
using UnityEngine.SceneManagement;

public class SocketEventHandlers : MonoBehaviour
{
    public static SocketReceiver socketReceiver;

    private static SocketEventHandlers _instance;

    public static void RegisterEventHandlers()
    {
        SocketIOComponent.Instance.On("newIncomingMessage", OnIncomingMessage);
        SocketIOComponent.Instance.On("playerJoined", OnPlayerJoined);
        SocketIOComponent.Instance.On("leftRoom", OnLeftRoom);
        SocketIOComponent.Instance.On("clientExistingPlayer", OnExistingPlayer);
        SocketIOComponent.Instance.On("cameraMoved", OnCameraMoved);
        SocketIOComponent.Instance.On("moveMade", OnMoveMade);
        SocketIOComponent.Instance.On("playersInRoom", OnPlayersInRoom);
        SocketIOComponent.Instance.On("promotedPawn", OnPromotedPawn);
        SocketIOComponent.Instance.On("newError", OnNewError);
        SocketIOComponent.Instance.On("acceptedRequest", OnAcceptedRequest);
        SocketIOComponent.Instance.On("addRequest", OnAddRequest);
        SocketIOComponent.Instance.On("removeRequest", OnRemoveRequest);
        SocketIOComponent.Instance.On("rep-get-rooms", OnRoomListReceived);
        SocketIOComponent.Instance.On("rep-join-room", OnJoinRoom);
        SocketIOComponent.Instance.On("req-leave-room", OnLeaveRoom);
        SocketIOComponent.Instance.On("res-draw", OnRoomListReceived);
        SocketIOComponent.Instance.On("req-draw-result", OnJoinRoom);
        SocketIOComponent.Instance.On("game-end", OnGameEnd);
        SocketIOComponent.Instance.On("reconnect-room", OnReconnectRoom);
        SocketIOComponent.Instance.On("opponent-disconnect", OnOpponentDisconnect);
        SocketIOComponent.Instance.On("initializing-detail", OnInitializingDetail);
        SocketIOComponent.Instance.On("respone-start-game", OnResponseStartGame);
        SocketIOComponent.Instance.On("response-kick-player", OnResponseKickPlayer);
        SocketIOComponent.Instance.On("req-send-move", OnReqSendMove);
    }

    public static void OnIncomingMessage(SocketIOResponse socketIOResponse)
    {

    }

    public static void OnPlayerJoined(SocketIOResponse socketIOResponse)
    {

    }

    public static void OnLeftRoom(SocketIOResponse socketIOResponse)
    {

    }

    public static void OnExistingPlayer(SocketIOResponse socketIOResponse)
    {

    }

    public static void OnCameraMoved(SocketIOResponse socketIOResponse)
    {

    }
    public static void OnMoveMade(SocketIOResponse socketIOResponse)
    {

    }
    public static void OnPlayersInRoom(SocketIOResponse socketIOResponse)
    {

    }
    public static void OnPromotedPawn(SocketIOResponse socketIOResponse)
    {

    }

    public static void OnNewError(SocketIOResponse socketIOResponse)
    {

    }

    public static void OnAcceptedRequest(SocketIOResponse socketIOResponse)
    {

    }

    public static void OnAddRequest(SocketIOResponse socketIOResponse)
    {

    }

    public static void OnRemoveRequest(SocketIOResponse socketIOResponse)
    {

    }

    public static void OnRoomListReceived(SocketIOResponse socketIOResponse)
    {
        UnityMainThreadDispatcher.Instance().Enqueue(() =>
        {
            Debug.Log(socketIOResponse);
            ListRoomJSON data = socketIOResponse.GetValue<ListRoomJSON>();
            socketReceiver.SocketGotRoomList(data);
        });
    }

    public static void OnJoinRoom(SocketIOResponse socketIOResponse)
    {
        UnityMainThreadDispatcher.Instance().Enqueue(() =>
        {
            Debug.Log($"Join room: {socketIOResponse}");
            ResJoinRoom data = socketIOResponse.GetValue<ResJoinRoom>();
            AppState.Instance.SetState<ResJoinRoom>("CurrentRoom", data);
            SceneManager.LoadScene("Multiplayer VR Chess");
        });
    }

    public static void OnLeaveRoom(SocketIOResponse socketIOResponse)
    {

    }

    public static void OnGameEnd(SocketIOResponse socketIOResponse)
    {

    }

    public static void OnReconnectRoom(SocketIOResponse socketIOResponse)
    {

    }

    public static void OnOpponentDisconnect(SocketIOResponse socketIOResponse)
    {

    }

    public static void OnInitializingDetail(SocketIOResponse socketIOResponse)
    {

    }

    public static void OnResponseStartGame(SocketIOResponse socketIOResponse)
    {

    }

    public static void OnResponseKickPlayer(SocketIOResponse socketIOResponse)
    {

    }

    public static void OnReqSendMove(SocketIOResponse socketIOResponse)
    {

    }
}

public class SocketReceiver : MonoBehaviour
{

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
