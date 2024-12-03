//using UnityEngine;
//using UnityEngine.UI;
//using System.Collections;

//public class SocketLobbyUI : MonoBehaviour
//{

//    public Transform panelHolder;

//    //public TopPanelUI topPanelPrefab;
//    //public ConnectPanelUI connectPanelPrefab;
//    public LobbyPanelUI lobbyPanelPrefab;
//    //public RoomPanelUI roomPanelPrefab;

//    //public TopPanelUI topPanel;
//    //public ConnectPanelUI connectPanel;
//    public LobbyPanelUI lobbyPanel;
//    //public RoomPanelUI roomPanel;


//    public void CreateTopPanel()
//    {
//        //if (topPanel != null)
//        //    return;

//        //topPanel = Instantiate(topPanelPrefab) as TopPanelUI;
//        //topPanel.transform.SetParent(panelHolder, false);
//    }

//    public void CreateConnectPanel()
//    {
//        //connectPanel = CreateSinglePanel(connectPanelPrefab) as ConnectPanelUI;
//        //connectPanel.SetServerUrl(SocketLobby.Instance.settings.gameServerUrl);
//    }

//    public void CreateLobbyPanel()
//    {
//        //lobbyPanel = CreateSinglePanel(lobbyPanelPrefab) as LobbyPanelUI;
//    }

//    public void CreateRoomPanel()
//    {
//        //roomPanel = CreateSinglePanel(roomPanelPrefab) as RoomPanelUI;
//    }

//    public void DeleteTopPanel()
//    {
//        //if (topPanel != null)
//        //    GameObject.Destroy(topPanel.gameObject);

//        //topPanel = null;
//    }

//    public void DeleteRoomPanel()
//    {
//        //if (roomPanel != null)
//        //    GameObject.Destroy(roomPanel.gameObject);

//        //roomPanel = null;
//    }

//    SinglePanelUI CreateSinglePanel(SinglePanelUI panelPrefab)
//    {
//        DeleteAllSinglePanels();

//        SinglePanelUI panel = Instantiate(panelPrefab) as SinglePanelUI;
//        panel.transform.SetParent(panelHolder, false);

//        return panel;
//    }

//    void DeleteAllSinglePanels()
//    {
//        SinglePanelUI[] oldPanels = panelHolder.GetComponentsInChildren<SinglePanelUI>();

//        for (int i = 0; i < oldPanels.Length; i++)
//        {
//            GameObject.Destroy(oldPanels[i].gameObject);
//        }
//    }
//}
