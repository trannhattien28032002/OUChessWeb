import Board from "src/interfaces/gamecore/board/Board";
import Coord from "src/interfaces/gamecore/board/Coord";
import Move, { MoveFlag } from "src/interfaces/gamecore/board/Move";
import * as Piece from "src/interfaces/gamecore/board/Piece";
import * as BoardHelper from "src/interfaces/gamecore/helper/BoardHelper";
import * as PieceFunc from "src/share/gamecore/board/Piece";
export const defaultFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export class PositionInfo {
    fen: string;
    squares: number[];
    whiteCastleKingside: boolean;
    whiteCastleQueenside: boolean;
    blackCastleKingside: boolean;
    blackCastleQueenside: boolean;

    epFile: number;
    whiteToMove: boolean;

    fiftyMovePlyCount: number;

    moveCount: number;

    constructor(fen: string) {
        this.fen = fen;
        const squarePieces: number[] = [];
        for (let i = 0; i < 64; i++) {
            squarePieces[i] = 0;
        }
        const sections: string[] = fen.split(" ");

        let file = 0;
        let rank = 7;

        for (let i = 0; i < sections[0].length; i++) {
            const symbol = sections[0][i];
            if (symbol === "/") {
                file = 0;
                rank--;
            } else {
                if (!isNaN(parseInt(symbol))) {
                    file += parseInt(symbol, 36);
                } else {
                    const pieceColour =
                        symbol === symbol.toUpperCase() ? Piece.PieceColor.White : Piece.PieceColor.Black;
                    const lower = symbol.toLowerCase();
                    let pieceType = 0;
                    switch (lower) {
                        case "k":
                            pieceType = Piece.PieceType.King;
                            break;
                        case "p":
                            pieceType = Piece.PieceType.Pawn;
                            break;
                        case "n":
                            pieceType = Piece.PieceType.Knight;
                            break;
                        case "b":
                            pieceType = Piece.PieceType.Bishop;
                            break;
                        case "r":
                            pieceType = Piece.PieceType.Rook;
                            break;
                        case "q":
                            pieceType = Piece.PieceType.Queen;
                            break;
                        default:
                            pieceType = Piece.PieceType.None;
                    }

                    squarePieces[rank * 8 + file] = pieceType | pieceColour;
                    file++;
                }
            }
        }

        this.squares = squarePieces;
        this.whiteToMove = sections[1] === "w";
        const castlingRights = sections[2];
        this.whiteCastleKingside = castlingRights.includes("K");
        this.whiteCastleQueenside = castlingRights.includes("Q");
        this.blackCastleKingside = castlingRights.includes("k");
        this.blackCastleQueenside = castlingRights.includes("q");

        this.epFile = 0;
        this.fiftyMovePlyCount = 0;
        this.moveCount = 0;

        if (sections.length > 3) {
            const enPassantFileName = sections[3][0].toString();
            if (BoardHelper.fileNames.includes(enPassantFileName)) {
                this.epFile = BoardHelper.fileNames.indexOf(enPassantFileName) + 1;
            }
        }

        if (sections.length > 4) {
            this.fiftyMovePlyCount = parseInt(sections[4]);
        }

        if (sections.length > 5) {
            this.moveCount = parseInt(sections[5]);
        }
    }
}

export const PositionFromFen = (fen: string): PositionInfo => {
    const loadedPositionInfo: PositionInfo = new PositionInfo(fen);
    return loadedPositionInfo;
};

