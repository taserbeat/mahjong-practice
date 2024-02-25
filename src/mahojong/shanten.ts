import Hand from "./hand";
import Pai from "./pai";

/**
 * 各色の面子数、塔子数、孤立牌数をカウントする型
 * { a: [0, 0, 0], b: [0, 0, 0] }の形式で、
 * パターンAの場合、面子数: a[0]、塔子数: a[1]、孤立牌数: a[2]
 * パターンBの場合、面子数: b[0]、塔子数: b[1]、孤立牌数: b[2]
 * */
type ShantenPatternOnColor = {
  a: number[];
  b: number[];
};

/** シャンテン数を計算する */
export const calcNumShanten = (hand: Hand): number => {
  return Math.min(
    calcNumShantenAsNormal(hand),
    calcNumShantenAsKokushi(hand),
    calcNumShantenAsChiitoi(hand)
  );
};

/** 国士無双系のシャンテン数を計算する */
export const calcNumShantenAsKokushi = (hand: Hand): number => {
  // 副露している場合、国士無双にはならない
  if (hand._fulos.length > 0) return Infinity;

  let numYaochu = 0; // 么九牌の種類数
  let numToitsu = 0; // 么九牌の対子数

  const mpsz: ["m", "p", "s", "z"] = ["m", "p", "s", "z"];
  for (let s of mpsz) {
    let menzenPais = hand._menzenPais[s];
    let nn = s === "z" ? [1, 2, 3, 4, 5, 6, 7] : [1, 9];
    for (let n of nn) {
      if (menzenPais[n] >= 1) numYaochu++;
      if (menzenPais[n] >= 2) numToitsu++;
    }
  }

  return numToitsu > 0 ? 12 - numYaochu : 13 - numYaochu;
};

/** 七対子系のシャンテン数を計算する */
export const calcNumShantenAsChiitoi = (hand: Hand): number => {
  // 副露している場合、七対子系にはならない
  if (hand._fulos.length > 0) return Infinity;

  let numToitsu = 0; // 対子の種類数
  let numLonely = 0; // 孤立牌の種類数

  const mpsz: ["m", "p", "s", "z"] = ["m", "p", "s", "z"];
  for (let s of mpsz) {
    let menzenPais = hand._menzenPais[s];
    for (let n = 1; n < menzenPais.length; n++) {
      if (menzenPais[n] >= 2) numToitsu++;
      else if (menzenPais[n] === 1) numLonely++;
    }
  }

  if (numToitsu > 7) numToitsu = 7; // 対子の種類数を補正
  if (numToitsu + numLonely > 7) numLonely = 7 - numToitsu; // 孤立牌の種類数を補正

  return 13 - numToitsu * 2 - numLonely;
};

/** 一般系(4面子1雀頭)のシャンテン数を計算する */
export const calcNumShantenAsNormal = (hand: Hand): number => {
  // 雀頭なしとした場合のシャンテン数を計算する
  let min = _calcShantenAsNormalByHead(hand, false);

  // 可能な雀頭を抜き取り、雀頭ありの場合のシャンテン数を計算する
  const mpsz: ["m", "p", "s", "z"] = ["m", "p", "s", "z"];
  for (let s of mpsz) {
    let bingpai = hand._menzenPais[s];
    for (let n = 1; n < bingpai.length; n++) {
      if (bingpai[n] >= 2) {
        bingpai[n] -= 2;
        let numShanten = _calcShantenAsNormalByHead(hand, true);
        bingpai[n] += 2;
        if (numShanten < min) {
          min = numShanten;
        }
      }
    }
  }

  // 副露直後の牌姿が和了系の場合、テンパイとして扱う
  if (min === -1 && hand._tsumoPai && hand._tsumoPai.length > 2) return 0;

  return min;
};

/** 雀頭の有無を指定してシャンテン数を数える */
const _calcShantenAsNormalByHead = (
  shoupai: Hand,
  hasHead: boolean
): number => {
  // 各色ごとの面子・塔子・孤立牌数をカウントする
  let r = {
    m: _calcMentsuOnColor(shoupai._menzenPais.m), // 萬子
    p: _calcMentsuOnColor(shoupai._menzenPais.p), // 筒子
    s: _calcMentsuOnColor(shoupai._menzenPais.s), // 索子
  };

  // 字牌の面子・塔子・孤立牌数をカウントする
  let z = [0, 0, 0];
  for (let n = 1; n <= 7; n++) {
    if (shoupai._menzenPais.z[n] >= 3) z[0]++; // 面子
    else if (shoupai._menzenPais.z[n] == 2) z[1]++; // 塔子
    else if (shoupai._menzenPais.z[n] == 1) z[2]++; // 孤立牌
  }

  // 副露面子は面子数にカウントする
  let numFulos = shoupai._fulos.length;

  let minNumShanten = 13;

  for (let m of [r.m.a, r.m.b]) {
    for (let p of [r.p.a, r.p.b]) {
      for (let s of [r.s.a, r.s.b]) {
        let x = [numFulos, 0, 0];

        for (let i = 0; i < 3; i++) {
          x[i] += m[i] + p[i] + s[i] + z[i];
        }

        let numShanten = _calcNumShantenAsNormalFormula(
          x[0],
          x[1],
          x[2],
          hasHead
        );
        if (numShanten < minNumShanten) {
          minNumShanten = numShanten;
        }
      }
    }
  }

  return minNumShanten;
};

