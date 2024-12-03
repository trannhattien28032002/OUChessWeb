import type { MoveFunction, Piece, PieceFactory } from "src/interfaces/gameplay/chess";
import { getFarMoves, getBasePiece } from "src/share/game/logic/pieces";

export const isBishop = (value: Bishop | Piece | null): value is Bishop => {
    return value?.type === `bishop`;
}

export const bishopMoves: MoveFunction = ({
    piece,
    board,
    propagateDetectCheck,
}) => {
    const props = { piece, board, propagateDetectCheck }
    const moveRightUp = getFarMoves({ direction: { x: 1, y: -1 }, ...props })
    const moveRightDown = getFarMoves({ direction: { x: 1, y: 1 }, ...props })
    const moveLeftUp = getFarMoves({ direction: { x: -1, y: -1 }, ...props })
    const moveLeftDown = getFarMoves({ direction: { x: -1, y: 1 }, ...props })
    return [...moveRightDown, ...moveLeftUp, ...moveLeftDown, ...moveRightUp]
}

export const createBishop = ({ color, id, position }: PieceFactory): Bishop => {
    return {
        ...getBasePiece({ color, id, type: `bishop`, position }),
    }
}

export type Bishop = Piece