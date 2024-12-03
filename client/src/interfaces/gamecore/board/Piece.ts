export const PieceType = {
    None: 0,
    Pawn: 1,
    Knight: 2,
    Bishop: 3,
    Rook: 4,
    Queen: 5,
    King: 6,
};

export const PieceColor = {
    White: 0,
    Black: 8,
};

export const WhitePiece = {
    WhitePawn: PieceType.Pawn | PieceColor.White, // 1
    WhiteKnight: PieceType.Knight | PieceColor.White, // 2
    WhiteBishop: PieceType.Bishop | PieceColor.White, // 3
    WhiteRook: PieceType.Rook | PieceColor.White, // 4
    WhiteQueen: PieceType.Queen | PieceColor.White, // 5
    WhiteKing: PieceType.King | PieceColor.White, // 6
};

export const BlackPiece = {
    BlackPawn: PieceType.Pawn | PieceColor.Black, // 9
    BlackKnight: PieceType.Knight | PieceColor.Black, // 10
    BlackBishop: PieceType.Bishop | PieceColor.Black, // 11
    BlackRook: PieceType.Rook | PieceColor.Black, // 12
    BlackQueen: PieceType.Queen | PieceColor.Black, // 13
    BlackKing: PieceType.King | PieceColor.Black, // 14
};

export const PieceMask = {
    typeMask: 0b0111,
    colourMask: 0b1000,
};

export const PieceIndices = [
    WhitePiece.WhitePawn,
    WhitePiece.WhiteKnight,
    WhitePiece.WhiteBishop,
    WhitePiece.WhiteRook,
    WhitePiece.WhiteQueen,
    WhitePiece.WhiteKing,
    BlackPiece.BlackPawn,
    BlackPiece.BlackKnight,
    BlackPiece.BlackBishop,
    BlackPiece.BlackRook,
    BlackPiece.BlackQueen,
    BlackPiece.BlackKing,
];

export const MaxPieceIndex = BlackPiece.BlackKing;
