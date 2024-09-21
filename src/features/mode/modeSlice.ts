import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export type ModeName = "Setting" | "Practice" | "Result";

export interface ModeState {
  /** モード名 */
  name: ModeName;
}

/** 初期値 */
const initialState: ModeState = {
  name: "Setting",
};

/** スライス */
export const modeSlice = createSlice({
  name: "mode",
  initialState: initialState,
  reducers: {
    /** 初期状態にする */
    initialize: (state) => {
      return initialState;
    },
    /** 指定したモードをセットする */
    setMode: (state, action: PayloadAction<ModeName>) => {
      state.name = action.payload;
    },
  },
});

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Actions

export const { initialize, setMode } = modeSlice.actions;

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Selector
export const selectCurrentMode = (state: RootState) => state.mode.name;

export default modeSlice.reducer;
