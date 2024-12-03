//using System;
//using System.Collections;
//using System.Collections.Generic;
//using System.Threading.Tasks;
//using Unity.Services.Authentication;
//using Unity.Services.Core;
//using Unity.Services.Lobbies.Models;
//using Unity.Services.Lobbies;
//using UnityEngine;
//using UnityEngine.SceneManagement;
//using ChessPieces;

//public class LobbyGameManager : MonoBehaviour
//{
//    static LobbyGameManager instance = null;
//    public static LobbyGameManager Instance { get { return instance; } }

//    SocketLobbyUI ui;
//    public static SocketLobbyUI UI { get { return instance.ui; } }

//    //public SocketLobbySettings settings;

//    public string connectionID;
    
//    //Room room;
//    //Player player;

//    //public static Room Room { get { return instance.room; } }
//    public static Player Player { get { return instance.player; } }

//    void Awake()
//    {
//        if (instance != null) GameObject.Destroy(instance.gameObject);
//        DontDestroyOnLoad(this);

//        instance = this;

//        //settings.gameServerUrl = settings.defaultGameServerUrl;
//    }

//    void Start()
//    {
//        //ui = GetComponent<SocketLobbyUIManager>();

//        //ConfigData config = new ConfigData();
//        //config.maxPlayersPerRoom = settings.maxPlayersPerRoom;
//        //config.minPlayerToStartGame = settings.minPlayersToStartGame;
//        //config.playerColors = settings.playerColors;
//        //config.defaultPlayerColor = settings.defaultPlayerColorIndex;

//        //SocketSender.Send("SetConfig", JsonUtility.ToJson(config));

//        //ui.CreateTopPanel();
//        //ui.CreateConnectPanel();

//        //SocketReceiver.OnConnected += OnConnected;
//        //SocketReceiver.OnDisconnected += OnDisconnected;
//        //SocketReceiver.OnConnectionTimeout += OnConnectionTimeout;
//        //SocketReceiver.OnStartedGame += OnStartedGame;
//    }

//    void OnConnected(string connectionID)
//    {
//        this.connectionID = connectionID;
//        ui.CreateLobbyPanel();
//    }

//    void OnDisconnected()
//    {
//        connectionID = "";
//        room = null;

//        //SceneManager.LoadScene(settings.lobbySceneBuildIndex);
//    }

//    void OnConnectionTimeout()
//    {
//        connectionID = "";
//        room = null;

//        //if (ui.connectPanel != null)
//        //{
//        //    ui.connectPanel.EnableConnectButton();
//        //}
//    }

//    void OnStartedGame()
//    {
//        ui.DeleteTopPanel();
//        ui.DeleteRoomPanel();
//        //SceneManager.LoadScene(settings.gameSceneBuildIndex);
//    }

//    public void SetGameServerUrl(string value)
//    {
//        //settings.gameServerUrl = value.Length == 0 ? settings.defaultGameServerUrl : value;
//    }

//    //public void SetRoom(Room room)
//    //{
//    //    this.room = room;
//    //    ui.CreateRoomPanel();
//    //}

//    public void SetPlayer(Player player)
//    {
//        this.player = player;
//    }

//    public void BackToLobby()
//    {
//        room = null;
//        ui.CreateLobbyPanel();
//    }
//}
