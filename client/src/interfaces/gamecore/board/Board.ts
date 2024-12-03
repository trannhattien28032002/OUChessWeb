import PieceList from "src/interfaces/gamecore/board/PieceList";
import Magic from "src/interfaces/gamecore/move/magic/Magic";
import Zobrist from "src/interfaces/gamecore/board/Zobrist";
import GameState, { GameStateSideMask } from "src/interfaces/gamecore/board/GameState";
import BitBoardUtility, { SetSquare, ToggleSquare, ToggleSquares } from "../move/bitboard/BitBoardUtility";
import Move, { MoveFlag } from "src/interfaces/gamecore/board/Move";
import { BlackPiece, PieceColor, PieceType, WhitePiece } from "src/interfaces/gamecore/board/Piece";
import * as PieceFunc from "src/share/gamecore/board/Piece";
import * as Piece from "src/interfaces/gamecore/board/Piece";
import * as BoardHelper from "src/interfaces/gamecore/helper/BoardHelper";
import * as FenUtility from "src/interfaces/gamecore/helper/FenUtility";

BitBoardUtility.initalized();
Zobrist.Initialize();

class Board {
    static WhiteIndex = 0;
    static BlackIndex = 1;

    IsWhiteToMove = true;
    MoveColour = () => {
        return this.IsWhiteToMove ? PieceColor.White : PieceColor.Black;
    };

    OpponentColour = () => {
        return this.IsWhiteToMove ? PieceColor.Black : PieceColor.White;
    };

    MoveColourIndex = () => {
        return this.IsWhiteToMove ? Board.WhiteIndex : Board.BlackIndex;
    };

    OpponentColourIndex = () => {
        return this.IsWhiteToMove ? Board.BlackIndex : Board.WhiteIndex;
    };

    FiftyMoveCounter = (): number => {
        return this.CurrentGameState.fiftyMoveCounter;
    };

    ZobristKey = (): bigint => {
        return this.CurrentGameState.zobristKey;
    };

    Square: number[];
    KingSquare: number[];

    Rooks: PieceList[];
    Bishops: PieceList[];
    Queens: PieceList[];
    Knights: PieceList[];
    Pawns: PieceList[];

    TotalPieceCountWithoutPawnsAndKings: number;

    RepetitionPositionHistory = [] as bigint[];

    PlyCount: number;
    CurrentGameState: GameState;
    gameStateHistory: GameState[];
    StartPositionInfo: FenUtility.PositionInfo;
    AllGameMoves: Move[];

    cachedInCheckValue = false;
    hasCachedInCheckValue = false;

    allPieceLists: PieceList[];

    pieceBitBoards: bigint[];
    colourBitBoards: bigint[];
    allPiecesBitboard: bigint;
    FriendlyOrthogonalSliders: bigint;
    FriendlyDiagonalSliders: bigint;
    EnemyOrthogonalSliders: bigint;
    EnemyDiagonalSliders: bigint;

