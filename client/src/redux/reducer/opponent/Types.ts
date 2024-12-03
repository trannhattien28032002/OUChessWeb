import { PayloadAction } from "@reduxjs/toolkit";
import type { Color } from "src/interfaces/gameplay/chess";

export type OpponentState = {
    position: [number, number, number];
    mousePosition: [number, number, number];
    name: string;
    avatar: string;
    color: Color | null;
    status: number;
};

export type ActionSetPosition = PayloadAction<{
    position: OpponentState["position"];
}>;

export type ActionSetMousePosition = PayloadAction<{
    mousePosition: OpponentState["mousePosition"];
}>;

export type ActionSetName = PayloadAction<{
    name: OpponentState["name"];
}>;

export type ActionSetAvatar = PayloadAction<{
    avatar: OpponentState["avatar"];
}>;

export type ActionSetColor = PayloadAction<{
    color: OpponentState["color"];
}>;

export type ActionSetDetail = PayloadAction<{
    name: OpponentState["name"];
    avatar: OpponentState["avatar"];
    color: OpponentState["color"];
    status: OpponentState["status"];
}>;

export type ActionSetStatus = PayloadAction<{
    status: OpponentState["status"];
}>
