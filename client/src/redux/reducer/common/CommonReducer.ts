import { createSlice } from "@reduxjs/toolkit";
import * as Types from "src/redux/reducer/common/Types";

const initialState: Types.CommonState = {
    isLoading: false,
    isLoadingBlock: false,
    errorMsg: "",
};
const commonSlice = createSlice({
    name: "common",
    initialState,
    reducers: {
        displayError: (state, action: Types.ActionDisplayError) => {
            const { errorMsg } = action.payload;
            state.errorMsg = errorMsg;
        },
    },
});

export const commonAction = commonSlice.actions;
export default commonSlice.reducer;
