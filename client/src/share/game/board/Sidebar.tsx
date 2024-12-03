import type { CSSProperties, FC } from "react";
import React, { useEffect, useRef, useState } from "react";

import { useHistoryState } from "src/components/game/Game";
import { AiFillCloseCircle } from "react-icons/ai";
import { BsReverseLayoutSidebarInsetReverse } from "react-icons/bs";

import { HistoryPanel } from "src/share/game/board/History";
import { MiniMap } from "src/share/game/board/MiniMap";
import { socket } from "src/index";
import { RootState } from "src/app/store";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { Router, redirect, useNavigate } from "react-router-dom";
import Board from "src/interfaces/gamecore/board/Board";
import { roomAction } from "src/redux/reducer/room/RoomReducer";
import { Id, toast } from "react-toastify";
import { userActions } from "src/redux/reducer/user/UserReducer";

export type LeaveRoom = {
    roomId?: string | null;
};

export const DrawRequestNotify = (params: any) => {
    const {roomID} = params;
    const container: CSSProperties = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    };

    const text = {};

    const accept = {
        padding: "5px",
        margin: "0 5px",
        color: "green",
    };

    const acceptHover = {
        padding: "5px",
        margin: "0 5px",
        color: "green",
        borderRadius: "25px",
        backgroundColor: "#a5a5a5",
        cursor: "pointer",
    };

    const deny = {
        padding: "5px",
        borderRadius: "25px",
        color: "red",
    };

    const denyHover = {
        padding: "5px",
        borderRadius: "25px",
        color: "red",
        backgroundColor: "#a5a5a5",
        cursor: "pointer",
    };

    const [hover, setHover] = useState(0);

    return (
        <>
            <div style={container}>
                <div style={text}>Đối phương muốn xin hoà ?</div>
                <div
                    onMouseOver={() => setHover(1)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => {
                        console.log(roomID);
                        socket.emit("req-draw", { isDraw: true, roomID: roomID });
                        const { closeToast } = params;
                        closeToast();
                    }}
                    style={hover === 1 ? acceptHover : accept}
                >
                    <i className="fa-solid fa-check"></i>
                </div>
                <div
                    onMouseOver={() => setHover(2)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => {
                        socket.emit("req-draw", { isDraw: false, roomID: roomID });
                        const { closeToast } = params;
                        closeToast();
                    }}
                    style={hover === 2 ? denyHover : deny}
                >
                    <i className="fa-solid fa-xmark"></i>
                </div>
            </div>
        </>
    );
};

export const Sidebar: FC<{
    board?: Board;
    moves: number[];
    selected: number | null;
    setBoard?: (board: Board) => void;
    reset?: () => void;
}> = ({ board, moves, selected, reset, setBoard }) => {
    const [show, setShow] = React.useState<boolean>(false);
    const roomId = useAppSelector((state: RootState) => state.playerReducer.roomId);
    const detail = useAppSelector((state: RootState) => state.roomReducer.detail);
    const curentUser = useAppSelector((state: RootState) => state.userReducer.currentUser);
    const isStarted = useAppSelector((state: RootState) => state.roomReducer.gameState.isStarted);
    const isDraw = useAppSelector((state: RootState) => state.roomReducer.isDraw);
    const dispatch = useAppDispatch();
    const nav = useNavigate();
    const toastId = useRef<Id | null>(null);

    const handleLeavingRoom = async () => {
        if (!isStarted) {
            if (curentUser._id !== detail?.owner) {
                socket.emit("leave-room", {
                    type: "player",
                    rId: detail?.id,
                });
                return;
            } else {
                socket.emit("leave-room", {
                    type: "owner",
                    rId: detail.id,
                });
               
                return;
            }
        } else {
            dispatch(
                roomAction.requestLeaveRoom({
                    rId: detail?.id || "",
                    uId: curentUser._id,
                }),
            );
        }
    };

    const handleRequestDraw = async () => {
        socket.emit("res-draw", { roomID: detail?.id });
    };

    const handleRequestStart = async () => {
        if (detail && detail?.player.length < 2) {
            toast.info("Chưa có đối thủ");
            return;
        }

        socket.emit("request-start-game", { roomID: detail?.id });
    };

    useEffect(() => {
        if(isDraw){
            if(detail?.id){
                toast(({closeToast}) => <DrawRequestNotify closeToast={closeToast} roomID={detail?.id}></DrawRequestNotify>)
            }
        }
    }, [isDraw])

    return (
        <>
            {!show && <BsReverseLayoutSidebarInsetReverse onClick={() => setShow(!show)} className="icon-sidebar" />}
            <div className="container-sidebar">
                {show && (
                    <>
                        <AiFillCloseCircle onClick={() => setShow(!show)} />
                        <MiniMap board={board} selected={selected} moves={moves} />
                        <HistoryPanel />
                        <div className="container-sidebar-button">
                            <button onClick={handleLeavingRoom}>Thoát</button>
                            {isStarted ? (
                                <button onClick={handleRequestDraw}>Hoà cờ</button>
                            ) : detail?.owner === curentUser._id ? (
                                <button onClick={handleRequestStart}>Bắt đầu</button>
                            ) : (
                                <></>
                            )}
                        </div>
                    </>
                )}
            </div>
        </>
    );
};
