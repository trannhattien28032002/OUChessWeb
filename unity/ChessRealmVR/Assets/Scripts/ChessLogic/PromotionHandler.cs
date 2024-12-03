using System;
using System.Collections;
using System.Collections.Generic;
using Chess.Core;
using ChessLogic;
using ChessPieces;
using Managers;
using Unity.VisualScripting;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.Rendering;
using UnityEngine.UI;
using static ChessLogic.Shared;
using static UnityEngine.GraphicsBuffer;

public class PromotionHandler : MonoBehaviour
{
    public Shared.ModeGame modeGame;
    public int promotionFlag;

    public GameObject promotionUI;
    public GameObject promotionInteractor;
    public ChessPieceType chessPieceType;
    
    public MovementManager movementManager;
    public Chessboard chessboard;
    private ChessPiece pawnToPromote;
    
    //Buttons
    public Button bishopButton;
    public Button knightButton;
    public Button queenButton;
    public Button rookButton;

    public void EnableDisablePromotionCanvas(bool value, ChessPiece passedPawn)
    {
        pawnToPromote = passedPawn;
        promotionUI.SetActive(value);
        promotionInteractor.SetActive(value);
    }

    public void ChangeInBishop()
    {
        chessPieceType = ChessPieceType.Bishop;
        promotionFlag = 0b0111;
        MarkPromotion();
        EnableDisablePromotionCanvas(false, null);
        EventSystem.current.SetSelectedGameObject(null);
        bishopButton.OnDeselect(null);
    }
    
    public void ChangeInQueen()
    {
        chessPieceType = ChessPieceType.Queen;
        promotionFlag = 0b0100;
        MarkPromotion();
        EnableDisablePromotionCanvas(false, null);
        EventSystem.current.SetSelectedGameObject(null);
        queenButton.OnDeselect(null);
    }
    
    public void ChangeInRook()
    {
        chessPieceType = ChessPieceType.Rook;
        promotionFlag = 0b0110;
        MarkPromotion();
        EnableDisablePromotionCanvas(false, null);EventSystem.current.SetSelectedGameObject(null);
        rookButton.OnDeselect(null);
    }
    
    public void ChangeInKnight()
    {
        chessPieceType = ChessPieceType.Knight;
        promotionFlag = 0b0101;
        MarkPromotion();
        EnableDisablePromotionCanvas(false, null);
        EventSystem.current.SetSelectedGameObject(null);
        knightButton.OnDeselect(null);
    }

    private void MarkPromotion()
    {
        // We eliminate the pawn to be promoted from every list that it's tracking the pieces
        var pawnTeam = pawnToPromote.team == Shared.TeamType.White
            ? movementManager.WhitePieces
            : movementManager.BlackPieces;
        pawnTeam.Remove(pawnToPromote.gameObject);
        pawnToPromote.MyPlayer.Pieces.Remove(pawnToPromote);
        movementManager.ChessPieces[pawnToPromote.currentX, pawnToPromote.currentY] = null;

        //We create the new promoted gameObject
        var newPiece = chessboard.SpawnSinglePiece(chessPieceType, pawnToPromote.team);
        newPiece.IsMoved = true;
        newPiece.MyPlayer = pawnToPromote.MyPlayer;
        movementManager.ChessPieces[pawnToPromote.currentX, pawnToPromote.currentY] = newPiece;
        chessboard.PositionSinglePiece(pawnToPromote.currentX, pawnToPromote.currentY);
        
        // Add the new piece to the correct team
        pawnTeam.Add(newPiece.gameObject);
        pawnToPromote.MyPlayer.Pieces.Add(newPiece);
        
        // Finally we destroy the old gameObject
        Destroy(pawnToPromote.gameObject);
        newPiece.MyPlayer.HasMoved = true;
        newPiece.DisablePickUpOnPiece();

        if (modeGame == Shared.ModeGame.Multiplayer)
        {
            int targetXY = BoardHelper.IndexFromCoord(newPiece.currentX, newPiece.currentY);
            int startXY = AppState.Instance.GetState<int>("StartPieceInCasePromotion", true); ;
            if (startXY != null)
            {
                var room = AppState.Instance.GetState<Room>("CurrentRoom");

                Moving moving = new Moving
                {
                    start = startXY,
                    target = targetXY,
                    flag = promotionFlag,
                };

                MovingRequest movingRequest = new MovingRequest
                {
                    rId = room.id,
                    moving = moving,
                };

                string data = JsonUtility.ToJson(movingRequest);

                SocketIOComponent.Instance.Emit("send-move", data);
            }
        }
    }
    
}
