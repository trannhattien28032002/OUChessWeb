import type { Response } from "src/config/Constants";
import { PlayerListState } from "src/redux/reducer/playersList/Types";
import { profileState } from "src/redux/reducer/profile/Types";

export type ResFetchGetProfile = Response<{
    profile: profileState["profile"];
}>;

export type ResFetchGetCommentInfoUser = Response<{
    comments: profileState["comments"];
}>;

export type ResGetListUser = Response<{
    list: PlayerListState["players"];
}>;

export type ResFetchGetMatchesOfUser = Response<{
    matches: profileState["matches"];
}>;
