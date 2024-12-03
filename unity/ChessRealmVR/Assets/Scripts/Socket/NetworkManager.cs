using PimDeWitte.UnityMainThreadDispatcher;
using SocketIOClient;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Unity.VisualScripting;
using UnityEngine;
using UnityEngine.UI;

public class NetworkManager : MonoBehaviour
{
    public static NetworkManager instance;
    public GameObject player;
    public GameObject otherPlayer;

    void Awake()
    {
        if (instance == null)
            instance = this;
        else if (instance != this)
            Destroy(gameObject);
        DontDestroyOnLoad(gameObject);
    }

    private void Start()
    {
        SocketIOComponent.Instance.On("other player connected", OnOtherPlayerConnected);
        //socket.On("other player head", OnOtherPlayerHead);
        //socket.On("other player right hand", OnOtherPlayerRightHand);
        //socket.On("other player left hand", OnOtherPlayerLeftHand);
        SocketIOComponent.Instance.On("other player disconnected", OnOtherPlayerDisconnected);
        SocketIOComponent.Instance.On("play", OnPlay);
        SocketIOComponent.Instance.On("head move", OnHeadMove);
        SocketIOComponent.Instance.On("head turn", OnHeadTurn);
        SocketIOComponent.Instance.On("player move", OnPlayerMove);
        SocketIOComponent.Instance.On("player turn", OnPlayerTurn);
        SocketIOComponent.Instance.On("right hand move", OnRightHandMove);
        SocketIOComponent.Instance.On("right hand turn", OnRightHandTurn);
        SocketIOComponent.Instance.On("left hand move", OnLeftHandMove);
        SocketIOComponent.Instance.On("left hand turn", OnLeftHandTurn);

        StartCoroutine(ConnectToServer());
    }

    public void JoinGame()
    {
        StartCoroutine(ConnectToServer());
    }

    #region Commands
    IEnumerator ConnectToServer()
    {
        yield return new WaitForSeconds(0.5f);

        SocketIOComponent.Instance.Emit("player connect");

        yield return new WaitForSeconds(1f);

        string playerName = "desktop";
        Debug.Log("Input name : " + playerName);
        PlayerSpawner ps = GetComponent<PlayerSpawner>();
        SpawnPoint playerSpawnPoint = ps.playerSpawnPoint;
        Vector3 playerSpawnPosition = playerSpawnPoint.spawnPosition;
        Quaternion playerSpawnRotation = playerSpawnPoint.spawnRotation;

        PlayerJSON playerJSON = new PlayerJSON(playerName, playerSpawnPosition, playerSpawnRotation);
        string data = JsonUtility.ToJson(playerJSON);

        Debug.Log("playerJSON : " + data);
        SocketIOComponent.Instance.Emit("play", data);
        Debug.Log("Emit : play");

        //canvas.gameObject.SetActive(false);

        //EnemySpawner es = GetComponent<EnemySpawner>();
        //es.GenerateSpownPoints();
        //List<SpawnPoint> enemySpawnPoints = es.GetComponent<EnemySpawner>().enemySpawnPoints;
        //PlayersEnemyJSON playersEnemyJSON = new PlayersEnemyJSON(playerName, enemySpawnPoints);

        //WakizashiSpawner ws = GetComponent<WakizashiSpawner>();
        //ws.GenerateSpownPoints();
        //List<SpawnPoint> wakizashiSpawnPoints = ws.GetComponent<WakizashiSpawner>().wakizashiSpawnPoints;
        //PlayersWakizashiJSON playersWakizashiJSON = new PlayersWakizashiJSON(playerName, wakizashiSpawnPoints);

        //string enemyData = JsonUtility.ToJson(playersEnemyJSON);
        //string wakizashiData = JsonUtility.ToJson(playersWakizashiJSON);

        //socket.Emit("enemy", enemyData);
        //socket.Emit("wakizashi", wakizashiData);
    }

    public void CommandMove(Vector3 vec3)
    {
        UnityMainThreadDispatcher.Instance().Enqueue(() =>
        {
            string data = JsonUtility.ToJson(new PositionJSON(vec3));
            SocketIOComponent.Instance.Emit("player move", data);
        });
    }

