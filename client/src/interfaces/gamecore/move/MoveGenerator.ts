import Board from "src/interfaces/gamecore/board/Board";
import Magic from "src/interfaces/gamecore/move/magic/Magic";
import PrecomputedMoveData from "src/interfaces/gamecore/move/PrecomputedMoveData";
import Move, { MoveFlag } from "src/interfaces/gamecore/board/Move";
import BitBoardUtility, {
    ContainsSquare,
    PawnAttacks,
    PopLSB,
    Rank1,
    Rank4,
    Rank5,
    Rank8,
    Shift,
    notAFile,
    notHFile,
} from "src/interfaces/gamecore/move/bitboard/BitBoardUtility";
import Bit, {
    BlackKingsideMask,
    BlackKingsideMask2,
    BlackQueensideMask,
    WhiteKingsideMask,
    WhiteKingsideMask2,
    WhiteQueensideMask,
} from "src/interfaces/gamecore/move/bitboard/Bit";
import { PieceColor, PieceType } from "src/interfaces/gamecore/board/Piece";
import * as BoardHelper from "src/interfaces/gamecore/helper/BoardHelper";
import * as PieceFunc from "src/share/gamecore/board/Piece";
export const PromotionMode = {
    All: "All",
    QueenOnly: "QueenOnly",
    QueenAndKnight: "QueenAndKnight",
};

PrecomputedMoveData.initialized();
Bit.initialized();
Magic.initialize();

class MoveGenerator {
    MaxMoves = 218;

    promotionsToGenerate = PromotionMode.All;

    isWhiteToMove: boolean;
    friendlyColour: number;
    opponentColour: number;
    friendlyKingSquare: number;
    friendlyIndex: number;
    enemyIndex: number;

    inCheck: boolean;
    inDoubleCheck: boolean;

    checkRayBitmask: bigint;

    pinRays: bigint;
    notPinRays: bigint;
    opponentAttackMapNoPawns: bigint;
    opponentAttackMap: bigint;
    opponentPawnAttackMap: bigint;
    opponentSlidingAttackMap: bigint;

    generateQuietMoves: boolean;
    board: Board;
    currMoveIndex: number;

    enemyPieces: bigint;
    friendlyPieces: bigint;
    allPieces: bigint;
    emptySquares: bigint;
    emptyOrEnemySquares: bigint;

    moveTypeMask: bigint;

    constructor() {
        this.board = new Board();
        this.generateQuietMoves = true;

        this.currMoveIndex = 0;
        this.inCheck = false;
        this.inDoubleCheck = false;
        this.checkRayBitmask = BigInt(0);
        this.pinRays = BigInt(0);
        this.notPinRays = BigInt(0);
        this.opponentAttackMapNoPawns = BigInt(0);
        this.opponentAttackMap = BigInt(0);
        this.opponentPawnAttackMap = BigInt(0);
        this.opponentSlidingAttackMap = BigInt(0);

        this.isWhiteToMove = this.board.MoveColour() === PieceColor.White;
        this.friendlyColour = this.board.MoveColour();
        this.opponentColour = this.board.OpponentColour();
        this.friendlyKingSquare = this.board.KingSquare[this.board.MoveColourIndex()];
        this.friendlyIndex = this.board.MoveColourIndex();
        this.enemyIndex = 1 - this.friendlyIndex;

        this.enemyPieces = this.board.colourBitBoards[this.enemyIndex];
        this.friendlyPieces = this.board.colourBitBoards[this.friendlyIndex];
        this.allPieces = this.board.allPiecesBitboard;
        this.emptySquares = ~this.allPieces;
        this.emptyOrEnemySquares = this.emptySquares | this.enemyPieces;
        this.moveTypeMask = this.generateQuietMoves ? BigInt("18446744073709551615") : this.enemyPieces;
    }

    public GenerateMoves = (board: Board, capturesOnly = false): Move[] => {
        const moves = Array<Move>(this.MaxMoves);
        this.board = board;
        this.generateQuietMoves = !capturesOnly;

        this.Init();

        this.GenerateKingMoves(moves);

        if (!this.inDoubleCheck) {
            this.GenerateSlidingMoves(moves);
            this.GenerateKnightMoves(moves);
            this.GeneratePawnMoves(moves);
        }
        return moves.slice(0, this.currMoveIndex);
    };

