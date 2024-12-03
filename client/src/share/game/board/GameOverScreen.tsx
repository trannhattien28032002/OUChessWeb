import type { FC } from "react";
import type { EndGame } from "src/components/game/Game";
import { VscDebugStepBack } from "react-icons/vsc";
import "src/share/game/board/Board.scss";
import { socket } from "src/index";
import { useAppSelector } from "src/app/hooks";
import { RootState } from "src/app/store";
import { LeaveRoom } from "src/share/game/board/Sidebar";
import { useNavigate } from "react-router-dom";

export const GameOverScreen: FC<{
    endGame: EndGame | null;
    endState: number;
    matchState:number;
}> = ({ endGame, endState, matchState }) => {
    const roomId = useAppSelector((state: RootState) => state.playerReducer.roomId);
    const curentUser = useAppSelector((state: RootState) => state.userReducer.currentUser);
    const opponentAvatar = useAppSelector((state: RootState) => state.opponentReducer.avatar);
    const opponentName = useAppSelector((state: RootState) => state.opponentReducer.name);
    const opponentColor = useAppSelector((state: RootState) => state.opponentReducer.color);
    const userColor = useAppSelector((state: RootState) => state.roomReducer.gameState.playerColor);
    const endType = useAppSelector((state: RootState) => state.roomReducer.endGame);
    const nav = useNavigate();

    const handleLeftGame = () => {
        const data: LeaveRoom = {
            roomId: roomId,
        };
        socket.emit(`setJoinedRoom`, data);
        socket.emit(`leaveRoom`, data);
        nav("/play/online");
    };

    return (
        <>
            {endState > -1 && (
                <div className="container-game-over-screen">
                    <div className="game__over__container">
                        <div className="player__box white__player">
                            <div className="player__color">TRẮNG</div>
                            <div className="player__avatar">
                                <img src={userColor === 0 ? curentUser.avatar : opponentAvatar} alt="white__avatar" />
                            </div>
                            <div className="player__name">{userColor === 0 ? curentUser.username : opponentName}</div>
                        </div>
                        <div className="result__match">
                            <div className="result__text">VÁN ĐẤU KẾT THÚC</div>
                            <div className="result__text">{endState === 1 ? "Chiến thắng" : endState === 2 ? "Thua cuộc" : "Hoà"}</div>
                            <div className="result__score">{matchState === 1 ? "1 - 0" : endState === -1 ? "0 - 1" : "0 - 0"}</div>
                        </div>
                        <div className="player__box black__player">
                            <div className="player__color">ĐEN</div>
                            <div className="player__avatar">
                                <img src={!(userColor === 0) ? curentUser.avatar : opponentAvatar} alt="black__avatar" />
                            </div>
                            <div className="player__name">{!(userColor === 0) ? curentUser.username : opponentName}</div>
                        </div>
                    </div>
                    <button onClick={handleLeftGame}>
                        <VscDebugStepBack />
                    </button>
                </div>
            )}
        </>
    );
};
