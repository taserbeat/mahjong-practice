import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Kaze, PracticeSettings } from "../../mahojong/practice";
import { defaultRule } from "../../mahojong/rule";
import { RootState } from "../../app/store";

/** 初期値 */
const initialState: PracticeSettings = {
  rule: defaultRule,
  bakaze: 0,
  jikaze: 0,
};

/** スライス */
export const settingsSlice = createSlice({
  name: "settings",
  initialState: initialState,
  reducers: {
    /** 初期状態にする */
    initialize: (state) => initialState,

    /** 場風を設定する */
    setBakaze: (state, action: PayloadAction<Kaze>) => {
      state.bakaze = action.payload;
    },

    /** 自風を設定する */
    setJikaze: (state, action: PayloadAction<Kaze>) => {
      state.jikaze = action.payload;
    },
  },
});

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Actions
export const { initialize, setBakaze, setJikaze } = settingsSlice.actions;

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Selector

/** 1人麻雀練習機の設定を取得する */
export const selectSettings = (state: RootState) => state.settings;

/** 場風を取得する */
export const selectBakaze = (state: RootState) => state.settings.bakaze;

/** 自風を取得する */
export const selectJikaze = (state: RootState) => state.settings.jikaze;

export default settingsSlice.reducer;