    Init = (): void => {
        this.currMoveIndex = 0;
        this.inCheck = false;
        this.inDoubleCheck = false;
        this.checkRayBitmask = BigInt(0);
        this.pinRays = BigInt(0);

        this.isWhiteToMove = this.board.MoveColour() === PieceColor.White;
        this.friendlyColour = this.board.MoveColour();
        this.opponentColour = this.board.OpponentColour();
        this.friendlyKingSquare = this.board.KingSquare[this.board.MoveColourIndex()];
        this.friendlyIndex = this.board.MoveColourIndex();
        this.enemyIndex = 1 - this.friendlyIndex;

        this.enemyPieces = this.board.colourBitBoards[this.enemyIndex];
        this.friendlyPieces = this.board.colourBitBoards[this.friendlyIndex];
        this.allPieces = this.board.allPiecesBitboard;
        this.emptySquares = ~this.allPieces;
        this.emptyOrEnemySquares = this.emptySquares | this.enemyPieces;
        this.moveTypeMask = this.generateQuietMoves ? BigInt("18446744073709551615") : this.enemyPieces;
        this.CalculateAttackData();
    };

    InCheck = (): boolean => {
        return this.inCheck;
    };

    GenerateKingMoves = (moves: Move[]) => {
        const legalMask = ~(this.opponentAttackMap | this.friendlyPieces);
        let kingMoves = BitBoardUtility.KingMoves[this.friendlyKingSquare] & legalMask & this.moveTypeMask;
        while (kingMoves !== BigInt(0)) {
            const popResult = PopLSB(kingMoves);
            const targetSquare = popResult.i;
            kingMoves = popResult.b;

            // if(PieceFunc.PieceType(this.board.Square[this.friendlyKingSquare]) === PieceType.None){
            //     continue;
            // }

            moves[this.currMoveIndex++] = new Move(this.friendlyKingSquare, targetSquare);
        }

        if (!this.inCheck && this.generateQuietMoves) {
            const castleBlockers = this.opponentAttackMap | this.board.allPiecesBitboard;
            if (this.board.CurrentGameState.HasKingsideCastleRight(this.board.IsWhiteToMove)) {
                const castleMask = this.board.IsWhiteToMove ? WhiteKingsideMask : BlackKingsideMask;
                if ((castleMask & castleBlockers) === BigInt(0)) {
                    const targetSquare = this.board.IsWhiteToMove
                        ? BoardHelper.SquareNames.g1
                        : BoardHelper.SquareNames.g8;
                    moves[this.currMoveIndex++] = new Move(this.friendlyKingSquare, targetSquare, MoveFlag.CastleFlag);
                }
            }
            if (this.board.CurrentGameState.HasQueensideCastleRight(this.board.IsWhiteToMove)) {
                const castleMask = this.board.IsWhiteToMove ? WhiteKingsideMask2 : BlackKingsideMask2;
                const castleBlockMask = this.board.IsWhiteToMove ? WhiteQueensideMask : BlackQueensideMask;
                if (
                    (castleMask & castleBlockers) === BigInt(0) &&
                    (castleBlockMask & this.board.allPiecesBitboard) === BigInt(0)
                ) {
                    const targetSquare = this.board.IsWhiteToMove
                        ? BoardHelper.SquareNames.c1
                        : BoardHelper.SquareNames.c8;
                    moves[this.currMoveIndex++] = new Move(this.friendlyKingSquare, targetSquare, MoveFlag.CastleFlag);
                }
            }
        }
    };

