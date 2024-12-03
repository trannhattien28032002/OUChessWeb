using UnityEngine;
using UnityEngine.UI;
using System.Collections;
public class ConnectPanelUI : SinglePanelUI
{

    public InputField serverInput;
    public Button connectButton;

    void Start()
    {
        connectButton.onClick.AddListener(() => {
            connectButton.interactable = false;

            //SocketLobby.Instance.SetGameServerUrl(serverInput.text);

            //SocketSender.Send("Connect", SocketLobby.Instance.settings.gameServerUrl);
        });
    }

    public void SetServerUrl(string value)
    {
        serverInput.text = value;
    }

    public void EnableConnectButton()
    {
        connectButton.interactable = true;
    }


}

