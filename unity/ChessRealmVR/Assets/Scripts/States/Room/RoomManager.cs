using UnityEngine;
using System.Collections;
using System;
using Chess.Core;
using Chess.Game;
using System.Collections.Generic;

public class RoomManager : MonoBehaviour
{
    public RoomState roomState;
    public static event Action<CreateRoomRequest> OnCreateRoom;
    public static event Action<JoinRoomRequest> OnJoinRoom;
    public static event Action<LeaveRoomRequest> OnLeaveRoom;
    public static event Action<MovingRequest> OnMoving;
    public static event Action<Reconnected> OnReconnected;

    private void OnEnable()
    {
        roomState.OnStateChange += HandleStateChange;
        OnCreateRoom += CreateRoom;
        OnJoinRoom += JoinRoom;
        OnLeaveRoom += LeaveRoom;
        OnMoving += Move;
        OnReconnected += Reconnect;
    }

    private void OnDisable()
    {
        roomState.OnStateChange -= HandleStateChange;
        OnCreateRoom -= CreateRoom;
        OnJoinRoom -= JoinRoom;
        OnLeaveRoom -= LeaveRoom;
        OnMoving -= Move;
        OnReconnected -= Reconnect;
    }

    private void HandleStateChange()
    {
        // Xử lý thay đổi trạng thái
    }

    private void CreateRoom(CreateRoomRequest request)
    {
        StartCoroutine(CreateRoomCoroutine(request));
    }

    private IEnumerator CreateRoomCoroutine(CreateRoomRequest request)
    {
        // Mô phỏng tác vụ tạo phòng bất đồng bộ
        yield return new WaitForSeconds(2);
        //var newRoomDetail = new RoomDetail { id = "newRoomId", title = request.title, owner = request.own, players = new Player[0] };
        //var newGameState = new GameState { turn = 0, isStarted = false, playerColor = request.color, whiteTimer = 600, blackTimer = 600 };
        //roomState.SetState(new RoomState { detail = newRoomDetail, gameState = newGameState, gameAction = new GameAction(), history = new Moving[0], type = 0, lastTime = 0, isProcessing = false, board = new Board(), endGame = GameResult.Result.NotStarted });
    }

    private void JoinRoom(JoinRoomRequest request)
    {
        StartCoroutine(JoinRoomCoroutine(request));
    }

    private IEnumerator JoinRoomCoroutine(JoinRoomRequest request)
    {
        // Mô phỏng tác vụ tham gia phòng bất đồng bộ
        yield return new WaitForSeconds(2);
        //var newRoomDetail = new RoomDetail { id = request.rId, title = "Joined Room", owner = "Owner", players = new Player[0] };
        //var newGameState = new GameState { turn = 0, isStarted = false, playerColor = 1, whiteTimer = 600, blackTimer = 600 };
        //roomState.SetState(new RoomState { detail = newRoomDetail, gameState = newGameState, gameAction = new GameAction(), history = new Moving[0], type = 0, lastTime = 0, isProcessing = false, board = new Board(), endGame = GameResult.Result.NotStarted });
    }

    private void LeaveRoom(LeaveRoomRequest request)
    {
        StartCoroutine(LeaveRoomCoroutine(request));
    }

    private IEnumerator LeaveRoomCoroutine(LeaveRoomRequest request)
    {
        // Mô phỏng tác vụ rời phòng bất đồng bộ
        yield return new WaitForSeconds(2);
        roomState.SetState(new RoomState());
    }

    private void Move(MovingRequest request)
    {
        StartCoroutine(MoveCoroutine(request));
    }

    private IEnumerator MoveCoroutine(MovingRequest request)
    {
        // Mô phỏng tác vụ di chuyển quân cờ bất đồng bộ
        yield return new WaitForSeconds(2);
        //var newMove = new Move { start = request.moving.start, target = request.moving.target, flag = request.moving.flag };
        var newMove = new Moving
        {
            startPiece = request.moving.startPiece,
            targetPiece = request.moving.targetPiece,
            start = request.moving.start,
            target = request.moving.target,
            flag = request.moving.flag,
            promotionPiece = request.moving.promotionPiece,
            moveString = request.moving.moveString
        };
        var newHistory = new List<Moving>(roomState.history) { newMove }.ToArray();
        roomState.SetState(new RoomState { detail = roomState.detail, gameState = roomState.gameState, gameAction = new GameAction(), history = newHistory, type = roomState.type, lastTime = DateTime.Now.Ticks, isProcessing = false, board = roomState.board, endGame = roomState.endGame });
    }

    private void Reconnect(Reconnected request)
    {
        StartCoroutine(ReconnectCoroutine(request));
    }

    private IEnumerator ReconnectCoroutine(Reconnected request)
    {
        // Mô phỏng tác vụ kết nối lại bất đồng bộ
        yield return new WaitForSeconds(2);
        roomState.SetState(new RoomState { detail = request.detail, gameState = request.gameState, gameAction = new GameAction(), history = request.history, type = roomState.type, lastTime = roomState.lastTime, isProcessing = roomState.isProcessing, board = roomState.board, endGame = roomState.endGame });
    }
}