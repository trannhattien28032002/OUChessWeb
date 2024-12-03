import React, { useState } from "react";
import "src/share/bot/Mode.scss";
import ModeItem from "./Item";
import { useNavigate } from "react-router-dom";

type Props = {
    SetShowDialog: () => void;
};

const Mode: React.FC<Props> = ({ SetShowDialog }) => {
    const [focus, setFocus] = useState<string>("");
    const nav = useNavigate();

    const SetFocusItem = (key: string) => {
        setFocus(key);
        nav(`/bot?mode=${key}`);
    };

    return (
        <>
            <div className="mode__panel">
                <div className="box__line box__line--top"></div>
                <div className="box__line box__line--right"></div>
                <div className="box__line box__line--bottom"></div>
                <div className="box__line box__line--left"></div>
                <div className="mode__header">CHỌN ĐỘ KHÓ</div>
                <div className="mode__selections ">
                    <ModeItem
                        text={"Dễ"}
                        item={"001"}
                        icon={"fa-solid fa-baby-carriage"}
                        color={"#4BAC4F"}
                        focusItem={focus}
                        SetFocus={SetFocusItem}
                    />
                    <ModeItem
                        text={"Trung bình"}
                        item={"002"}
                        icon={"fa-solid fa-robot"}
                        color={"#00BCD4"}
                        focusItem={focus}
                        SetFocus={SetFocusItem}
                    />
                    <ModeItem
                        text={"Khó"}
                        item={"003"}
                        icon={"fa-solid fa-khanda"}
                        color={"#F44336"}
                        focusItem={focus}
                        SetFocus={SetFocusItem}
                    />
                </div>
                <div className="mode__footer">
                    <button onClick={() => SetShowDialog()} className="btn__style btn__close">
                        Huỷ
                    </button>
                </div>
            </div>
        </>
    );
};

export default Mode;
