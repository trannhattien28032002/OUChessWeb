using System;
using System.Collections.Generic;
using ChessPieces;
using Managers;
using UnityEngine;

namespace ChessLogic
{
    public static class Shared
    {
        public const string TileDetectorName = "TileDetector";

        public const string EliminationTileParentName = "EliminationTiles - DestroyOnLoad";
        public const string WhiteEliminationTilesName = "White EliminationTiles";
        public const string BlackEliminationTilesName = "Black EliminationTiles";

        public enum ModeGame
        {
            Multiplayer,
            BotAI
        }

        public enum TileType
        {
            Default,
            Selected,
            AvailableBlack,
            AvailableWhite,
            HighlightMoveTo,
            AttackTileBlack,
            AttackTileWhite,
            HighlightAttack
        }

        public enum TileOccupiedBy
        {
            EndOfTable,
            FriendlyPiece,
            EnemyPiece,
            None
        }

        public enum TeamType
        {
            White,
            Black
        }

        public enum MovementType
        {
            Normal,
            Attack,
            None
        }

        public enum MoveType
        {
            EnPassant,
            ShortCastle,
            LongCastle,
            Promotion,
            AttackPromotion,
            Normal,
            Attack
        }

        public enum AttackedBy
        {
            None,
            White,
            Black,
            Both
        }

        public enum GameStatus
        {
            NotStarted,
            Draw,
            Victory,
            Defeat,
            Continue
        }
        
        public enum ChessboardConfig
        {
            Normal,
            Victory,
            Defeat,
            Draw,
            ShortCastle,
            LongCastle,
            EnPassant,
            Promotion
        }
        
        public static List<Move> GeneratePossibleMovesBasedOnXAndYStep(ChessPiece[,] board, Tile[,] tiles, ChessPiece chessPiece, int stepX, int stepY)
        {
            List<Move> possibleMoves = new();

            while (true)
            {
                var lastAddedMove =
                    possibleMoves.Count == 0
                        ? new Vector2Int(chessPiece.currentX, chessPiece.currentY)
                        : possibleMoves[^1].Coords;

                Vector2Int possibleMove = new(lastAddedMove.x + stepX, lastAddedMove.y + stepY);
                
                var occupationType = chessPiece.MovementManager.CalculateSpaceOccupation(board, possibleMove, chessPiece.team);

                if (occupationType is TileOccupiedBy.EndOfTable) break;
                
                chessPiece.AddToTileAttackingPieces(tiles, possibleMove);
                
                if (occupationType is TileOccupiedBy.FriendlyPiece) break;
                if (TileOccupiedBy.EnemyPiece == occupationType)
                {
                    possibleMoves.Add(new Move(possibleMove, MoveType.Attack));
                    break;
                }

                possibleMoves.Add(new Move(possibleMove, MoveType.Normal));
            }

            return possibleMoves;
        }

    }
}