    constructor() {
        this.Square = new Array<number>(64);
        for (let i = 0; i < 64; i++) {
            this.Square[i] = 0;
        }
        this.AllGameMoves = new Array<Move>();
        this.KingSquare = Array(2);
        this.Square.length = 0;

        this.gameStateHistory = [];
        this.CurrentGameState = new GameState();
        this.StartPositionInfo = new FenUtility.PositionInfo(FenUtility.defaultFen);
        this.PlyCount = 0;
        this.Knights = [new PieceList(10), new PieceList(10)];
        this.Pawns = [new PieceList(8), new PieceList(8)];
        this.Bishops = [new PieceList(10), new PieceList(10)];
        this.Queens = [new PieceList(9), new PieceList(9)];
        this.Rooks = [new PieceList(10), new PieceList(10)];

        this.allPieceLists = Array(15);
        this.allPieceLists[WhitePiece.WhitePawn] = this.Pawns[Board.WhiteIndex];
        this.allPieceLists[WhitePiece.WhiteKnight] = this.Knights[Board.WhiteIndex];
        this.allPieceLists[WhitePiece.WhiteBishop] = this.Bishops[Board.WhiteIndex];
        this.allPieceLists[WhitePiece.WhiteRook] = this.Rooks[Board.WhiteIndex];
        this.allPieceLists[WhitePiece.WhiteQueen] = this.Queens[Board.WhiteIndex];
        this.allPieceLists[WhitePiece.WhiteKing] = new PieceList(1);

        this.allPieceLists[BlackPiece.BlackPawn] = this.Pawns[Board.BlackIndex];
        this.allPieceLists[BlackPiece.BlackKnight] = this.Knights[Board.BlackIndex];
        this.allPieceLists[BlackPiece.BlackBishop] = this.Bishops[Board.BlackIndex];
        this.allPieceLists[BlackPiece.BlackRook] = this.Rooks[Board.BlackIndex];
        this.allPieceLists[BlackPiece.BlackQueen] = this.Queens[Board.BlackIndex];
        this.allPieceLists[BlackPiece.BlackKing] = new PieceList(1);
        this.TotalPieceCountWithoutPawnsAndKings = 0;

        this.pieceBitBoards = Array<bigint>(Piece.MaxPieceIndex + 1).fill(BigInt(0));
        this.colourBitBoards = Array<bigint>(2).fill(BigInt(0));
        this.allPiecesBitboard = BigInt(0);

        const friendlyRook = PieceFunc.MakePiece(PieceType.Rook, this.MoveColour());
        const friendlyQueen = PieceFunc.MakePiece(PieceType.Queen, this.MoveColour());
        const friendlyBishop = PieceFunc.MakePiece(PieceType.Bishop, this.MoveColour());
        this.FriendlyOrthogonalSliders = this.pieceBitBoards[friendlyRook] | this.pieceBitBoards[friendlyQueen];
        this.FriendlyDiagonalSliders = this.pieceBitBoards[friendlyBishop] | this.pieceBitBoards[friendlyQueen];
        const enemyRook = PieceFunc.MakePiece(PieceType.Rook, this.OpponentColour());
        const enemyQueen = PieceFunc.MakePiece(PieceType.Queen, this.OpponentColour());
        const enemyBishop = PieceFunc.MakePiece(PieceType.Bishop, this.OpponentColour());
        this.EnemyOrthogonalSliders = this.pieceBitBoards[enemyRook] | this.pieceBitBoards[enemyQueen];
        this.EnemyDiagonalSliders = this.pieceBitBoards[enemyBishop] | this.pieceBitBoards[enemyQueen];
    }

    MovePiece = (piece: number, startSquare: number, targetSquare: number): void => {
        this.pieceBitBoards[piece] = ToggleSquares(this.pieceBitBoards[piece], startSquare, targetSquare);
        this.colourBitBoards[this.MoveColourIndex()] = ToggleSquares(
            this.colourBitBoards[this.MoveColourIndex()],
            startSquare,
            targetSquare,
        );

        this.allPieceLists[piece].MovePiece(startSquare, targetSquare);
        this.Square[startSquare] = PieceType.None;
        this.Square[targetSquare] = piece;
    };

