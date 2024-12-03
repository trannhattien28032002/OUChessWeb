import React, { useState } from "react";

type Props = {
    text: string;
    item: string;
    icon?: string;
    color?: string;
    focusItem: string;
    SetFocus: (key: string) => void;
};

const ModeItem: React.FC<Props> = ({ text, item, icon, color, focusItem, SetFocus }) => {
    const [isHover, setHover] = useState<boolean>(false);

    const boxStyle = {
        background: isHover ? `linear-gradient(45deg, ${color}, #ffffff01)` : "linear-gradient(45deg, #ffffff20, #ffffff01)",
        color: isHover ? `${color}` : "",
    };

    const iconStyle = {
        fontSize: "25px",
        transform: isHover ? "scale(1.5)" : "",

    }

    const fontStyle = {
        padding: isHover ? "5px 0 0 0" : "0",
        transform: isHover ? "scale(1.5)" : "",
    }

    return (
        <>
            <div
                onClick={() => SetFocus(item)}
                style={boxStyle}
                className={`mode__item ${focusItem === item ? `focus__item` : ""}`}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
            >
                <div style={iconStyle}>
                    <i className={icon ? icon : ""}></i>
                </div>
                <div style={fontStyle}>{text}</div>
            </div>
        </>
    );
};

export default ModeItem;