    GenerateSlidingMoves = (moves: Move[]) => {
        // Limit movement to empty or enemy squares, and must block check if king is in check.
        const moveMask = this.emptyOrEnemySquares & this.checkRayBitmask & this.moveTypeMask;

        let othogonalSliders = this.board.FriendlyOrthogonalSliders;
        let diagonalSliders = this.board.FriendlyDiagonalSliders;

        // Pinned pieces cannot move if king is in check
        if (this.inCheck) {
            othogonalSliders &= ~BigInt(this.pinRays);
            diagonalSliders &= ~BigInt(this.pinRays);
        }

        // Ortho
        while (othogonalSliders !== BigInt(0)) {
            const popResult = PopLSB(othogonalSliders);
            const startSquare = popResult.i;
            othogonalSliders = popResult.b;
            let moveSquares = Magic.GetRookAttacks(startSquare, this.allPieces) & moveMask;

            // If piece is pinned, it can only move along the pin ray
            if (this.IsPinned(startSquare)) {
                moveSquares =
                    BigInt(moveSquares) & BigInt(PrecomputedMoveData.alignMask[startSquare][this.friendlyKingSquare]);
            }
            while (moveSquares !== BigInt(0)) {
                const pop = PopLSB(moveSquares);
                const targetSquare = pop.i;
                moveSquares = pop.b;
                moves[this.currMoveIndex++] = new Move(startSquare, targetSquare);
            }
        }

        // Diag
        while (diagonalSliders !== BigInt(0)) {
            const pop = PopLSB(diagonalSliders);
            const startSquare = pop.i;
            diagonalSliders = pop.b;
            let moveSquares = Magic.GetBishopAttacks(startSquare, this.allPieces) & moveMask;

            // If piece is pinned, it can only move along the pin ray
            if (this.IsPinned(startSquare)) {
                moveSquares &= PrecomputedMoveData.alignMask[startSquare][this.friendlyKingSquare];
            }

            while (moveSquares !== BigInt(0)) {
                const pop = PopLSB(moveSquares);
                const targetSquare = pop.i;
                moveSquares = pop.b;
                moves[this.currMoveIndex++] = new Move(startSquare, targetSquare);
            }
        }
    };

    GenerateKnightMoves = (moves: Move[]) => {
        const friendlyKnightPiece = PieceFunc.MakePiece(PieceType.Knight, this.board.MoveColour());
        // bitboard of all non-pinned knights
        let knights = this.board.pieceBitBoards[friendlyKnightPiece] & this.notPinRays;
        const moveMask = this.emptyOrEnemySquares & this.checkRayBitmask & this.moveTypeMask;

        while (knights !== BigInt(0)) {
            const pop = PopLSB(knights);
            const knightSquare = pop.i;
            knights = pop.b;
            let moveSquares = BitBoardUtility.KnightAttacks[knightSquare] & moveMask;
            while (moveSquares !== BigInt(0)) {
                const pop = PopLSB(moveSquares);
                const targetSquare = pop.i;
                moveSquares = pop.b;
                moves[this.currMoveIndex++] = new Move(knightSquare, targetSquare);
            }
        }
    };

