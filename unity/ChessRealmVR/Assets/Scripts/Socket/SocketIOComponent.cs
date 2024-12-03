using Newtonsoft.Json.Linq;
using SocketIOClient.Newtonsoft.Json;
using SocketIOClient;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UnityEngine;
using System.Net.Sockets;
using WebSocketSharp;
using Unity.VisualScripting.Antlr3.Runtime;
using UnityEditor.PackageManager;

public class SocketIOComponent : MonoBehaviour
{
    private static SocketIOComponent _instance;
    public static SocketIOComponent Instance
    {
        get
        {
            if (_instance == null)
            {
                GameObject go = new GameObject("SocketIOComponent");
                _instance = go.AddComponent<SocketIOComponent>();
                DontDestroyOnLoad(go);
            }
            return _instance;
        }
    }

    private SocketIOUnity socket;
    public event EventHandler OnConnectedEvent;

    [Header("Components")]
    [SerializeField] private string _authHost = "http://localhost:8080";

    private void Awake()
    {
        if (_instance == null)
        {
            _instance = this;
            DontDestroyOnLoad(gameObject);
            InitializeSocket();
        }
        else if (_instance != this)
        {
            Destroy(gameObject);
        }
    }

    private void InitializeSocket()
    {
        var token = AppState.Instance.GetState<string>("Token");
        StartCoroutine(APIClient.Instance.FetchCurrentUser(token, OnConnectedSocketWithCurrentUserSuccess, OnConnectedCurrentUserFailture));
    }

    private void OnConnectedSocketWithCurrentUserSuccess(string response)
    {
        var uri = new Uri(_authHost);
        var token = AppState.Instance.GetState<string>("Token");
        JObject resCurrentUser = JObject.Parse(response);
        Debug.Log(response);
        UserInfo userInfo = new UserInfo
        {
            _id = resCurrentUser["data"]["currentUser"]["_id"].ToString(),
            username = resCurrentUser["data"]["currentUser"]["username"].ToString(),
            firstName = resCurrentUser["data"]["currentUser"]["firstName"].ToString(),
            lastName = resCurrentUser["data"]["currentUser"]["lastName"].ToString(),
            phone = resCurrentUser["data"]["currentUser"]["phone"].ToString(),
            dateOfBirth = DateTime.Parse(resCurrentUser["data"]["currentUser"]["dateOfBirth"].ToString()),
            email = resCurrentUser["data"]["currentUser"]["email"].ToString(),
            elo = int.Parse(resCurrentUser["data"]["currentUser"]["elo"].ToString()),
            nation = resCurrentUser["data"]["currentUser"]["nation"].ToString(),
            avatar = resCurrentUser["data"]["currentUser"]["avatar"].ToString(),
            role = resCurrentUser["data"]["currentUser"]["role"].ToString()
        };
        socket = new SocketIOUnity(uri, new SocketIOOptions
        {
            Auth = new AuthData
            {
                token = token,
                userInfo = userInfo,
                type = "VR"
            },
            EIO = 4,
            Transport = SocketIOClient.Transport.TransportProtocol.WebSocket
        });
        socket.JsonSerializer = new NewtonsoftJsonSerializer();

        socket.OnConnected += OnConnected;

        socket.Connect();
    }

    private void OnConnectedCurrentUserFailture(string error)
    {
        Debug.LogError("Failed to fetch current user: " + error);
    }

    private void OnConnected(object sender, EventArgs e)
    {
        RoomManager.OnCreateRoom += (request) =>
        {
            SocketIOComponent.Instance.Emit("join-room", new { type = "new", title = request.title, id = request.own, color = request.color });
        };

        RoomManager.OnJoinRoom += (request) =>
        {
            SocketIOComponent.Instance.Emit("join-room", new { type = "join", rID = request.rId, id = request.uId });
        };

        RoomManager.OnLeaveRoom += (request) =>
        {
            SocketIOComponent.Instance.Emit("leave-room", new { type = "End", rId = request.rId, uId = request.uId });
        };

        RoomManager.OnMoving += (request) =>
        {
            SocketIOComponent.Instance.Emit("send-move", new { rId = request.rId, moving = request.moving });
        };

        RoomManager.OnReconnected += (request) =>
        {
            SocketIOComponent.Instance.Emit("initializing-detail", new { detail = request.detail, gameState = request.gameState, history = request.history });
        };

        SocketEventHandlers.RegisterEventHandlers();
    }

    public void Emit(string eventName)
    {
        //Debug.Log(socket);
        socket.Emit(eventName);
    }

    public void Emit(string eventName, object parameter)
    {
        socket.Emit(eventName, parameter);
    }

    public void Emit(string eventName, JObject parameter)
    {
        socket.Emit(eventName, parameter);
    }

    public void On(string eventName, Action<SocketIOResponse> socketIOResponse)
    {
        socket.On(eventName, socketIOResponse);
    }

    public void Disconnect()
    {
        socket.Disconnect();
    }
}

