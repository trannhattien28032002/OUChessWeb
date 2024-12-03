import * as Piece from "src/interfaces/gamecore/board/Piece";

export const MakePiece = (pieceType: number, pieceColour: number | boolean): number => {
    if(typeof pieceColour === "boolean"){
        pieceColour = pieceColour === true ? 0 : 8;
    }

    return pieceType | pieceColour;
}

export const IsColour = (piece: number, colour: number): boolean => {
    return (piece & Piece.PieceMask.colourMask) === colour && piece !== 0;
}

export const IsWhite = (piece: number): boolean => {
    return IsColour(piece, Piece.PieceColor.White);
}

export const PieceColour = (piece: number): number => {
    return piece & Piece.PieceMask.colourMask;
}

export const PieceType = (piece: number): number => {
    return piece & Piece.PieceMask.typeMask;
}

export const IsOrthogonalSlider = (piece: number): boolean => {
    return PieceType(piece) === Piece.PieceType.Queen || PieceType(piece) === Piece.PieceType.Rook;
}

export const IsDiagonalSlider = (piece: number): boolean => {
    return PieceType(piece) === Piece.PieceType.Queen || PieceType(piece) === Piece.PieceType.Bishop;
}

export const IsSlidingPiece = (piece: number): boolean => {
    return PieceType(piece) === Piece.PieceType.Queen
        || PieceType(piece) === Piece.PieceType.Bishop
        || PieceType(piece) === Piece.PieceType.Rook;
}

export const GetSymbol = (piece: number): string => {
    const pieceType = PieceType(piece);
    let symbol = "";
    switch(pieceType){
        case Piece.PieceType.Rook:
            symbol = "R";
            break;
        case Piece.PieceType.Knight:
            symbol = "N";
            break;
        case Piece.PieceType.Bishop:
            symbol = "B";
            break;
        case Piece.PieceType.Queen:
            symbol = "Q";
            break;
        case Piece.PieceType.King:
            symbol = "K";
            break;
        case Piece.PieceType.Pawn:
            symbol = "P";
            break;
        default:
            symbol = "";
    }

    symbol = IsWhite(piece) ? symbol : symbol.toLowerCase();

    return symbol;
}

export const GetPieceTypeBySymbol = (symbol: string) => {
    symbol = symbol.toUpperCase();
    let pieceType = 0;
    switch(symbol){
        case "R":
            pieceType = Piece.PieceType.Rook;
            break;
        case "N":
            pieceType = Piece.PieceType.Knight;
            break;
        case "B":
            pieceType = Piece.PieceType.Bishop;
            break;
        case "Q":
            pieceType = Piece.PieceType.Queen;
            break;
        case "K":
            pieceType = Piece.PieceType.Knight;
            break;
        case "P":
            pieceType = Piece.PieceType.Pawn;
            break;
        default:
            pieceType = Piece.PieceType.None;
    }

    return pieceType;
}