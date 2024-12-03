import Board from "src/interfaces/gamecore/board/Board";
import Move from "src/interfaces/gamecore/board/Move";
import Evalution from "src/interfaces/gamecore/botChess/evalution/Evalution";
import RepetitionTable from "src/interfaces/gamecore/botChess/search/RepetitionTable";
import TranspositionTable from "src/interfaces/gamecore/botChess/search/TranspositionTable";
import MoveOrdering, { maxKillerMovePly } from "src/interfaces/gamecore/botChess/search/MoveOrdering";
import MoveGenerator, { PromotionMode } from "src/interfaces/gamecore/move/MoveGenerator";
import * as Piece from "src/interfaces/gamecore/board/Piece";
import * as PieceFunc from "src/share/gamecore/board/Piece";
import * as BoardHelper from "src/interfaces/gamecore/helper/BoardHelper";

export const transpositionTableSizeMB = 64;
export const maxExtentions = 16;
export const immediateMateScore = 100000;
export const positiveInfinity = 9999999;
export const negativeInfinity = -positiveInfinity;

class Searcher {
    // OnSearchComplete: Move[];

    bestMove: Move;
    bestEval: number;

    isPlayingWhite: boolean;
    bestMoveThisIteration: Move;
    bestEvalThisIteration: number;
    hasSearchedAtLeastOneMove: boolean;
    searchCancelled: boolean;
    CurrentDepth: number;

    transpositionTable: TranspositionTable;
    repetitionTable: RepetitionTable;
    moveGenerator: MoveGenerator;
    moveOrderer: MoveOrdering;
    evaluation: Evalution;
    board: Board;

    BestMoveSoFar = (): Move => {
        return this.bestMove;
    };
    BestEvalSoFar = (): number => {
        return this.bestEval;
    };

    constructor(board: Board) {
        this.board = board;

        this.evaluation = new Evalution();
        this.moveGenerator = new MoveGenerator();
        this.transpositionTable = new TranspositionTable(board, transpositionTableSizeMB);
        this.moveOrderer = new MoveOrdering(this.moveGenerator, this.transpositionTable);
        this.repetitionTable = new RepetitionTable();

        this.moveGenerator.promotionsToGenerate = PromotionMode.QueenAndKnight;

        this.bestEvalThisIteration = this.bestEval = 0;
        this.bestMoveThisIteration = this.bestMove = Move.NullMove();

        this.isPlayingWhite = this.board.IsWhiteToMove;

        this.CurrentDepth = 0;

        this.hasSearchedAtLeastOneMove = false;
        this.searchCancelled = false;

        this.Search(1, 0, negativeInfinity, positiveInfinity, 0, new Move(0), false);
    }

    StartSearch = (depth: number) => {
        this.bestEvalThisIteration = this.bestEval = 0;
        this.bestMoveThisIteration = this.bestMove = Move.NullMove();

        this.isPlayingWhite = this.board.IsWhiteToMove;

        this.moveOrderer.ClearHistory();
        this.repetitionTable.Init(this.board);

        this.CurrentDepth = 0;

        this.RunIterativeDeepeningSearch(depth);

        if (this.bestMove.IsNull()) {
            this.bestMove = this.moveGenerator.GenerateMoves(this.board)[0];
        }
        // this.OnSearchComplete.invoke(this.bestMove);
        this.searchCancelled = false;
    };

    RunIterativeDeepeningSearch = (depth: number) => {
        // for (let searchDepth = 1; searchDepth <= depth; searchDepth++) {
            this.hasSearchedAtLeastOneMove = false;

            this.Search(depth, 0, negativeInfinity, positiveInfinity, 0, new Move(0), false);

            if (this.searchCancelled) {
                if (this.hasSearchedAtLeastOneMove) {
                    this.bestMove = this.bestMoveThisIteration;
                    this.bestEval = this.bestEvalThisIteration;
                }
            } else {
                this.CurrentDepth = depth;
                this.bestMove = this.bestMoveThisIteration;
                this.bestEval = this.bestEvalThisIteration;

                this.bestEvalThisIteration = Number.MIN_SAFE_INTEGER;
                this.bestMoveThisIteration = Move.NullMove();
            }
        // }
    };

