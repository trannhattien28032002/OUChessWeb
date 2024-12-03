import { PayloadAction } from "@reduxjs/toolkit";
import { Match } from "src/redux/reducer/match/Types";

export type Friend = {
    requester: Profile,
    recipient: Profile,
    status: number
}

export type Profile = {
    _id?: string,
    username: string,
    firstName?: string,
    lastName?: string,
    avatar: string,
    friends?: Friend[],
    elo?: number,
    nation?: string
    createdAt?: Date,
    role?: string
    dateOfBirth?: Date
}

export type CommentInfo = {
    content: string,
    receiver: Profile,
    sender: Profile
}

export type profileState = {
    profile: Profile;
    comments: CommentInfo[];
    matches: Match[];
    isLoading: boolean;
}

export type ActionReqGetProfile = PayloadAction<{}>
export type ActionResGetProfile = PayloadAction<{
    profile: profileState["profile"]
}>

export type ActionPostAddCommentInfo = PayloadAction<{
    comment: CommentInfo
}>
export type ActionReqGetCommentInfoesUser = PayloadAction<{}>
export type ActionResGetCommentInfoesUser = PayloadAction<{
    comments: profileState["comments"]
}>

export type ActionReqGetMatchesOfUser = PayloadAction<{}>
export type ActionResGetMatchesOfUser = PayloadAction<{
    matches: Match[];
}>
