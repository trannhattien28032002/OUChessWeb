using System;
using ChessLogic;
using ChessPieces;
using Managers;

namespace Players
{
    public class AIPlayer : Player
    {
        public override void Update()
        {
            if (!IsMyTurn || !HasMoved) return;
            
            IsMyTurn = false;
            HasMoved = false;
        }
    }
}