import type { MoveFunction, Piece, PieceFactory } from "src/interfaces/gameplay/chess";
import { getFarMoves, getBasePiece } from "src/share/game/logic/pieces"

export function isQueen(value: Piece | Queen | null): value is Queen {
    return value?.type === `queen`
}

export const queenMoves: MoveFunction = ({
    piece,
    board,
    propagateDetectCheck,
}) => {
    const props = { piece, board, propagateDetectCheck }
    const moveRightDown = getFarMoves({ direction: { x: 1, y: 1 }, ...props })
    const moveLeftUp = getFarMoves({ direction: { x: -1, y: -1 }, ...props })
    const moveLeftDown = getFarMoves({ direction: { x: -1, y: 1 }, ...props })
    const moveRightUp = getFarMoves({ direction: { x: 1, y: -1 }, ...props })

    const movesForward = getFarMoves({ direction: { x: 0, y: 1 }, ...props })
    const movesBackward = getFarMoves({ direction: { x: 0, y: -1 }, ...props })
    const movesLeft = getFarMoves({ direction: { x: -1, y: 0 }, ...props })
    const movesRight = getFarMoves({ direction: { x: 1, y: 0 }, ...props })

    return [
        ...moveRightDown,
        ...moveLeftUp,
        ...moveLeftDown,
        ...moveRightUp,
        ...movesForward,
        ...movesBackward,
        ...movesLeft,
        ...movesRight,
    ]
}

export const createQueen = ({ color, id, position }: PieceFactory): Queen => {
    return {
        ...getBasePiece({ color, id, type: `queen`, position }),
    }
}

export type Queen = Piece