export const CurrentFen = (board: Board, alwaysIncludeEPSquare = true) => {
    let fen = "";
    for (let rank = 7; rank >= 0; rank--) {
        let numEmptyFiles = 0;
        for (let file = 0; file < 8; file++) {
            const i = rank * 8 + file;
            const piece = board.Square[i];
            if (piece !== 0) {
                if (numEmptyFiles !== 0) {
                    fen += numEmptyFiles;
                    numEmptyFiles = 0;
                }

                const isBlack = PieceFunc.IsColour(piece, Piece.PieceColor.Black);
                const pieceType = PieceFunc.PieceType(piece);
                let pieceChar = " ";
                switch (pieceType) {
                    case Piece.PieceType.Rook:
                        pieceChar = "R";
                        break;
                    case Piece.PieceType.Bishop:
                        pieceChar = "B";
                        break;
                    case Piece.PieceType.Knight:
                        pieceChar = "N";
                        break;
                    case Piece.PieceType.Pawn:
                        pieceChar = "P";
                        break;
                    case Piece.PieceType.Queen:
                        pieceChar = "Q";
                        break;
                    case Piece.PieceType.King:
                        pieceChar = "K";
                        break;
                    default:
                        pieceChar = "";
                }
                fen += isBlack ? pieceChar.toLowerCase() : pieceChar;
            } else {
                numEmptyFiles++;
            }
        }

        if (numEmptyFiles !== 0) {
            fen += numEmptyFiles;
        }

        if (rank !== 0) {
            fen += "/";
        }
    }

    fen += " ";
    fen += board.IsWhiteToMove ? "w" : "b";

    const whiteKingSide = (board.CurrentGameState.castlingRights & 1) === 1;
    const whiteQueenSide = ((board.CurrentGameState.castlingRights >> 1) & 1) === 1;
    const blackKingSide = ((board.CurrentGameState.castlingRights >> 2) & 1) === 1;
    const blackQueenSide = ((board.CurrentGameState.castlingRights >> 3) & 1) === 1;
    fen += " ";
    fen += whiteKingSide ? "K" : "";
    fen += whiteQueenSide ? "Q" : "";
    fen += blackKingSide ? "k" : "";
    fen += blackQueenSide ? "q" : "";
    fen += board.CurrentGameState.castlingRights === 0 ? "-" : "";

    fen += " ";
    const epFileIndex = board.CurrentGameState.enPassantFile - 1;
    const epRankIndex = board.IsWhiteToMove ? 5 : 2;

    const isEnPassant = epFileIndex !== -1;
    const includeEP = alwaysIncludeEPSquare || EnPassantCanBeCaptured(epFileIndex, epRankIndex, board);
    if (isEnPassant && includeEP) {
        fen += BoardHelper.SquareNameFromFileAndRank(epFileIndex, epRankIndex);
    } else {
        fen += "-";
    }

    fen += " ";
    fen += board.CurrentGameState.fiftyMoveCounter;

    fen += " ";
    fen += board.PlyCount / 2 + 1;

    return fen;
};

export const EnPassantCanBeCaptured = (epFileIndex: number, epRankIndex: number, board: Board): boolean => {
    const captureFromA: Coord = new Coord(epFileIndex - 1, epRankIndex + (board.IsWhiteToMove ? -1 : 1));
    const captureFromB: Coord = new Coord(epFileIndex + 1, epRankIndex + (board.IsWhiteToMove ? -1 : 1));
    const epCaptureSquare: number = new Coord(epFileIndex, epRankIndex).SquareIndex();
    const friendlyPawn: number = PieceFunc.MakePiece(Piece.PieceType.Pawn, board.MoveColour());

    const CanCapture = (from: Coord): boolean => {
        const isPawnOnSquare = board.Square[from.SquareIndex()] === friendlyPawn;
        if (from.IsValidSquare() && isPawnOnSquare) {
            const move: Move = new Move(from.SquareIndex(), epCaptureSquare, MoveFlag.EnPassantCaptureFlag);
            board.MakeMove(move);
            board.MakeNullMove();
            const wasLegalMove = !board.CalculateInCheckState();

            board.UnMakeMove(move);
            board.UnMakeNullMove();
            return wasLegalMove;
        }
        return false;
    };

    return CanCapture(captureFromA) || CanCapture(captureFromB);
};

export const FlipFen = (fen: string): string => {
    let flippedFen = "";
    const sections: string[] = fen.split(" ");

    const invertedFenChars = [] as string[];
    const fenRanks = sections[0].split("/");

    const InvertCase = (c: string): string => {
        if (c === c.toLowerCase()) {
            return c.toUpperCase();
        }
        return c.toLowerCase();
    };

    for (let i = fenRanks.length; i >= 0; i--) {
        const rank = fenRanks[i];

        for (let j = 0; j < rank.length; i++) {
            flippedFen += InvertCase(rank[j]);
        }
        if (i !== 0) {
            flippedFen += "/";
        }
    }

    flippedFen += " " + (sections[1][0] === "w" ? "b" : "w");
    const castlingRights = sections[2];
    let flippedRights = "";
    const str = "kqKQ";
    for (let i = 0; i < str.length; i++) {
        if (castlingRights.includes(str[i])) {
            flippedRights += InvertCase(str[i]);
        }
    }
    flippedFen += " " + (flippedRights.length === 0 ? "-" : flippedRights);

    const ep = sections[3];
    let flippedEp = ep[0] + "";
    if (ep.length > 1) {
        flippedEp += ep[1] === "6" ? "3" : "6";
    }
    flippedFen += " " + flippedEp;
    flippedFen += " " + sections[4] + " " + sections[5];

    return flippedFen;
};
