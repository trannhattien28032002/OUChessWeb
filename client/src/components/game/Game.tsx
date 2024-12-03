import PromoteDialog from "src/share/game/board/PromotionDialog";
import create from "zustand";
import Board from "src/interfaces/gamecore/board/Board";

import { FC, useState, useEffect } from "react";
import { BoardComponent } from "src/share/game/board/Board";
import { GameOverScreen } from "src/share/game/board/GameOverScreen";
import type { History } from "src/share/game/board/History";
import { Sidebar } from "src/share/game/board/Sidebar";
import { Environment } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Loader } from "src/share/game/board/Loader";
import { BoardModel } from "src/models/Board";
import { Opponent } from "src/share/game/board/Opponent";
import { StatusBar } from "src/share/game/board/StatusBar";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { gameSettingActions } from "src/redux/reducer/gameSettings/GameSettingsReducer";
import { RootState } from "src/app/store";
import { Chat } from "src/share/game/board/Chat";
import { StatusUser } from "src/share/game/board/StatusUser";
import { Color, Vector3 } from "three";
import { matchActions } from "src/redux/reducer/match/MatchReducer";
import { useNavigate } from "react-router-dom";
import { EndGameType, Move, Tile } from "src/interfaces/gameplay/chess";

import "src/components/game/Game.scss";
import { roomAction } from "src/redux/reducer/room/RoomReducer";
import { userActions } from "src/redux/reducer/user/UserReducer";
import { GameResult } from "src/interfaces/gamecore/result/GameResult";
import { isDiffSet } from "@react-three/fiber/dist/declarations/src/core/utils";

export type ThreeMouseEvent = {
    stopPropagation: () => void;
};

export type MovingTo = {
    move: Move;
    tile: Tile;
};

export type EndGame = {
    type: EndGameType;
    winner: Color;
};

export const useHistoryState = create<{
    history: History[];
    reset: VoidFunction;
    addItem: (item: History) => void;
    undo: VoidFunction;
}>((set) => ({
    history: [] as History[],
    reset: () => set({ history: [] }),
    addItem: (item) => set((state) => ({ history: [...state.history, item] })),
    undo: () => set((state) => ({ history: state.history.slice(0, -1) })),
}));

const initializeStartPos = (): Board => {
    const board = new Board();
    board.LoadStartPostion();

    return board;
};

