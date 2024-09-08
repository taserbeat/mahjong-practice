import Hand from "./hand";
import Pai, { RonPai } from "./pai";
import PaiYama from "./paiyama";

/** 状況役を記録する型 */
export type SituationMeta = {
  /** 0: 立直なし  1: 立直  2: ダブル立直 */
  riichi: 0 | 1 | 2;

  /** 一発の場合はtrue */
  isOneShot: boolean;

  /** 槍槓の場合はtrue */
  isChanKan: boolean;

  /** 嶺上開花の場合はtrue */
  isRinShan: boolean;

  /** 0: 海底/河底なし  1: 海底ツモ  2: 河底ロン */
  haitei: 0 | 1 | 2;

  /** 0: 天和/地和なし  1: 天和  2: 地和 */
  tenho: 0 | 1 | 2;
};

/** 状況役の名前 */
export type SituationYakuName =
  | "立直"
  | "ダブル立直"
  | "一発"
  | "海底摸月"
  | "河底撈魚"
  | "嶺上開花"
  | "槍槓"
  | "天和"
  | "地和";

/** 懸賞役の名前 */
export type BonusYakuName = "ドラ" | "赤ドラ" | "裏ドラ";

/** 役の名前 */
export type YakuName = SituationYakuName | BonusYakuName;

/** 和了役 */
export type HorayYaku = {
  /** 役名 */
  name: YakuName;

  /**
   * 飜数(number)または役満を表す'*'(string)
   * ダブル役満は'**'、トリプル役満は'***'のように表す。 */
  numHan: number | string;
};

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// 役の計算

// TODO: function hule(shoupai, rongpai, param){}

/** 状況役の一覧を取得する */
export const getSituationYakus = (meta: SituationMeta): HorayYaku[] => {
  let situationYakus: HorayYaku[] = [];

  if (meta.riichi === 1) situationYakus.push({ name: "立直", numHan: 1 });
  if (meta.riichi === 2) situationYakus.push({ name: "ダブル立直", numHan: 2 });

  if (meta.isOneShot) situationYakus.push({ name: "一発", numHan: 1 });

  if (meta.haitei === 1) situationYakus.push({ name: "海底摸月", numHan: 1 });
  if (meta.haitei === 2) situationYakus.push({ name: "河底撈魚", numHan: 1 });

  if (meta.isRinShan) situationYakus.push({ name: "嶺上開花", numHan: 1 });
  if (meta.isChanKan) situationYakus.push({ name: "槍槓", numHan: 1 });

  if (meta.tenho === 1) situationYakus.push({ name: "天和", numHan: "*" });
  if (meta.tenho === 2) situationYakus.push({ name: "地和", numHan: "*" });

  return situationYakus;
};

/** 懸賞役の一覧を取得する */
export const getBonusYakus = (
  hand: Hand,
  ronPai: Pai | null,
  doraDisplayPais: Pai[],
  backDoraDisplayPais: Pai[]
): HorayYaku[] => {
  // 手牌に和了牌を加え、文字列形式に変換する
  let newHand = hand.clone();
  if (ronPai) newHand.tsumo(ronPai);
  const paiString = newHand.toString();

  let bonusYakus: HorayYaku[] = [];

  const suitStr = paiString.match(/[mpsz][^mpsz,]*/g);

  // パターンマッチで保有するドラの枚数を数える
  let numDora = 0;
  for (let doraDisplayPai of doraDisplayPais) {
    if (!suitStr) continue;
    const doraPai = PaiYama.getDora(doraDisplayPai);
    const regexp = new RegExp(doraPai[1], "g");

    for (let m of suitStr) {
      if (m[0] !== doraPai[0]) continue;
      m = m.replace(/0/, "5");
      let nn = m.match(regexp);
      if (nn) numDora += nn.length;
    }
  }
  if (numDora) bonusYakus.push({ name: "ドラ", numHan: numDora });

  // パターンマッチで保有する赤ドラの枚数を数える
  let numRedDora = 0;
  let nn = paiString.match(/0/g);
  if (nn) numRedDora = nn.length;
  if (numRedDora) bonusYakus.push({ name: "赤ドラ", numHan: numRedDora });

  // パターンマッチで保有する裏ドラの枚数を数える
  let numBackDora = 0;
  for (let backDoraDisplayPai of backDoraDisplayPais || []) {
    if (!suitStr) continue;

    const backDoraPai = PaiYama.getDora(backDoraDisplayPai);
    const regexp = new RegExp(backDoraPai[1], "g");
    for (let m of suitStr) {
      if (m[0] !== backDoraPai[0]) continue;
      m = m.replace(/0/, "5");
      let nn = m.match(regexp);
      if (nn) numBackDora += nn.length;
    }
  }
  if (numBackDora) bonusYakus.push({ name: "裏ドラ", numHan: numBackDora });

  return bonusYakus;
};

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// 和了系の取得

