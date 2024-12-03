using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using ChessLogic;
using ChessPieces;
using PimDeWitte.UnityMainThreadDispatcher;
using Players;
using SocketIOClient;
using Unity.VisualScripting;
using Unity.XR.CoreUtils;
using UnityEngine;
using UnityEngine.XR.Interaction.Toolkit;

namespace Managers
{
    public class GameManager : MonoBehaviour
    {
        // Mock Start Game
        public bool mockTeamSelection;
        public Shared.TeamType mockTeamType;
        public Shared.ModeGame modeGame;

        // Properties
        public Chessboard chessboard;
        public MovementManager movementManager;
        public TileManager tileManager;
        public GameObject xrOrigin;
        public BotPlayer botPlayer;
        public EndGameHandler endGameHandler;
        public bool IsWhiteTurn { get; private set; }

        // Game History
        public List<Turn> History { get; set; }
        public Turn LastTurn { get; set; }
        public Shared.GameStatus GameStatus { get; set; }

        // Player Info and team selection
        public List<GameObject> teamSelectors;
        
        // Refactor
        private HumanPlayer HumanPlayer { get; set; }
        private AIPlayer AIPlayer { get; set; }
        private Player CurrentPlayer { get; set; }
        private OtherPlayer OtherPlayer { get; set; }

        //--------------------------------------- Methods ----------------------------------------------------------
        private void Awake()
        {
            HumanPlayer = new HumanPlayer();
            AIPlayer = new AIPlayer();
            OtherPlayer = new OtherPlayer();
            CurrentPlayer = null;
            
            History = new List<Turn>();
            LastTurn = null;

            movementManager.TileManager = tileManager;
            chessboard.MovementManager = movementManager;
            chessboard.TileManager = tileManager;
            movementManager.GameManager = this;
            GameStatus = Shared.GameStatus.NotStarted;
            Debug.Log("test: " + transform.position);
            if (modeGame == Shared.ModeGame.BotAI)
            {
                if (mockTeamSelection)
                {
                    SelectTeam(mockTeamType, transform.position, transform.rotation, Shared.ChessboardConfig.Normal);
                }
            }
            else if (modeGame == Shared.ModeGame.Multiplayer)
            {
                SocketIOComponent.Instance.On("req-send-move", OnRequestSendMove);
                ResJoinRoom data = AppState.Instance.GetState<ResJoinRoom>("CurrentRoom");
                if (data.color == 0)
                    SelectTeam(Shared.TeamType.White, transform.position, transform.rotation, Shared.ChessboardConfig.Normal);
                else SelectTeam(Shared.TeamType.Black, transform.position, transform.rotation, Shared.ChessboardConfig.Normal);
            }
        }

        private void Update()
        {
            if(CurrentPlayer == null) return;
            
            if (CurrentPlayer.HasMoved)
            {
                CurrentPlayer.Update();
                CurrentPlayer = CurrentPlayer == AIPlayer ? HumanPlayer : AIPlayer;
                CurrentPlayer.IsMyTurn = true;
                if (CurrentPlayer == HumanPlayer) CurrentPlayer.EnablePieces();
                
                movementManager.GenerateAllMoves(LastTurn, CurrentPlayer, movementManager.ChessPieces, tileManager.Tiles, HumanPlayer.Pieces, AIPlayer.Pieces);
                movementManager.EvaluateKingStatus(tileManager.Tiles,
                    (King)CurrentPlayer.Pieces.First(p => p.type == ChessPieceType.King));
                movementManager.EliminateInvalidMoves(movementManager.ChessPieces, tileManager.Tiles,
                    CurrentPlayer.Team);
                GameStatus = EvaluateGameStatus(CurrentPlayer.Team);

                if (modeGame == Shared.ModeGame.BotAI)
                {
                    if (CurrentPlayer == AIPlayer)
                    {
                        try
                        {
                            UnmarkAIMove(History[^2]);
                        }
                        catch
                        {
                            // ignored
                        }

                        StartCoroutine(AITurn());
                    }
                }
                else if (modeGame == Shared.ModeGame.Multiplayer)
                {

                }
            }

            if (GameStatus is not (Shared.GameStatus.Victory or Shared.GameStatus.Defeat or Shared.GameStatus.Draw))
                return;
            CurrentPlayer = null;
            endGameHandler.DisplayEndGameCanvas(GameStatus);
        }

