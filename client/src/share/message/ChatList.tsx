import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { RootState } from "src/app/store";
import useDocument from "src/share/firestore/DocumentHook";
import ChatItem from "src/share/message/ChatItem";
import "src/components/messenger/Messenger.scss";

interface Props {}

const Chat = (props: Props) => {
    const currentUser = useAppSelector((state: RootState) => state.userReducer.currentUser);
    const [kw, setKw] = useState("");
    const { chatId } = useParams();
    const nav = useNavigate();
    const dispatch = useAppDispatch();

    const listChat = useDocument({
        _collection: "userCharts",
        _id: currentUser._id,
    }).sort((a: { [key: string]: any }, b: { [key: string]: any }) => a.updateAt - b.updateAt);
    // .filter((kw:string) => );

    console.log({ listChat });

    useEffect(() => {
        if (listChat.length > 0)
            if (chatId) {
                for (const c of listChat) {
                    if (chatId === c.key) {
                        console.log("In")
                        return;
                    }
                }
                nav("/messages");
                console.log("not In")
            } else {
                console.log("not ok");
            }
    }, [listChat]);

    return (
        <>
            <div className="chat-list sketchy">
                <div className="chat-list-header">Các cuộc trò truyện</div>
                <div className="chat-list-search">
                    <input
                        type="text"
                        placeholder="Tìm kiếm ..."
                        value={kw}
                        onChange={(evt) => setKw(evt.target.value)}
                    ></input>
                </div>
                <div className="chat-list-items">
                    {listChat.map((c: any) => {
                        return <ChatItem chat={c} key={c.key} kw={kw} />;
                    })}
                </div>
            </div>
        </>
    );
};

export default Chat;
