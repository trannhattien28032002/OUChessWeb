using Newtonsoft.Json.Linq;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class LobbyCreateUI : MonoBehaviour
{
    [SerializeField] private Button closeButton;
    [SerializeField] private Button createPublicButton;
    [SerializeField] private Button createPrivateButton;
    [SerializeField] private TMP_InputField lobbyNameInputField;
    [SerializeField] private RadioButtonSystem radioButtonSystem;

    private void Awake()
    {
        string accountJson = PlayerPrefs.GetString("AccountData");
        Users account = JsonUtility.FromJson<Users>(accountJson);

        createPublicButton.onClick.AddListener(() =>
        {
            JObject reqCreateRoom = new JObject();
            reqCreateRoom["type"] = "new";
            reqCreateRoom["title"] = lobbyNameInputField.text;
            reqCreateRoom["color"] = radioButtonSystem.GetValue();

            SocketIOComponent.Instance.Emit("join-room", reqCreateRoom);
        });

        createPrivateButton.onClick.AddListener(() =>
        {
            //socket.Emit("join-room", true);
        });

        closeButton.onClick.AddListener(() =>
        {
            Hide();
        });
    }

    private void Start()
    {
        Hide();
    }

    public void Show()
    {
        gameObject.SetActive(true);
        createPublicButton.Select();
    }

    private void Hide()
    {
        gameObject.SetActive(false);
    }
}
