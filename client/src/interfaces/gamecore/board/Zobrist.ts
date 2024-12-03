import { PieceColor, PieceIndices, PieceType } from "src/interfaces/gamecore/board/Piece";
import * as PieceFunc from "src/share/gamecore/board/Piece";
import Board from "src/interfaces/gamecore/board/Board";

class Random {
    public state: number;

    constructor(seed: number) {
        this.state = seed;
    }

    Next = () => {
        this.state = (this.state * 9301 + 49297) % 233280;
        return this.state / 233280;
    };
}

class Zobrist {
    public static piecesArray = new Array<bigint>(15).fill(BigInt(0)).map(() => new Array<bigint>(64).fill(BigInt(0)));
    public static castlingRights = new Array<bigint>(16);
    public static enPassantFile = new Array<bigint>(9);
    public static sideToMove = BigInt(-1);
    public static Initialized = false;

    public static Initialize = () => {
        if (!Zobrist.Initialized) {
            Zobrist.Initialized = true;
            const seed = 29426028;
            const rng = new Random(seed);

            for (let squareIndex = 0; squareIndex < 64; squareIndex++) {
                PieceIndices.forEach((piece: number) => {
                    Zobrist.piecesArray[piece][squareIndex] = Zobrist.RandomUnsigned64BitNumber(rng);
                });
            }

            for (let i = 0; i < Zobrist.castlingRights.length; i++) {
                Zobrist.castlingRights[i] = Zobrist.RandomUnsigned64BitNumber(rng);
            }

            for (let i = 0; i < Zobrist.enPassantFile.length; i++) {
                Zobrist.enPassantFile[i] = i === 0 ? BigInt(0) : Zobrist.RandomUnsigned64BitNumber(rng);
            }

            this.sideToMove = Zobrist.RandomUnsigned64BitNumber(rng);
        }
    };

    static CalculateZobristKey = (board: Board) => {
        let zobristKey = BigInt(0);
        for (let squareIndex = 0; squareIndex < 64; squareIndex++) {
            const piece = board.Square[squareIndex];

            if (PieceFunc.PieceType(piece) !== PieceType.None) {
                zobristKey ^= this.piecesArray[piece][squareIndex];
            }
        }

        zobristKey ^= this.enPassantFile[board.CurrentGameState.enPassantFile];
        if (board.MoveColour() === PieceColor.Black) {
            zobristKey ^= this.sideToMove;
        }

        zobristKey ^= this.castlingRights[board.CurrentGameState.castlingRights];

        return zobristKey;
    };

    static RandomUnsigned64BitNumber = (rng: Random): bigint => {
        const buffer = new Uint8Array(8);
        for (let i = 0; i < 8; i++) {
            buffer[i] = Math.floor(rng.Next() * 256);
        }

        let result = BigInt(0);
        for (let i = 0; i < 8; i++) {
            result = BigInt(result) + BigInt(buffer[i]) * BigInt(Math.pow(256, i));
        }

        return result;
    };
}

export default Zobrist;
