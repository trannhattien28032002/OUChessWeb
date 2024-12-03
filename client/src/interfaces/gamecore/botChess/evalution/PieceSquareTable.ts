import * as BoardHelper from "src/interfaces/gamecore/helper/BoardHelper";
import * as Piece from "src/interfaces/gamecore/board/Piece";
import * as PieceFunc from "src/share/gamecore/board/Piece";
import Coord from "src/interfaces/gamecore/board/Coord";

class PieceSquareTable {
    static initilize = false;
    static Tables: number[][];

    static Read = (table: number[], square: number, isWhite: boolean): number => {
        if (isWhite) {
            const file = BoardHelper.FileIndex(square);
            let rank = BoardHelper.RankIndex(square);
            rank = 7 - rank;
            square = BoardHelper.IndexFromCoord(file, rank);
        }

        return table[square];
    };

    static ReadTables = (piece: number, square: number): number => {
        return this.Tables[piece][square];
    };

    static Pawns: number[] = [
        0, 0, 0, 0, 0, 0, 0, 0, 50, 50, 50, 50, 50, 50, 50, 50, 10, 10, 20, 30, 30, 20, 10, 10, 5, 5, 10, 25, 25, 10, 5,
        5, 0, 0, 0, 20, 20, 0, 0, 0, 5, -5, -10, 0, 0, -10, -5, 5, 5, 10, 10, -20, -20, 10, 10, 5, 0, 0, 0, 0, 0, 0, 0,
        0,
    ];

    static PawnsEnd: number[] = [
        0, 0, 0, 0, 0, 0, 0, 0, 80, 80, 80, 80, 80, 80, 80, 80, 50, 50, 50, 50, 50, 50, 50, 50, 30, 30, 30, 30, 30, 30,
        30, 30, 20, 20, 20, 20, 20, 20, 20, 20, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 0, 0, 0,
        0, 0, 0, 0, 0,
    ];

    static Rooks: number[] = [
        0, 0, 0, 0, 0, 0, 0, 0, 5, 10, 10, 10, 10, 10, 10, 5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0,
        0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0, -5, 0, 0, 0, 5, 5, 0, 0, 0,
    ];

    static Knights: number[] = [
        -50, -40, -30, -30, -30, -30, -40, -50, -40, -20, 0, 0, 0, 0, -20, -40, -30, 0, 10, 15, 15, 10, 0, -30, -30, 5,
        15, 20, 20, 15, 5, -30, -30, 0, 15, 20, 20, 15, 0, -30, -30, 5, 10, 15, 15, 10, 5, -30, -40, -20, 0, 5, 5, 0,
        -20, -40, -50, -40, -30, -30, -30, -30, -40, -50,
    ];

    static Bishops: number[] = [
        -20, -10, -10, -10, -10, -10, -10, -20, -10, 0, 0, 0, 0, 0, 0, -10, -10, 0, 5, 10, 10, 5, 0, -10, -10, 5, 5, 10,
        10, 5, 5, -10, -10, 0, 10, 10, 10, 10, 0, -10, -10, 10, 10, 10, 10, 10, 10, -10, -10, 5, 0, 0, 0, 0, 5, -10,
        -20, -10, -10, -10, -10, -10, -10, -20,
    ];

    static Queens: number[] = [
        -20, -10, -10, -5, -5, -10, -10, -20, -10, 0, 0, 0, 0, 0, 0, -10, -10, 0, 5, 5, 5, 5, 0, -10, -5, 0, 5, 5, 5, 5,
        0, -5, 0, 0, 5, 5, 5, 5, 0, -5, -10, 5, 5, 5, 5, 5, 0, -10, -10, 0, 5, 0, 0, 0, 0, -10, -20, -10, -10, -5, -5,
        -10, -10, -20,
    ];

    static KingStart: number[] = [
        -80, -70, -70, -70, -70, -70, -70, -80, -60, -60, -60, -60, -60, -60, -60, -60, -40, -50, -50, -60, -60, -50,
        -50, -40, -30, -40, -40, -50, -50, -40, -40, -30, -20, -30, -30, -40, -40, -30, -30, -20, -10, -20, -20, -20,
        -20, -20, -20, -10, 20, 20, -5, -5, -5, -5, 20, 20, 20, 30, 10, 0, 0, 10, 30, 20,
    ];

    static KingEnd: number[] = [
        -20, -10, -10, -10, -10, -10, -10, -20, -5, 0, 5, 5, 5, 5, 0, -5, -10, -5, 20, 30, 30, 20, -5, -10, -15, -10,
        35, 45, 45, 35, -10, -15, -20, -15, 30, 40, 40, 30, -15, -20, -25, -20, 20, 25, 25, 20, -20, -25, -30, -25, 0,
        0, 0, 0, -25, -30, -50, -30, -30, -30, -30, -30, -30, -50,
    ];

    static GetFlippedTable = (table: number[]) => {
        const flippedTable = new Array<number>(table.length);
        for (let i = 0; i < table.length; i++) {
            const coord: Coord = new Coord(i);
            const flippedCoord: Coord = new Coord(coord.fileIndex, 7 - coord.rankIndex);
            flippedTable[flippedCoord.SquareIndex()] = table[i];
        }

        return flippedTable;
    };

    static Initialized() {
        if (!this.initilize) {
            PieceSquareTable.Tables = new Array<number>(14 + 1).map(() => []);
            PieceSquareTable.Tables[PieceFunc.MakePiece(Piece.PieceType.Pawn, Piece.PieceColor.White)] =
                PieceSquareTable.Pawns;
            PieceSquareTable.Tables[PieceFunc.MakePiece(Piece.PieceType.Rook, Piece.PieceColor.White)] =
                PieceSquareTable.Rooks;
            PieceSquareTable.Tables[PieceFunc.MakePiece(Piece.PieceType.Knight, Piece.PieceColor.White)] =
                PieceSquareTable.Knights;
            PieceSquareTable.Tables[PieceFunc.MakePiece(Piece.PieceType.Bishop, Piece.PieceColor.White)] =
                PieceSquareTable.Bishops;
            PieceSquareTable.Tables[PieceFunc.MakePiece(Piece.PieceType.Queen, Piece.PieceColor.White)] =
                PieceSquareTable.Queens;

            PieceSquareTable.Tables[PieceFunc.MakePiece(Piece.PieceType.Pawn, Piece.PieceColor.Black)] =
                this.GetFlippedTable(PieceSquareTable.Pawns);
            PieceSquareTable.Tables[PieceFunc.MakePiece(Piece.PieceType.Rook, Piece.PieceColor.Black)] =
                this.GetFlippedTable(PieceSquareTable.Rooks);
            PieceSquareTable.Tables[PieceFunc.MakePiece(Piece.PieceType.Knight, Piece.PieceColor.Black)] =
                this.GetFlippedTable(PieceSquareTable.Knights);
            PieceSquareTable.Tables[PieceFunc.MakePiece(Piece.PieceType.Bishop, Piece.PieceColor.Black)] =
                this.GetFlippedTable(PieceSquareTable.Bishops);
            PieceSquareTable.Tables[PieceFunc.MakePiece(Piece.PieceType.Queen, Piece.PieceColor.Black)] =
                this.GetFlippedTable(PieceSquareTable.Queens);
        }
    }
}

export default PieceSquareTable;