    GeneratePawnMoves = (moves: Move[]) => {
        const pushDir = this.board.IsWhiteToMove ? 1 : -1;
        const pushOffset = pushDir * 8;

        const friendlyPawnPiece = PieceFunc.MakePiece(PieceType.Pawn, this.board.MoveColour());
        const pawns = this.board.pieceBitBoards[friendlyPawnPiece];

        const promotionRankMask = this.board.IsWhiteToMove ? Rank8 : Rank1;

        const singlePush = Shift(pawns, pushOffset) & this.emptySquares;

        let pushPromotions = singlePush & promotionRankMask & this.checkRayBitmask;

        const captureEdgeFileMask = this.board.IsWhiteToMove ? notAFile : notHFile;
        const captureEdgeFileMask2 = this.board.IsWhiteToMove ? notHFile : notAFile;
        let captureA = Shift(pawns & captureEdgeFileMask, pushDir * 7) & this.enemyPieces;
        let captureB = Shift(pawns & captureEdgeFileMask2, pushDir * 9) & this.enemyPieces;

        let singlePushNoPromotions = singlePush & ~promotionRankMask & this.checkRayBitmask;

        let capturePromotionsA = captureA & promotionRankMask & this.checkRayBitmask;
        let capturePromotionsB = captureB & promotionRankMask & this.checkRayBitmask;

        captureA &= this.checkRayBitmask & ~promotionRankMask;
        captureB &= this.checkRayBitmask & ~promotionRankMask;

        // Single / double push
        if (this.generateQuietMoves) {
            // Generate single pawn pushes
            while (singlePushNoPromotions !== BigInt(0)) {
                const pop = PopLSB(singlePushNoPromotions);
                const targetSquare = pop.i;
                singlePushNoPromotions = pop.b;
                const startSquare = targetSquare - pushOffset;
                if (
                    !this.IsPinned(startSquare) ||
                    PrecomputedMoveData.alignMask[startSquare][this.friendlyKingSquare] ===
                        PrecomputedMoveData.alignMask[targetSquare][this.friendlyKingSquare]
                ) {
                    moves[this.currMoveIndex++] = new Move(startSquare, targetSquare);
                }
            }

            // Generate double pawn pushes
            const doublePushTargetRankMask = this.board.IsWhiteToMove ? Rank4 : Rank5;
            let doublePush =
                Shift(singlePush, pushOffset) & this.emptySquares & doublePushTargetRankMask & this.checkRayBitmask;

            while (doublePush !== BigInt(0)) {
                const pop = PopLSB(doublePush);
                const targetSquare = pop.i;
                doublePush = pop.b;
                const startSquare = targetSquare - pushOffset * 2;
                if (
                    !this.IsPinned(startSquare) ||
                    PrecomputedMoveData.alignMask[startSquare][this.friendlyKingSquare] ===
                        PrecomputedMoveData.alignMask[targetSquare][this.friendlyKingSquare]
                ) {
                    moves[this.currMoveIndex++] = new Move(startSquare, targetSquare, MoveFlag.PawnTwoUpFlag);
                }
            }
        }

        // Captures
        while (captureA !== BigInt(0)) {
            const pop = PopLSB(captureA);
            const targetSquare = pop.i;
            captureA = pop.b;
            const startSquare = targetSquare - pushDir * 7;

            if (
                !this.IsPinned(startSquare) ||
                PrecomputedMoveData.alignMask[startSquare][this.friendlyKingSquare] ===
                    PrecomputedMoveData.alignMask[targetSquare][this.friendlyKingSquare]
            ) {
                moves[this.currMoveIndex++] = new Move(startSquare, targetSquare);
            }
        }

        while (captureB !== BigInt(0)) {
            const pop = PopLSB(captureB);
            const targetSquare = pop.i;
            captureB = pop.b;
            const startSquare = targetSquare - pushDir * 9;

            if (
                !this.IsPinned(startSquare) ||
                PrecomputedMoveData.alignMask[startSquare][this.friendlyKingSquare] ===
                    PrecomputedMoveData.alignMask[targetSquare][this.friendlyKingSquare]
            ) {
                moves[this.currMoveIndex++] = new Move(startSquare, targetSquare);
            }
        }

        // Promotions
        while (pushPromotions !== BigInt(0)) {
            const pop = PopLSB(pushPromotions);
            const targetSquare = pop.i;
            pushPromotions = pop.b;
            const startSquare = targetSquare - pushOffset;
            if (!this.IsPinned(startSquare)) {
                this.GeneratePromotions(startSquare, targetSquare, moves);
            }
        }

        while (capturePromotionsA !== BigInt(0)) {
            const pop = PopLSB(capturePromotionsA);
            const targetSquare = pop.i;
            capturePromotionsA = pop.b;
            const startSquare = targetSquare - pushDir * 7;

            if (
                !this.IsPinned(startSquare) ||
                PrecomputedMoveData.alignMask[startSquare][this.friendlyKingSquare] ===
                    PrecomputedMoveData.alignMask[targetSquare][this.friendlyKingSquare]
            ) {
                this.GeneratePromotions(startSquare, targetSquare, moves);
            }
        }

        while (capturePromotionsB !== BigInt(0)) {
            const pop = PopLSB(capturePromotionsB);
            const targetSquare = pop.i;
            capturePromotionsB = pop.b;
            const startSquare = targetSquare - pushDir * 9;

            if (
                !this.IsPinned(startSquare) ||
                PrecomputedMoveData.alignMask[startSquare][this.friendlyKingSquare] ===
                    PrecomputedMoveData.alignMask[targetSquare][this.friendlyKingSquare]
            ) {
                this.GeneratePromotions(startSquare, targetSquare, moves);
            }
        }

        // En passant
        if (this.board.CurrentGameState.enPassantFile > 0) {
            const epFileIndex = this.board.CurrentGameState.enPassantFile - 1;
            const epRankIndex = this.board.IsWhiteToMove ? 5 : 2;
            const targetSquare = epRankIndex * 8 + epFileIndex;
            const capturedPawnSquare = targetSquare - pushOffset;

            if (ContainsSquare(this.checkRayBitmask, capturedPawnSquare)) {
                let pawnsThatCanCaptureEp =
                    pawns & PawnAttacks(BigInt(1) << BigInt(targetSquare), !this.board.IsWhiteToMove);

                while (pawnsThatCanCaptureEp !== BigInt(0)) {
                    const pop = PopLSB(pawnsThatCanCaptureEp);
                    const startSquare = pop.i;
                    pawnsThatCanCaptureEp = pop.b;
                    if (
                        !this.IsPinned(startSquare) ||
                        PrecomputedMoveData.alignMask[startSquare][this.friendlyKingSquare] ===
                            PrecomputedMoveData.alignMask[targetSquare][this.friendlyKingSquare]
                    ) {
                        if (!this.InCheckAfterEnPassant(startSquare, targetSquare, capturedPawnSquare)) {
                            moves[this.currMoveIndex++] = new Move(
                                startSquare,
                                targetSquare,
                                MoveFlag.EnPassantCaptureFlag,
                            );
                        }
                    }
                }
            }
        }
    };

