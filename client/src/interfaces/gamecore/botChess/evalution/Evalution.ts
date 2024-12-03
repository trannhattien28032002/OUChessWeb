import Board from "src/interfaces/gamecore/board/Board";
import Bits from "src/interfaces/gamecore/move/bitboard/Bit";
import PieceList from "src/interfaces/gamecore/board/PieceList";
import PieceSquareTable from "src/interfaces/gamecore/botChess/evalution/PieceSquareTable";
import PrecomputedMoveData from "src/interfaces/gamecore/move/PrecomputedMoveData";
import * as PieceFunc from "src/share/gamecore/board/Piece";
import * as Piece from "src/interfaces/gamecore/board/Piece";
import * as BoardHelper from "src/interfaces/gamecore/helper/BoardHelper";

export const PieceValue = {
    PawnValue: 100,
    KnightValue: 300,
    BishopValue: 320,
    RookValue: 500,
    QueenValue: 900,
};

export const passedPawnBonuses: number[] = [0, 120, 80, 50, 30, 15, 15];
export const isolatedPawnPenaltyByCount: number[] = [0, -10, -25, -50, -75, -75, -75, -75, -75];
export const kingPawnShieldScores: number[] = [4, 7, 4, 3, 6, 3];

Bits.initialized();
PieceSquareTable.Initialized();

class Evalution {
    endgameMaterialStart = PieceValue.RookValue * 2 + PieceValue.BishopValue + PieceValue.KnightValue;
    board: Board;
    whiteEval: EvalutionData;
    blackEval: EvalutionData;

    GetMaterialInfo = (colourIndex: number): MaterialInfo => {
        const numPawns = this.board.Pawns[colourIndex].Count();
        const numKnights = this.board.Knights[colourIndex].Count();
        const numBishops = this.board.Bishops[colourIndex].Count();
        const numRooks = this.board.Rooks[colourIndex].Count();
        const numQueens = this.board.Queens[colourIndex].Count();
        const isWhite = colourIndex === Board.WhiteIndex;
        const myPawns = this.board.pieceBitBoards[PieceFunc.MakePiece(Piece.PieceType.Pawn, isWhite)];
        const enemyPawns = this.board.pieceBitBoards[PieceFunc.MakePiece(Piece.PieceType.Pawn, !isWhite)];

        return new MaterialInfo(numPawns, numKnights, numBishops, numQueens, numRooks, myPawns, enemyPawns);
    };

    constructor() {
        this.board = new Board();
        this.whiteEval = new EvalutionData();
        this.blackEval = new EvalutionData();
    }

    Evalute = (board: Board): number => {
        this.board = board;
        this.whiteEval = new EvalutionData();
        this.blackEval = new EvalutionData();

        const whiteMaterial: MaterialInfo = this.GetMaterialInfo(Board.WhiteIndex);
        const blackMaterial: MaterialInfo = this.GetMaterialInfo(Board.BlackIndex);

        this.whiteEval.materialScore = whiteMaterial.materialScore;
        this.blackEval.materialScore = blackMaterial.materialScore;

        this.whiteEval.pieceSquareScore = this.EvaluatePieceSquareTables(true, blackMaterial.endgameT);
        this.blackEval.pieceSquareScore = this.EvaluatePieceSquareTables(false, whiteMaterial.endgameT);

        this.whiteEval.mopUpScore = this.MopUpEval(true, whiteMaterial, blackMaterial);
        this.blackEval.mopUpScore = this.MopUpEval(false, blackMaterial, whiteMaterial);

        this.whiteEval.pawnScore = this.EvaluatePawns(Board.WhiteIndex);
        this.blackEval.pawnScore = this.EvaluatePawns(Board.BlackIndex);

        this.whiteEval.pawnShieldScore = this.KingPawnShield(
            Board.WhiteIndex,
            blackMaterial,
            this.blackEval.pieceSquareScore,
        );
        this.blackEval.pawnShieldScore = this.KingPawnShield(
            Board.BlackIndex,
            whiteMaterial,
            this.whiteEval.pieceSquareScore,
        );

        const perspective = board.IsWhiteToMove ? 1 : -1;
        const _eval = this.whiteEval.sum() - this.blackEval.sum();
        return _eval * perspective;
    };

