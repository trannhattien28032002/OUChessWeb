import type { FC } from "react";
import * as BoardHelper from "src/interfaces/gamecore/helper/BoardHelper";
import * as PieceFunc from "src/share/gamecore/board/Piece";
import "src/share/game/board/Board.scss";
import Board from "src/interfaces/gamecore/board/Board";
import MoveGenerator from "src/interfaces/gamecore/move/MoveGenerator";
import { Position } from "src/interfaces/gameplay/chess";
import { FaChessPawn, FaChessKnight, FaChessBishop, FaChessRook, FaChessQueen, FaChessKing } from "react-icons/fa";

export const MiniMap: FC<{
    board?: Board;
    selected: number | null;
    moves: number[];
}> = ({ board, selected, moves }) => {
    const moveGenerator = new MoveGenerator();

    const IsHightLigt = (board: Board, start: number | null, target: number) => {
        if (start === null) return null;
        const moves = moveGenerator.GenerateMoves(board, false);

        for (let i = 0; i < moves.length; i++) {
            const move = moves[i];
            if (move.StartSquare() === start && move.TargetSquare() === target) {
                return {
                    target: move.TargetSquare(),
                    flag: move.MoveFlag(),
                };
            }
        }

        return null;
    };

    return (
        <div className="mini-map">
            {board?.Square.map((square, i) => {
                const file = BoardHelper.FileIndex(i);
                const rank = BoardHelper.RankIndex(i);

                const bg = (file + rank) % 2 === 0 ? `#a5a5a5` : `#676767`;
                const isSelected = selected && selected === i ? true : false;
                const isHightLight = IsHightLigt(board, selected, i);
                let canMoveHere: Position | null = null;
                if (isHightLight !== null) {
                    canMoveHere = {
                        x: BoardHelper.RankIndex(isHightLight.target),
                        y: BoardHelper.FileIndex(isHightLight.target),
                    };
                }

                return (
                    <div
                        key={`${file}-${rank}`}
                        className={`mini-map-tile-move 
                                ${isSelected ? "selected " : PieceFunc.IsWhite(square) ? "white " : "black "}
                                ${bg === `#a5a5a5` ? "odd " : "even "}
                                ${canMoveHere ? "can-move" : ""}`}
                    >
                        {square !== 0 && (
                            <>
                                {PieceFunc.PieceType(square) === 1 && <FaChessPawn />}
                                {PieceFunc.PieceType(square) === 4 && <FaChessRook />}
                                {PieceFunc.PieceType(square) === 2 && <FaChessKnight />}
                                {PieceFunc.PieceType(square) === 3 && <FaChessBishop />}
                                {PieceFunc.PieceType(square) === 5 && <FaChessQueen />}
                                {PieceFunc.PieceType(square) === 6 && <FaChessKing />}
                                {PieceFunc.PieceType(square) === 0 && <FaChessKing />}
                            </>
                        )}
                    </div>
                );
            })}
        </div>
    );
};