export const Game: FC = () => {
    const playerColor = useAppSelector((state: RootState) => state.roomReducer.gameState.playerColor);
    const board = useAppSelector((state: RootState) => state.roomReducer.board);
    const room = useAppSelector((state: RootState) => state.roomReducer.detail);
    const whiteTimer = useAppSelector((state: RootState) => state.roomReducer.gameState.whiteTimer);
    const blackTimer = useAppSelector((state: RootState) => state.roomReducer.gameState.blackTimer);
    const currentUser = useAppSelector((state: RootState) => state.userReducer.currentUser);
    const history = useAppSelector((state: RootState) => state.roomReducer.history);
    const [showPromotionDialog, setShowPromotionDialog] = useState<boolean>(false);
    const [cameraDefault, setCameraDefault] = useState(new Vector3(0, 0, 0));
    const [selected, setSelected] = useState<number | null>(null);
    const [targeted, setTargeted] = useState<number | null>(null);
    const [moves, setMoves] = useState<number[]>([]);
    const [endGame, setEndGame] = useState<EndGame | null>(null);
    const [lastSelected, setLastSelected] = useState<number | null>(null);
    const [end, setEnd] = useState<number>(-1);
    const [matchState, setMatchState] = useState<number>(-1);
    const nav = useNavigate();
    const dispatch = useAppDispatch();

    const roomState = useAppSelector((state: RootState) => state.roomReducer);
    const endType = useAppSelector((state: RootState) => state.roomReducer.endGame);

    useEffect(() => {
        if (playerColor === 0) {
            setCameraDefault(new Vector3(0, 10, -6));
        } else {
            setCameraDefault(new Vector3(0, 10, 6));
        }
        return;
    }, [playerColor]);

    useEffect(() => {
        if (roomState.detail === null) {
            nav("/play/online");
        }
        return;
    }, [roomState]);

    useEffect(() => {
        console.log("Game: ", history);
    }, [history])

    const checkWinner = (playerColor: number, result: GameResult) => {
        const whiteWin = [GameResult.BlackTimeout, GameResult.BlackIsMated, GameResult.BlackIllegalMove];
        const blackWin = [GameResult.WhiteTimeout, GameResult.WhiteIsMated, GameResult.WhiteIllegalMove];
        const draw = [
            GameResult.Stalemate,
            GameResult.Repetition,
            GameResult.FiftyMoveRule,
            GameResult.InsufficientMaterial,
            GameResult.DrawByArbiter,
        ];
        const nothing = [GameResult.NotStarted, GameResult.InProgress];
        if (!result) {
            return null; // or handle invalid input appropriately
        }

        const isWhiteWin = whiteWin.includes(result);
        const isBlackWin = blackWin.includes(result);

        if (isWhiteWin) {
            if (playerColor === 0) return 0;
            return 1;
        } else if (isBlackWin) {
            if (playerColor === 1) return 0;
            return 1;
        } else if (draw.includes(result)) {
            return 2;
        } else {
            return -1; // or handle unexpected result appropriately
        }
    };

    const calculateElo = (eloA: number, eloB: number, isWin: number, k: number) => {
        if (isWin === -1) {
            return eloA;
        }

        let S = 0;
        if (isWin === 0) {
            S = 1;
        } else if (isWin === 1) {
            S = 0;
        } else if (isWin === 2) {
            S = 0.5;
        }

        const m = (eloB - eloA) / 400;
        const u = 1 + Math.pow(10, m);
        const E = 1 / u;

        const newElo = eloA + Math.round(k * (S - E));
        return newElo;
    };

    const isWhiteWin = (result: GameResult) => {
        const whiteWin = [GameResult.BlackTimeout, GameResult.BlackIsMated, GameResult.BlackIllegalMove];
        const blackWin = [GameResult.WhiteTimeout, GameResult.WhiteIsMated, GameResult.WhiteIllegalMove];
        const draw = [
            GameResult.Stalemate,
            GameResult.Repetition,
            GameResult.FiftyMoveRule,
            GameResult.InsufficientMaterial,
            GameResult.DrawByArbiter,
        ];
        const nothing = [GameResult.NotStarted, GameResult.InProgress];

        const isWhiteWin = whiteWin.includes(result);
        const isBlackWin = blackWin.includes(result);

        if (isWhiteWin) {
            return 1;
        } else if (isBlackWin) {
            return -1;
        } else {
            return 0;
        }
    };

    useEffect(() => {
        if (endType) {
            const isWin = checkWinner(playerColor, endType);
            let isEnd = false;
            const matchState = isWhiteWin(endType);
            setMatchState(matchState);
            console.log("EndType: ", endType);
            console.log("Winner: ", isWin);
            if (isWin === 0) {
                // player win
                isEnd = true;
                setEnd(1);
            } else if (isWin === 1) {
                // opponent win
                isEnd = true;
                setEnd(2);
            } else if (isWin === 2) {
                // draw
                isEnd = true;
                setEnd(3);
            } else {
                isEnd = false;
                setEnd(-1);
            }

            if (isEnd) {
                const mElo = room?.player.filter((p) => p._id === currentUser._id)[0].elo;
                const oElo = room?.player.filter((p) => p._id !== currentUser._id)[0].elo;

                const newElo = calculateElo(Number(mElo), Number(oElo), isWin !== null ? isWin : -1, 10);
                dispatch(userActions.resPatchUpdateElo({ username: currentUser.username, elo: newElo }));
                console.log(history);
                if (room?.owner === currentUser._id) {
                    console.log(history);
                    dispatch(
                        matchActions.requestSaveMatch({
                            detail: room,
                            history: history,
                            mode: 1,
                            state: matchState,
                        }),
                    );
                }    
            }
        }
    }, [endType]);

    return (
        <div className="container-chess">
            <Sidebar board={board} moves={moves} selected={selected} />
            {room?.id && <Chat />}
            <StatusBar />
            <GameOverScreen endGame={endGame} endState={end} matchState={matchState} />
            <Loader />
            <StatusUser whiteTimer={whiteTimer} blackTimer={blackTimer} />
            <PromoteDialog
                showPromotionDialog={showPromotionDialog}
                setShowPromotionDialog={setShowPromotionDialog}
                board={board}
                selected={selected}
                targeted={targeted}
            />
            <Canvas shadows camera={{ position: cameraDefault, fov: 70 }}>
                <Environment files="/dawn.hdr" />
                <Opponent />
                <BoardModel />
                <BoardComponent
                    selected={selected}
                    setSelected={setSelected}
                    targeted={targeted}
                    setTargeted={setTargeted}
                    board={board ? board : initializeStartPos()}
                    moves={moves}
                    setMoves={setMoves}
                    setEndGame={setEndGame}
                    showPromotionDialog={showPromotionDialog}
                    setShowPromotionDialog={setShowPromotionDialog}
                    lastSelected={lastSelected}
                    setLastSelected={setLastSelected}
                    blackTimer={blackTimer}
                    whiteTimer={whiteTimer}
                />
            </Canvas>
        </div>
    );
};

export default Game;
