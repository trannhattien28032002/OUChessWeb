import React, { useEffect, useState } from "react";
import { Match } from "src/redux/reducer/match/Types";
import type { FC } from "react";
import { socket } from "src/index";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { RootState } from "src/app/store";
import { useNavigate } from "react-router-dom";
import { playerActions } from "src/redux/reducer/player/PlayerReducer";
import { matchActions } from "src/redux/reducer/match/MatchReducer";
import { roomAction } from "src/redux/reducer/room/RoomReducer";
import { Room } from "src/util/Socket";
import "src/share/roomList/RoomList.scss";
import Mode from "../bot/Mode";

export type JoinRoomClient = {
    roomId: string | null | undefined;
    username: string;
    avatar: string;
};

export const RoomListComponent: FC<{
    rooms: Room[];
    match: Match[];
    newMatch: Match;
    setNewMatch: (newMatch: any) => void;
}> = ({ rooms, match, newMatch, setNewMatch }) => {
    const userId = useAppSelector((state: RootState) => state.userReducer.currentUser._id);
    const username = useAppSelector((state: RootState) => state.userReducer.currentUser.username);
    const currentUser = useAppSelector((state: RootState) => state.userReducer.currentUser);
    const lastestMatchId = useAppSelector((state: RootState) => state.matchReducer.lastestMatchId);
    const avatar = useAppSelector((state: RootState) => state.userReducer.currentUser.avatar);
    const detail = useAppSelector((state: RootState) => state.roomReducer.detail);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [searchRoomId, setSearchRoomId] = useState("");
    const [isSearch, setIsSearch] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [isModeModalOpen, setModeModalOpen] = useState(false);
    const [color, setColor] = useState<number>(0);
    const matchesPerPage = 8;
    const nav = useNavigate();
    const dispatch = useAppDispatch();

    const indexOfLastMatch = currentPage * matchesPerPage;
    const indexOfFirstMatch = indexOfLastMatch - matchesPerPage;
    const currentMatches = match.slice(indexOfFirstMatch, indexOfLastMatch);
    const currentList = rooms.slice(indexOfFirstMatch, indexOfLastMatch);
    // Old code
    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handleRoomClick = (match: Match) => {
        joinRoom(match._id);
        updateRoom(match);
    };

    const handleCreateModal = () => {
        setIsCreateModalOpen(!isCreateModalOpen);
    };

    const handleSearchRoom = () => {
        if (!searchRoomId) {
            setIsSearch(true);
            dispatch(matchActions.reqGetMatch({}));
        } else {
            setIsSearch(false);
            dispatch(matchActions.reqGetMatchById({ matchId: searchRoomId }));
        }
    };

    const handleCreateRoom = () => {
        dispatch(matchActions.reqPostAddMatch({ match: { ...newMatch, whiteId: currentUser._id } }));
    };

    const joinRoom = (matchId: string | null | undefined) => {
        if (!socket) return;
        dispatch(playerActions.setRoomId({ roomId: matchId }));
        const data: JoinRoomClient = { roomId: matchId, username: `${username}#${userId}`, avatar: avatar };
        socket.emit(`joinRoom`, data);
        socket.emit(`fetchPlayers`, { roomId: matchId });
        nav(`/game/live/${matchId}`);
    };

    const updateRoom = (match: Match) => {
        dispatch(matchActions.reqPutMatchById({ matchId: match._id, match: { ...match, blackId: currentUser._id } }));
    };

    const handleSearchRoomIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchRoomId(e.target.value);
    };

    const checkCanCreateRoom = (roomName: string | undefined) => {
        if (roomName && roomName !== "") {
            return true;
        } else {
            return false;
        }
    };

    useEffect(() => {
        if (lastestMatchId != null) {
            joinRoom(lastestMatchId);
        }
    }, [lastestMatchId]);
    //

    // New Code
    const createRoomHandle = () => {
        const title = newMatch.matchName ? newMatch.matchName : "Fight with me";
        dispatch(
            roomAction.requestCreateRoom({
                title: title,
                own: userId,
                color: color,
            }),
        );
    };

    const joinRoomHandle = (roomId: string) => {
        dispatch(
            roomAction.requestJoinRoom({
                rId: roomId,
                uId: userId,
            }),
        );
    };
    
    const handleBotMode = () => {
        setModeModalOpen(!isModeModalOpen);
    };

    useEffect(() => {
        if (detail !== null) {
            nav(`/game/live/${detail?.id}`);
        }
    }, [detail]);
    // New Code
    return (
        <>
            <div className="buttons-room">
                <div className="btn-room-left">
                    <button onClick={handleCreateModal} className="btn-form-create">
                        Tạo Phòng
                    </button>
                    {/* <button className="btn-form-create">Chơi Nhanh</button> */}
                    <button onClick={handleBotMode} className="btn-form-create">
                        Chơi với máy
                    </button>
                </div>
                <div className="btn-room-right">
                    <input
                        type="text"
                        placeholder="Nhập ID phòng"
                        value={searchRoomId}
                        onChange={handleSearchRoomIdChange}
                    />
                    <button onClick={handleSearchRoom} className="btn-form-search">
                        <i className="fa-solid fa-right-to-bracket"></i>
                    </button>
                </div>
            </div>

            {isCreateModalOpen && (
                <div className="create-room-modal">
                    <div className="modal-content">
                        <div className="box__line box__line--top"></div>
                        <div className="box__line box__line--right"></div>
                        <div className="box__line box__line--bottom"></div>
                        <div className="box__line box__line--left"></div>
                        <h2>Tạo Phòng</h2>
                        <label>Tên Phòng:</label>
                        <input
                            type="text"
                            value={newMatch.matchName}
                            onChange={(e) => {
                                setNewMatch({ ...newMatch, matchName: e.target.value });
                                checkCanCreateRoom(e.target.value);
                            }}
                        />

                        <div
                            className={`color__team ${color === 1 ? "color__black" : "color__white"}`}
                            onClick={() => setColor(1 - color)}
                        >
                            {color ? "Đen" : "Trắng"}
                        </div>

                        {/* <label>Chế Độ:</label>
                        <select
                            value={newMatch.mode}
                            onChange={(e) => {
                                setNewMatch({ ...newMatch, mode: e.target.value });
                            }}
                        >
                            <option value="" disabled>
                                Chọn chế độ
                            </option>
                            <option value="Siêu chớp">Siêu chớp</option>
                            <option value="Chớp">Chớp</option>
                            <option value="Nhanh">Nhanh</option>
                        </select> */}
                        <button onClick={handleCreateModal} className="decline-button">
                            Huỷ
                        </button>
                        <button
                            onClick={createRoomHandle}
                            disabled={!checkCanCreateRoom(newMatch.matchName)}
                            className="create-button"
                        >
                            Tạo
                        </button>
                    </div>
                </div>
            )}

            {isModeModalOpen && (
                <div className="create-room-modal">
                    <Mode SetShowDialog={handleBotMode} />
                </div>
            )}

            <div className="room-list">
                <h2>Danh Sách Phòng</h2>
                {rooms && (
                    <table>
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Tên Phòng</th>
                                <th>Số lượng</th>
                                <th>Trạng thái</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentList.map((room, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{room.title}</td>
                                        <td>{room.player.length} / 2</td>
                                        <td>{room.player.length === 2 ? "Full" : "Waiting"}</td>
                                        <td>
                                            <button onClick={() => joinRoomHandle(room.id)}>Vào phòng</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}

                {!isSearch && rooms && rooms.length === 0 && (
                    <div className="no-matches-message">Hiện tại không có phòng nào được tạo.</div>
                )}
                {isSearch && rooms && rooms.length === 0 && (
                    <div className="no-matches-message">Không tìm thấy trận đấu bạn đang tìm!</div>
                )}

                {/* Hiển thị Pagination */}
                <div className="pagination">
                    {Array.from({ length: Math.ceil(match.length / matchesPerPage) }, (_, index) => (
                        <button key={index} onClick={() => paginate(index + 1)}>
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
};