        private void StartGame(Shared.ChessboardConfig chessboardConfig)
        {
            chessboard.StartGame(chessboardConfig);
            IsWhiteTurn = true;
            
            GameStatus = Shared.GameStatus.Continue;

            if (modeGame == Shared.ModeGame.BotAI)
            {
                CurrentPlayer = HumanPlayer;
                if (HumanPlayer.Team == Shared.TeamType.White)
                {
                    HumanPlayer.Pieces = movementManager.WhitePieces.Select(piece => piece.GetComponent<ChessPiece>())
                        .ToList();
                    AIPlayer.Pieces = movementManager.BlackPieces.Select(piece => piece.GetComponent<ChessPiece>())
                        .ToList();
                    HumanPlayer.EnablePieces();

                    movementManager.GenerateAllMoves(null, CurrentPlayer, movementManager.ChessPieces, tileManager.Tiles, HumanPlayer.Pieces,
                        AIPlayer.Pieces);
                    movementManager.EliminateInvalidMoves(movementManager.ChessPieces, tileManager.Tiles,
                        CurrentPlayer.Team);
                }
                else
                {
                    HumanPlayer.Pieces = movementManager.BlackPieces.Select(piece => piece.GetComponent<ChessPiece>())
                        .ToList();
                    AIPlayer.Pieces = movementManager.WhitePieces.Select(piece => piece.GetComponent<ChessPiece>())
                        .ToList();
                    HumanPlayer.DisablePieces();
                    HumanPlayer.HasMoved = true;
                }

                AIPlayer.DisablePieces();
                CurrentPlayer.IsMyTurn = true;

                HumanPlayer.InitPieces();
                AIPlayer.InitPieces();
            }
            else
            {
                CurrentPlayer = HumanPlayer;
                if (HumanPlayer.Team == Shared.TeamType.White)
                {
                    HumanPlayer.Pieces = movementManager.WhitePieces.Select(piece => piece.GetComponent<ChessPiece>())
                        .ToList();
                    OtherPlayer.Pieces = movementManager.BlackPieces.Select(piece => piece.GetComponent<ChessPiece>())
                        .ToList();
                    HumanPlayer.EnablePieces();

                    movementManager.GenerateAllMoves(null, CurrentPlayer, movementManager.ChessPieces, tileManager.Tiles, HumanPlayer.Pieces,
                        OtherPlayer.Pieces);
                    movementManager.EliminateInvalidMoves(movementManager.ChessPieces, tileManager.Tiles,
                        CurrentPlayer.Team);
                }
                else
                {
                    HumanPlayer.Pieces = movementManager.BlackPieces.Select(piece => piece.GetComponent<ChessPiece>())
                        .ToList();
                    OtherPlayer.Pieces = movementManager.WhitePieces.Select(piece => piece.GetComponent<ChessPiece>())
                        .ToList();
                    HumanPlayer.DisablePieces();
                    HumanPlayer.HasMoved = true;
                }

                OtherPlayer.DisablePieces();
                CurrentPlayer.IsMyTurn = true;

                HumanPlayer.InitPieces();
                OtherPlayer.InitPieces();
            }
        }

