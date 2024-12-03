import { useEffect, useMemo, useRef, useState } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useAppSelector } from "src/app/hooks";
import { RootState } from "src/app/store";
import uploadImage from "src/config/ImageUpload";
import ChatList from "src/share/message/ChatList";
import MessageService from "src/services/message/MessageService";
import useDocuments from "src/share/firestore/DocumentsHook";
import "src/components/messenger/Messenger.scss";

interface Props {}

const Messenger = (props: Props) => {
    const currentUser = useAppSelector((state: RootState) => state.userReducer.currentUser);
    const selectedChat = useAppSelector((state: RootState) => state.messageReducer.selectedChat);
    const selectedUser = useAppSelector((state: RootState) => state.messageReducer.selectedUser);
    const [message, setMessage] = useState("");
    const [showEmoji, setShowEmoji] = useState(false);
    const [limit, setLimit] = useState<number>(100);
    const ref = useRef(null);

    const _condition = useMemo(() => {
        return {
            fieldName: "chatID",
            operator: "==",
            value: selectedChat,
        };
    }, [selectedChat]);

    const list = useDocuments({
        _collection: "messages",
        _condition: _condition,
        _limit: limit,
        _orderBy: {
            by: "createdAt",
            asc: "asc",
        },
    });

    const emojiHandler = (emoji: any) => {
        setMessage((current) => current + emoji["native"]);
    };

    const firstMessages = async () => {
        if (list.length === 0) {
            const _data = {
                [selectedChat]: {
                    sent: true,
                },
            };
            await MessageService.addWithId("userCharts", selectedUser._id, _data);
        }
    };

    const imageHandler = async (e: any) => {
        await firstMessages();

        const imageUrl = await uploadImage(e.target.files[0], currentUser._id);

        const newMessage = {
            chatID: selectedChat,
            sendID: currentUser._id,
            type: "image",
            content: imageUrl,
        };

        MessageService.add("messages", newMessage);
        MessageService.update("chat", selectedChat, { lastMessage: "Đã gửi một ảnh" });
        MessageService.update("userCharts", selectedUser._id, {
            [selectedChat]: {
                sent: true,
            },
        });
        MessageService.update("userCharts", currentUser._id, {
            [selectedChat]: {
                sent: false,
            },
        });
    };

    const sendMessage = async () => {
        await firstMessages();

        if (message === "") {
            return;
        }

        const newMessage = {
            chatID: selectedChat,
            sendID: currentUser._id,
            type: "text",
            content: message,
        };

        MessageService.add("messages", newMessage);
        MessageService.update("chat", selectedChat, { lastMessage: message });
        MessageService.update("userCharts", selectedUser._id, {
            [selectedChat]: {
                sent: true,
            },
        });
        MessageService.update("userCharts", currentUser._id, {
            [selectedChat]: {
                sent: false,
            },
        });
        setMessage("");
    };

    useEffect(() => {
        if (ref && ref.current) {
            // ref.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [list]);

    return (
        <>
            <div className="chat-container">
                <ChatList />
                <div className="chat-field">
                    {selectedChat !== "" && (
                        <>
                            <div className="chat-header">
                                <div className="header-container">
                                    {selectedUser && selectedUser?.avatar !== "" && (
                                        <img className="header-image" src={selectedUser?.avatar} alt="avatar"></img>
                                    )}
                                    <div className="active">
                                        <p>{selectedUser?.username}</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                    <div className="chat-page">
                        <div className="chat-inbox">
                            <div className="chat-msg">
                                <div className="chat-msg-box">
                                    {list.map((m: any, index: number) => {
                                        return (
                                            <>
                                                {m.sendID !== currentUser._id ? (
                                                    <div className="received-box">
                                                        <div className="received-box-img">
                                                            <img src={selectedUser.avatar} alt="avatar" />
                                                        </div>
                                                        <div className="received-box-msg">
                                                            <div className="received-msg">
                                                                {m.type === "text" && (
                                                                    <div className="received-text">{m.content}</div>
                                                                )}
                                                                {m.type === "image" && (
                                                                    <img
                                                                        className="received-image"
                                                                        alt="anh"
                                                                        src={m.content}
                                                                    />
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div ref={ref} className="sended-box">
                                                        <div className="sended-box-img">
                                                            <img src={currentUser.avatar} alt="avatar" />
                                                        </div>
                                                        <div className="sended-box-msg">
                                                            <div className="sended-msg">
                                                                {m.type === "text" && (
                                                                    <div className="sended-text">{m.content}</div>
                                                                )}
                                                                {m.type === "image" && (
                                                                    <img
                                                                        className="sended-image"
                                                                        alt="anh"
                                                                        src={m.content}
                                                                    />
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {selectedChat !== "" && (
                        <>
                            <div className="chat-footer">
                                <div className="chat-inputs">
                                    <input
                                        type="text"
                                        className="input-msg"
                                        placeholder="Aa..."
                                        value={message}
                                        onChange={(evt) => setMessage(evt.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") sendMessage();
                                        }}
                                    />
                                    <div className="chat-inputs-feature">
                                        <div className="chat-inputs-image">
                                            <input type="file" id="image" onChange={imageHandler}></input>
                                            <label htmlFor="image">
                                                <i className="fa-regular fa-image"></i>
                                            </label>
                                        </div>
                                        <div className="chat-inputs-emoji">
                                            <div
                                                className="emoji-toggle"
                                                onClick={(evt) => {
                                                    evt.stopPropagation();
                                                    setShowEmoji(!showEmoji);
                                                }}
                                            >
                                                <i className="fa-solid fa-icons"></i>
                                            </div>
                                            {showEmoji && (
                                                <div className="emoji-box">
                                                    <Picker
                                                        locale="vi"
                                                        previewPosition="none"
                                                        data={data}
                                                        navPosition="bottom"
                                                        onClickOutside={() => {
                                                            setShowEmoji(false);
                                                        }}
                                                        onEmojiSelect={emojiHandler}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <div className="chat-inputs-text" onClick={sendMessage}>
                                            <i className="fa-solid fa-paper-plane"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default Messenger;
