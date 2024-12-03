import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify";
import moment from "moment";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { RootState } from "src/app/store";
import { Friend, Profile as ProfileStyle } from "src/redux/reducer/profile/Types";
import { profileActions } from "src/redux/reducer/profile/Profile";
import { Match } from "src/redux/reducer/match/Types";
import { socket } from "src/index";
import CommentInfoList from "src/share/comment/CommentInfoList";
import MessageService from "src/services/message/MessageService";
import "src/components/profile/Profile.scss";

interface ProfileProps {}

const Profile: React.FC<ProfileProps> = (props: ProfileProps) => {
    const currentUser = useAppSelector((state: RootState) => state.userReducer.currentUser);
    const profile = useAppSelector((state: RootState) => state.profileReducer.profile);
    const isLoading = useAppSelector((state: RootState) => state.profileReducer.isLoading);
    const matches = useAppSelector((state: RootState) => state.profileReducer.matches);
    const dispatch = useAppDispatch();
    const [option, setOption] = useState<string>("history");
    const [friends, setFriends] = useState<Friend[]>([]);
    const [isFriend, setisFriend] = useState<number>(3);
    enum friendStatus {
        "Chấp nhận" = 0,
        "Đã gửi lời mời" = 1,
        "Bạn bè" = 2,
        "Kết bạn" = 3,
    }
    const nav = useNavigate();
    const { username } = useParams();

    useEffect(() => {
        dispatch(profileActions.reqGetProfile({ username }));
    }, [username]);

    useEffect(() => {
        if (profile.friends) {
            const listFriends: Friend[] = profile.friends.filter((f: any) => f.status === 2);
            setFriends(listFriends);

            profile.friends.forEach((f: Friend) => {
                if (currentUser._id === f.recipient._id) setisFriend(f.status);
            });
        }
    }, [profile]);

    useEffect(() => {
        if (profile._id !== null && profile._id !== "") {
            if (option === "history") {
                dispatch(profileActions.reqGetMatchesOfUser({ _id: profile._id }));
            }
            if (option === "comment") {
                dispatch(profileActions.reqGetCommentInfoesUser({ username: profile._id, params: {} }));
            }
        }
    }, [option, profile]);

    useEffect(() => {
        socket.on("updated-friend", (friend: Friend) => {
            setFriends((prev) => [...prev, friend]);
        });

        return () => {
            socket.removeAllListeners();
        };
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    const requestHandle = () => {
        if (isFriend === 3) {
            socket.emit("addFriend", currentUser._id, profile._id, (succcess: boolean) => {
                if (succcess) {
                    setisFriend(1);
                    toast.success(`Đã gửi lời mời kết bạn tới ${profile.username}`);
                } else {
                    toast.error("Đã có lỗi xảy ra");
                }
            });
        }
    };

    const chatHandle = async () => {
        let combineId = "";
        if (profile._id) {
            if (currentUser._id > profile._id) combineId = profile._id + currentUser._id;
            else combineId = currentUser._id + profile._id;
        }

        const doc = await MessageService.get("chat", combineId);
        if (doc?.exists()) {
            nav(`/messages/${combineId}`);
        } else {
            const _data = {
                lastMessage: "",
                members: [currentUser._id, profile._id],
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };

            try {
                const isSuc = await MessageService.addWithId("chat", combineId, _data);
                if (isSuc) {
                    const _chat = {
                        [combineId]: {
                            sent: false,
                        },
                    };

                    await MessageService.addWithId("userCharts", currentUser._id, _chat);
                    nav(`/messages/${combineId}`);
                }
            } catch (error) {
                toast.error("Đã có lỗi xảy ra");
            }
        }
    };

    return (
        <>
            <div className="profile__container">
                <div className="avatar__container">
                    <div className="avatar-img ">
                        <img src={profile?.avatar} alt={profile?.username} />
                    </div>
                    <div className="avatar-content">
                        <div className="avatar-username">
                            {profile?.username} {profile?.nation && `(${profile.nation})`}
                        </div>
                        <div className="avatar-fullname">
                            {profile?.firstName} {profile?.lastName}
                        </div>
                        <div className="avatar-fullname">Elo: {profile?.elo}</div>
                        <div className="avatar-fullname">
                            Tham gia: {moment(profile?.createdAt).format("DD/MM/YYYY")}
                        </div>
                        {profile._id !== currentUser._id && (
                            <div className="profile-feature">
                                <div className="btn-form btn-form-save" onClick={requestHandle}>
                                    {friendStatus[isFriend]}
                                </div>
                                <div className="btn-form btn-form-save" onClick={chatHandle}>
                                    Nhắn tin
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="toEdit">
                        {currentUser.username === profile?.username && (
                            <Link to={`/profile/${username}/edit`}>
                                <i className="fa-solid fa-pen-to-square"></i>
                            </Link>
                        )}
                    </div>
                </div>
                <div className="infomation-container">
                    <div className="information-title">Bạn bè</div>
                    <div className="information-content friend-list">
                        {friends.length === 0 && (
                            <div style={{ color: "#9e9e9e", padding: "5px", margin: "auto" }}>Hiện không có bạn bè</div>
                        )}
                        {friends.map((f: Friend) => {
                            return (
                                <div
                                    key={f.recipient._id}
                                    className="friend-item"
                                    onClick={(evt) => {
                                        nav(`/profile/${f.recipient.username}`);
                                    }}
                                >
                                    <img src={f.recipient.avatar} alt={f.recipient.username} />
                                </div>
                            );
                        })}
                    </div>
                </div>
                <br></br>
                <div>
                    <div className="notes-toggle-button">
                        <div
                            className={(option === "history" && "notes-button-active ") + " notes-button"}
                            onClick={(evt) => setOption("history")}
                        >
                            Lịch sử đấu
                        </div>
                        <div
                            className={(option === "comment" && "notes-button-active ") + " notes-button"}
                            onClick={(evt) => setOption("comment")}
                        >
                            Nhận xét
                        </div>
                    </div>
                    <div className="information-content">
                        {option === "history" && (
                            <>
                                <div className="matches-list">
                                    {matches.length === 0 && (
                                        <div style={{ color: "#9e9e9e", padding: "5px", margin: "auto" }}>
                                            Không có bất kỳ trận đấu nào
                                        </div>
                                    )}
                                    {matches.map((m: Match) => {
                                        return (
                                            <>
                                                <div
                                                    className={
                                                        (m.whiteId?._id === profile._id && m.state === 1) ||
                                                        (m.blackId?._id === profile._id && m.state === -1)
                                                            ? "match-item win"
                                                            : "match-item lose" + (m.state === 0 ? " draw" : "")
                                                    }
                                                >
                                                    <div
                                                        className="white-profile"
                                                        onClick={(evt) => nav(`/profile/${m.whiteId?.username}`)}
                                                    >
                                                        <div>QUÂN TRẮNG</div>
                                                        <div className="white-img">
                                                            <img src={m.whiteId?.avatar} alt={m.whiteId?.username} />
                                                        </div>
                                                        {m.whiteId?.username}
                                                    </div>
                                                    <div className="winner">
                                                        <div> Tỉ số</div>
                                                        {m.state === 1 && <div>1-0</div>}
                                                        {m.state === 0 && <div>1/2-1/2</div>}
                                                        {m.state === -1 && <div>0-1</div>}
                                                    </div>

                                                    <div
                                                        className="black-profile"
                                                        onClick={(evt) => nav(`/profile/${m.blackId?.username}`)}
                                                    >
                                                        <div>QUÂN ĐEN</div>
                                                        <div className="black-img">
                                                            <img src={m.blackId?.avatar} alt={m.blackId?.username} />
                                                        </div>
                                                        {m.blackId?.username}
                                                    </div>
                                                </div>
                                            </>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                        {option === "comment" && <CommentInfoList />}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;
