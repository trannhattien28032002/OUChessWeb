import MoveGenerator from "src/interfaces/gamecore/move/MoveGenerator";
import TranspositionTable from "src/interfaces/gamecore/botChess/search/TranspositionTable";
import Board from "src/interfaces/gamecore/board/Board";
import PieceSquareTable from "src/interfaces/gamecore/botChess/evalution/PieceSquareTable";
import Move, { MoveFlag } from "src/interfaces/gamecore/board/Move";
import BitBoardUtility, { ContainsSquare } from "src/interfaces/gamecore/move/bitboard/BitBoardUtility";
import Evalution, { PieceValue } from "src/interfaces/gamecore/botChess/evalution/Evalution";
import * as PieceFunc from "src/share/gamecore/board/Piece";
import * as Piece from "src/interfaces/gamecore/board/Piece";

const maxMoveCount = 218;
const squareControlledByOpponentPawnPenalty = 350;
const capturedPieceValueMultiplier = 100;

export const maxKillerMovePly = 32;

const million = 1000000;
const hashMoveScore = 100 * million;
const winningCaptureBias = 8 * million;
const promoteBias = 6 * million;
const killerBias = 4 * million;
const losingCaptureBias = 2 * million;
const regularBias = 0;

class MoveOrdering {
    moveScores: number[];
    transpositionTable: TranspositionTable;
    invalidMove: Move;
    killerMoves: Killers[];
    History: number[][][];

    constructor(m: MoveGenerator, tt: TranspositionTable) {
        this.moveScores = new Array<number>(maxMoveCount);
        this.transpositionTable = tt;
        this.invalidMove = Move.NullMove();
        this.killerMoves = new Array<Killers>(maxKillerMovePly).fill(new Killers());
        this.History = Array.from({ length: 2 }, () => Array.from({ length: 64 }, () => new Array<number>(64).fill(0)));
    }

    ClearHistory = () => {
        this.History = Array.from({ length: 2 }, () => Array.from({ length: 64 }, () => new Array<number>(64).fill(0)));
    };

    ClearKillers = () => {
        this.killerMoves = new Array<Killers>(maxKillerMovePly);
    };

    Clear = () => {
        this.ClearHistory();
        this.ClearKillers();
    };

    OrderMoves = (
        hashMove: Move,
        board: Board,
        moves: Move[],
        oppAttacks: bigint,
        oppPawnAttacks: bigint,
        inQSearch: boolean,
        ply: number,
    ) => {
        // const oppPieces =
        //     board.EnemyDiagonalSliders |
        //     board.EnemyOrthogonalSliders |
        //     board.pieceBitBoards[PieceFunc.MakePiece(Piece.PieceType.Knight, board.OpponentColour())];
        // const pawnAttacks = board.IsWhiteToMove ? BitBoardUtility.WhitePawnAttacks : BitBoardUtility.BlackPawnAttacks;

        for (let i = 0; i < moves.length; i++) {
            const move = moves[i];

            if (Move.SameMove(move, hashMove)) {
                this.moveScores[i] = hashMoveScore;
                continue;
            }
            let score = 0;
            const startSquare = move.StartSquare();
            const targetSquare = move.TargetSquare();
            const movePiece = board.Square[startSquare];
            const movePieceType = PieceFunc.PieceType(movePiece);
            const capturePieceType = PieceFunc.PieceType(board.Square[targetSquare]);
            const isCapture = capturePieceType !== Piece.PieceType.None;
            const flag = moves[i].MoveFlag();
            const pieceValue = MoveOrdering.GetPieceValue(movePieceType);

            if (isCapture) {
                // Order moves to try capturing the most valuable opponent piece with least valuable of own pieces first
                const captureMaterialDelta = MoveOrdering.GetPieceValue(capturePieceType) - pieceValue;
                const opponentCanRecapture = ContainsSquare(oppPawnAttacks | oppAttacks, targetSquare);
                if (opponentCanRecapture) {
                    score +=
                        (captureMaterialDelta >= 0 ? winningCaptureBias : losingCaptureBias) + captureMaterialDelta;
                } else {
                    score += winningCaptureBias + captureMaterialDelta;
                }
            }

            if (movePieceType === Piece.PieceType.Pawn) {
                if (flag === MoveFlag.PromoteToQueenFlag && !isCapture) {
                    score += promoteBias;
                }
            } else if (movePieceType === Piece.PieceType.King || movePieceType === Piece.PieceType.None) {
                const empty = 1;
            } else {
                const toScore = PieceSquareTable.ReadTables(movePiece, targetSquare);
                const fromScore = PieceSquareTable.ReadTables(movePiece, startSquare);
                score += toScore - fromScore;

                if (ContainsSquare(oppPawnAttacks, targetSquare)) {
                    score -= 50;
                } else if (ContainsSquare(oppAttacks, targetSquare)) {
                    score -= 25;
                }
            }

            if (!isCapture) {
                //score += regularBias;
                const isKiller = !inQSearch && ply < maxKillerMovePly && this.killerMoves[ply].Match(move);
                score += isKiller ? killerBias : regularBias;
                score += this.History[board.MoveColourIndex()][move.StartSquare()][move.TargetSquare()];
            }

            this.moveScores[i] = score;
        }

        MoveOrdering.QuickSort(moves, this.moveScores, 0, moves.length - 1);
    };

