using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Players
{
    public class OtherPlayer : Player
    {
        public override void Update()
        {
            if (!IsMyTurn || !HasMoved) return;

            DisablePieces();
            IsMyTurn = false;
            HasMoved = false;
        }
    }
}
