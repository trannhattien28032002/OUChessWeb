import { Environment } from "@react-three/drei";
import { Canvas, RootState } from "@react-three/fiber";
import React, { useEffect, useState } from "react";
import { BoardModel } from "src/models/Board";
import { Opponent } from "src/share/game/board/Opponent";
import { Vector3 } from "three";
import { EndGame, useHistoryState } from "../game/Game";
import { useAppDispatch } from "src/app/hooks";
import { BoardDefault } from "src/share/gamecore/Board";
import Board from "src/interfaces/gamecore/board/Board";
import { useParams, useSearchParams } from "react-router-dom";
import Move from "src/interfaces/gamecore/board/Move";
import Searcher from "src/interfaces/gamecore/botChess/search/Searcher";

const initializeStartPos = (): Board => {
    const board = new Board();
    board.LoadStartPostion();
    return board;
};

const BotChess = () => {
    const [board, setBoard] = useState<Board>(initializeStartPos());
    const [showPromotionDialog, setShowPromotionDialog] = useState<boolean>(false);
    const [cameraDefault, setCameraDefault] = useState(new Vector3(0, 0, 0));
    const [moving, setMoving] = useState<Move | null>(null);
    const [turn, setTurn] = useState<number>(0);
    const [diff, setDiff] = useState<number>(0);
    const dispatch = useAppDispatch();
    const [params] = useSearchParams();

    const handleMoving = (moving: Move | null) => {
        setMoving(moving);
    };

    const handleTurn = (turn: number) => {
        setTurn(turn);
    };

    useEffect(() => {
        const _diff = params.get("mode");
        if (_diff === "001") {
            setDiff(3);
        } else if (_diff === "002") {
            setDiff(10);
        } else if (_diff === "003") {
            setDiff(20);
        }
    }, [params]);

    useEffect(() => {
        if (turn === 1) {
            let copyBoard = new Board();
            copyBoard = Board.CreateNewBoard(board);
            const searcher = new Searcher(copyBoard);
            setTimeout(() => {
                searcher.StartSearch(diff);
                const bestMove = searcher.bestMove;
                if (bestMove !== null) {
                    handleMoving(bestMove);
                }
            }, 5000);
        }
    }, [turn]);

    return (
        <>
            <div className="bot__container">
                <div className="container-chess">
                    <Canvas shadows camera={{ position: cameraDefault, fov: 70 }}>
                        <Environment files="/dawn.hdr" />
                        <Opponent />
                        <BoardModel />
                        <BoardDefault
                            board={board}
                            setBoard={setBoard}
                            moving={moving}
                            setMoving={handleMoving}
                            setTurning={handleTurn}
                        />
                    </Canvas>
                </div>
            </div>
        </>
    );
};

export default BotChess;