    static GetPieceValue = (pieceType: number): number => {
        switch (pieceType) {
            case Piece.PieceType.Queen:
                return PieceValue.QueenValue;
            case Piece.PieceType.Rook:
                return PieceValue.RookValue;
            case Piece.PieceType.Knight:
                return PieceValue.KnightValue;
            case Piece.PieceType.Bishop:
                return PieceValue.BishopValue;
            case Piece.PieceType.Pawn:
                return PieceValue.PawnValue;
            default:
                return 0;
        }
    };

    GetScore = () => {};

    static Sort = (moves: Move[], scores: number[]) => {
        for (let i = 0; i < moves.length - 1; i++) {
            for (let j = i + 1; j > 0; j--) {
                const swapIndex = j - 1;
                if (scores[swapIndex] < scores[j]) {
                    const temp = moves[j];
                    moves[j] = moves[swapIndex];
                    moves[swapIndex] = temp;

                    const temp2 = scores[j];
                    scores[j] = scores[swapIndex];
                    scores[swapIndex] = temp2;
                }
            }
        }
    };

    static QuickSort = (values: Move[], scores: number[], low: number, high: number) => {
        if (low < high) {
            const pivotIndex = MoveOrdering.Partition(values, scores, low, high);
            MoveOrdering.QuickSort(values, scores, low, pivotIndex - 1);
            MoveOrdering.QuickSort(values, scores, pivotIndex + 1, high);
        }
    };

    static Partition = (values: Move[], scores: number[], low: number, high: number): number => {
        const pivotScore = scores[high];
        let i = low - 1;

        for (let j = low; j <= high - 1; j++) {
            if (scores[j] > pivotScore) {
                i++;
                const temp = values[i];
                values[i] = values[j];
                values[j] = temp;

                const temp2 = scores[i];
                scores[i] = scores[j];
                scores[j] = temp2;
            }
        }
        const temp = values[i + 1];
        values[i + 1] = values[high];
        values[high] = temp;

        const temp2 = scores[i + 1];
        scores[i + 1] = scores[high];
        scores[high] = temp2;

        return i + 1;
    };
}

export class Killers {
    moveA: Move = new Move(0);
    moveB: Move = new Move(0);

    Add = (move: Move) => {
        if (move.Value() !== this.moveA.Value()) {
            this.moveB = this.moveA;
            this.moveA = move;
        }
    };

    Match = (move: Move): boolean => {
        return move.Value() === this.moveA.Value() || move.Value() === this.moveB.Value();
    };
}

export default MoveOrdering;
