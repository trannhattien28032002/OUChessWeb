using System;
using System.Collections;
using System.Text;
using UnityEngine.Networking;
using UnityEngine;
using SocketIOClient.Transport;
using UnityEditor.PackageManager.Requests;

public class APIClient : MonoBehaviour
{
    private static APIClient instance;
    private string _authHost = "http://localhost";
    private int _authPort = 8080;
    public static APIClient Instance
    {
        get
        {
            if (instance == null)
            {
                GameObject obj = new GameObject("APIClient");
                instance = obj.AddComponent<APIClient>();
            }
            return instance;
        }
    }

    private void Awake()
    {
        if (instance != null && instance != this)
        {
            Destroy(this.gameObject);
        }
        else
        {
            instance = this;
            DontDestroyOnLoad(this.gameObject);
        }
    }

    public IEnumerator FetchLogin(string username, string password, System.Action<string> onSuccess, System.Action<string> onFailure)
    {
        var url = GetFullHref(APIConstants.API_SIGN_IN);
        UserLogin userAccount = new UserLogin { username = username, password = password };
        var request = new UnityWebRequest(url, "POST");
        string bodyJsonString = JsonUtility.ToJson(userAccount);

        byte[] bodyRaw = Encoding.UTF8.GetBytes(bodyJsonString);
        request.uploadHandler = (UploadHandler)new UploadHandlerRaw(bodyRaw);
        request.downloadHandler = (DownloadHandler)new DownloadHandlerBuffer();
        request.SetRequestHeader("Content-Type", "application/json");
        yield return request.SendWebRequest();
        Debug.Log("Status Code: " + request.responseCode);
        if (request.responseCode == 200)
        {
            Debug.Log(request.downloadHandler.text);
            onSuccess?.Invoke(request.downloadHandler.text);
        }
        else
        {
            onFailure?.Invoke(request.error);
        }
    }

    public IEnumerator FetchCurrentUser(string token, System.Action<string> onSuccess, System.Action<string> onFailure)
    {
        var url = GetFullHref(APIConstants.API_GET_CURRENT_USER);
        var request = new UnityWebRequest(url, "GET");

        request.downloadHandler = (DownloadHandler)new DownloadHandlerBuffer();
        request.SetRequestHeader("Content-Type", "application/json");
        request.SetRequestHeader("Authorization", $"Bearer {token}");
        yield return request.SendWebRequest();
        Debug.Log("Status Code: " + request.responseCode);

        if (request.responseCode == 200)
        {
            Debug.Log(request.downloadHandler.text);
            onSuccess?.Invoke(request.downloadHandler.text);
        }
        else
        {
            onFailure?.Invoke(request.error);
        }
    }

    private string GetFullHref(string route)
    {
        return _authHost + ":" + _authPort + route;
    }
}

[System.Serializable]
public class UserLogin
{
    public string username;
    public string password;
}