    MakeMove = (move: Move, inSearch = false): void => {
        const startSquare = move.StartSquare();
        const targetSquare = move.TargetSquare();
        const moveFlag = move.MoveFlag();
        const isPromotion = move.IsPromotion();
        const isEnPassant = moveFlag === MoveFlag.EnPassantCaptureFlag;

        const movedPiece = this.Square[startSquare];
        const movedPieceType = PieceFunc.PieceType(movedPiece);
        const capturedPiece = isEnPassant
            ? PieceFunc.MakePiece(PieceType.Pawn, this.OpponentColour())
            : this.Square[targetSquare];
        const capturedPieceType = PieceFunc.PieceType(capturedPiece);

        const prevCastleState = this.CurrentGameState.castlingRights;
        const prevEnPassantFile = this.CurrentGameState.enPassantFile;
        let newZobristKey = this.CurrentGameState.zobristKey;
        let newCastlingRights = this.CurrentGameState.castlingRights;
        let newEnPassantFile = 0;

        console.log(movedPiece, startSquare, targetSquare, moveFlag)
        this.MovePiece(movedPiece, startSquare, targetSquare);

        if (capturedPieceType !== PieceType.None) {
            let captureSquare = targetSquare;

            if (isEnPassant) {
                captureSquare = targetSquare + (this.IsWhiteToMove ? -8 : 8);
                this.Square[captureSquare] = PieceType.None;
            }

            if (capturedPieceType !== PieceType.Pawn) {
                this.TotalPieceCountWithoutPawnsAndKings--;
            }
            this.allPieceLists[capturedPiece].RemovePieceAtSquare(captureSquare);
            this.pieceBitBoards[capturedPiece] = ToggleSquare(this.pieceBitBoards[capturedPiece], captureSquare);
            this.colourBitBoards[this.OpponentColourIndex()] = ToggleSquare(
                this.colourBitBoards[this.OpponentColourIndex()],
                captureSquare,
            );
            newZobristKey ^= Zobrist.piecesArray[capturedPiece][captureSquare];
        }

        if (movedPieceType === PieceType.King) {
            this.KingSquare[this.MoveColourIndex()] = targetSquare;
            newCastlingRights &= this.IsWhiteToMove ? 0b1100 : 0b0001;

            if (moveFlag === MoveFlag.CastleFlag) {
                const rookPiece = PieceFunc.MakePiece(PieceType.Rook, this.MoveColour());
                const kingSide =
                    targetSquare === BoardHelper.SquareNames.g1 || targetSquare === BoardHelper.SquareNames.g8;
                const castlingRookFromIndex = kingSide ? targetSquare + 1 : targetSquare - 2;
                const castlingRookToIndex = kingSide ? targetSquare - 1 : targetSquare + 1;

                this.pieceBitBoards[rookPiece] = ToggleSquares(
                    this.pieceBitBoards[rookPiece],
                    castlingRookFromIndex,
                    castlingRookToIndex,
                );
                this.colourBitBoards[this.MoveColourIndex()] = ToggleSquares(
                    this.colourBitBoards[this.MoveColourIndex()],
                    castlingRookFromIndex,
                    castlingRookToIndex,
                );
                this.allPieceLists[rookPiece].MovePiece(castlingRookFromIndex, castlingRookToIndex);
                this.Square[castlingRookFromIndex] = PieceType.None;
                this.Square[castlingRookToIndex] = PieceType.Rook | this.MoveColour();

                newZobristKey ^= Zobrist.piecesArray[rookPiece][castlingRookFromIndex];
                newZobristKey ^= Zobrist.piecesArray[rookPiece][castlingRookToIndex];
            }
        }

        if (isPromotion) {
            this.TotalPieceCountWithoutPawnsAndKings++;
            let promotionTypePiece = PieceType.None;

            switch (moveFlag) {
                case MoveFlag.PromoteToBishopFlag:
                    promotionTypePiece = PieceType.Bishop;
                    break;
                case MoveFlag.PromoteToKnightFlag:
                    promotionTypePiece = PieceType.Knight;
                    break;
                case MoveFlag.PromoteToQueenFlag:
                    promotionTypePiece = PieceType.Queen;
                    break;
                case MoveFlag.PromoteToRookFlag:
                    promotionTypePiece = PieceType.Rook;
                    break;
                default:
                    promotionTypePiece = PieceType.None;
            }

            const promotionPiece = PieceFunc.MakePiece(promotionTypePiece, this.MoveColour());
            this.pieceBitBoards[movedPiece] = ToggleSquare(this.pieceBitBoards[movedPiece], targetSquare);
            this.pieceBitBoards[promotionPiece] = ToggleSquare(this.pieceBitBoards[promotionPiece], targetSquare);
            this.allPieceLists[movedPiece].RemovePieceAtSquare(targetSquare);
            this.allPieceLists[promotionPiece].AddPieceAtSquare(targetSquare);
            this.Square[targetSquare] = promotionPiece;
        }

        if (moveFlag === MoveFlag.PawnTwoUpFlag) {
            const file = BoardHelper.FileIndex(startSquare) + 1;
            newEnPassantFile = file;
            newZobristKey ^= Zobrist.enPassantFile[file];
        }

        if (prevCastleState !== 0) {
            if (targetSquare === BoardHelper.SquareNames.h1 || startSquare === BoardHelper.SquareNames.h1) {
                newCastlingRights &= GameStateSideMask.ClearWhiteKingsideMask;
            } else if (targetSquare === BoardHelper.SquareNames.a1 || startSquare === BoardHelper.SquareNames.a1) {
                newCastlingRights &= GameStateSideMask.ClearWhiteQueensideMask;
            } else if (targetSquare === BoardHelper.SquareNames.h8 || startSquare === BoardHelper.SquareNames.h8) {
                newCastlingRights &= GameStateSideMask.ClearBlackKingsideMask;
            } else if (targetSquare === BoardHelper.SquareNames.a8 || startSquare === BoardHelper.SquareNames.a8) {
                newCastlingRights &= GameStateSideMask.ClearBlackQueensideMask;
            }
        }

        newZobristKey ^= Zobrist.sideToMove;
        newZobristKey ^= Zobrist.piecesArray[movedPiece][startSquare];
        newZobristKey ^= Zobrist.piecesArray[this.Square[targetSquare]][targetSquare];
        newZobristKey ^= Zobrist.enPassantFile[prevEnPassantFile];
        if (newCastlingRights !== prevCastleState) {
            newZobristKey ^= Zobrist.castlingRights[prevCastleState]; // remove old castling rights state
            newZobristKey ^= Zobrist.castlingRights[newCastlingRights]; // add new castling rights state
        }
        this.IsWhiteToMove = !this.IsWhiteToMove;
        this.PlyCount++;
        let newFiftyMoveCounter = this.CurrentGameState.fiftyMoveCounter + 1;

        this.allPiecesBitboard = this.colourBitBoards[Board.WhiteIndex] | this.colourBitBoards[Board.BlackIndex];
        this.UpdateSliderBitboards();

        if (movedPieceType === PieceType.Pawn || capturedPieceType !== PieceType.None) {
            if (!inSearch) {
                this.RepetitionPositionHistory = [] as bigint[];
            }
            newFiftyMoveCounter = 0;
        }

        const newState = new GameState(
            capturedPieceType,
            newEnPassantFile,
            newCastlingRights,
            newFiftyMoveCounter,
            newZobristKey,
        );
        this.gameStateHistory.push(newState);
        this.CurrentGameState = newState;
        this.hasCachedInCheckValue = false;

        if (!inSearch) {
            this.RepetitionPositionHistory.push(newState.zobristKey);
            this.AllGameMoves.push(move);
        }
    };