/**
 * 和了系を取得する
 * hand: 手牌
 * ronPai: ロン和了した牌 (ツモ和了の場合はnull)
 * NOTE: ronPaiの型は、今後string | nullにするかもしれない。
 */
export const getHoraType = (hand: Hand, ronPai: RonPai | null): string[][] => {
  // 手牌をコピーする
  const newHand = hand.clone();

  // ロン牌はツモとして手牌に加える
  if (ronPai) {
    const tmpRonPai = ronPai.substring(0, ronPai.length - 1) as Pai;
    newHand.tsumo(tmpRonPai);
  }

  let horaTypes: string[][] = [];

  // 14枚の手牌ではない場合 または 副露直の手牌の場合
  if (!newHand._tsumoPai || newHand._tsumoPai.length > 2) {
    // 和了系ではない
    return horaTypes;
  }

  // ツモ和了の場合は、和了牌に '_' マークを加える
  // また、0 は 5に正規化する
  const horaPai = (ronPai || newHand._tsumoPai + "_").replace(/0/, "5");

  horaTypes = horaTypes
    .concat(_getHoraTypeIppan(newHand, horaPai))
    .concat(_getHoraTypeChiitoi(newHand, horaPai))
    .concat(_getHoraTypeKokushi(newHand, horaPai))
    .concat(_getHoraTypeChuuren(newHand, horaPai));

  return horaTypes;
};

/** 国士無双系の和了形を取得する */
const _getHoraTypeKokushi = (hand: Hand, horaPai: string): string[][] => {
  // 副露ありの場合、国士無双形にならない
  if (hand._fulos.length > 0) return [];

  let mentsuList: string[] = [];
  let numHead = 0;

  const mpsz: ["m", "p", "s", "z"] = ["m", "p", "s", "z"];
  for (let s of mpsz) {
    let menzenPais = hand._menzenPais[s];
    let nn = s === "z" ? [1, 2, 3, 4, 5, 6, 7] : [1, 9];

    for (let n of nn) {
      const numYaochuuPai = menzenPais[n];

      // 么九牌が2枚の場合
      if (numYaochuuPai === 2) {
        let m =
          s + n == horaPai.slice(0, 2)
            ? s + n + n + horaPai[2] + "!"
            : s + n + n;

        // 雀頭は先頭にする
        mentsuList.unshift(m);
        numHead++;
      }
      // 么九牌が1枚の場合
      else if (numYaochuuPai === 1) {
        let m = s + n == horaPai.slice(0, 2) ? s + n + horaPai[2] + "!" : s + n;
        mentsuList.push(m);
      }
      // それ以外は国士無双にならない
      else return [];
    }
  }

  return numHead === 1 ? [mentsuList] : [];
};