/**
 * 同色内の面子数、塔子数、孤立牌数をカウントする。
 * 返り値 best は{ a: [0, 0, 0], b: [0, 0, 0] }の形式となる。
 * パターンAの場合、面子数: best.a[0]、塔子数: best.a[1]、孤立牌数: best.a[2]
 * パターンBの場合、面子数: best.b[0]、塔子数: best.b[1]、孤立牌数: best.b[2]
 * */
const _calcMentsuOnColor = (
  paisOnColor: number[],
  n = 1
): ShantenPatternOnColor => {
  // 面子抜き取り後に塔子数、孤立牌数をカウントする
  if (n > 9) return _calcTaatsuPatternOnColor(paisOnColor);

  // 1. 面子を(あえて)とらない
  let best = _calcMentsuOnColor(paisOnColor, n + 1); // 次の位置に進む

  // 2. 順子として面子をとる
  if (
    n <= 7 &&
    paisOnColor[n] > 0 &&
    paisOnColor[n + 1] > 0 &&
    paisOnColor[n + 2] > 0
  ) {
    paisOnColor[n]--;
    paisOnColor[n + 1]--;
    paisOnColor[n + 2]--;

    let r = _calcMentsuOnColor(paisOnColor, n); // 抜き取ったら同じ位置で再試行する
    paisOnColor[n]++;
    paisOnColor[n + 1]++;
    paisOnColor[n + 2]++;

    // パターンA・Bの面子数を1つ増やす
    r.a[0]++;
    r.b[0]++;

    // A・Bともに最良の組み合わせを best とする
    if (r.a[2] < best.a[2] || (r.a[2] === best.a[2] && r.a[1] < best.a[1])) {
      best.a = r.a;
    }

    if (r.b[0] > best.b[0] || (r.b[0] === best.b[0] && r.b[1] > best.b[1])) {
      best.b = r.b;
    }
  }

  // 3. 刻子として面子をとる
  if (paisOnColor[n] >= 3) {
    paisOnColor[n] -= 3;
    let r = _calcMentsuOnColor(paisOnColor, n); // 抜き取ったら同じ位置で再試行する
    paisOnColor[n] += 3;

    // パターンA・Bの面子数を1つ増やす
    r.a[0]++;
    r.b[0]++;

    // A・Bともに最良の組み合わせを best とする
    if (r.a[2] < best.a[2] || (r.a[2] === best.a[2] && r.a[1] < best.a[1])) {
      best.a = r.a;
    }

    if (r.b[0] > best.b[0] || (r.b[0] === best.b[0] && r.b[1] > best.b[1])) {
      best.b = r.b;
    }
  }

  return best;
};

/** 各色の塔子の抜き取り方のパターンを計算する */
const _calcTaatsuPatternOnColor = (
  paisOnColor: number[]
): ShantenPatternOnColor => {
  let numTaatsuGroup = 0; // 現在の塔子グループ牌数
  let sumTaatsu = 0; // 総塔子数
  let sumLonely = 0; // 総孤立牌数

  for (let n = 1; n <= 9; n++) {
    numTaatsuGroup += paisOnColor[n];

    // 現在の塔子グループが終わった場合、塔子数と孤立牌数を計算する
    if (n <= 7 && paisOnColor[n + 1] === 0 && paisOnColor[n + 2] === 0) {
      sumTaatsu += numTaatsuGroup >> 1;
      sumLonely += numTaatsuGroup % 2;
      numTaatsuGroup = 0;
    }
  }
  sumTaatsu += numTaatsuGroup >> 1;
  sumLonely += numTaatsuGroup % 2;

  return { a: [0, sumTaatsu, sumLonely], b: [0, sumTaatsu, sumLonely] };
};

/**
 * 面子数、塔子数、孤立牌の数から一般系(4面子1雀頭)のシャンテン数を計算する公式
 * m: 面子数、d: 塔子数、g: 孤立牌数、hasHead: 雀頭がある場合true
 * */
const _calcNumShantenAsNormalFormula = (
  m: number,
  d: number,
  g: number,
  hasHead: boolean
) => {
  // 必要なブロック数
  let numBlocksToTenpai = hasHead ? 4 : 5;

  // 面子数を補正
  if (m > 4) {
    d += m - 4;
    m = 4;
  }

  // 塔子数を補正
  if (m + d > 4) {
    g += m + d - 4;
    d = 4 - m;
  }

  // 孤立牌を補正
  if (m + d + g > numBlocksToTenpai) {
    g = numBlocksToTenpai - m - d;
  }

  // 雀頭ありの場合、雀頭は塔子として数える
  if (hasHead) d++;

  return 13 - m * 3 - d * 2 - g;
};

/**
 * 手牌に1枚加えるとシャンテン数の進む牌の配列を返す。
 * calculator で指定された関数をシャンテン数計算の際に使用する。
 * 返り値には赤牌は含まない。
 * ツモると多牌になる場合は null を返す。
 */
export const calcImproveShantenPais = (
  hand: Hand,
  calculator = calcNumShanten
): Pai[] | null => {
  // ツモると多牌になる場合はnullを返す
  if (hand._tsumoPai) return null;

  let pais: Pai[] = [];
  let numShanten = calculator(hand);

  const mpsz: ["m", "p", "s", "z"] = ["m", "p", "s", "z"];
  for (let s of mpsz) {
    let sameColorPais = hand._menzenPais[s];

    for (let n = 1; n < sameColorPais.length; n++) {
      // ある牌を4枚持っていた場合、5枚目をツモることはないので計算を省略する
      if (sameColorPais[n] >= 4) continue;

      sameColorPais[n]++;
      if (calculator(hand) < numShanten) {
        const pai = (s + n) as Pai;
        pais.push(pai);
      }

      sameColorPais[n]--;
    }
  }

  return pais;
};