    GeneratePromotions = (startSquare: number, targetSquare: number, moves: Move[]) => {
        moves[this.currMoveIndex++] = new Move(startSquare, targetSquare, MoveFlag.PromoteToQueenFlag);
        // Don't generate non-queen promotions in q-search
        if (this.generateQuietMoves) {
            if (this.promotionsToGenerate === PromotionMode.All) {
                moves[this.currMoveIndex++] = new Move(startSquare, targetSquare, MoveFlag.PromoteToKnightFlag);
                moves[this.currMoveIndex++] = new Move(startSquare, targetSquare, MoveFlag.PromoteToRookFlag);
                moves[this.currMoveIndex++] = new Move(startSquare, targetSquare, MoveFlag.PromoteToBishopFlag);
            } else if (this.promotionsToGenerate === PromotionMode.QueenAndKnight) {
                moves[this.currMoveIndex++] = new Move(startSquare, targetSquare, MoveFlag.PromoteToKnightFlag);
            }
        }
    };

    IsPinned = (square: number) => {
        return ((this.pinRays >> BigInt(square)) & BigInt(1)) !== BigInt(0);
    };

    GenSlidingAttackMap = () => {
        this.opponentSlidingAttackMap = BigInt(0);
        const UpdateSlideAttack = (pieceBoard: bigint, ortho: boolean) => {
            const blockers = this.board.allPiecesBitboard & ~(BigInt(1) << BigInt(this.friendlyKingSquare));

            while (pieceBoard !== BigInt(0)) {
                const pop = PopLSB(pieceBoard);
                const startSquare = pop.i;
                pieceBoard = pop.b;
                const moveBoard = Magic.GetSliderAttacks(startSquare, blockers, ortho);

                this.opponentSlidingAttackMap |= moveBoard;
            }
        };

        UpdateSlideAttack(this.board.EnemyOrthogonalSliders, true);
        UpdateSlideAttack(this.board.EnemyDiagonalSliders, false);
    };

