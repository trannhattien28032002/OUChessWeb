using UnityEngine;
using UnityEngine.UI;
using System.Collections;
using PimDeWitte.UnityMainThreadDispatcher;
using UnityEngine.SceneManagement;
using TMPro;
using Newtonsoft.Json.Linq;

public class LobbyPanelUI : MonoBehaviour
{

    public Transform roomList;
    //[SerializeField] private Button refreshButton;2
    //[SerializeField] private InputField roomNameInput;
    //[SerializeField] private LobbyCreateUI lobbyCreateUI;


    //[SerializeField] private GameObject createRoomLoading;
    //[SerializeField] private GameObject joinRoomLoading;
    //[SerializeField] private GameObject fetchRoomListLoading;

    //public LobbyListItem lobbyListItemPrefab;
    //private LobbyListItem roomListItem;
    //private LobbyListItem[] roomListItems;

    //public string defaultRoomName = "RoomName";
    [SerializeField] private Button createLobbyButton;
    [SerializeField] private LobbyListItem lobbyListItemPrefab;
    [SerializeField] private LobbyCreateUI lobbyCreateUI;
    [SerializeField] private Button playBotButton;
    [SerializeField] private Button logOutButton;
    [SerializeField] private Button refreshButton;

    [SerializeField] private Image avatarImage;
    [SerializeField] private TextMeshProUGUI usernameTxt; 
    private void Awake()
    {
        //roomListTest = FindObjectOfType<>;
    }

    void Start()
    {
        string token = AppState.Instance.GetState<string>("Token");
        //roomNameInput.text = defaultRoomName;

        //createRoomButton.onClick.AddListener(() => {
        //    roomNameInput.interactable = false;
        //    createRoomButton.interactable = false;

        //    createRoomLoading.SetActive(true);

        //    SocketSender.Send("CreateRoom", roomNameInput.text == "" ? defaultRoomName : roomNameInput.text);
        //});
        createLobbyButton.onClick.AddListener(() => {
            lobbyCreateUI.Show();
        });

        refreshButton.onClick.AddListener(() =>
        {
            SocketIOComponent.Instance.Emit("get-rooms");
        });

        playBotButton.onClick.AddListener(() =>
        {
            SceneManager.LoadScene("Bot VR Chess");
        });

        logOutButton.onClick.AddListener(() =>
        {
            PlayerPrefs.DeleteAll();
            SceneManager.LoadScene("Login VR Scene");
        });

        refreshButton.onClick.AddListener(() =>
        {
            refreshButton.interactable = false;
            SocketIOComponent.Instance.Emit("get-rooms");
        });

        //fetchRoomListLoading.SetActive(true);
        StartCoroutine(APIClient.Instance.FetchCurrentUser(token, OnGetCurrentUserSuccess, OnGetCurrentUserFailture));
        StartCoroutine(GetRoomList());
    }
    IEnumerator GetRoomList()
    {
        yield return new WaitForSeconds(0.5f);
        SocketIOComponent.Instance.Emit("get-rooms");
    }

    private void OnGetCurrentUserSuccess(string response)
    {
        JObject resCurrentUser = JObject.Parse(response);
        PlayerPrefs.SetString("current-user-id", resCurrentUser["data"]["currentUser"]["_id"].ToString());
        string avatarUrl = resCurrentUser["data"]["currentUser"]["avatar"].ToString();
        ImageLoader imageLoader = FindObjectOfType<ImageLoader>();
        if (imageLoader != null)
        {
            imageLoader.LoadImageFromURL(avatarImage, avatarUrl);
        }
        string username = resCurrentUser["data"]["currentUser"]["username"].ToString();
        if (username != null)
        {
            usernameTxt.text = username;
        }
    }

    private void OnGetCurrentUserFailture(string error)
    {
        usernameTxt.text = "No name";
    }

    void OnEnable()
    {
        SocketReceiver.OnRoomCreated += OnRoomCreated;
        //SocketReceiver.OnRoomJoined += OnRoomJoined;
        SocketReceiver.OnGotRoomList += OnGotRoomList;
    }

    void OnDisable()
    {
        SocketReceiver.OnRoomCreated -= OnRoomCreated;
        //SocketReceiver.OnRoomJoined -= OnRoomJoined;
        SocketReceiver.OnGotRoomList -= OnGotRoomList;
    }

    void OnGotRoomList(ListRoomJSON rooms)
    {
        CreateRoomListItems(rooms);

        //fetchRoomListLoading.SetActive(false);
        //refreshButton.interactable = true;
    }

    void OnRoomCreated(Room room)
    {
        lobbyCreateUI.Show();
    }

    void CreateRoomListItems(ListRoomJSON rooms)
    {
        UnityMainThreadDispatcher.Instance().Enqueue(() =>
        {
            Debug.Log(rooms);
            LobbyListItem[] lobbyListItems = roomList.GetComponentsInChildren<LobbyListItem>();

            if (lobbyListItems != null)
            {
                for (int i = 0; i < lobbyListItems.Length; i++)
                {
                    bool remain = false;

                    for (int j = 0; j < rooms.Count; j++)
                    {
                        if (lobbyListItems[i].room.id == rooms[j].id)
                        {
                            remain = true;
                            break;
                        }
                    }

                    if (!remain)
                    {
                        GameObject.Destroy(lobbyListItems[i].gameObject);
                    }
                }
            }

            lobbyListItems = roomList.GetComponentsInChildren<LobbyListItem>();

            for (int i = 0; i < rooms.Count; i++)
            {
                LobbyListItem lobbyListItem = null;

                if (lobbyListItems != null)
                {
                    for (int j = 0; j < lobbyListItems.Length; j++)
                    {
                        if (lobbyListItems[j].room.id == rooms[i].id)
                        {
                            lobbyListItem = lobbyListItems[j];
                            break;
                        }
                    }
                }

                if (lobbyListItem == null)
                {
                    lobbyListItem = Instantiate(lobbyListItemPrefab) as LobbyListItem;
                    lobbyListItem.transform.SetParent(roomList, false);
                    lobbyListItem.gameObject.SetActive(true);
                }

                lobbyListItem.SetRoom(rooms[i]);
            }
        });
    }
}