        public void SelectTeam(Shared.TeamType selectedTeam, Vector3 selectorPosition, Quaternion selectorRotation,
            Shared.ChessboardConfig chessboardConfig)
        {
            if (modeGame == Shared.ModeGame.BotAI) {
                HumanPlayer.Team = selectedTeam;
                AIPlayer.Team =
                    HumanPlayer.Team == Shared.TeamType.White
                        ? Shared.TeamType.Black
                        : Shared.TeamType.White;

                StartGame(chessboardConfig);
                var rotation = selectedTeam is Shared.TeamType.White
                    ? Quaternion.Euler(0, 41, 0)
                    : Quaternion.Euler(0, 0, 0);
                if (selectedTeam is Shared.TeamType.White)
                    SetPlayer(teamSelectors[0].gameObject.transform.position);
                else SetPlayer(teamSelectors[1].gameObject.transform.position);

                foreach (var teamSelector in teamSelectors)
                    Destroy(teamSelector);
            }
            else
            {
                HumanPlayer.Team = selectedTeam;
                OtherPlayer.Team =
                    HumanPlayer.Team == Shared.TeamType.White
                        ? Shared.TeamType.Black
                        : Shared.TeamType.White;

                StartGame(chessboardConfig);
                var rotation = selectedTeam is Shared.TeamType.White
                    ? Quaternion.Euler(0, 41, 0)
                    : Quaternion.Euler(0, 0, 0);

                if (selectedTeam is Shared.TeamType.White)
                    SetPlayer(teamSelectors[0].gameObject.transform.position);
                else SetPlayer(teamSelectors[1].gameObject.transform.position);

                foreach (var teamSelector in teamSelectors)
                    Destroy(teamSelector);
            }
        }

        public void AdvanceTurn(Turn currentTurn)
        {
            DisableEnPassantTargetOnLastTurnPiece();
            History.Add(currentTurn);
            LastTurn = currentTurn;
            SwitchTurn();
            
            tileManager.UpdateTileMaterialAfterMove(LastTurn.PiecesMovedInThisTurn.Pieces[^1]);
        }
        
        private Shared.GameStatus EvaluateGameStatus(Shared.TeamType evaluatedTeam)
        {
            if (modeGame == Shared.ModeGame.BotAI)
            {
                var currentKing = (King)(evaluatedTeam == Shared.TeamType.White ? movementManager.WhiteKing : movementManager.BlackKing);

                switch (currentKing.isChecked)
                {
                    case true when !movementManager.TeamHasPossibleMoves:
                        return evaluatedTeam == HumanPlayer.Team ? Shared.GameStatus.Defeat : Shared.GameStatus.Victory;
                    case false when !movementManager.TeamHasPossibleMoves:
                        return Shared.GameStatus.Draw;
                }

                var drawConfigurations = new List<List<ChessPiece>>();
                /*drawConfigurations.Add(new List<ChessPiece> {new King()});
                drawConfigurations.Add(new List<ChessPiece> {new King(), new Bishop()});
                drawConfigurations.Add(new List<ChessPiece> {new King(), new Knight()});*/

                if (drawConfigurations.Contains(AIPlayer.Pieces)
                    && drawConfigurations.Contains(HumanPlayer.Pieces))
                    return Shared.GameStatus.Draw;

                return Shared.GameStatus.Continue;
            }
            else
            {
                var currentKing = (King)(evaluatedTeam == Shared.TeamType.White ? movementManager.WhiteKing : movementManager.BlackKing);

                switch (currentKing.isChecked)
                {
                    case true when !movementManager.TeamHasPossibleMoves:
                        return evaluatedTeam == HumanPlayer.Team ? Shared.GameStatus.Defeat : Shared.GameStatus.Victory;
                    case false when !movementManager.TeamHasPossibleMoves:
                        return Shared.GameStatus.Draw;
                }

                var drawConfigurations = new List<List<ChessPiece>>();
                /*drawConfigurations.Add(new List<ChessPiece> {new King()});
                drawConfigurations.Add(new List<ChessPiece> {new King(), new Bishop()});
                drawConfigurations.Add(new List<ChessPiece> {new King(), new Knight()});*/

                if (drawConfigurations.Contains(OtherPlayer.Pieces)
                    && drawConfigurations.Contains(HumanPlayer.Pieces))
                    return Shared.GameStatus.Draw;

                return Shared.GameStatus.Continue;
            }
        }
        