    public void CommandTurn(Quaternion quat)
    {
        UnityMainThreadDispatcher.Instance().Enqueue(() =>
        {
            string data = JsonUtility.ToJson(new RotationJSON(quat));
            SocketIOComponent.Instance.Emit("player turn", data);
        });
    }

    public void CommandHeadMove(Vector3 vec3)
    {
        UnityMainThreadDispatcher.Instance().Enqueue(() =>
        {
            string data = JsonUtility.ToJson(new HeadPositionJSON(vec3));
            SocketIOComponent.Instance.Emit("head move", data);
        });
    }

    public void CommandHeadTurn(Quaternion quat)
    {
        UnityMainThreadDispatcher.Instance().Enqueue(() =>
        {
            string data = JsonUtility.ToJson(new HeadRotationJSON(quat));
            SocketIOComponent.Instance.Emit("head turn", data);
        });
    }

    public void CommandRightHandMove(Vector3 vec3)
    {
        UnityMainThreadDispatcher.Instance().Enqueue(() =>
        {
            string data = JsonUtility.ToJson(new RightHandPositionJSON(vec3));
            SocketIOComponent.Instance.Emit("right hand move", data);
        });
    }

    public void CommandRightHandTurn(Quaternion quat)
    {
        UnityMainThreadDispatcher.Instance().Enqueue(() =>
        {
            string data = JsonUtility.ToJson(new RightHandRotationJSON(quat));
            SocketIOComponent.Instance.Emit("right hand turn", data);
        });
    }

    public void CommandLeftHandMove(Vector3 vec3)
    {
        UnityMainThreadDispatcher.Instance().Enqueue(() =>
        {
            string data = JsonUtility.ToJson(new LeftHandPositionJSON(vec3));
            SocketIOComponent.Instance.Emit("left hand move", data);
        });
    }

    public void CommandLeftHandTurn(Quaternion quat)
    {
        UnityMainThreadDispatcher.Instance().Enqueue(() =>
        {
            string data = JsonUtility.ToJson(new LeftHandRotationJSON(quat));
            SocketIOComponent.Instance.Emit("left hand turn", data);
        });
    }

    #endregion

    #region Listening

    void OnOtherPlayerConnected(SocketIOResponse socketIOResponse)
    {
        try
        {
            UnityMainThreadDispatcher.Instance().Enqueue(() =>
            {
                print("Someone else Joined ");
                string data = socketIOResponse.GetValue<string>();
                UserJSON userJSON = UserJSON.CreateFromJSON(data);
                Debug.Log("userJSON is ganerated : " + data);
                Vector3 position = new Vector3(userJSON.playerPosition[0], userJSON.playerPosition[1], userJSON.playerPosition[2]);
                Quaternion rotation = Quaternion.Euler(userJSON.playerRotation[0], userJSON.playerRotation[1], userJSON.playerRotation[2]);
                GameObject o = GameObject.Find(userJSON.name) as GameObject;
                Debug.Log("O is : " + o);
                if (o != null)
                {
                    return;
                }
                Debug.Log("Again O is : " + o);
                GameObject p = Instantiate(otherPlayer, position, rotation) as GameObject;
                Debug.Log(userJSON.name + " :  body is generated ");
                GameObject EyeCamera = p.transform.Find("Other Head Avator").gameObject;
                EyeCamera.gameObject.SetActive(true);
                GameObject OtherRightHand = p.transform.Find("Other R Hand").gameObject;
                OtherRightHand.gameObject.SetActive(true);
                GameObject OtherLeftHand = p.transform.Find("Other L Hand").gameObject;
                OtherLeftHand.gameObject.SetActive(true);
                MultiPlayerController pc = p.GetComponent<MultiPlayerController>();
                //Transform t = p.transform.Find("Healthbar Canvas");
                //Transform t1 = t.transform.Find("Player Name");
                //Text playerName = t1.GetComponent<Text>();
                //playerName.text = userJSON.name;
                pc.isLocalPlayer = false;
                p.name = userJSON.name;
                Debug.Log("Joining player name is : " + p.name);
            });
        }
        catch (Exception ex)
        {
            Debug.Log(ex);
        }
    }

