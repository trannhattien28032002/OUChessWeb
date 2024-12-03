import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { RootState } from "src/app/store";
import { userActions } from "src/redux/reducer/user/UserReducer";
import { Friend } from "src/redux/reducer/profile/Types";
import { socket } from "src/index";
import useDocument from "src/share/firestore/DocumentHook";
import "src/share/header/Header.scss";

type Props = object;



const Header = (props: Props) => {
    const currentUser = useAppSelector((state: RootState) => state.userReducer.currentUser);
    const friends = useAppSelector((state: RootState) => state.userReducer.friends);
    const [friendNotify, setFriendNotify] = useState<boolean>(false);
    const [chatNotify, setChatNotify] = useState<boolean>(false);
    const [show, setShow] = useState<boolean>(false);
    const [request, setRequest] = useState<Friend[]>();
    const dispatch = useAppDispatch();
    const nav = useNavigate();

    const chat = useDocument({
        _collection: "userCharts",
        _id: currentUser._id,
    });

    useEffect(() => {
        chat.forEach((c: any) => {
            if (c.data.sent) setChatNotify(true);
        });
    }, [chat]);

    useEffect(() => {
        dispatch(userActions.reqGetCurrentUser({}));
    }, []);

    useEffect(() => {
        const req = friends.filter((f: Friend) => f.status === 1);
        setRequest(req);
        if (req.length > 0) {
            setFriendNotify(true);
        } else {
            setFriendNotify(false);
        }
    }, [friends]);

    const acceptRequest = (friend: Friend) => {
        socket.emit("acceptFriend", friend);
    };

    const rejectRequest = (friend: Friend) => {
        socket.emit("rejectFriend", friend);
    };

    useEffect(() => {
        socket.on("acceptedRequest", (friend: Friend) => {
            toast.success(`${friend.recipient.username} đã chấp nhận lời mời kết bạn`);
        });

        socket.on("addRequest", (friend: Friend) => {
            const newList = [...friends, friend];
            dispatch(userActions.reqSetFriends({ friends: newList }));
        });

        socket.on("removeRequest", (friend: Friend) => {
            const newList = friends.filter((f: Friend) => {
                return f.recipient._id !== friend.recipient._id;
            });
            dispatch(userActions.reqSetFriends({ friends: newList }));
        });

        return () => {
            socket.removeAllListeners();
        };
    }, []);

    return (
        <>
            <nav>
                <div className="headers-container">
                    <div className="notify friends" onClick={(evt) => setShow(!show)}>
                        <div>Bạn bè</div>
                        {friendNotify && <span className="badge"></span>}
                        {show && (
                            <div className="request-list">
                                {request?.map((f: Friend) => {
                                    return (
                                        <>
                                            <div className="request-item">
                                                <div>{f.recipient.username} đã gửi cho bạn một lời kết bạn</div>
                                                <div className="request-choose">
                                                    <div
                                                        className="btn-form btn-form-save"
                                                        onClick={(evt) => acceptRequest(f)}
                                                    >
                                                        Chấp nhận
                                                    </div>
                                                    <div className="btn-form" onClick={(evt) => rejectRequest(f)}>
                                                        Huỷ
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    );
                                })}
                                {request?.length === 0 && <div className="request-item">Không có lời mời nào</div>}
                            </div>
                        )}
                    </div>
                    <div className="notify chats" onClick={evt => {
                        nav("/messages")
                    }}>
                        <div>Tin nhắn</div>
                        {chatNotify && <span className="badge"></span>}
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Header;
