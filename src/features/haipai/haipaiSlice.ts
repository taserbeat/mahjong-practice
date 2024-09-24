import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Pai from "../../mahojong/pai";
import { RootState } from "../../app/store";

/** 配牌を指定するステート */
type HaipaiState = {
  /** 配牌 */
  haipai: Pai[];

  /** 牌山 (配牌から計算される) */
  paiyama: Pai[];
};

const initialState: HaipaiState = {
  haipai: [],
  paiyama: [
    /* 萬子 */
    "m1",
    "m1",
    "m1",
    "m1",
    "m2",
    "m2",
    "m2",
    "m2",
    "m3",
    "m3",
    "m3",
    "m3",
    "m4",
    "m4",
    "m4",
    "m4",
    "m0",
    "m5",
    "m5",
    "m5",
    "m6",
    "m6",
    "m6",
    "m6",
    "m7",
    "m7",
    "m7",
    "m7",
    "m8",
    "m8",
    "m8",
    "m8",
    "m9",
    "m9",
    "m9",
    "m9",
    /* 筒子 */
    "p1",
    "p1",
    "p1",
    "p1",
    "p2",
    "p2",
    "p2",
    "p2",
    "p3",
    "p3",
    "p3",
    "p3",
    "p4",
    "p4",
    "p4",
    "p4",
    "p0",
    "p5",
    "p5",
    "p5",
    "p6",
    "p6",
    "p6",
    "p6",
    "p7",
    "p7",
    "p7",
    "p7",
    "p8",
    "p8",
    "p8",
    "p8",
    "p9",
    "p9",
    "p9",
    "p9",
    /* 索子 */
    "s1",
    "s1",
    "s1",
    "s1",
    "s2",
    "s2",
    "s2",
    "s2",
    "s3",
    "s3",
    "s3",
    "s3",
    "s4",
    "s4",
    "s4",
    "s4",
    "s0",
    "s5",
    "s5",
    "s5",
    "s6",
    "s6",
    "s6",
    "s6",
    "s7",
    "s7",
    "s7",
    "s7",
    "s8",
    "s8",
    "s8",
    "s8",
    "s9",
    "s9",
    "s9",
    "s9",
    /* 東 */
    "z1",
    "z1",
    "z1",
    "z1",
    /* 南 */
    "z2",
    "z2",
    "z2",
    "z2",
    /* 西 */
    "z3",
    "z3",
    "z3",
    "z3",
    /* 北 */
    "z4",
    "z4",
    "z4",
    "z4",
    /* 白 */
    "z5",
    "z5",
    "z5",
    "z5",
    /* 發 */
    "z6",
    "z6",
    "z6",
    "z6",
    /* 中 */
    "z7",
    "z7",
    "z7",
    "z7",
  ],
};

/** スライス */
export const haipaiSlice = createSlice({
  name: "haipai",
  initialState: initialState,
  reducers: {
    /** 指定配牌を初期化する */
    initializeHaipai: (state) => initialState,

    /** 指定配牌に牌を追加する */
    addHaipai: (state, action: PayloadAction<Pai>) => {
      // 配牌が13枚よりも多くなる場合は追加しない
      if (state.haipai.length >= 13) {
        return;
      }

      // 最初に一致するインデックス番号
      const index = state.paiyama.indexOf(action.payload);
      if (index === -1) {
        // 指定の牌が牌山に残っていない場合は処理しない
        return;
      }

      state.paiyama.splice(index, 1);
      state.haipai = sortHaipai([...state.haipai, action.payload]);
    },

    /** 指定配牌の牌を取り除く */
    removeHaipai: (state, action: PayloadAction<Pai>) => {
      // 最初に一致するインデックス番号
      const index = state.haipai.indexOf(action.payload);
      if (index === -1) {
        // 指定の牌が牌山に残っていない場合は処理しない
        return;
      }

      state.haipai.splice(index, 1);
      state.haipai = sortHaipai(state.haipai);
      state.paiyama = [...state.paiyama, action.payload];
    },
  },
});

/** 配牌の配列をソートする */
const sortHaipai = (haipai: Pai[]) => {
  const newHaipai: Pai[] = [];

  // 数牌のソートインデックス
  // (数牌は赤を考慮したソート順とする)
  const suuhaiSortIndex = ["1", "2", "3", "4", "0", "5", "6", "7", "8", "9"];

  // 萬子
  const manzuPais = haipai.filter((pai) => pai.startsWith("m"));
  for (let i = 0; i < suuhaiSortIndex.length; i++) {
    // 数牌のインデックス
    const sortIndex = suuhaiSortIndex[i];

    // ソートインデックスの順番で配牌の配列に追加する
    manzuPais.forEach((manzuPai) => {
      if (manzuPai[1] === sortIndex) {
        newHaipai.push(manzuPai);
      }
    });
  }

  // 筒子
  const pinzuPais = haipai.filter((pai) => pai.startsWith("p"));
  for (let i = 0; i < suuhaiSortIndex.length; i++) {
    // 数牌のインデックス
    const sortIndex = suuhaiSortIndex[i];

    // ソートインデックスの順番で配牌の配列に追加する
    pinzuPais.forEach((pinzuPai) => {
      if (pinzuPai[1] === sortIndex) {
        newHaipai.push(pinzuPai);
      }
    });
  }

  // 索子
  const sozuPais = haipai.filter((pai) => pai.startsWith("s"));
  for (let i = 0; i < suuhaiSortIndex.length; i++) {
    // 数牌のインデックス
    const sortIndex = suuhaiSortIndex[i];

    // ソートインデックスの順番で配牌の配列に追加する
    sozuPais.forEach((sozuPai) => {
      if (sozuPai[1] === sortIndex) {
        newHaipai.push(sozuPai);
      }
    });
  }

  // 字牌
  const jiPais = haipai.filter((pai) => pai.startsWith("z")).sort();
  jiPais.forEach((jiPai) => {
    newHaipai.push(jiPai);
  });

  return newHaipai;
};

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Actions

export const { initializeHaipai, addHaipai, removeHaipai } =
  haipaiSlice.actions;

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Selector

/** 配牌設定を取得する */
export const selectHaipaiSetting = (state: RootState) =>
  state.haipaiSetting.haipai;

/** 牌山設定を取得する */
export const selectPaiyamaSetting = (state: RootState) =>
  state.haipaiSetting.paiyama;

export default haipaiSlice.reducer;
