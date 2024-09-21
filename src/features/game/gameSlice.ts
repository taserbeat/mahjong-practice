import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PracticeGame } from "../../mahojong/practice";
import { defaultRule } from "../../mahojong/rule";
import { RootState } from "../../app/store";

/** 初期値 */
const initialState: PracticeGame = new PracticeGame({
  rule: defaultRule,
  bakaze: 0,
  jikaze: 0,
});

/** スライス */
export const gameSlice = createSlice({
  name: "game",
  initialState: initialState,
  reducers: {
    /** ゲームを設定する */
    setGame: (state, action: PayloadAction<PracticeGame>) => action.payload,
  },
});

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Actions

export const { setGame } = gameSlice.actions;

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Selector

/** ゲームを取得する */
// export const selectGame = (state: RootState) => state.game;

export default gameSlice.reducer;
