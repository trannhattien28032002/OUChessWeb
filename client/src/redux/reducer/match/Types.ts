import { PayloadAction } from "@reduxjs/toolkit";
import { User } from "src/redux/reducer/user/Types";
import { Room } from "src/util/Socket";
import * as RoomTypes from "src/redux/reducer/room/Types";

export type Match = {
    _id?: string | null;
    whiteId?: User | null;
    blackId?: User | null;
    matchName?: string;
    state?: number | null;
    mode?: string;
}

export type matchState = {
    rooms: Room[];
    match: Match[];
    playerColor?: string;
    joinedRoom?: boolean;
    isLoading?: boolean;
    lastestMatchId?: string | null;
};

export type ActionReqGetMatch = PayloadAction<{}>;
export type ActionResGetMatch = PayloadAction<{
    matches: matchState["match"];
}>;

export type ActionReqPostAddMatch = PayloadAction<{}>;
export type ActionResPostAddMatch = PayloadAction<{
    match: Match;
}>;

export type ActionReqGetMatchById = PayloadAction<{}>;
export type ActionResGetMatchById = PayloadAction<{
    matches: matchState["match"];
}>;

export type ActionReqPutMatchById = PayloadAction<{}>;
export type ActionResPutMatchById = PayloadAction<{
    match: Match;
}>;

export type GetMatchesRequest = PayloadAction<{}>;
export type GetMatchesResponse = PayloadAction<{
    rooms: Room[]
}>

export type MatchDetail = PayloadAction<{
    detail: Room,
    history: RoomTypes.Room["history"],
    mode: number,
    state: number
}>
export type SaveMatch = {
    whiteId: string,
    blackId: string,
    moves: string[],
    state: number,
    mode: number,
};