    UnMakeMove = (move: Move, inSearch = false): void => {
        this.IsWhiteToMove = !this.IsWhiteToMove;

        const undoingWhiteMove = this.IsWhiteToMove;

        const movedFrom = move.StartSquare();
        const movedTo = move.TargetSquare();
        const moveFlag = move.MoveFlag();
        const undoingEnPassant = moveFlag === MoveFlag.EnPassantCaptureFlag;
        const undoingPromotion = move.IsPromotion();
        const undoingCapture = this.CurrentGameState.capturedPieceType !== PieceType.None;

        const movedPiece = undoingPromotion
            ? PieceFunc.MakePiece(PieceType.Pawn, this.MoveColour())
            : this.Square[movedTo];
        const movedPieceType = PieceFunc.PieceType(movedPiece);
        const capturedPieceType = this.CurrentGameState.capturedPieceType;

        if (undoingPromotion) {
            const promotedPiece = this.Square[movedTo];
            const pawnPiece = PieceFunc.MakePiece(PieceType.Pawn, this.MoveColour());
            this.TotalPieceCountWithoutPawnsAndKings--;

            this.allPieceLists[promotedPiece].RemovePieceAtSquare(movedTo);
            this.allPieceLists[movedPiece].AddPieceAtSquare(movedTo);
            this.pieceBitBoards[promotedPiece] = ToggleSquare(this.pieceBitBoards[promotedPiece], movedTo);
            this.pieceBitBoards[pawnPiece] = ToggleSquare(this.pieceBitBoards[pawnPiece], movedTo);
        }

        this.MovePiece(movedPiece, movedTo, movedFrom);

        if (undoingCapture) {
            let captureSquare = movedTo;
            const capturedPiece = PieceFunc.MakePiece(capturedPieceType, this.OpponentColour());

            if (undoingEnPassant) {
                captureSquare = movedTo + (undoingWhiteMove ? -8 : 8);
            }
            if (capturedPiece !== PieceType.Pawn) {
                this.TotalPieceCountWithoutPawnsAndKings++;
            }

            this.pieceBitBoards[capturedPiece] = ToggleSquare(this.pieceBitBoards[capturedPiece], captureSquare);
            this.colourBitBoards[this.OpponentColourIndex()] = ToggleSquare(
                this.colourBitBoards[this.OpponentColourIndex()],
                captureSquare,
            );
            this.allPieceLists[capturedPiece].AddPieceAtSquare(captureSquare);
            this.Square[captureSquare] = capturedPiece;
        }

        if (movedPieceType === PieceType.King) {
            this.KingSquare[this.MoveColourIndex()] = movedFrom;
            if (moveFlag === MoveFlag.CastleFlag) {
                const rookPiece = PieceFunc.MakePiece(PieceType.Rook, this.MoveColour());
                const kingSide = movedTo === BoardHelper.SquareNames.g1 || movedTo === BoardHelper.SquareNames.g8;
                const rookSquareBeforeCastling = kingSide ? movedTo + 1 : movedTo - 2;
                const rookSquareAfterCastling = kingSide ? movedTo - 1 : movedTo + 1;

                this.Square[rookSquareBeforeCastling] = PieceType.None;
                this.Square[rookSquareAfterCastling] = rookPiece;
                this.pieceBitBoards[rookPiece] = ToggleSquares(
                    this.pieceBitBoards[rookPiece],
                    rookSquareAfterCastling,
                    rookSquareBeforeCastling,
                );
                this.colourBitBoards[this.MoveColourIndex()] = ToggleSquares(
                    this.colourBitBoards[this.MoveColourIndex()],
                    rookSquareAfterCastling,
                    rookSquareBeforeCastling,
                );
                this.Square[rookSquareAfterCastling] = Piece.PieceType.None;
                this.Square[rookSquareBeforeCastling] = rookPiece;
                this.allPieceLists[rookPiece].MovePiece(rookSquareAfterCastling, rookSquareBeforeCastling);
            }
        }

        this.allPiecesBitboard = this.colourBitBoards[Board.WhiteIndex] | this.colourBitBoards[Board.BlackIndex];
        this.UpdateSliderBitboards();

        if (!inSearch && this.RepetitionPositionHistory.length > 0) {
            this.RepetitionPositionHistory.pop();
        }

        if (!inSearch) {
            this.AllGameMoves.pop();
        }

        this.gameStateHistory.pop();
        const prevState = this.gameStateHistory[this.gameStateHistory.length - 1];
        if (prevState) {
            this.CurrentGameState = prevState;
        } else {
            this.CurrentGameState = new GameState();
        }
        this.hasCachedInCheckValue = false;
        this.PlyCount--;
    };

