import type { Response } from "src/config/Constants";
import { Match, matchState } from "src/redux/reducer/match/Types";
import { CommonState } from "src/redux/reducer/common/Types";

export type ResFetchGetMatch = Response<{
    matches: matchState["match"];
    errorMsg: CommonState["errorMsg"];
}>;

export type ResFetchPostAddMatch = Response<{
    match: Match;
    errorMsg: CommonState["errorMsg"];
}>;

export type ResFetchGetMatchById = Response<{
    matches: matchState["match"];
    errorMsg: CommonState["errorMsg"];
}>

export type ResFetchPutMatchById = Response<{
    match: Match;
    errorMsg: CommonState["errorMsg"];
}>

export type ResFetchPatchSaveMatch = Response<{
    errorMsg: CommonState["errorMsg"];
}>;