/** 七対子系の和了形を取得する */
const _getHoraTypeChiitoi = (hand: Hand, horaPai: string): string[][] => {
  // 副露ありの場合、七対子形にならない
  if (hand._fulos.length > 0) return [];

  let mentsuList: string[] = [];

  // すべての牌が対子になっているかチェックする
  const mpsz: ["m", "p", "s", "z"] = ["m", "p", "s", "z"];
  for (let s of mpsz) {
    let menzenPais = hand._menzenPais[s];
    for (let n = 1; n < menzenPais.length; n++) {
      if (menzenPais[n] === 0) continue;
      if (menzenPais[n] === 2) {
        let m =
          s + n == horaPai.slice(0, 2)
            ? s + n + n + horaPai[2] + "!"
            : s + n + n;
        mentsuList.push(m);
      } else return [];
    }
  }

  return mentsuList.length === 7 ? [mentsuList] : [];
};

/** TODO: 九蓮宝燈系の和了系を取得する */
const _getHoraTypeChuuren = (hand: Hand, horaPai: string): string[][] => {
  // 副露ありの場合、九蓮宝燈にならない
  if (hand._fulos.length > 0) {
    return [];
  }

  // 和了牌の「色」
  // (萬子: "m"、筒子: "p"、索子: "s")
  const horaPaiType = horaPai[0] as "m" | "p" | "s" | "z";

  // 字牌の場合、九蓮宝燈にならない
  if (horaPaiType === "z") {
    return [];
  }

  let mentsu = horaPaiType; // 九蓮宝燈の和了系を格納する変数
  let menzenPaiNums = hand._menzenPais[horaPaiType]; // 対象色の数ごとの枚数リスト (1 ~ 9それぞれが何枚であるか？のリスト)

  // 対象の色の1~9が揃っているかチェックする
  for (let n = 1; n <= 9; n++) {
    // 1~9のいずれか1つでも揃っていない場合は、九蓮宝燈ではない
    if (menzenPaiNums[n] === 0) return [];

    // 1と9は3枚必要
    if ((n === 1 || n === 9) && menzenPaiNums[n] < 3) return [];

    let nStr = n.toString();
    let nPai = nStr === horaPai[1] ? menzenPaiNums[n] - 1 : menzenPaiNums[n];
    for (let i = 0; i < nPai; i++) {
      mentsu += nStr;
    }
  }

  // この時点で手牌が13枚ではない(=文字数が14ではない)場合、九蓮宝燈ではない
  if (mentsu.length !== 14) return [];

  // 和了牌を加える
  mentsu += horaPai.substring(1) + "!";

  return [[mentsu]];
};

/** 一般系(4面子+1雀頭)の和了系を取得する */
const _getHoraTypeIppan = (hand: Hand, horaPai: string): string[][] => {
  let mentsu: string[][] = [];

  const mpsz: ["m", "p", "s", "z"] = ["m", "p", "s", "z"];
  for (let s of mpsz) {
    let menzenPai = hand._menzenPais[s];
    for (let n = 1; n < menzenPai.length; n++) {
      if (menzenPai[n] < 2) continue;
      menzenPai[n] -= 2; // 2枚以上ある牌を雀頭候補として抜き取る

      // 雀頭候補
      const headPai = s + n.toString() + n.toString();

      // 残りの手牌から4面子となる組み合わせをすべて求める
      for (let blocks of _getAllMentsuPattern(hand)) {
        // 雀頭を先頭に差し込む
        blocks.unshift(headPai);

        // 5ブロック以外は和了系ではない
        if (blocks.length !== 5) continue;

        // 和了牌のマークをつける
        mentsu = mentsu.concat(_addMarkToHoraPai(blocks, horaPai));
      }
      menzenPai[n] += 2;
    }
  }

  return mentsu;
};

