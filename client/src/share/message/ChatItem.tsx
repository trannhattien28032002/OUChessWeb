import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { RootState } from "src/app/store";
import useDocument from "src/share/firestore/DocumentHook";
import { ROOT_URL } from "src/config/ApiConstants";
import { messageAction } from "src/redux/reducer/messages/Messages";
import { messageState } from "src/redux/reducer/messages/Types";
import "src/components/messenger/Messenger.scss";

type Props = {
    chat: { [key: string]: any };
    kw: string;
};

const ChatItem: React.FC<Props> = ({ chat: chat, kw: kw }) => {
    const [user, setUser] = useState<{ [key: string]: any }>({});
    const currentUser = useAppSelector((state: RootState) => state.userReducer.currentUser);
    const selectedChat = useAppSelector((state: RootState) => state.messageReducer.selectedChat);
    const nav = useNavigate();
    const dispatch = useAppDispatch();
    const { chatId } = useParams();

    const chatInfo = useDocument({
        _collection: "chat",
        _id: chat.key,
    }).sort((a: { [k: string]: any }, b: { [k: string]: any }) => a.key.localeCompare(b.key));

    console.log({chatInfo});

    useEffect(() => {
        const userInfo = chatInfo[2]?.data[0] !== currentUser._id ? chatInfo[2]?.data[0] : chatInfo[2]?.data[1];
        if (chatInfo.length > 0) {
            fetch(`${ROOT_URL}/user/${userInfo}`).then((res) =>
                res.json().then((json) => {
                    const info = json.data.userInfo;
                    setUser(info);
                }),
            );
        }
    }, [chatInfo]);

    useEffect(() => {
        if (chat.key === chatId) {
            dispatch(
                messageAction.setSelectedChat({
                    selectedChat: chat.key,
                    selectedUser: user as messageState["selectedUser"],
                }),
            );
        }
    }, [user]);

    const selectChatHandler = () => {
        console.log(user);
        dispatch(
            messageAction.setSelectedChat({
                selectedChat: chat.key,
                selectedUser: user as messageState["selectedUser"],
            }),
        );
        nav(`/messages/${chat.key}`);
    };

    if (user && user.username && kw !== "" && !user.username.includes(kw)) {
        return <></>;
    }

    return (
        <>
            {chat && (
                <div
                    className={(selectedChat === chat.key ? "selected " : " ") + "chat-list-item"}
                    key={chat.id}
                    onClick={selectChatHandler}
                >
                    <div className="item-img">
                        <img src={user?.avatar} alt={user?.username}></img>
                    </div>
                    <div className="item-profile">
                        <div className="item-username">{user?.username}</div>
                        <div className="item-msg" style={chat.data.sent ? { color: "#fff", fontWeight: "bold" }: {color: "#ffffffaa"}} >{chatInfo[1]?.data}</div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatItem;
