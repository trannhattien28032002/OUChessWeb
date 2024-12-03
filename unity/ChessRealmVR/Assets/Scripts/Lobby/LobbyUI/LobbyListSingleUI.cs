using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using Unity.Services.Lobbies.Models;
using UnityEngine.UI;


public class LobbySingleUIScript : MonoBehaviour
{
    [SerializeField] private TextMeshProUGUI lobbyNameText;
    private Lobby lobby;


    private void Awake()
    {
        //GetComponent<Button>().onClick.AddListener(() => {
        //    KitchenGameLobby.Instance.JoinWithId(lobby.Id);
        //});
    }

    public void SetLobby(Lobby lobby)
    {
        this.lobby = lobby;
        lobbyNameText.text = lobby.Name;
    }
}
