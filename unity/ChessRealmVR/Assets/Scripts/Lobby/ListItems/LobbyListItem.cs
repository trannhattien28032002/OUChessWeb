using UnityEngine;
using UnityEngine.UI;
using System.Collections;
using TMPro;
using static LobbyManager;
using UnityEngine.SceneManagement;
using Newtonsoft.Json.Linq;
using System;

public class LobbyListItem : MonoBehaviour
{

    [SerializeField] private TextMeshProUGUI roomName;
    [SerializeField] private TextMeshProUGUI roomPlayers;
    [SerializeField] private Button joinRoomButton;

    public Room room;

    public void SetRoom(Room room)
    {
        this.room = room;

        roomName.text = room.title;
        roomPlayers.text = room.player.Count + "/2";

        joinRoomButton.onClick.AddListener(() =>
        {
            var currentUserId = PlayerPrefs.GetString("current-user-id");
            var payload = new JObject();
            payload["type"] = "join";
            payload["rID"] = room.id;
            payload["id"] = currentUserId;
            Debug.Log(payload["rID"]);
            SocketIOComponent.Instance.Emit("join-room", payload.ToString());
        });
    }
}