        private IEnumerator AITurn()
        {
            const int depthSearch = 2;
            // Calculate best move for bot
            ChessPiece chessPieceToMove = null;
            var moveToMake = new Move();
            var bestScore = int.MinValue;
            var alpha = int.MinValue;
            var beta = int.MaxValue;
             
            foreach (var piece in AIPlayer.Pieces)
            {
                foreach (var move in piece.Moves)
                {
                    yield return null;
                    var simulatedTile = tileManager.Tiles[move.Coords.x, move.Coords.y];
                    
                    simulatedTile.DetermineTileTypeFromMove(move);
                    var simulatedTurn = movementManager.MakeMove(movementManager.ChessPieces, piece, simulatedTile, true);

                    // We make a deep copy of the board to not re-calculate the moves for each simulation
                    // Each MiniMax instance will have its own board to play around with
                    var boardCopy = chessboard.DeepCopyBoard(movementManager.ChessPieces);

                    var score = MiniMax(simulatedTurn, boardCopy,
                        chessboard.DeepCopyTiles(tileManager.Tiles, boardCopy), depthSearch - 1, HumanPlayer, false,
                        alpha, beta);

                    movementManager.UndoMove(movementManager.ChessPieces, simulatedTurn, true);

                    simulatedTile.ResetTileType();
                    
                    if (score <= bestScore) continue;
                    
                    chessPieceToMove = piece;
                    moveToMake = move;
                    bestScore = score;
                    
                    alpha = Math.Max(alpha, bestScore);
                    if (alpha >= beta)
                        break;
                }
            }

            var moveToTile = tileManager.Tiles[moveToMake.Coords.x, moveToMake.Coords.y];

            moveToTile.DetermineTileTypeFromMove(moveToMake);
            var turn = movementManager.MakeMove(movementManager.ChessPieces, chessPieceToMove, moveToTile, false);
            moveToTile.ResetTileType();

            AIPlayer.HasMoved = true;
            AdvanceTurn(turn);
            MarkAIMove(turn);
        }

        private void MarkAIMove(Turn turn)
        {
            var positionChange = turn.PiecesMovedInThisTurn.PositionChanges[^1];
            tileManager.UpdateTileMaterial(positionChange.Item1, Shared.TileType.Selected);

            var isTurnAttack = turn.MoveType is Shared.MoveType.Attack or Shared.MoveType.AttackPromotion
                or Shared.MoveType.EnPassant;
            var isTileWhite = tileManager.Tiles[positionChange.Item2.x, positionChange.Item2.y];
            tileManager.UpdateTileMaterial(positionChange.Item2,
                isTurnAttack 
                    ? isTileWhite ? Shared.TileType.AttackTileWhite : Shared.TileType.AttackTileBlack 
                    : isTileWhite ? Shared.TileType.AvailableWhite : Shared.TileType.AvailableBlack);
        }

        private void UnmarkAIMove(Turn turn)
        {
            var positionChange = turn.PiecesMovedInThisTurn.PositionChanges[^1];
            tileManager.UpdateTileMaterial(positionChange.Item1, Shared.TileType.Default);
            tileManager.UpdateTileMaterial(positionChange.Item2, Shared.TileType.Default);
        }
        
        private static Dictionary<ChessPiece, List<Move>> CopyAllMoves(List<ChessPiece> pieces)
        {
            return pieces.ToDictionary(playerPiece => playerPiece, playerPiece => Move.DeepCopy(playerPiece.Moves));
        }
        