    MakeNullMove = () => {
        this.IsWhiteToMove = !this.IsWhiteToMove;

        this.PlyCount++;

        let newZobristKey = this.CurrentGameState.zobristKey;
        newZobristKey ^= Zobrist.sideToMove;
        newZobristKey ^= Zobrist.enPassantFile[this.CurrentGameState.enPassantFile];

        const newState = new GameState(
            PieceType.None,
            0,
            this.CurrentGameState.castlingRights,
            this.CurrentGameState.fiftyMoveCounter + 1,
            newZobristKey,
        );
        this.CurrentGameState = newState;
        this.gameStateHistory.push(this.CurrentGameState);
        this.UpdateSliderBitboards();   
        this.hasCachedInCheckValue = true;
        this.cachedInCheckValue = false;
    };

    UnMakeNullMove = () => {
        this.IsWhiteToMove = !this.IsWhiteToMove;
        this.PlyCount--;
        this.gameStateHistory.pop();
        this.CurrentGameState = this.gameStateHistory[this.gameStateHistory.length - 1];
        this.UpdateSliderBitboards();
        this.hasCachedInCheckValue = true;
        this.cachedInCheckValue = false;
    };

    IsInCheck = () => {
        if (this.hasCachedInCheckValue) {
            return this.cachedInCheckValue;
        }
        this.cachedInCheckValue = this.CalculateInCheckState();
        this.hasCachedInCheckValue = true;

        return this.cachedInCheckValue;
    };

