import { moveTypes } from "src/share/game/logic/pieces/index"

// Board Type
export type Position = { x: number; y: number }

export type Board = Tile[][]

export type Tile = {
    position: Position
    piece: Pawn | Piece | Rook | null
}

// Gameplay Type
export type Piece = {
    type: PieceType
    color: Color
    id: number
    getId: () => string
    position: Position
}

export type Color = `black` | `white`
export type PieceType = `bishop` | `king` | `knight` | `pawn` | `queen` | `rook`

export type PieceArgs = {
    color: Color
    id: number
    type: PieceType
}

export type PieceFactory = PieceArgs & { position: Position }

export type Move = {
    steps: Position
    type: MoveTypes
    piece: Piece
    capture: Piece | null
    newPosition: Position
    castling?: {
        rook: Piece
        rookNewPosition: Position
        rookSteps: Position
    }
}

export type MoveTypes = typeof moveTypes[keyof typeof moveTypes]; // keyof typeof moveTypes sẽ trả về invalid | valid | castling | ...

export type MoveFunction<T extends Piece = Piece> = (props: {
    piece: T
    board: Board
    propagateDetectCheck: boolean
}) => Move[]

export type EndGameType = `checkmate` | `stalemate` | `threeford repetition` | `insufficient material` | `draw`;

// King Type
export type King = Piece & {
    hasMoved: boolean
}

// Rook Type
export type Rook = Piece & { hasMoved: boolean }


// Pawn Type
export type Pawn = Piece & {
    hasMoved: boolean
}