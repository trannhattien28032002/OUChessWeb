import { PayloadAction } from "@reduxjs/toolkit";

export type CommonState = {
    isLoading: boolean;
    isLoadingBlock: boolean;
    errorMsg: string;
};

export type ActionDisplayError = PayloadAction<{
    errorMsg: CommonState["errorMsg"];
}>;