    KingPawnShield = (colourIndex: number, enemyMaterial: MaterialInfo, enemyPieceSquareScore: number): number => {
        if (enemyMaterial.endgameT >= 1) {
            return 0;
        }

        let penalty = 0;
        const isWhite = colourIndex === Board.WhiteIndex;
        const friendlyPawn = PieceFunc.MakePiece(Piece.PieceType.Pawn, isWhite);
        const kingSquare = this.board.KingSquare[colourIndex];
        const kingFile = BoardHelper.FileIndex(kingSquare);

        let uncastleKingPenalty = 0;

        if (kingFile <= 2 || kingFile >= 5) {
            const squares: number[] = isWhite ? [] : [];

            for (let i = 0; i < squares.length / 2; i++) {
                const shieldSquareIndex = squares[i];
                if (this.board.Square[shieldSquareIndex] !== friendlyPawn) {
                    if (squares.length > 3 && this.board.Square[squares[i + 3]] === friendlyPawn) {
                        penalty += kingPawnShieldScores[i + 3];
                    } else {
                        penalty += kingPawnShieldScores[i];
                    }
                }
            }
            penalty *= penalty;
        } else {
            const enemyDevelopmentScore = Math.min(Math.max((enemyPieceSquareScore + 10) / 130, 0), 1);
            uncastleKingPenalty = 50 * enemyDevelopmentScore;
        }

        let openFileAgainstKingPenalty = 0;

        if (enemyMaterial.numRooks > 1 || (enemyMaterial.numRooks > 0 && enemyMaterial.numQueens > 0)) {
            const clampedKingFile = Math.min(Math.max(kingFile, 1), 6);
            const myPawns = BigInt(enemyMaterial.enemyPawns);
            for (let attackFile = clampedKingFile; attackFile <= clampedKingFile + 1; attackFile++) {
                const fileMask = Bits.FileMask[attackFile];
                const isKingFile = attackFile === kingFile;
                if ((enemyMaterial.pawns & fileMask) === BigInt(0)) {
                    openFileAgainstKingPenalty += isKingFile ? 25 : 15;
                    if ((myPawns & fileMask) === BigInt(0)) {
                        openFileAgainstKingPenalty += isKingFile ? 15 : 10;
                    }
                }
            }
        }

        let pawnShieldWeight = 1 - enemyMaterial.endgameT;
        if (this.board.Queens[1 - colourIndex].Count() === 0) {
            pawnShieldWeight *= 0.6;
        }

        return (-penalty - uncastleKingPenalty - openFileAgainstKingPenalty) * pawnShieldWeight;
    };

    EvaluatePawns = (colourIndex: number): number => {
        const pawns = this.board.Pawns[colourIndex];
        const isWhite = colourIndex === Board.WhiteIndex;
        const opponentPawns =
            this.board.pieceBitBoards[
                PieceFunc.MakePiece(Piece.PieceType.Pawn, isWhite ? Piece.PieceColor.Black : Piece.PieceColor.White)
            ];
        const friendlyPawns =
            this.board.pieceBitBoards[
                PieceFunc.MakePiece(Piece.PieceType.Pawn, isWhite ? Piece.PieceColor.White : Piece.PieceColor.Black)
            ];
        const masks = isWhite ? Bits.WhitePassedPawnMask : Bits.BlackPassedPawnMask;
        let bonus = 0;
        let numIsolateaPawns = 0;

        for (let i = 0; i < pawns.Count(); i++) {
            const square = pawns.Get(i);
            const passedMask = BigInt(masks[square]);

            if ((opponentPawns & passedMask) === BigInt(0)) {
                const rank = BoardHelper.RankIndex(square);
                const numSquareFromPromotion = isWhite ? 7 - rank : rank;
                bonus += passedPawnBonuses[numSquareFromPromotion];
            }

            if ((friendlyPawns & Bits.AdjacentFileMasks[BoardHelper.FileIndex(square)]) === BigInt(0)) {
                numIsolateaPawns++;
            }
        }

        return bonus + isolatedPawnPenaltyByCount[numIsolateaPawns];
    };

    EndgamePhaseWeight = (materialCountWithoutPawns: number): number => {
        const mutltiplier = 1 / this.endgameMaterialStart;
        return 1 - Math.min(1, materialCountWithoutPawns * mutltiplier);
    };

    MopUpEval = (isWhite: boolean, myMaterail: MaterialInfo, enemyMaterial: MaterialInfo): number => {
        if (
            myMaterail.materialScore > enemyMaterial.materialScore + PieceValue.PawnValue * 2 &&
            enemyMaterial.endgameT > 0
        ) {
            let mopUpScore = 0;
            const friendlyIndex = isWhite ? Board.WhiteIndex : Board.BlackIndex;
            const opponentIndex = isWhite ? Board.BlackIndex : Board.WhiteIndex;

            const friendlyKingSquare = this.board.KingSquare[friendlyIndex];
            const opponentKingSquare = this.board.KingSquare[opponentIndex];
            mopUpScore += 14 - PrecomputedMoveData.OrthogonalDistance[friendlyKingSquare][opponentKingSquare];
            mopUpScore += PrecomputedMoveData.CentreManhattanDistance[opponentKingSquare] * 10;

            return mopUpScore * enemyMaterial.endgameT;
        }
        return 0;
    };

