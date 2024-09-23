import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HoraAmountInfo } from "../../mahojong/hora";
import { RootState } from "../../app/store";

/** 結果表示用の場況情報 */
type ResultSituationInfo = {
  /** 牌姿の文字列 */
  paisi: string;

  // ドラ表示牌の配列
  doraDisplayPais: string[];

  // 裏ドラ表示牌の配列
  backDoraDisplayPais: string[];
};

/** 和了結果 */
type HoraResult = {
  /** 和了情報 */
  horaInfo: HoraAmountInfo | null;

  /** テンパイしているか？ */
  isTenpai: boolean;

  /** 九種九牌であるか？ */
  isKyusyu: boolean;

  /** 結果表示用の場況情報 */
  situationInfo: ResultSituationInfo;
};

/** 初期値 */
const initialState: HoraResult = {
  horaInfo: null,
  isTenpai: false,
  isKyusyu: false,
  situationInfo: {
    paisi: "",
    doraDisplayPais: [],
    backDoraDisplayPais: [],
  },
};

/** スライス */
export const horaSlice = createSlice({
  name: "hora",
  initialState: initialState,
  reducers: {
    /** ノーテンの結果をセットする */
    setNoTenpaiResult: (
      state,
      action: PayloadAction<ResultSituationInfo | undefined>
    ) => {
      return {
        horaInfo: null,
        isKyusyu: false,
        isTenpai: false,
        situationInfo: {
          paisi: action.payload?.paisi ?? "",
          doraDisplayPais: action.payload?.doraDisplayPais ?? [],
          backDoraDisplayPais: action.payload?.backDoraDisplayPais ?? [],
        },
      };
    },

    /** 和了結果をセットする */
    setHoraResult: (
      state,
      action: PayloadAction<{
        horaInfo: HoraAmountInfo;
        situationInfo: ResultSituationInfo;
      }>
    ) => {
      return {
        horaInfo: action.payload.horaInfo,
        isTenpai: false,
        isKyusyu: false,
        situationInfo: action.payload.situationInfo,
      };
    },

    /** テンパイの結果をセットする */
    setTenpaiResult: (
      state,
      action: PayloadAction<ResultSituationInfo | undefined>
    ) => {
      return {
        horaInfo: null,
        isTenpai: true,
        isKyusyu: false,
        situationInfo: {
          paisi: action.payload?.paisi ?? "",
          doraDisplayPais: action.payload?.doraDisplayPais ?? [],
          backDoraDisplayPais: action.payload?.backDoraDisplayPais ?? [],
        },
      };
    },

    /** 九種九牌の結果をセットする */
    setKyusyuResult: (
      state,
      action: PayloadAction<ResultSituationInfo | undefined>
    ) => {
      return {
        horaInfo: null,
        isTenpai: false,
        isKyusyu: true,
        situationInfo: {
          paisi: action.payload?.paisi ?? "",
          doraDisplayPais: action.payload?.doraDisplayPais ?? [],
          backDoraDisplayPais: action.payload?.backDoraDisplayPais ?? [],
        },
      };
    },
  },
});

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Actions

export const {
  setNoTenpaiResult,
  setHoraResult,
  setTenpaiResult,
  setKyusyuResult,
} = horaSlice.actions;

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Selector

/** 和了結果を取得する */
export const selectHoraResult = (state: RootState) => state.hora;

export default horaSlice.reducer;
