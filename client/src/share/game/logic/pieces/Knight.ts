import type { Position, MoveFunction, Piece, PieceFactory } from "src/interfaces/gameplay/chess";
import { getMove, getBasePiece } from "src/share/game/logic/pieces"

export function isKnight(value: Knight | Piece | null): value is Knight {
  return value?.type === `knight`
}

export const knightMoves: MoveFunction = ({
  piece,
  board,
  propagateDetectCheck,
}) => {
  const moves = []
  for (const steps of KNIGHT_MOVES) {
    const move = getMove({ piece, board, steps, propagateDetectCheck })
    if (!move) continue
    moves.push(move)
  }

  return moves
}

export const createKnight = ({ color, id, position }: PieceFactory): Knight => {
  return {
    ...getBasePiece({ color, id, type: `knight`, position }),
  }
}

const KNIGHT_MOVES: Position[] = [
  {
    x: 1,
    y: 2,
  },
  {
    x: 2,
    y: 1,
  },
  {
    x: 2,
    y: -1,
  },
  {
    x: 1,
    y: -2,
  },
  {
    x: -1,
    y: -2,
  },
  {
    x: -2,
    y: -1,
  },
  {
    x: -2,
    y: 1,
  },
  {
    x: -1,
    y: 2,
  },
]

export type Knight = Piece
