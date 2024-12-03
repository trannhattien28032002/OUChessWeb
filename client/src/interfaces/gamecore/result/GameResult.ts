import Board from "src/interfaces/gamecore/board/Board";
import MoveGenerator from "src/interfaces/gamecore/move/MoveGenerator";
import * as BoardHelper from "src/interfaces/gamecore/helper/BoardHelper";

export const enum GameResult {
    NotStarted,
    InProgress,
    WhiteIsMated,
    BlackIsMated,
    Stalemate,
    Repetition,
    FiftyMoveRule,
    InsufficientMaterial,
    DrawByArbiter,
    WhiteTimeout,
    BlackTimeout,
    WhiteIllegalMove,
    BlackIllegalMove,
    GameResult,
}

export const IsDrawResult = (result: GameResult): boolean => {
    if (
        result === GameResult.DrawByArbiter ||
        result === GameResult.FiftyMoveRule ||
        result === GameResult.Repetition ||
        result === GameResult.Stalemate ||
        result === GameResult.InsufficientMaterial
    )
        return true;

    return false;
};

export const IsWinResult = (result: GameResult): boolean => {
    return IsWhiteWinResult(result) || IsBlackWinsResult(result);
};

export const IsWhiteWinResult = (result: GameResult): boolean => {
    if (
        result === GameResult.BlackIsMated ||
        result === GameResult.BlackTimeout ||
        result === GameResult.BlackIllegalMove
    )
        return true;

    return false;
};

export const IsBlackWinsResult = (result: GameResult): boolean => {
    if (
        result === GameResult.WhiteIsMated ||
        result === GameResult.WhiteTimeout ||
        result === GameResult.WhiteIllegalMove
    )
        return true;

    return false;
};

export const InsufficentMaterial = (board: Board): boolean => {
    // Can't have insufficient material with pawns on the board
    if (board.Pawns[Board.WhiteIndex].Count() > 0 || board.Pawns[Board.BlackIndex].Count() > 0) {
        return false;
    }

    // Can't have insufficient material with queens/rooks on the board
    if (board.FriendlyOrthogonalSliders !== BigInt(0) || board.EnemyOrthogonalSliders !== BigInt(0)) {
        return false;
    }

    // If no pawns, queens, or rooks on the board, then consider knight and bishop cases
    const numWhiteBishops = board.Bishops[Board.WhiteIndex].Count();
    const numBlackBishops = board.Bishops[Board.BlackIndex].Count();
    const numWhiteKnights = board.Knights[Board.WhiteIndex].Count();
    const numBlackKnights = board.Knights[Board.BlackIndex].Count();
    const numWhiteMinors = numWhiteBishops + numWhiteKnights;
    const numBlackMinors = numBlackBishops + numBlackKnights;
    const numMinors = numWhiteMinors + numBlackMinors;

    // Lone kings or King vs King + single minor: is insuffient
    if (numMinors <= 1) {
        return true;
    }

    // Bishop vs bishop: is insufficient when bishops are same colour complex
    if (numMinors === 2 && numWhiteBishops === 1 && numBlackBishops === 1) {
        const whiteBishopIsLightSquare = BoardHelper.LightSquare(
            BoardHelper.FileIndex(board.Bishops[Board.WhiteIndex].Get(0)),
            BoardHelper.RankIndex(board.Bishops[Board.WhiteIndex].Get(0)),
        );
        const blackBishopIsLightSquare = BoardHelper.LightSquare(
            BoardHelper.FileIndex(board.Bishops[Board.BlackIndex].Get(0)),
            BoardHelper.RankIndex(board.Bishops[Board.BlackIndex].Get(0)),
        );
        return whiteBishopIsLightSquare === blackBishopIsLightSquare;
    }

    return false;
};

export const GetGameState = (board: Board): GameResult => {
    const moveGenerator = new MoveGenerator();
    const moves = moveGenerator.GenerateMoves(board);

    // Look for mate/stalemate
    if (moves.length === 0) {
        if (moveGenerator.InCheck()) {
            return board.IsWhiteToMove ? GameResult.WhiteIsMated : GameResult.BlackIsMated;
        }
        return GameResult.Stalemate;
    }

    // Fifty move rule
    if (board.FiftyMoveCounter() >= 100) {
        return GameResult.FiftyMoveRule;
    }

    // Threefold repetition
    const repCount = board.RepetitionPositionHistory.filter(x => x === board.ZobristKey()).length;
    if (repCount === 3) {
        return GameResult.Repetition;
    }

    // Look for insufficient material
    if (InsufficentMaterial(board)) {
        return GameResult.InsufficientMaterial;
    }

    return GameResult.InProgress;
};
