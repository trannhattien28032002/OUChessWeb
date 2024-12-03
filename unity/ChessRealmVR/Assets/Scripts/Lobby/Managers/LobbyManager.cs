using Newtonsoft.Json.Linq;
using PimDeWitte.UnityMainThreadDispatcher;
using SocketIOClient;
using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;
using static NetworkManager;
using static SocketReceiver;

public class LobbyManager : MonoBehaviour
{

    public SocketReceiver socketReceiver;
    public static LobbyManager instance;

    void Awake()
    {
        if (instance == null)
            instance = this;
        else if (instance != this)
            Destroy(gameObject);
        DontDestroyOnLoad(gameObject);
    }

    void Start()
    {
        if (SocketIOComponent.Instance != null)
        {
            SocketIOComponent.Instance.OnConnectedEvent += OnSocketConnected;
        }
        else
        {
            Debug.LogError("SocketIOComponent instance is null");
        }
        //SocketIOComponent.Instance.On("rep-get-rooms", OnRoomListReceived);
    }

    private void OnSocketConnected(object sender, EventArgs e)
    {
        SocketIOComponent.Instance.On("rep-get-rooms", OnRoomListReceived);
        SocketIOComponent.Instance.On("rep-join-room", OnResJoinRoom);
    }

    public void OnRoomListReceived(SocketIOResponse socketIOResponse)
    {
        UnityMainThreadDispatcher.Instance().Enqueue(() =>
        {
            Debug.Log(socketIOResponse);
            ListRoomJSON data = socketIOResponse.GetValue<ListRoomJSON>();
            socketReceiver.SocketGotRoomList(data);
        });
    }

    public void OnResJoinRoom(SocketIOResponse socketIOResponse)
    {
        UnityMainThreadDispatcher.Instance().Enqueue(() =>
        {
            Debug.Log(socketIOResponse);
            ResJoinRoom data = socketIOResponse.GetValue<ResJoinRoom>();
            AppState.Instance.SetState<ResJoinRoom>("CurrentRoom", data);
            SceneManager.LoadScene("Multiplayer VR Chess");
        });
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}