        private int MiniMax(Turn previousTurn, ChessPiece[,] board, Tile[,] tiles, int depth, Player player, bool maximizing, int alpha, int beta)
        {
            var gameStatus = EvaluateGameStatus(player.Team);
            if (depth == 0 || gameStatus is Shared.GameStatus.Defeat or Shared.GameStatus.Victory
                    or Shared.GameStatus.Draw)
            {
                var score = EvaluateBoardScore(board, player);
                CleanUpSearchBoard(board, tiles);
                return score;
            }
            
            // Correctly break the copied board into white and black chessPieces
            var chessBoard = movementManager.GetChessPieceListFromArray(board);
            var whitePieces = chessBoard.FindAll(cp => cp.team == Shared.TeamType.White).ToList();
            var blackPieces = chessBoard.FindAll(cp => cp.team == Shared.TeamType.Black).ToList();
            RegenerateMovesForPlayer(previousTurn, board, tiles, whitePieces, blackPieces, player);

            // Calculate each piece moves
            var playerPieces = player.Team == Shared.TeamType.White ? whitePieces : blackPieces;
            var moveDict = CopyAllMoves(playerPieces);
            int bestEval;
            if (maximizing)
            {
                bestEval = int.MinValue;
                foreach (var piece in playerPieces)
                {
                    var copyPieceMoves = moveDict[piece];
                    foreach (var move in copyPieceMoves)
                    {
                        // Make Move
                        var moveToTile = tiles[move.Coords.x, move.Coords.y];
                        
                        moveToTile.DetermineTileTypeFromMove(move);
                        var simulatedTurn =
                            movementManager.MakeMove(board, piece, moveToTile, true);

                        var boardCopy = chessboard.DeepCopyBoard(board);
                        bestEval =
                            Math.Max(bestEval,
                                MiniMax(simulatedTurn, boardCopy, chessboard.DeepCopyTiles(tiles, boardCopy), depth - 1,
                                    HumanPlayer, false, alpha, beta));
                        
                        movementManager.UndoMove(board, simulatedTurn, true);
                        moveToTile.ResetTileType();
                        
                        alpha = Math.Max(alpha, bestEval);
                        if (bestEval >= beta)
                        {
                            CleanUpSearchBoard(board, tiles);
                            return alpha;
                        }
                    }
                }
            }
            else
            {
                bestEval = int.MaxValue;
                foreach (var piece in playerPieces)
                {
                    var copyPieceMoves = moveDict[piece];
                    foreach (var move in copyPieceMoves)
                    {
                        var moveToTile = tiles[move.Coords.x, move.Coords.y];

                        // Simulate move
                        moveToTile.DetermineTileTypeFromMove(move);
                        var simulatedTurn =
                            movementManager.MakeMove(board, piece, tiles[move.Coords.x, move.Coords.y], true);
                        
                        // Calculate score
                        var boardCopy = chessboard.DeepCopyBoard(board);
                        bestEval = Math.Min(bestEval,
                            MiniMax(simulatedTurn, boardCopy, chessboard.DeepCopyTiles(tiles, boardCopy), depth - 1,
                                AIPlayer, true, alpha, beta));
                        
                        // Undo simulated movement
                        movementManager.UndoMove(board, simulatedTurn, true);
                        moveToTile.ResetTileType();

                        beta = Math.Min(beta, bestEval);
                        if (bestEval <= alpha)
                        {
                            CleanUpSearchBoard(board, tiles);
                            return beta;
                        }
                    }
                }
                
            }

            CleanUpSearchBoard(board, tiles);
            return bestEval;
        }
        
        private int EvaluateBoardScore(ChessPiece[,] board, Player evaluatedPlayer)
        {
            var score = 0;
            foreach (var piece in board)
            {
                if (piece == null) continue;

                var scoreSign = piece.team == evaluatedPlayer.Team ? 1 : -1;
                score += piece.pieceScore * scoreSign;
            }

            return score;
        }

        private void SwitchTurn()
        {
            IsWhiteTurn = !IsWhiteTurn;
        }
        