    CalculateAttackData = () => {
        this.GenSlidingAttackMap();
        // Search squares in all directions around friendly king for checks/pins by enemy sliding pieces (queen, rook, bishop)
        let startDirIndex = 0;
        let endDirIndex = 8;

        if (this.board.Queens[this.enemyIndex].Count() === 0) {
            startDirIndex = this.board.Rooks[this.enemyIndex].Count() > 0 ? 0 : 4;
            endDirIndex = this.board.Bishops[this.enemyIndex].Count() > 0 ? 8 : 4;
        }

        for (let dir = startDirIndex; dir < endDirIndex; dir++) {
            const isDiagonal = dir > 3;
            const slider = isDiagonal ? this.board.EnemyDiagonalSliders : this.board.EnemyOrthogonalSliders;
            if ((PrecomputedMoveData.dirRayMask[dir][this.friendlyKingSquare] & slider) === BigInt(0)) {
                continue;
            }

            const n = PrecomputedMoveData.numSquaresToEdge[this.friendlyKingSquare][dir];
            const directionOffset = PrecomputedMoveData.directionOffsets[dir];
            let isFriendlyPieceAlongRay = false;
            let rayMask = BigInt(0);

            for (let i = 0; i < n; i++) {
                const squareIndex = this.friendlyKingSquare + directionOffset * (i + 1);
                rayMask |= BigInt(1) << BigInt(squareIndex);
                const piece = this.board.Square[squareIndex];
       
                if (piece !== PieceType.None) {
                    if (PieceFunc.IsColour(piece, this.friendlyColour)) {
                        if (!isFriendlyPieceAlongRay) {
                            isFriendlyPieceAlongRay = true;
                        } else {
                            break;
                        }
                    } else {
                        const pieceType = PieceFunc.PieceType(piece);
                        if (
                            isDiagonal && PieceFunc.IsDiagonalSlider(pieceType) ||
                            !isDiagonal && PieceFunc.IsOrthogonalSlider(pieceType)
                        ) {
                            if (isFriendlyPieceAlongRay) {
                                this.pinRays |= rayMask;
                            } else {
                                this.checkRayBitmask |= rayMask;
                                this.inDoubleCheck = this.inCheck;
                                this.inCheck = true;
                            }
                            break;
                        } else {
                            break;
                        }
                    }
                }
            }
            if (this.inDoubleCheck) {
                break;
            }
        }
        this.notPinRays = ~this.pinRays;

        let opponentKnightAttacks = BigInt(0);
        let knights = this.board.pieceBitBoards[PieceFunc.MakePiece(PieceType.Knight, this.board.OpponentColour())];
        const friendlyKingBoard =
            this.board.pieceBitBoards[PieceFunc.MakePiece(PieceType.King, this.board.MoveColour())];
        while (knights !== BigInt(0)) {
            const pop = PopLSB(knights);
            const knightSquare = pop.i;
            knights = pop.b;
            const knightAttacks = BitBoardUtility.KnightAttacks[knightSquare];
            opponentKnightAttacks |= knightAttacks;

            if ((knightAttacks & friendlyKingBoard) !== BigInt(0)) {
                this.inDoubleCheck = this.inCheck;
                this.inCheck = true;
                this.checkRayBitmask |= BigInt(1) << BigInt(knightSquare);
            }
        }

        // Pawn attacks

        this.opponentPawnAttackMap = BigInt(0);
        const opponentPawnsBoard =
            this.board.pieceBitBoards[PieceFunc.MakePiece(PieceType.Pawn, this.board.OpponentColour())];
        this.opponentPawnAttackMap = PawnAttacks(opponentPawnsBoard, !this.isWhiteToMove);
        if (ContainsSquare(this.opponentPawnAttackMap, this.friendlyKingSquare)) {
            this.inDoubleCheck = this.inCheck; 
            this.inCheck = true;
            const possiblePawnAttackOrigins = this.board.IsWhiteToMove
                ? BitBoardUtility.WhitePawnAttacks[this.friendlyKingSquare]
                : BitBoardUtility.BlackPawnAttacks[this.friendlyKingSquare];
            const pawnCheckMap = opponentPawnsBoard & possiblePawnAttackOrigins;
            this.checkRayBitmask |= pawnCheckMap;
        }

        const enemyKingSquare = this.board.KingSquare[this.enemyIndex];
        this.opponentAttackMapNoPawns =
            this.opponentSlidingAttackMap | opponentKnightAttacks | BitBoardUtility.KingMoves[enemyKingSquare];
        this.opponentAttackMap = this.opponentAttackMapNoPawns | this.opponentPawnAttackMap;

        if (!this.inCheck) {
            this.checkRayBitmask = BigInt("18446744073709551615");
        }
    };

    InCheckAfterEnPassant = (startSquare: number, targetSquare: number, epCaptureSquare: number) => {
        const enemyOrtho = this.board.EnemyOrthogonalSliders;

        if (enemyOrtho !== BigInt(0)) {
            const maskedBlockers =
                this.allPieces ^
                ((BigInt(1) << BigInt(epCaptureSquare)) |
                    (BigInt(1) << BigInt(startSquare)) |
                    (BigInt(1) << BigInt(targetSquare)));
            const rookAttacks = Magic.GetRookAttacks(this.friendlyKingSquare, maskedBlockers);
            return (rookAttacks & enemyOrtho) !== BigInt(0);
        }

        return false;
    };
}

export default MoveGenerator;