    void OnOtherPlayerHead(SocketIOResponse socketIOResponse)
    {
        UnityMainThreadDispatcher.Instance().Enqueue(() =>
        {
            string data = socketIOResponse.GetValue<string>();
            HeadJSON headJSON = HeadJSON.CreateFromJSON(data);
            Vector3 headPosition = new Vector3(headJSON.headPosition[0], headJSON.headPosition[1], headJSON.headPosition[2]);
            Quaternion headRotation = Quaternion.Euler(headJSON.headRotation[0], headJSON.headRotation[1], headJSON.headRotation[2]);
            GameObject o = GameObject.Find(headJSON.name) as GameObject;
            if (o != null)
            {
                return;
            }
            GameObject p = GameObject.Find(headJSON.name) as GameObject;
            GameObject EyeCamera = p.transform.Find("Other Head Avator").gameObject;
            GameObject ec = Instantiate(EyeCamera, headPosition, headRotation) as GameObject;
            ec.transform.parent = p.transform;
            p.name = headJSON.name;
            EyeCamera.gameObject.SetActive(false);
        });
    }

    void OnOtherPlayerRightHand(SocketIOResponse socketIOResponse)
    {
        UnityMainThreadDispatcher.Instance().Enqueue(() =>
        {
            string data = socketIOResponse.GetValue<string>();
            RightHandJSON rightHandJSON = RightHandJSON.CreateFromJSON(data);
            Vector3 rightHandPosition = new Vector3(rightHandJSON.rightHandPosition[0], rightHandJSON.rightHandPosition[1], rightHandJSON.rightHandPosition[2]);
            Quaternion rightHandRotation = Quaternion.Euler(rightHandJSON.rightHandRotation[0], rightHandJSON.rightHandRotation[1], rightHandJSON.rightHandRotation[2]);
            GameObject o = GameObject.Find(rightHandJSON.name) as GameObject;
            if (o != null)
            {
                return;
            }
            GameObject p = GameObject.Find(rightHandJSON.name) as GameObject;
            GameObject OtherRightHand = p.transform.Find("Other R Hand").gameObject;
            GameObject orh = Instantiate(OtherRightHand, rightHandPosition, rightHandRotation) as GameObject;
            orh.transform.parent = p.transform;
            p.name = rightHandJSON.name;
            OtherRightHand.gameObject.SetActive(false);
        });
    }

    void OnOtherPlayerLeftHand(SocketIOResponse socketIOResponse)
    {
        UnityMainThreadDispatcher.Instance().Enqueue(() =>
        {
            string data = socketIOResponse.GetValue<string>();
            LeftHandJSON leftHandJSON = LeftHandJSON.CreateFromJSON(data);
            Vector3 leftHandPosition = new Vector3(leftHandJSON.leftHandPosition[0], leftHandJSON.leftHandPosition[1], leftHandJSON.leftHandPosition[2]);
            Quaternion leftHandRotation = Quaternion.Euler(leftHandJSON.leftHandRotation[0], leftHandJSON.leftHandRotation[1], leftHandJSON.leftHandRotation[2]);
            Debug.Log(leftHandJSON.name);
            GameObject o = GameObject.Find(leftHandJSON.name) as GameObject;
            if (o != null)
            {
                return;
            }
            GameObject p = GameObject.Find(leftHandJSON.name) as GameObject;
            GameObject OtherLeftHand = p.transform.Find("Other L Hand").gameObject;
            GameObject olh = Instantiate(OtherLeftHand, leftHandPosition, leftHandRotation) as GameObject;
            olh.transform.parent = p.transform;
            p.name = leftHandJSON.name;
            OtherLeftHand.gameObject.SetActive(false);
        });
    }

