using System.Collections.Generic;
using UnityEngine;

public class AppState : MonoBehaviour
{
    private static AppState _instance;
    public static AppState Instance
    {
        get
        {
            if (_instance == null)
            {
                _instance = new GameObject("AppState").AddComponent<AppState>();
                DontDestroyOnLoad(_instance.gameObject);
            }
            return _instance;
        }
    }

    private Dictionary<string, object> state = new Dictionary<string, object>();

    public T GetState<T>(string key, bool isClear = false)
    {
        if (state.ContainsKey(key))
        {
            T value = (T)state[key];
            if (isClear)
            {
                state.Remove(key);
            }
            return value;
        }
        return default(T);
    }

    public void SetState<T>(string key, T value)
    {
        if (state.ContainsKey(key))
        {
            state[key] = value;
        }
        else
        {
            state.Add(key, value);
        }
    }
}