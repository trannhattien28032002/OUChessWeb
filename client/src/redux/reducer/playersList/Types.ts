import { PayloadAction } from "@reduxjs/toolkit";
import { Profile } from "src/redux/reducer/profile/Types";

export type PlayerListState = {
    players: Profile[];
    isLoadding: boolean;
    notify: {
        msg: string;
        type: string;
    };
};

export type ActionReqGetListUser = PayloadAction<{}>;
export type ActionResGetListUser = PayloadAction<{
    list: PlayerListState["players"];
}>;

export type ActionReqSetNotify = PayloadAction<{
    notify: PlayerListState["notify"];
}>