    void OnPlay(SocketIOResponse socketIOResponse)
    {
        UnityMainThreadDispatcher.Instance().Enqueue(() =>
        {
            print("you joined");
            string data = socketIOResponse.GetValue<string>();
            print("your JSON data was recieved");
            PlayerJSON currentUserJSON = PlayerJSON.CreateFromJSON(data);

            print("your JSON was created : " + data);
            Vector3 position = new Vector3(currentUserJSON.playerPosition[0], currentUserJSON.playerPosition[1], currentUserJSON.playerPosition[2]);
            print("your name isssssssssssssssss ");
            Quaternion rotation = Quaternion.Euler(currentUserJSON.playerRotation[0], currentUserJSON.playerRotation[1], currentUserJSON.playerRotation[2]);
            print("your name isssssssssssssssss ");
            GameObject p = Instantiate(player, position, rotation) as GameObject;
            MultiPlayerController pc = p.GetComponent<MultiPlayerController>();
            //Transform t = p.transform.Find("Healthbar Canvas");
            //Transform t1 = t.transform.Find("Player Name");
            //Text playerName = t1.GetComponent<Text>();
            //playerName.text = currentUserJSON.name;
            pc.isLocalPlayer = true;
            p.name = currentUserJSON.name;
            GameObject Eye = p.transform.Find("Camera Offset").gameObject;
            Eye.gameObject.SetActive(true);
            print("your name is " + currentUserJSON.name);
        });
    }

    void OnHeadMove(SocketIOResponse socketIOResponse)
    {
        UnityMainThreadDispatcher.Instance().Enqueue(() =>
        {
            string data = socketIOResponse.GetValue<string>();
            HeadJSON headJSON = HeadJSON.CreateFromJSON(data);

            Vector3 headPosition = new Vector3(headJSON.headPosition[0], headJSON.headPosition[1], headJSON.headPosition[2]);
            GameObject p = GameObject.Find(headJSON.name) as GameObject;
            GameObject eye = p.transform.Find("Other Head Avator").gameObject;
            if (p != null)
            {
                eye.transform.position = headPosition;
            }
        });

    }

    void OnHeadTurn(SocketIOResponse socketIOResponse)
    {
        UnityMainThreadDispatcher.Instance().Enqueue(() =>
        {
            string data = socketIOResponse.GetValue<string>();
            Debug.Log("Head turn " + data);
            HeadJSON headJSON = HeadJSON.CreateFromJSON(data);
            Quaternion headRotation = Quaternion.Euler(headJSON.headRotation[0], headJSON.headRotation[1], headJSON.headRotation[2]);
            GameObject p = GameObject.Find(headJSON.name) as GameObject;
            GameObject eye = p.transform.Find("Other Head Avator").gameObject;
            if (p != null)
            {
                eye.transform.rotation = headRotation;
            }
        });
    }

    void OnPlayerMove(SocketIOResponse socketIOResponse)
    {
        UnityMainThreadDispatcher.Instance().Enqueue(() =>
        {
            string data = socketIOResponse.GetValue<string>();
            UserJSON userJSON = UserJSON.CreateFromJSON(data);
            Vector3 playerPosition = new Vector3(userJSON.playerPosition[0], userJSON.playerPosition[1], userJSON.playerPosition[2]);
            GameObject p = GameObject.Find(userJSON.name) as GameObject;
            if (p != null)
            {
                p.transform.position = playerPosition;
            }
            Debug.Log(userJSON.name + " moved! ! !");
        });
    }

    void OnPlayerTurn(SocketIOResponse socketIOResponse)
    {
        UnityMainThreadDispatcher.Instance().Enqueue(() =>
        {
            string data = socketIOResponse.GetValue<string>();
            UserJSON userJSON = UserJSON.CreateFromJSON(data);
            Quaternion playerRotation = Quaternion.Euler(userJSON.playerRotation[0], userJSON.playerRotation[1], userJSON.playerRotation[2]);
            GameObject p = GameObject.Find(userJSON.name) as GameObject;
            if (p != null)
            {
                p.transform.rotation = playerRotation;
            }
            Debug.Log(userJSON.name + " turned! ! !");
        });
    }