/** TODO: 雀頭候補を抜き取った12枚の手牌に対して、4面子となる組み合わせをすべて求める */
const _getAllMentsuPattern = (hand: Hand): string[][] => {
  // 萬子・筒子・索子の副露していない牌から、面子の組み合わせをすべて求める
  let suHaiAll: string[][] = [[]]; // 数牌
  const mps: ["m", "p", "s"] = ["m", "p", "s"];

  for (let s of mps) {
    const newMenzen: string[][] = [];
    for (let mm of suHaiAll) {
      // 同色内を面子をすべて求め、今までの結果すべてに追加する
      for (let nn of _getMentsuInColor(s, hand._menzenPais[s])) {
        newMenzen.push(mm.concat(nn));
      }
    }
    suHaiAll = newMenzen;
  }

  // 字牌の面子は刻子しかないので、以下で取得する
  const jiHaiMentsuList: string[] = [];
  for (let n = 1; n <= 7; n++) {
    if (hand._menzenPais.z[n] === 0) continue;

    // 刻子以外がある場合、和了系ではない
    if (hand._menzenPais.z[n] !== 3) return [];

    // 刻子を追加する
    const mentsu = "z" + n + n + n;
    jiHaiMentsuList.push(mentsu);
  }

  // 副露面子内の0を5に正規化する
  const normFulos = hand._fulos.map((m) => m.replace(/0/g, "5"));

  // 萬子・筒子・索子の副露していない和了系すべての後方に、字牌刻子と副露面子を追加する
  const mentsuList = suHaiAll.map((suHai) =>
    suHai.concat(jiHaiMentsuList).concat(normFulos)
  );

  return mentsuList;
};

/** TODO: 同色内の面子を全て求める */
const _getMentsuInColor = (
  s: "m" | "p" | "s",
  menzenSuPais: number[],
  n = 1
): string[][] => {
  if (n > 9) return [[]];

  // 面子をすべて抜き取ったら次の位置に進む
  if (menzenSuPais[n] == 0) return _getMentsuInColor(s, menzenSuPais, n + 1);

  // 順子を抜き取る
  let shuntsu: string[][] = [];
  if (
    n <= 7 &&
    menzenSuPais[n] > 0 &&
    menzenSuPais[n + 1] > 0 &&
    menzenSuPais[n + 2] > 0
  ) {
    menzenSuPais[n]--;
    menzenSuPais[n + 1]--;
    menzenSuPais[n + 2]--;
    shuntsu = _getMentsuInColor(s, menzenSuPais, n);

    menzenSuPais[n]++;
    menzenSuPais[n + 1]++;
    menzenSuPais[n + 2]++;
    for (let s_mianzi of shuntsu) {
      s_mianzi.unshift(s + n + (n + 1) + (n + 2));
    }
  }

  // 刻子を抜き取る
  let kotsu: string[][] = [];
  if (menzenSuPais[n] == 3) {
    menzenSuPais[n] -= 3;
    kotsu = _getMentsuInColor(s, menzenSuPais, n + 1);
    menzenSuPais[n] += 3;
    for (let k_mianzi of kotsu) {
      k_mianzi.unshift(s + n + n + n);
    }
  }

  return shuntsu.concat(kotsu);
};

/** TODO: 和了牌にマークをつける */
function _addMarkToHoraPai(mentsuList: string[], horaPai: string): string[][] {
  const s = horaPai[0];
  const n = horaPai[1];
  const d = horaPai[2];

  const searchHoraPaiRegexp = new RegExp(`^(${s}.*${n})`); // 和了牌を探す正規表現
  const replacer = `$1${d}!`; // マークをつける置換文字列

  const newMentsuList: string[][] = []; // 和了牌マークをつけた後の面子表現のリスト

  for (let i = 0; i < mentsuList.length; i++) {
    // 副露面子は対象外
    if (mentsuList[i].match(/[\+\=\-]|\d{4}/)) continue;

    // 重複して処理しない
    if (i > 0 && mentsuList[i] == mentsuList[i - 1]) continue;

    // 置換を試みる
    const mentsu = mentsuList[i].replace(searchHoraPaiRegexp, replacer);

    // 置換ができなければ次へ
    if (mentsu == mentsuList[i]) continue;

    // 和了系を複製する
    let tmpMentsuList = mentsuList.concat();

    // マークした面子と置き換える
    tmpMentsuList[i] = mentsu;

    // 結果に追加する
    newMentsuList.push(tmpMentsuList);
  }

  return newMentsuList;
}