    CountMaterial = (colourIndex: number): number => {
        let material = 0;
        material += this.board.Pawns[colourIndex].Count() + PieceValue.PawnValue;
        material += this.board.Knights[colourIndex].Count() + PieceValue.KnightValue;
        material += this.board.Bishops[colourIndex].Count() + PieceValue.BishopValue;
        material += this.board.Rooks[colourIndex].Count() + PieceValue.RookValue;
        material += this.board.Queens[colourIndex].Count() + PieceValue.QueenValue;

        return material;
    };

    EvaluatePieceSquareTables = (isWhite: boolean, endgameT: number) => {
        let value = 0;
        const colourIndex = isWhite ? Board.WhiteIndex : Board.BlackIndex;

        value += this.EvaluatePieceSquareTable(PieceSquareTable.Rooks, this.board.Rooks[colourIndex], isWhite);
        value += this.EvaluatePieceSquareTable(PieceSquareTable.Knights, this.board.Knights[colourIndex], isWhite);
        value += this.EvaluatePieceSquareTable(PieceSquareTable.Bishops, this.board.Bishops[colourIndex], isWhite);
        value += this.EvaluatePieceSquareTable(PieceSquareTable.Queens, this.board.Queens[colourIndex], isWhite);

        const pawnEarly = this.EvaluatePieceSquareTable(PieceSquareTable.Pawns, this.board.Pawns[colourIndex], isWhite);
        const pawnLate = this.EvaluatePieceSquareTable(
            PieceSquareTable.PawnsEnd,
            this.board.Pawns[colourIndex],
            isWhite,
        );

        value += pawnEarly * (1 - endgameT);
        value += pawnLate * endgameT;

        const kingEarlyPhase = PieceSquareTable.Read(
            PieceSquareTable.KingStart,
            this.board.KingSquare[colourIndex],
            isWhite,
        );
        value += kingEarlyPhase * (1 - endgameT);
        const kingLatePhase = PieceSquareTable.Read(
            PieceSquareTable.KingEnd,
            this.board.KingSquare[colourIndex],
            isWhite,
        );
        value += kingLatePhase * endgameT;

        return value;
    };

    EvaluatePieceSquareTable = (table: number[], pieceList: PieceList, isWhite: boolean): number => {
        let value = 0;
        for (let i = 0; i < pieceList.Count(); i++) {
            value += PieceSquareTable.Read(table, pieceList.Get(i), isWhite);
        }
        return value;
    };
}

class MaterialInfo {
    materialScore: number;
    numPawns: number;
    numMajors: number;
    numMinor: number;
    numBishops: number;
    numQueens: number;
    numRooks: number;

    pawns: bigint;
    enemyPawns: bigint;

    endgameT: number;

    constructor(
        numPawns: number,
        numBishops: number,
        numKnights: number,
        numQueens: number,
        numRooks: number,
        pawns: bigint,
        enemyPawns: bigint,
    ) {
        this.numPawns = numPawns;
        this.numBishops = numBishops;
        this.numQueens = numQueens;
        this.numRooks = numRooks;
        this.pawns = pawns;
        this.enemyPawns = enemyPawns;

        this.numMajors = numRooks + numQueens;
        this.numMinor = numBishops + numKnights;

        this.materialScore = 0;
        this.materialScore += numPawns + PieceValue.PawnValue;
        this.materialScore += numKnights + PieceValue.KnightValue;
        this.materialScore += numBishops + PieceValue.BishopValue;
        this.materialScore += numRooks + PieceValue.RookValue;
        this.materialScore += numQueens + PieceValue.QueenValue;

        const queenEndgameWeight = 45;
        const rookEndgameWeight = 20;
        const bishopEndgameWeight = 10;
        const knightEndgameWeight = 10;

        const endgameStartWeight =
            2 * rookEndgameWeight + 2 * bishopEndgameWeight + 2 * knightEndgameWeight + queenEndgameWeight;
        const endgameWeightSum =
            numQueens * queenEndgameWeight +
            numRooks * rookEndgameWeight +
            numBishops * bishopEndgameWeight +
            numKnights * knightEndgameWeight;
        this.endgameT = 1 - Math.min(1, endgameWeightSum / endgameStartWeight);
    }
}

class EvalutionData {
    public materialScore: number;
    public mopUpScore: number;
    public pieceSquareScore: number;
    public pawnScore: number;
    public pawnShieldScore: number;

    constructor() {
        this.materialScore = 0;
        this.mopUpScore = 0;
        this.pieceSquareScore = 0;
        this.pawnScore = 0;
        this.pawnShieldScore = 0;
    }

    sum = () => {
        return this.materialScore + this.mopUpScore + this.pieceSquareScore + this.pawnScore + this.pawnShieldScore;
    };
}

export default Evalution;
