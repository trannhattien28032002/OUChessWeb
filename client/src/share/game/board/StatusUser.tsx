import { FC, useEffect, useState } from "react";

import { playerActions } from "src/redux/reducer/player/PlayerReducer";
import { gameSettingActions } from "src/redux/reducer/gameSettings/GameSettingsReducer";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { RootState } from "src/app/store";
import { roomAction } from "src/redux/reducer/room/RoomReducer";
import { GameResult } from "src/interfaces/gamecore/result/GameResult";
import { socket } from "src";

interface StatusUserParametar {
    whiteTimer: number;
    blackTimer: number;
}

export const StatusUser: FC<StatusUserParametar> = ({ whiteTimer, blackTimer }) => {
    const username = useAppSelector((state: RootState) => state.userReducer.currentUser.username);
    const userID = useAppSelector((state: RootState) => state.userReducer.currentUser._id);
    const usernameOpponent = useAppSelector((state: RootState) => state.opponentReducer.name);
    const avatar = useAppSelector((state: RootState) => state.userReducer.currentUser.avatar);
    const avatarOpponent = useAppSelector((state: RootState) => state.opponentReducer.avatar);
    const status = useAppSelector((state: RootState) => state.opponentReducer.status);
    const detail = useAppSelector((state: RootState) => state.roomReducer.detail);
    const color = useAppSelector((state: RootState) => state.roomReducer.gameState.playerColor);
    const turn = useAppSelector((state: RootState) => state.roomReducer.gameState.turn);
    const isStarted = useAppSelector((state: RootState) => state.roomReducer.gameState.isStarted);
    const [disconnectCounter, setDisconectCounter] = useState<number>(90);
    const dispatch = useAppDispatch();

    const MilisecondsToHourMinutes = (ms: number) => {
        // Convert milliseconds to seconds
        let totalSeconds = Math.floor(ms / 1000);

        // Calculate hours
        const hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;

        // Calculate minutes
        const minutes = Math.floor(totalSeconds / 60);

        // Calculate remaining seconds
        const seconds = totalSeconds % 60;

        return { hours, minutes, seconds };
    };

    const Clocker = (s: number) => {
        const { minutes, seconds } = MilisecondsToHourMinutes(s * 1000);
        let flag = false;
        if (seconds < 10) {
            flag = true;
        }

        if (flag) {
            return `${minutes}:0${seconds}`;
        }
        return `${minutes}:${seconds}`;
    };

    useEffect(() => {
        if (isStarted) {
            const counter = setInterval(() => {
                if (whiteTimer === 0) {
                    dispatch(roomAction.endGame({ EndType: GameResult.WhiteTimeout }));
                }
                if (blackTimer === 0) {
                    dispatch(roomAction.endGame({ EndType: GameResult.BlackTimeout }));
                }

                dispatch(roomAction.tickTimer());
            }, 1000);

            return () => clearInterval(counter);
        }
    }, [turn, isStarted, whiteTimer, blackTimer]);

    useEffect(() => {
        if (status === 0) {
            if (disconnectCounter === 0) {
                dispatch(
                    roomAction.endGame({
                        EndType: color === 0 ? GameResult.BlackTimeout : GameResult.WhiteTimeout,
                    }),
                );
            }
            const counter = setInterval(() => {
                if (disconnectCounter >= 0) {
                    setDisconectCounter((prev) => prev - 1);
                }
            }, 1000);

            return () => clearInterval(counter);
        } else {
            setDisconectCounter(90);
        }
    }, [status, disconnectCounter]);

    const handleKick = async () => {
        socket.emit("request-kick-player", { roomID: detail?.id });
    };

    return (
        <>
            <div className="player-container">
                <div className="player-bar">
                    <div className="user-avatar">
                        <img src={avatar} alt={username} />
                    </div>
                    <div className="user-info">
                        <div className="user-name">{username} </div>
                        {detail?.owner === userID && (
                            <i
                                style={{ color: "yellow", marginLeft: "5px", display: "inline-block" }}
                                className="fa-solid fa-crown"
                            ></i>
                        )}
                    </div>
                    {isStarted && (
                        <div className={`timer ${turn === color && "your-turn"}`}>
                            {Clocker(color === 0 ? whiteTimer : blackTimer)}
                        </div>
                    )}
                </div>
            </div>
            <div className="opponent-container">
                {status === 0 && (
                    <>
                        <div>
                            <div style={{ color: "red", position: "fixed", bottom: 0, left: "30%" }}>
                                Người chơi đã bị mất kết nối{" "}
                                <span style={{ fontWeight: "bold" }}>[{Clocker(disconnectCounter || 0)}]</span>
                            </div>
                        </div>
                    </>
                )}
                <div className="opponent-bar">
                    <div className="opponent-avatar">
                        <img src={avatarOpponent} alt={usernameOpponent} />
                    </div>
                    <div className="opponent-info">
                        <div className="opponent-name">{usernameOpponent} </div>
                        {detail?.owner !== userID && (
                            <i
                                style={{ color: "yellow", marginLeft: "5px", display: "inline-block" }}
                                className="fa-solid fa-crown"
                            ></i>
                        )}
                    </div>
                    {isStarted ? (
                        <div className={`timer ${turn !== color && "your-turn"}`}>
                            {Clocker(color !== 0 ? whiteTimer : blackTimer)}
                        </div>
                    ) : detail?.owner === userID && status === 1 ? (
                        <div className="timer" style={{ fontSize: "15px" }}>
                            <div className="btn__style btn__close" onClick={handleKick}>
                                <i className="fa-solid fa-xmark"></i>
                            </div>
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </>
    );
};
