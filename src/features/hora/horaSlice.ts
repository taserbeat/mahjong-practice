import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HoraAmountInfo } from "../../mahojong/hora";
import { RootState } from "../../app/store";

/** 和了結果 */
interface HoraResult {
  /** 和了情報 */
  info: HoraAmountInfo | null;

  isKyusyu: boolean;
}

/** 初期値 */
const initialState: HoraResult = {
  info: null,
  isKyusyu: false,
};

/** スライス */
export const horaSlice = createSlice({
  name: "hora",
  initialState: initialState,
  reducers: {
    /** 初期状態にする */
    initializeHoraResult: (state) => initialState,

    /** 和了結果をセットする */
    setHoraResult: (state, action: PayloadAction<HoraAmountInfo>) => {
      return {
        info: action.payload,
        isKyusyu: false,
      };
    },

    /** 九種九牌にする */
    setKyusyu: (state) => {
      return {
        info: null,
        isKyusyu: true,
      };
    },
  },
});

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Actions

export const { initializeHoraResult, setHoraResult, setKyusyu } =
  horaSlice.actions;

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Selector

/** 和了結果を取得する */
export const selectHoraResult = (state: RootState) => state.hora.info;

/** 九種九牌が発生したかどうかを取得する */
export const selectIsKyusyu = (state: RootState) => state.hora.isKyusyu;

export default horaSlice.reducer;