    void OnRightHandMove(SocketIOResponse socketIOResponse)
    {
        UnityMainThreadDispatcher.Instance().Enqueue(() =>
        {
            string data = socketIOResponse.GetValue<string>();
            RightHandJSON rightHandJSON = RightHandJSON.CreateFromJSON(data);
            Vector3 rightHandPosition = new Vector3(rightHandJSON.rightHandPosition[0], rightHandJSON.rightHandPosition[1], rightHandJSON.rightHandPosition[2]);
            GameObject p = GameObject.Find(rightHandJSON.name) as GameObject;
            GameObject orh = p.transform.Find("Other R Hand").gameObject;
            if (p != null)
            {
                orh.transform.position = rightHandPosition;
            }
        });
    }

    void OnRightHandTurn(SocketIOResponse socketIOResponse)
    {
        UnityMainThreadDispatcher.Instance().Enqueue(() =>
        {
            string data = socketIOResponse.GetValue<string>();
            RightHandJSON rightHandJSON = RightHandJSON.CreateFromJSON(data);
            Quaternion rightHandRotation = Quaternion.Euler(rightHandJSON.rightHandRotation[0], rightHandJSON.rightHandRotation[1], rightHandJSON.rightHandRotation[2]);
            GameObject p = GameObject.Find(rightHandJSON.name) as GameObject;
            GameObject orh = p.transform.Find("Other R Hand").gameObject;
            if (p != null)
            {
                orh.transform.rotation = rightHandRotation;
            }
        });
    }

    void OnLeftHandMove(SocketIOResponse socketIOResponse)
    {
        UnityMainThreadDispatcher.Instance().Enqueue(() =>
        {
            string data = socketIOResponse.GetValue<string>();
            LeftHandJSON leftHandJSON = LeftHandJSON.CreateFromJSON(data);
            Vector3 leftHandPosition = new Vector3(leftHandJSON.leftHandPosition[0], leftHandJSON.leftHandPosition[1], leftHandJSON.leftHandPosition[2]);
            GameObject p = GameObject.Find(leftHandJSON.name) as GameObject;
            GameObject olh = p.transform.Find("Other L Hand").gameObject;
            if (p != null)
            {
                olh.transform.position = leftHandPosition;
            }
        });
    }

    void OnLeftHandTurn(SocketIOResponse socketIOResponse)
    {
        UnityMainThreadDispatcher.Instance().Enqueue(() =>
        {
            string data = socketIOResponse.GetValue<string>();
            LeftHandJSON leftHandJSON = LeftHandJSON.CreateFromJSON(data);
            Quaternion leftHandRotation = Quaternion.Euler(leftHandJSON.leftHandRotation[0], leftHandJSON.leftHandRotation[1], leftHandJSON.leftHandRotation[2]);
            GameObject p = GameObject.Find(leftHandJSON.name) as GameObject;
            GameObject olh = p.transform.Find("Other L Hand").gameObject;
            if (p != null)
            {
                olh.transform.rotation = leftHandRotation;
            }
        });
    }

    void OnOtherPlayerDisconnected(SocketIOResponse socketIOResponse)
    {
        UnityMainThreadDispatcher.Instance().Enqueue(() =>
        {
            print("user disconnected");
            string data = socketIOResponse.GetValue<string>();
            UserJSON userJSON = UserJSON.CreateFromJSON(data);
            Destroy(GameObject.Find(userJSON.name));
        }); 
    }

    #endregion
    void OnApplicationQuit()
    {
        UnityMainThreadDispatcher.Instance().Enqueue(() =>
        {
            SocketIOComponent.Instance.Disconnect();
        });
    }
    #region JSONMessageClasses

    [Serializable]
    public class PlayerJSON
    {
        public string name;
        public float[] playerPosition;
        public float[] playerRotation;

        public static PlayerJSON CreateFromJSON(string data)
        {
            return JsonUtility.FromJson<PlayerJSON>(data);
        }

        public PlayerJSON(string _name, Vector3 _playerSpawnPosition, Quaternion _playerSpawnRotation)
        {
            name = _name;
            playerPosition = new float[] { _playerSpawnPosition.x, _playerSpawnPosition.y, _playerSpawnPosition.z };
            playerRotation = new float[] { _playerSpawnRotation.eulerAngles.x, _playerSpawnRotation.eulerAngles.y, _playerSpawnRotation.eulerAngles.z };
        }
    }

