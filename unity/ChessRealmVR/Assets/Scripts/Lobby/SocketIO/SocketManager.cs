//using UnityEngine;
//using SocketIOClient;
//using Newtonsoft.Json;
//using Unity.Services.Lobbies.Models;
//using System.Collections.Generic;
//using System.Linq;
//using Players;
//using System;
//using System.Collections;
//using SocketIOClient.Newtonsoft.Json;
//using UnityEditor.Rendering;
//using Newtonsoft.Json.Linq;
//using Unity.VisualScripting.Antlr3.Runtime;

//public class SocketManager : MonoBehaviour
//{
//    private static SocketManager instance;
//    private SocketIOUnity socket;
//    [Header("Components")]
//    [SerializeField] private string _authHost = "http://localhost:8080";

//    public delegate void RoomListReceived(Rooms roomListData);
//    public event RoomListReceived OnRoomListReceived;

//    //public delegate void RoomJoinedAction(ResResultJoinRoom resDataJoinRoom);
//    //public event RoomJoinedAction OnRoomJoined;



//    //public delegate void RoomCreatedAction(RoomData room);
//    //public event RoomCreatedAction OnRoomCreated;

//    private IEnumerator OnEmit(SocketIOUnity socket)
//    {
//        yield return new WaitForSeconds(1);
//        socket.Emit("get-rooms");
//    }

//    private void Start()
//    {
//        Initialize(_authHost);
//    }

//    public static SocketManager Instance
//    {
//        get
//        {
//            if (instance == null)
//            {
//                instance = FindObjectOfType<SocketManager>();
//                if (instance == null)
//                {
//                    GameObject obj = new GameObject();
//                    obj.name = "SocketManager";
//                    instance = obj.AddComponent<SocketManager>();
//                    DontDestroyOnLoad(obj);
//                }
//            }
//            return instance;
//        }
//    }

//    public void Initialize(string authHost)
//    {
//        var uri = new Uri(authHost);
//        socket = new SocketIOUnity(uri, new SocketIOOptions
//        {
//            Query = new Dictionary<string, string>
//            {
//                {"token", "UNITY" }
//            },
//            EIO = 4,
//            Transport = SocketIOClient.Transport.TransportProtocol.WebSocket
//        });
//        socket.JsonSerializer = new NewtonsoftJsonSerializer();

//        socket.OnConnected += (sender, e) =>
//        {
//            Debug.Log("Connected");
//        };

//        socket.On("rep-get-rooms", (data) =>
//        {
//            var obj = JToken.Parse(data.ToString());
//            Debug.Log(obj);
//            List<Room> roomList = new List<Room>();

//            if (obj.Type == JTokenType.Array)
//            {
//                foreach (var roomToken in obj[0])
//                {
//                    string roomId = roomToken["id"].ToString();
//                    string roomTitle = roomToken["title"].ToString();

//                    JToken playersToken = roomToken["player"];
//                    List<User> playersList = new List<User>();

//                    if (playersToken.Type == JTokenType.Array)
//                    {
//                        foreach (JToken playerToken in playersToken)
//                        {
//                            User player = new User
//                            {
//                                _id = playerToken["_id"].ToString(),
//                                username = playerToken["username"].ToString(),
//                            };
//                            playersList.Add(player);
//                        }
//                    }

//                    Room room = new Room
//                    {
//                        id = roomId,
//                        title = roomTitle,
//                        player = playersList
//                    };

//                    roomList.Add(room);
//                }
//            }

//            Rooms rooms = new Rooms
//            {
//                rooms = roomList
//            };

//            OnRoomListReceived(rooms);
//        });

//        socket.On("rep-join-room", (data) =>
//        {
//        });
//        StartCoroutine(OnEmit(socket));
//        socket.Connect();
//    }

//    public static bool IsJSON(string str)
//    {
//        if (string.IsNullOrWhiteSpace(str)) { return false; }
//        str = str.Trim();
//        if ((str.StartsWith("{") && str.EndsWith("}")) || //For object
//            (str.StartsWith("[") && str.EndsWith("]"))) //For array
//        {
//            try
//            {
//                var obj = JToken.Parse(str);
//                return true;
//            }
//            catch (Exception ex) //some other exception
//            {
//                Console.WriteLine(ex.ToString());
//                return false;
//            }
//        }
//        else
//        {
//            return false;
//        }
//    }

//    public void Emit(string eventName)
//    {
//        //Debug.Log(socket);
//        socket.Emit(eventName);
//    }

//    public void Emit(string eventName, object parameter)
//    {
//        socket.Emit(eventName, parameter);
//    }

//    // Add other socket-related methods as needed
//}