    GetSearchResult = (): { move: Move; _eval: number } => {
        return {
            move: this.bestMove,
            _eval: this.bestEval,
        };
    };

    Search = (
        plyRemaining: number,
        plyFromRoot: number,
        alpha: number,
        beta: number,
        numExtenstion: number,
        prevMove: Move,
        prevWasCapture: boolean,
    ): number => {
        if (this.searchCancelled) {
            return 0;
        }

        if (plyFromRoot > 0) {
            if (
                this.board.FiftyMoveCounter() >= 100 ||
                this.repetitionTable.Contains(this.board.CurrentGameState.zobristKey)
            ) {
                return 0;
            }

            alpha = Math.max(alpha, -immediateMateScore + plyFromRoot);
            beta = Math.min(beta, immediateMateScore - plyFromRoot);

            if (alpha > beta) {
                return alpha;
            }
        }

        const ttVal = this.transpositionTable.LookupEvaluation(plyRemaining, plyFromRoot, alpha, beta);
        if (ttVal !== TranspositionTable.lookUpFailed) {
            if (plyFromRoot === 0) {
                this.bestMoveThisIteration = this.transpositionTable.TryGetStoredMove();
                this.bestEvalThisIteration =
                    this.transpositionTable.entries[Number(this.transpositionTable.Index())].value;
            }
            return ttVal;
        }

        if (plyRemaining === 0) {
            const evaluation = this.QuiescenceSearch(alpha, beta);
            return evaluation;
        }

        let moves: Move[] = new Array<Move>(256);
        moves = this.moveGenerator.GenerateMoves(this.board, false);
        const prevBestMove = plyFromRoot === 0 ? this.bestMove : this.transpositionTable.TryGetStoredMove();
        this.moveOrderer.OrderMoves(
            prevBestMove,
            this.board,
            moves,
            this.moveGenerator.opponentAttackMap,
            this.moveGenerator.opponentPawnAttackMap,
            false,
            plyFromRoot,
        );

        if (moves.length === 0) {
            if (this.moveGenerator.InCheck()) {
                const mateScore = immediateMateScore - plyFromRoot;
                return -mateScore;
            } else {
                return 0;
            }
        }

        if (plyFromRoot > 0) {
            const wasPawnMove =
                PieceFunc.PieceType(this.board.Square[prevMove.TargetSquare()]) === Piece.PieceType.Pawn;
            this.repetitionTable.Push(this.board.CurrentGameState.zobristKey, prevWasCapture || wasPawnMove);
        }

        let evaluationBound = TranspositionTable.upperBound;
        let bestMoveInThisPosition = Move.NullMove();
        for (let i = 0; i < moves.length; i++) {
            const move = moves[i];
            const capturedPieceType = PieceFunc.PieceType(this.board.Square[move.TargetSquare()]);
            const isCapture = capturedPieceType !== Piece.PieceType.None;

            this.board.MakeMove(moves[i], true);
            let extension = 0;

            if (numExtenstion < maxExtentions) {
                const movedPieceType = PieceFunc.PieceType(this.board.Square[move.TargetSquare()]);
                const targetRank = BoardHelper.RankIndex(move.TargetSquare());

                if (this.board.IsInCheck()) {   
                    extension = 1;
                } else if (movedPieceType === Piece.PieceType.Pawn && (targetRank === 1 || targetRank === 6)) {
                    extension = 1;
                }
            }

            let needsFullSearch = true;
            let _eval = 0;

            if (extension === 0 && plyRemaining >= 3 && i >= 3 && !isCapture) {
                const reduceDepth = 1;
                _eval = -this.Search(
                    plyRemaining - 1 - reduceDepth,
                    plyFromRoot + 1,
                    -alpha - 1,
                    -alpha,
                    numExtenstion,
                    move,
                    isCapture,
                );

                needsFullSearch = _eval > alpha;
            }

            if (needsFullSearch) {
                _eval = -this.Search(
                    plyRemaining - 1 + extension,
                    plyFromRoot + 1,
                    -beta,
                    -alpha,
                    numExtenstion + extension,
                    move,
                    isCapture,
                );
            }

            this.board.UnMakeMove(moves[i], true);

            if (this.searchCancelled) {
                return 0;
            }

            if (_eval >= beta) {
                this.transpositionTable.StoreEvaluation(
                    plyRemaining,
                    plyFromRoot,
                    beta,
                    TranspositionTable.lowerBound,
                    moves[i],
                );

                if (!isCapture) {
                    if (plyFromRoot < maxKillerMovePly) {
                        this.moveOrderer.killerMoves[plyFromRoot].Add(move);
                    }
                    const historyScore = plyRemaining * plyRemaining;
                    this.moveOrderer.History[this.board.MoveColourIndex()][moves[i].StartSquare()][
                        moves[i].TargetSquare()
                    ] += historyScore;
                }

                if (plyFromRoot > 0) {
                    this.repetitionTable.TryPop();
                }

                return beta;
            }

            if (_eval > alpha) {
                evaluationBound = TranspositionTable.exact;
                bestMoveInThisPosition = moves[i];

                alpha = _eval;
                if (plyFromRoot === 0) {
                    this.bestMoveThisIteration = moves[i];
                    this.bestEvalThisIteration = _eval;
                    this.hasSearchedAtLeastOneMove = true;
                }
            }
        }

        if (plyFromRoot > 0) {
            this.repetitionTable.TryPop();
        }

        this.transpositionTable.StoreEvaluation(
            plyRemaining,
            plyFromRoot,
            alpha,
            evaluationBound,
            bestMoveInThisPosition,
        );

        return alpha;
    };

