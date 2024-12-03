using UnityEngine;
using System;
using Chess.Core;
using Chess.Game;

[CreateAssetMenu(fileName = "RoomState", menuName = "Game/RoomState", order = 1)]
public class RoomState : ScriptableObject
{
    public RoomDetail detail;
    public GameState gameState;
    public GameAction gameAction;
    public Moving[] history;
    public int type;
    public long lastTime;
    public bool isProcessing;
    public Board board;
    public GameResult.Result endGame;

    public event Action OnStateChange;

    public void SetState(RoomState newState)
    {
        detail = newState.detail;
        gameState = newState.gameState;
        gameAction = newState.gameAction;
        history = newState.history;
        type = newState.type;
        lastTime = newState.lastTime;
        isProcessing = newState.isProcessing;
        board = newState.board;
        endGame = newState.endGame;
        OnStateChange?.Invoke();
    }
}

[Serializable]
public class RoomDetail
{
    public string id;
    public string title;
    public ChessPlayer[] players;
    public string owner;
}

[Serializable]
public class ChessPlayer
{
    public User user;
    public int color;
}

[Serializable]
public class GameState
{
    public int turn;
    public bool isStarted;
    public int playerColor;
    public float whiteTimer;
    public float blackTimer;
}

[Serializable]
public class GameAction
{
    public MoveAction move;
    public bool isPromotion;
    public string promotionPiece;
    public bool isAction;
}

[Serializable]
public class MoveAction
{
    public int start;
    public int target;
    public int? flag;
}

[Serializable]
public class CreateRoomRequest
{
    public string title;
    public string own;
    public int color;
}

[Serializable]
public class JoinRoomRequest
{
    public string rId;
    public string uId;
}

[Serializable]
public class LeaveRoomRequest
{
    public string rId;
    public string uId;
}

[Serializable]
public class Reconnected
{
    public RoomDetail detail;
    public GameState gameState;
    public Moving[] history;
}