        private void DisableEnPassantTargetOnLastTurnPiece()
        {
            if (LastTurn != null && LastTurn.PiecesMovedInThisTurn.Pieces[^1].type == ChessPieceType.Pawn)
            {
                ((Pawn)LastTurn.PiecesMovedInThisTurn.Pieces[^1]).IsEnPassantTarget = false;
            }
        }
        
        private void SetPlayer(Vector3 position)
        {
            var direction = Shared.TeamType.White == HumanPlayer.Team ? 1 : -1;
            Debug.Log(position.x + " " + position.y + " " + position.z);
            if (Shared.TeamType.White == HumanPlayer.Team)
                xrOrigin.transform.rotation = Quaternion.Euler(0, -90, 0);
            else xrOrigin.transform.rotation = Quaternion.Euler(0, 90, 0);
            xrOrigin.transform.position = new Vector3(position.x, position.y,
                position.z);
            xrOrigin.GetComponent<ActionBasedContinuousMoveProvider>().enabled = true;
        }
        
        public bool IsChessPieceInHistory(ChessPiece chessPiece)
        {
            foreach (var turn in History)
            {
                var pieces = turn.PiecesMovedInThisTurn.Pieces;
                foreach (var piece in pieces)
                {
                    if (piece == chessPiece) return true;
                }
            }

            return false;
        }

        private void RegenerateMovesForPlayer(Turn lastTurn, ChessPiece[,] board, Tile[,] tiles,
            List<ChessPiece> whitePieces, List<ChessPiece> blackPieces, Player player)
        {
            var king = (King)(player.Team == Shared.TeamType.White
                ? whitePieces.First(cp => cp.type == ChessPieceType.King)
                : blackPieces.First(cp => cp.type == ChessPieceType.King));
            
            movementManager.GenerateAllMoves(lastTurn, player, board, tiles, whitePieces, blackPieces);
            movementManager.EvaluateKingStatus(tiles, king);
            movementManager.EliminateInvalidMoves(board, tiles, player.Team);
        }
        
        private static void CleanUpSearchBoard(ChessPiece[,] board, Tile[,] tiles)
        {
            DestroyBoard(board);
            DestroyTileSet(tiles);
        }
        
        private static void DestroyBoard(ChessPiece[,] boardToDestroy)
        {
            foreach (var chessPiece in boardToDestroy)
            {
                if(chessPiece == null) continue;
                
                Destroy(chessPiece.gameObject);
                break;
            }
        }
        
        private static void DestroyTileSet(Tile[,] tilesToDestroy)
        {
            foreach (var tile in tilesToDestroy)
                Destroy(tile.gameObject);
        }

        public void OnRequestSendMove(SocketIOResponse socketIOResponse)
        {
            UnityMainThreadDispatcher.Instance().Enqueue(() =>
            {
                MovingRequest data = socketIOResponse.GetValue<MovingRequest>();
                Vector2Int startV2 = Chess.Core.BoardHelper.Vector2FromIndex(data.moving.start);
                Vector2Int targetV2 = Chess.Core.BoardHelper.Vector2FromIndex(data.moving.target);
                Debug.Log(startV2.x + " / " + startV2.y);
                ChessPiece chessPieceToMove = movementManager.GetChessPiece(startV2);

                var moveToMake = new Move();

                foreach (var piece in OtherPlayer.Pieces)
                {
                    foreach (var move in piece.Moves)
                    {
                        if (piece.name == chessPieceToMove.name && piece.currentX == chessPieceToMove.currentX && piece.currentY == chessPieceToMove.currentY)
                        {
                            moveToMake = move;
                            break;
                        }
                    }
                }

                moveToMake.Coords = targetV2;
                var moveToTile = tileManager.Tiles[moveToMake.Coords.x, moveToMake.Coords.y];

                moveToTile.DetermineTileTypeFromMove(moveToMake);
                var turn = movementManager.MakeMove(movementManager.ChessPieces, chessPieceToMove, moveToTile, false);
                moveToTile.ResetTileType();

                CurrentPlayer.HasMoved = true;
            });
        }
    }
}
