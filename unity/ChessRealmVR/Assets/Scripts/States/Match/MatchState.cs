using UnityEngine;
using System;

[CreateAssetMenu(fileName = "MatchState", menuName = "Game/MatchState", order = 1)]
public class MatchState : ScriptableObject
{
    public MatchDetail[] match;
    public bool isLoading;
    public string lastestMatchId;

    public event Action OnStateChange;

    public void SetState(MatchState newState)
    {
        match = newState.match;
        isLoading = newState.isLoading;
        lastestMatchId = newState.lastestMatchId;
        OnStateChange?.Invoke();
    }
}

[System.Serializable]
public class MatchDetail
{
    public string id;
    public string matchName;
    public int state;
    public int mode;
}

[System.Serializable]
public class CreateMatchRequest
{
    public string matchName;
    public int mode;
}

[System.Serializable]
public class JoinMatchRequest
{
    public string matchId;
}

[System.Serializable]
public class LeaveMatchRequest
{
    public string matchId;
}