    CalculateInCheckState = (): boolean => {
        const kingSquare = this.KingSquare[this.MoveColourIndex()];
        const blockers = this.allPiecesBitboard;

        if (this.EnemyOrthogonalSliders !== BigInt(0)) {
            const rookAttacks = Magic.GetRookAttacks(kingSquare, blockers);
            if ((rookAttacks & this.EnemyOrthogonalSliders) !== BigInt(0)) {
                return true;
            }
        }

        if (this.EnemyDiagonalSliders !== BigInt(0)) {
            const bishopAttacks = Magic.GetBishopAttacks(kingSquare, blockers);
            if ((bishopAttacks & this.EnemyDiagonalSliders) !== BigInt(0)) {
                return true;
            }
        }

        const enemyPawns = this.pieceBitBoards[PieceFunc.MakePiece(PieceType.Pawn, this.OpponentColour())];
        const pawnAttackMask = this.IsWhiteToMove
            ? BitBoardUtility.WhitePawnAttacks[kingSquare]
            : BitBoardUtility.BlackPawnAttacks[kingSquare];
        if ((pawnAttackMask & enemyPawns) !== BigInt(0)) {
            return true;
        }

        return false;
    };

    LoadStartPostion = () => {
        this.LoadPositionByFen(FenUtility.defaultFen);
    };

    LoadPositionByFen = (fen: string) => {
        const posInfo: FenUtility.PositionInfo = FenUtility.PositionFromFen(fen);
        this.LoadPositionByPositionInfo(posInfo);
    };

    LoadPositionByPositionInfo = (posInfo: FenUtility.PositionInfo) => {
        this.StartPositionInfo = posInfo;
        this.Initialize();

        for (let squareIndex = 0; squareIndex < 64; squareIndex++) {
            const piece = posInfo.squares[squareIndex];
            const pieceType = PieceFunc.PieceType(piece);
            const colourIndex = PieceFunc.IsWhite(piece) ? Board.WhiteIndex : Board.BlackIndex;
            this.Square[squareIndex] = piece;

            if (piece !== PieceType.None) {
                this.pieceBitBoards[piece] = SetSquare(this.pieceBitBoards[piece], squareIndex);
                this.colourBitBoards[colourIndex] = SetSquare(this.colourBitBoards[colourIndex], squareIndex);
                if (pieceType === PieceType.King) {
                    this.KingSquare[colourIndex] = squareIndex;
                } else {
                    this.allPieceLists[piece].AddPieceAtSquare(squareIndex);
                }
                this.TotalPieceCountWithoutPawnsAndKings +=
                    pieceType === PieceType.Pawn || pieceType === PieceType.King ? 0 : 1;
            }

            this.IsWhiteToMove = posInfo.whiteToMove;

            this.allPiecesBitboard = this.colourBitBoards[Board.WhiteIndex] | this.colourBitBoards[Board.BlackIndex];
            this.UpdateSliderBitboards();

            const whiteCastle =
                (posInfo.whiteCastleKingside ? 1 << 0 : 0) | (posInfo.whiteCastleQueenside ? 1 << 1 : 0);
            const blackCastle =
                (posInfo.blackCastleKingside ? 1 << 2 : 0) | (posInfo.blackCastleQueenside ? 1 << 3 : 0);
            const castlingRights = whiteCastle | blackCastle;

            this.PlyCount = (posInfo.moveCount - 1) * 2 + (this.IsWhiteToMove ? 0 : 1);
            this.CurrentGameState = new GameState(
                PieceType.None,
                posInfo.epFile,
                castlingRights,
                posInfo.fiftyMovePlyCount,
                BigInt(0),
            );

            const zobristKey = Zobrist.CalculateZobristKey(this);

            this.CurrentGameState = new GameState(
                PieceType.None,
                posInfo.epFile,
                castlingRights,
                posInfo.fiftyMovePlyCount,
                zobristKey,
            );

            this.RepetitionPositionHistory.push(zobristKey);

            this.gameStateHistory.push(this.CurrentGameState);
        }
    };