    QuiescenceSearch = (alpha: number, beta: number): number => {
        if (this.searchCancelled) {
            return 0;
        }

        let _eval = this.evaluation.Evalute(this.board);
        if (_eval >= beta) {
            return beta;
        }

        if (_eval > alpha) {
            return alpha;
        }

        let moves: Move[] = new Array<Move>();
        moves = this.moveGenerator.GenerateMoves(this.board, true);
        this.moveOrderer.OrderMoves(
            Move.NullMove(),
            this.board,
            moves,
            this.moveGenerator.opponentAttackMap,
            this.moveGenerator.opponentPawnAttackMap,
            true,
            0,
        );
        for (let i = 0; i < moves.length; i++) {
            if (PieceFunc.PieceType(this.board.Square[moves[i].StartSquare()]) === Piece.PieceType.None) {
                continue;
            }
            this.board.MakeMove(moves[i], true);
            _eval = -this.QuiescenceSearch(-beta, -alpha);
            this.board.UnMakeMove(moves[i], true);

            if (_eval >= beta) {
                return beta;
            }
            if (_eval > alpha) {
                return alpha;
            }
        }

        return alpha;
    };

    AnnounceMate = (): string => {
        if (IsMateScore(this.bestEvalThisIteration)) {
            const numPlyToMate = NumPlyToMateFromScore(this.bestEvalThisIteration);
            const numMovesToMate = Math.ceil(numPlyToMate / 2);

            const sideWithMate =
                this.bestEvalThisIteration * (this.board.IsWhiteToMove ? 1 : -1) < 0 ? "Black" : "White";

            return `${sideWithMate} can mate is ${numMovesToMate} move${numMovesToMate > 1 ? "s" : ""}`;
        }
        return "No mate found";
    };

    ClearForNewPosition = () => {
        this.transpositionTable.Clear();
        this.moveOrderer.ClearKillers();
    };

    GetTranspositionTable = (): TranspositionTable => {
        return this.transpositionTable;
    };
}

export const IsMateScore = (score: number): boolean => {
    if (score === Number.MIN_SAFE_INTEGER) {
        return false;
    }
    const maxMateDepth = 1000;
    return Math.abs(score) > immediateMateScore - maxMateDepth;
};

export const NumPlyToMateFromScore = (score: number): number => {
    return immediateMateScore - Math.abs(score);
};

export default Searcher;
