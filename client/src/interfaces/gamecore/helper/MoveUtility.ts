import Board from "../board/Board";
import Move, { MoveFlag } from "../board/Move";
import * as PieceFunc from "src/share/gamecore/board/Piece";
import MoveGenerator from "../move/MoveGenerator";
import { PieceType } from "../board/Piece";
import * as BoardHelper from "./BoardHelper";

export const GetMoveNameSAN = (move: Move, board: Board): string => {
    if (move.IsNull()) {
        return "Null";
    }
    const movePieceType = PieceFunc.PieceType(board.Square[move.StartSquare()]);
    const capturedPieceType = PieceFunc.PieceType(board.Square[move.TargetSquare()]);

    if (move.MoveFlag() === MoveFlag.CastleFlag) {
        const delta = move.TargetSquare() - move.StartSquare();
        if (delta === 2) {
            return "0-0";
        } else if (delta === -2) {
            return "0-0-0";
        }
    }

    const moveGen = new MoveGenerator();
    let moveNotation = PieceFunc.GetSymbol(movePieceType);

    moveNotation = board.IsWhiteToMove ? moveNotation : moveNotation.toLowerCase();

    if (movePieceType !== PieceType.Pawn || movePieceType !== PieceType.King) {
        const allMove = moveGen.GenerateMoves(board) as Move[];

        for (const i in allMove) {
            const altMove = allMove[i] as Move;

            if (altMove.StartSquare() !== move.StartSquare() && altMove.TargetSquare() === move.TargetSquare()) {
                if (PieceFunc.PieceType(board.Square[altMove.StartSquare()]) === movePieceType) {
                    const fromFileIndex = BoardHelper.FileIndex(move.StartSquare());
                    const alternateFromFileIndex = BoardHelper.FileIndex(altMove.TargetSquare());
                    const fromRankIndex = BoardHelper.RankIndex(move.TargetSquare());
                    const alternateFromRankIndex = BoardHelper.RankIndex(altMove.StartSquare());

                    if (fromFileIndex !== alternateFromFileIndex) {
                        moveNotation += BoardHelper.fileNames[fromFileIndex];
                        break;
                    } else if (fromRankIndex !== alternateFromRankIndex) {
                        moveNotation += BoardHelper.ranknames[fromRankIndex];
                        break;
                    }
                }
            }
        }
    }

    if(capturedPieceType !== 0){
        if(movePieceType === PieceType.Pawn){
            moveNotation += BoardHelper.fileNames[BoardHelper.FileIndex(move.StartSquare())];
        }
        moveNotation += "x";
    }else{
        if(move.MoveFlag() === MoveFlag.EnPassantCaptureFlag){
            moveNotation += BoardHelper.fileNames[BoardHelper.FileIndex(move.StartSquare())] + "x";
        }
    }

    moveNotation += BoardHelper.fileNames[BoardHelper.FileIndex(move.TargetSquare())];
    moveNotation += BoardHelper.ranknames[BoardHelper.RankIndex(move.TargetSquare())];

    if(move.IsPromotion()){
        const promotionPieceType = move.PromotionType();
        moveNotation += "=" + PieceFunc.GetSymbol(promotionPieceType).toUpperCase();
    }

    board.MakeMove(move, true);
    const legalResponses = moveGen.GenerateMoves(board);
    if(moveGen.InCheck()){
        if(legalResponses.length === 0){
            moveNotation += "#";
        }else{
            moveNotation += "+";
        }
    }
    board.UnMakeMove(move, true);

    return moveNotation;



};
