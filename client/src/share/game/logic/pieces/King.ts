import type { Board, Position, Move, MoveFunction, Piece, PieceFactory, Rook } from "src/interfaces/gameplay/chess"
import { moveTypes, getFarMoves, getPiece, getMove, getBasePiece } from "src/share/game/logic/pieces"
import { isRook } from "src/share/game/logic/pieces/Rook"

export const isKing = (value: King | Piece | null): value is King => {
    return value?.type === `king`
}

const canCastleKing = (king: King, board: Board, propagateDetectCheck: boolean): Move[] => {
    if (king.hasMoved) return []
    const possibleRookPositions: Move[] = []
    const rook = getPiece(board, {
        x: king.position.x + 3,
        y: king.position.y,
    })

    const rook2 = getPiece(board, {
        x: king.position.x - 4,
        y: king.position.y,
    })

    const spacesToRight = getFarMoves({
        board,
        piece: king,
        direction: { x: 1, y: 0 },
        propagateDetectCheck: propagateDetectCheck,
    })
    const spacesToLeft = getFarMoves({
        board,
        piece: king,
        direction: { x: -1, y: 0 },
        propagateDetectCheck: propagateDetectCheck,
    })
    const props = (right: boolean) => ({
        capture: null,
        piece: king,
        type: moveTypes.castling,
        newPosition: { x: right ? 6 : 2, y: king.position.y },
        steps: { x: right ? 2 : -2, y: 0 },
        castling: {
            rook: right ? (rook as Rook) : (rook2 as Rook),
            rookSteps: { x: right ? -2 : 3, y: 0 },
            rookNewPosition: { x: right ? 5 : 3, y: king.position.y },
        },
    })
    if (isRook(rook) && !rook.hasMoved && spacesToRight.length === 2) {
        possibleRookPositions.push(props(true))
    }

    if (isRook(rook2) && !rook2.hasMoved && spacesToLeft.length === 3) {
        possibleRookPositions.push(props(false))
    }

    return possibleRookPositions
}

export const kingMoves: MoveFunction<King> = ({
    piece,
    board,
    propagateDetectCheck,
}) => {
    const moves: Move[] = []

    for (const steps of KING_MOVES) {
        const move = getMove({ piece, board, steps, propagateDetectCheck })
        if (!move) continue
        moves.push(move)
    }

    const possibleCastles = canCastleKing(piece, board, propagateDetectCheck)
    return [...moves, ...possibleCastles]
}

export const createKing = ({ color, id, position }: PieceFactory): King => {
    return {
        hasMoved: false,
        ...getBasePiece({ color, id, type: `king`, position }),
    }
}

export type King = Piece & {
    hasMoved: boolean
}

const KING_MOVES: Position[] = [
    {
        x: 0,
        y: -1,
    },
    {
        x: 0,
        y: 1,
    },
    {
        x: -1,
        y: 0,
    },
    {
        x: 1,
        y: 0,
    },
    {
        x: -1,
        y: -1,
    },
    {
        x: 1,
        y: 1,
    },
    {
        x: -1,
        y: 1,
    },
    {
        x: 1,
        y: -1,
    },
]