    static CreateNewBoard = (source: Board) => {
        const newBoard = new Board();
        newBoard.LoadPositionByFen(source.StartPositionInfo.fen);

        for (let i = 0; i < source.AllGameMoves.length; i++)
        {
            newBoard.MakeMove(source.AllGameMoves[i]);
        }
        return newBoard;
    };

    LoadPositionByMove = (moves: Move[]) => {
        const newBoard = new Board();
        newBoard.LoadStartPostion();

        for (let i = 0; i < moves.length; i++)
        {
            newBoard.MakeMove(moves[i]);
        }
        return newBoard;
    };

    UpdateSliderBitboards = () => {
        const friendlyRook = PieceFunc.MakePiece(PieceType.Rook, this.MoveColour());
        const friendlyQueen = PieceFunc.MakePiece(PieceType.Queen, this.MoveColour());
        const friendlyBishop = PieceFunc.MakePiece(PieceType.Bishop, this.MoveColour());
        this.FriendlyOrthogonalSliders = this.pieceBitBoards[friendlyRook] | this.pieceBitBoards[friendlyQueen];
        this.FriendlyDiagonalSliders = this.pieceBitBoards[friendlyBishop] | this.pieceBitBoards[friendlyQueen];

        const enemyRook = PieceFunc.MakePiece(PieceType.Rook, this.OpponentColour());
        const enemyQueen = PieceFunc.MakePiece(PieceType.Queen, this.OpponentColour());
        const enemyBishop = PieceFunc.MakePiece(PieceType.Bishop, this.OpponentColour());
        this.EnemyOrthogonalSliders = this.pieceBitBoards[enemyRook] | this.pieceBitBoards[enemyQueen];
        this.EnemyDiagonalSliders = this.pieceBitBoards[enemyBishop] | this.pieceBitBoards[enemyQueen];
    };

    Initialize = () => {
        this.Square = new Array<number>(64);
        for (let i = 0; i < 64; i++) {
            this.Square[i] = 0;
        }
        this.AllGameMoves = new Array<Move>();
        this.KingSquare = Array(2);
        this.Square.length = 0;

        this.gameStateHistory = [];
        this.CurrentGameState = new GameState();
        //PlyCount
        this.Knights = [new PieceList(10), new PieceList(10)];
        this.Pawns = [new PieceList(8), new PieceList(8)];
        this.Bishops = [new PieceList(10), new PieceList(10)];
        this.Queens = [new PieceList(9), new PieceList(9)];
        this.Rooks = [new PieceList(10), new PieceList(10)];

        this.allPieceLists = Array(15);
        this.allPieceLists[WhitePiece.WhitePawn] = this.Pawns[Board.WhiteIndex];
        this.allPieceLists[WhitePiece.WhiteKnight] = this.Knights[Board.WhiteIndex];
        this.allPieceLists[WhitePiece.WhiteBishop] = this.Bishops[Board.WhiteIndex];
        this.allPieceLists[WhitePiece.WhiteRook] = this.Rooks[Board.WhiteIndex];
        this.allPieceLists[WhitePiece.WhiteQueen] = this.Queens[Board.WhiteIndex];
        this.allPieceLists[WhitePiece.WhiteKing] = new PieceList(1);

        this.allPieceLists[BlackPiece.BlackPawn] = this.Pawns[Board.BlackIndex];
        this.allPieceLists[BlackPiece.BlackKnight] = this.Knights[Board.BlackIndex];
        this.allPieceLists[BlackPiece.BlackBishop] = this.Bishops[Board.BlackIndex];
        this.allPieceLists[BlackPiece.BlackRook] = this.Rooks[Board.BlackIndex];
        this.allPieceLists[BlackPiece.BlackQueen] = this.Queens[Board.BlackIndex];
        this.allPieceLists[BlackPiece.BlackKing] = new PieceList(1);

        this.TotalPieceCountWithoutPawnsAndKings = 0;

        this.pieceBitBoards = Array<bigint>(Piece.MaxPieceIndex + 1).fill(BigInt(0));
        this.colourBitBoards = Array<bigint>(2).fill(BigInt(0));
        this.allPiecesBitboard = BigInt(0);
    };
}

export default Board;
