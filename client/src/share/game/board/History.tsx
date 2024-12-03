import { CSSProperties, useEffect, useState, type FC } from "react";

import type { Board, Position, MoveTypes, Piece } from "src/interfaces/gameplay/chess";
import { useHistoryState } from "src/components/game/Game";
import "src/share/game/board/Board";
import { useAppSelector } from "src/app/hooks";
import { RootState } from "src/app/store";
import * as MoveUtility from "src/interfaces/gamecore/helper/MoveUtility";
import Move, { MoveFlag } from "src/interfaces/gamecore/board/Move";
import BoardCore from "src/interfaces/gamecore/board/Board";

export type History = {
    board: Board;
    from: Position;
    to: Position;
    capture: Piece | null;
    type: MoveTypes;
    steps: Position;
    piece: Piece;
};

const convertCoords = (x: number, y: number) => {
    return { y: y + 1, x: numberMap[x] };
};

const numberMap: {
    [key: number]: string;
} = {
    0: `a`,
    1: `b`,
    2: `c`,
    3: `d`,
    4: `e`,
    5: `f`,
    6: `g`,
    7: `h`,
};

const uppercase = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

const getLastFive = (arr: History[]) => {
    if (arr.length < 5) return arr;
    return arr.slice(arr.length - 5, arr.length);
};

export const HistoryPanel: FC = () => {
    const allGameMove = useAppSelector((root: RootState) => root.roomReducer.history);

    const whiteMove = {
        width: "45%",
        color: "#fff",
        margin: "2px",
        backgroudColor: "green"
    };

    const blackMove = {
        width: "45%",
        color: "rgb(128 128 128)",
        margin: "2px",
        backgroudColor: "green"

    };

    const historyPanel: CSSProperties = {
        display: "flex",
        flexWrap: "wrap",
        overflow: "auto",
        height: "100%",
        width: "100%"
    };

    return (
        <div className="history">
            <h1>NƯỚC ĐI</h1>
            <div style={historyPanel}>
                {allGameMove.map((move) => {
                    let isWhite = true;
                    if (move.moveString) {
                        isWhite = move.moveString[0].toUpperCase() === move.moveString[0];
                    }

                    return (
                        <>
                            <div style={isWhite ? whiteMove : blackMove}>{move.moveString}</div>
                        </>
                    );
                })}
            </div>

            {/* {getLastFive(history).map((h, i) => {
                const from = convertCoords(h.from.x, h.from.y)
                const to = convertCoords(h.to.x, h.to.y)
                return (
                    <p key={i}>
                        {uppercase(h.piece?.color)} {uppercase(h.piece?.type)}
                        <span>
                            {` `}from{` `}
                        </span>
                        {from.x + from.y}
                        <span>
                            {` `}to{` `}
                        </span>
                        {to.x + to.y}
                    </p>
                )
            })} */}
        </div>
    );
};