    [Serializable]
    public class PointJSON
    {
        public float[] position;
        public float[] rotation;
        public PointJSON(SpawnPoint spawnPoint)
        {
            position = new float[]
            {
                spawnPoint.transform.position.x,
                spawnPoint.transform.position.y,
                spawnPoint.transform.position.z
            };

            rotation = new float[]
            {
                spawnPoint.transform.eulerAngles.x,
                spawnPoint.transform.eulerAngles.y,
                spawnPoint.transform.eulerAngles.z
            };
        }
    }

    [Serializable]
    public class HeadJSON
    {
        public string name;
        public float[] headPosition;
        public float[] headRotation;

        public static HeadJSON CreateFromJSON(string data)
        {
            return JsonUtility.FromJson<HeadJSON>(data);
        }
    }

    [Serializable]
    public class HeadPositionJSON
    {
        public float[] headPosition;

        public HeadPositionJSON(Vector3 _headPosition)
        {
            headPosition = new float[] { _headPosition.x, _headPosition.y, _headPosition.z };
        }
    }

    [Serializable]
    public class HeadRotationJSON
    {
        public float[] headRotation;

        public HeadRotationJSON(Quaternion _headRotation)
        {
            headRotation = new float[] { _headRotation.eulerAngles.x, _headRotation.eulerAngles.y, _headRotation.eulerAngles.z };
        }
    }

    [Serializable]
    public class PositionJSON
    {
        public float[] playerPosition;

        public PositionJSON(Vector3 _position)
        {
            playerPosition = new float[] { _position.x, _position.y, _position.z };
        }
    }

    [Serializable]
    public class RotationJSON
    {
        public float[] playerRotation;

        public RotationJSON(Quaternion _rotation)
        {
            playerRotation = new float[] { _rotation.eulerAngles.x, _rotation.eulerAngles.y, _rotation.eulerAngles.z };
        }
    }

    [Serializable]
    public class RightHandJSON
    {
        public string name;
        public float[] rightHandPosition;
        public float[] rightHandRotation;

        public static RightHandJSON CreateFromJSON(string data)
        {
            return JsonUtility.FromJson<RightHandJSON>(data);
        }
    }

    [Serializable]
    public class RightHandPositionJSON
    {
        public float[] rightHandPosition;

        public RightHandPositionJSON(Vector3 _rightHandPosition)
        {
            rightHandPosition = new float[] { _rightHandPosition.x, _rightHandPosition.y, _rightHandPosition.z };
        }
    }

    [Serializable]
    public class RightHandRotationJSON
    {
        public float[] rightHandRotation;

        public RightHandRotationJSON(Quaternion _rightHandRotation)
        {
            rightHandRotation = new float[] { _rightHandRotation.eulerAngles.x, _rightHandRotation.eulerAngles.y, _rightHandRotation.eulerAngles.z };
        }
    }

    [Serializable]
    public class LeftHandJSON
    {
        public string name;
        public float[] leftHandPosition;
        public float[] leftHandRotation;

        public static LeftHandJSON CreateFromJSON(string data)
        {
            return JsonUtility.FromJson<LeftHandJSON>(data);
        }
    }

    [Serializable]
    public class LeftHandPositionJSON
    {
        public float[] leftHandPosition;

        public LeftHandPositionJSON(Vector3 _leftHandPosition)
        {
            leftHandPosition = new float[] { _leftHandPosition.x, _leftHandPosition.y, _leftHandPosition.z };
        }
    }

    [Serializable]
    public class LeftHandRotationJSON
    {
        public float[] leftHandRotation;

        public LeftHandRotationJSON(Quaternion _leftHandRotation)
        {
            leftHandRotation = new float[] { _leftHandRotation.eulerAngles.x, _leftHandRotation.eulerAngles.y, _leftHandRotation.eulerAngles.z };
        }
    }

    [Serializable]
    public class UserJSON
    {
        public string name;
        public float[] playerPosition;
        public float[] playerRotation;
        public int health;

        public static UserJSON CreateFromJSON(string data)
        {
            return JsonUtility.FromJson<UserJSON>(data);
        }
    }

    #endregion
}
