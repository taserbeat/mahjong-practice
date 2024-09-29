import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Kaze, PracticeSettings } from "../../mahojong/practice";
import { defaultRule } from "../../mahojong/rule";
import { RootState } from "../../app/store";

/** アプリの設定値 */
type AppSettings = {
  /** 練習の設定 */
  practiceSettings: PracticeSettings;

  /** アシストモードが有効であるか？ */
  isAssistEnabled: boolean;
};

/** 初期値 */
const initialState: AppSettings = {
  practiceSettings: {
    rule: defaultRule,
    bakaze: 0,
    jikaze: 0,
  },
  isAssistEnabled: false,
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
      state.practiceSettings.bakaze = action.payload;
    },

    /** 自風を設定する */
    setJikaze: (state, action: PayloadAction<Kaze>) => {
      state.practiceSettings.jikaze = action.payload;
    },

    /** アシストモードを設定する */
    setIsAssistEnabled: (state, action: PayloadAction<boolean>) => {
      return {
        ...state,
        isAssistEnabled: action.payload,
      };
    },
  },
});

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Actions

export const { initialize, setBakaze, setJikaze, setIsAssistEnabled } =
  settingsSlice.actions;

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Selector

/** 1人麻雀練習機の設定を取得する */
export const selectSettings = (state: RootState) =>
  state.settings.practiceSettings;

/** 場風を取得する */
export const selectBakaze = (state: RootState) =>
  state.settings.practiceSettings.bakaze;

/** 自風を取得する */
export const selectJikaze = (state: RootState) =>
  state.settings.practiceSettings.jikaze;

/** アシストモードが有効であるかを取得する */
export const selectIsAssistEnabled = (state: RootState) =>
  state.settings.isAssistEnabled;

export default settingsSlice.reducer;
