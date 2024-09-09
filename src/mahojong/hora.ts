import Hand from "./hand";
import Pai, { RonPai } from "./pai";
import PaiYama from "./paiyama";
import { Rule, ruleForTest } from "./rule";

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

/** 和了役の名前 */
export type HoraYakuName =
  /* 1飜 */
  | "門前清自摸和"
  | "平和"
  | "断幺九"
  | "一盃口"
  // 役牌
  | "場風 東"
  | "場風 南"
  | "場風 西"
  | "場風 北"
  | "自風 東"
  | "自風 南"
  | "自風 西"
  | "自風 北"
  | "翻牌 白"
  | "翻牌 發"
  | "翻牌 中"
  /* 2飜 */
  | "三色同順"
  | "一気通貫"
  | "混全帯幺九"
  | "七対子"
  | "対々和"
  | "三暗刻"
  | "三槓子"
  | "三色同刻"
  | "混老頭"
  | "小三元"
  /* 3飜 */
  | "混一色"
  | "純全帯幺九"
  | "二盃口"
  /* 6飜 */
  | "清一色"
  /* 役満 */
  | "国士無双"
  | "国士無双十三面"
  | "四暗刻"
  | "四暗刻単騎"
  | "大三元"
  | "大四喜"
  | "小四喜"
  | "字一色"
  | "緑一色"
  | "清老頭"
  | "四槓子"
  | "純正九蓮宝燈"
  | "九蓮宝燈";

/** 役の名前 */
export type YakuName = SituationYakuName | BonusYakuName | HoraYakuName;

/** 和了役 */
export type HoraYakuInfo = {
  /** 役名 */
  name: YakuName;

  /**
   * 飜数(number)または役満を表す'*'(string)
   * ダブル役満は'**'、トリプル役満は'***'のように表す。 */
  numHan: number | string;

  /**
   * パオの対象者 (パオがある場合のみ)
   * 下家: +
   * 対面: =
   * 上家: -
   */
  paoTarget?: "+" | "=" | "-";
};

/** 面子構成情報 */
export type MentsuComposition = {
  /** 符 */
  hu: number;

  /** 門前フラグ (門前の場合は true ) */
  isMenzen: boolean;

  /** ツモ和了フラグ (ツモ和了の場合は true) */
  isTsumoHora: boolean;

  /** 順子の構成情報 */
  shuntsu: {
    m: number[];
    p: number[];
    s: number[];
  };

  /** 刻子の構成情報 */
  kootsu: {
    m: number[];
    p: number[];
    s: number[];
    z: number[];
  };

  /** 順子の数 */
  numShuntsu: number;

  /** 刻子の数 */
  numKootsu: number;

  /** 暗刻の数 */
  numAnko: number;

  /** 槓子の数 */
  numKantsu: number;

  /** 么九牌を含むブロックの数 */
  numYaochuBlock: number;

  /** 字牌を含むブロックの数 */
  numJihaiBlock: number;

  /** 単騎待ちのフラグ (単騎待ちの場合は true ) */
  isTanki: boolean;

  /** 平和フラグ (平和の場合は true ) */
  isPinhu: boolean;

  /** 場風 (0: 東、1: 南、2: 西、3: 北) */
  bakaze: 0 | 1 | 2 | 3;

  /** 自風 (0: 東、1: 南、2: 西、3: 北) */
  jikaze: 0 | 1 | 2 | 3;
};

/** 場況情報 */
export type SituationParam = {
  /** ルール */
  rule: Rule;

  /** 場風 (0: 東、1: 南、2: 西、3: 北) */
  bakaze: 0 | 1 | 2 | 3;

  /** 自風 (0: 東、1: 南、2: 西、3: 北) */
  jikaze: 0 | 1 | 2 | 3;

  /** 状況役 */
  situationMeta: SituationMeta;

  /** ドラ表示牌の配列 */
  baopai: Pai[];

  /** 裏ドラ表示牌の配列 (立直がない場合はnull) */
  fubaopai: Pai[] | null;

  /** 供託 */
  kyotaku: {
    /** 積み棒の本数 */
    numTsumibou: number;

    /** 立直棒の数 */
    numRiichiBou: number;
  };
};

/** 和了点数の情報 */
export type HoraAmountInfo = {
  /** 和了役一覧 */
  horaYakuInfos?: HoraYakuInfo[];

  /** 和了の符 (役満の場合はundefined) */
  hu?: number;

  /** 飜数 (役満の場合はundefined) */
  numHan?: number;

  /** 役満複合数 (役満ではない場合はundefined) */
  numCompositeYakuman?: number;

  /** 和了点 (供託収入は含まない) */
  horaPoint: number;

  /**
   * 局収支 (供託も含めたその局の点数の収支)
   * その局の東家→南家→西家→北家の順に並ぶ。
   * 立直宣言による1000点減は収支に含まれない
   */
  incomes?: number[];
};

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// 和了点の計算

/** 和了の点数計算を行う */
export const hora = (
  hand: Hand,
  ronPai: RonPai | null,
  param: SituationParam
): HoraAmountInfo | undefined => {
  let ronPaiToBonusYaku: Pai | null = null; // getBonusYakus関数に渡す変数

  // ロン和了の場合
  if (ronPai) {
    // 不正なロン牌の場合
    if (!ronPai.match(/[\+\=\-]$/))
      throw new Error(`ロン牌が不正です。: ${ronPai}`);

    // ロン牌を示す文字を組み立て直す (不要だと思われる処理はコメントアウト)
    // ronPai = (ronPai.slice(0, 2) + ronPai.slice(-1)) as RonPai | null;
    ronPaiToBonusYaku = (ronPai[0] + ronPai[1]) as Pai | null;
  }

  let max;

  const situationYakus = getSituationYakus(param.situationMeta);

  const bonusYakus = getBonusYakus(
    hand,
    ronPaiToBonusYaku,
    param.baopai,
    param.fubaopai
  );

  for (let mentsuList of getHoraType(hand, ronPai)) {
    let composition = getMentsuComposition(
      mentsuList,
      param.bakaze,
      param.jikaze,
      param.rule
    );

    const horaYakuInfos = getHoraYakus(
      mentsuList,
      composition,
      situationYakus,
      bonusYakus,
      param.rule
    );

    const rv = calcHoraPoint(composition.hu, horaYakuInfos, ronPai, param);

    if (
      !max ||
      rv.horaPoint > max.horaPoint ||
      (rv.horaPoint === max.horaPoint &&
        (!rv.numHan ||
          (max.numHan !== undefined && rv.numHan > max.numHan) ||
          (rv.numHan === max.numHan && rv.hu && max.hu && rv.hu > max.hu)))
    )
      max = rv;
  }

  return max;
};

/** 和了点数を計算する */
const calcHoraPoint = (
  hu: number,
  horaYakuInfos: HoraYakuInfo[],
  rongpai: RonPai | null,
  param: SituationParam
): HoraAmountInfo => {
  // 役無しの場合、打点0を返す
  if (horaYakuInfos.length === 0) {
    return { horaPoint: 0 };
  }

  const jikaze = param.jikaze; // 自風
  let horaHu: number | undefined = hu; // 和了の符
  let numHan: number | undefined = undefined; // 飜数 (役満の場合はundefined)
  let numYakuman: number | undefined = undefined; // 役満複合数 (役満ではない場合はundefined)
  let payBaseOfRoned = 0; // 放銃者が負担する基本点
  let payBaseOfPao = 0; // パオ責任者が負担する基本点
  let payAmountByPayer: number = 0; // 支払者が支払う点数
  let payAmountByPao: number = 0; // パオ責任者が支払う点数
  let payer: number; // 支払者
  let paoTarget: number | null = null; // パオ対象者 (存在しない場合はnull)

  const horaYakuInfoAtPao = horaYakuInfos.find((h) => h.paoTarget);

  /* 基本点を算出する */

  if (typeof horaYakuInfos[0].numHan === "string") {
    // 役満の場合

    horaHu = undefined; // 符は無し

    const numHanHoraYakumans: string[] = horaYakuInfos
      .filter((h) => typeof h.numHan === "string")
      .map((h) => h.numHan) as string[];

    // 役満複合数を決定する
    // 役満の複合無しの場合は固定で1となる
    numYakuman = !param.rule["役満の複合あり"]
      ? 1
      : numHanHoraYakumans.map((h) => h.length).reduce((x, y) => x + y);

    // 基本点 = 8000 * 役満複合数
    payBaseOfRoned = 8000 * numYakuman;

    // パオ責任者がいる場合は、責任対象の基本点を算出する
    // (大四喜と大三元は同時に成立しないので、対象の役満は1つ)
    if (horaYakuInfoAtPao?.paoTarget !== undefined) {
      // パオ責任者
      paoTarget =
        (jikaze + { "+": 1, "=": 2, "-": 3 }[horaYakuInfoAtPao.paoTarget]) % 4;

      // 基本点 = 8000 * 責任対象の役満複合数
      const yakumanHan: string = horaYakuInfoAtPao.numHan as string;
      payBaseOfPao = 8000 * Math.min(yakumanHan.length, numYakuman);
    }
  } else {
    /* 通常役の場合 */

    const numHanHoraNormals: number[] = horaYakuInfos
      .filter((h) => typeof h.numHan === "number")
      .map((h) => h.numHan) as number[];

    // 役ごとの飜数の総和を和了の飜数とする
    numHan = numHanHoraNormals.map((h) => h).reduce((x, y) => x + y);

    payBaseOfRoned =
      numHan >= 13 && param.rule["数え役満あり"]
        ? 8000 // 数え役満
        : numHan >= 11
        ? 6000 // 三倍満
        : numHan >= 8
        ? 4000 // 倍満
        : numHan >= 6
        ? 3000 // 跳満
        : param.rule["切り上げ満貫あり"] && hu << (2 + numHan) === 1920
        ? 2000 // 切り上げ満貫
        : Math.min(hu << (2 + numHan), 2000); // それ以外は2000点を上限とする
  }

  let fenpei = [0, 0, 0, 0];
  let chang = param.kyotaku.numTsumibou;
  let lizhi = param.kyotaku.numRiichiBou;

  if (paoTarget !== null) {
    // パオ責任者がいる場合、パオ分について精算する

    // ロン和了は放銃者とパオ責任者とで折半
    if (rongpai) {
      payBaseOfPao = payBaseOfPao / 2;
    }

    // 放銃者が負担する基本点を決定する
    payBaseOfRoned = payBaseOfRoned - payBaseOfPao;

    // パオ責任者が負担する点を決定する
    payAmountByPao = payBaseOfPao * (jikaze === 0 ? 6 : 4);

    // 和了者の収支 = +負担点
    fenpei[jikaze] += payAmountByPao;

    // パオ責任者の収支 = -負担点
    fenpei[paoTarget] -= payAmountByPao;
  } else {
    // パオ責任者がいない場合、パオ分の点数は0となる
    payAmountByPao = 0;
  }

  /* パオ分以外について和了点を計算する */

  if (rongpai) {
    // ロン和了の場合

    // 支払者を決定する
    const ronedPlayer: "+" | "=" | "-" = rongpai[2] as "+" | "=" | "-";
    payer = (jikaze + { "+": 1, "=": 2, "-": 3 }[ronedPlayer]) % 4;

    // 支払者の負担額を決定する
    payAmountByPayer =
      Math.ceil((payBaseOfRoned * (jikaze === 0 ? 6 : 4)) / 100) * 100;

    // 供託棒・積み棒も含め精算する
    fenpei[jikaze] += payAmountByPayer + chang * 300 + lizhi * 1000; // 和了者の収支 = 負担額 + 積み棒　* 300 + 立直棒
    fenpei[payer] -= payAmountByPayer + chang * 300; // 支払者の負担 = -(負担額 + 積み棒 * 300)
  } else if (payBaseOfRoned === 0) {
    // パオ責任者の一人払いの場合

    // 支払者を決定する (パオ責任者か放銃者か？)
    payer = paoTarget as number;

    // 支払者の負担額を決定する
    payAmountByPayer =
      Math.ceil((payBaseOfRoned * (jikaze === 0 ? 6 : 4)) / 100) * 100;

    // 供託棒・積み棒も含め精算する
    fenpei[jikaze] += payAmountByPayer + chang * 300 + lizhi * 1000; // 和了者の収支 = 負担額 + 積み棒　* 300 + 立直棒
    fenpei[payer] -= payAmountByPayer + chang * 300; // 支払者の負担 = -(負担額 + 積み棒 * 300)
  } else {
    // ツモ和了の場合
    let payParent = Math.ceil((payBaseOfRoned * 2) / 100) * 100; // 親の負担額
    let payChild = Math.ceil(payBaseOfRoned / 100) * 100; // 子の負担額

    if (jikaze === 0) {
      // 親の和了の場合
      payAmountByPayer = payParent * 3; // 和了点 = 親の負担額 * 3

      for (let l = 0; l < 4; l++) {
        if (l === jikaze) {
          // 和了者の収支 = 和了点 + 積み棒 * 300 + 立直棒
          fenpei[l] += payAmountByPayer + chang * 300 + lizhi * 1000;
        } else {
          // 支払者の収支 = -(負担額 + 積み棒 * 100)
          fenpei[l] -= payParent + chang * 100;
        }
      }
    } else {
      // 子の和了の場合
      payAmountByPayer = payParent + payChild * 2; // 和了点 = 親の負担額 + 子の負担額 * 2

      for (let l = 0; l < 4; l++) {
        if (l == jikaze) {
          // 和了者の収支 = 和了点 + 積み棒 * 300 + 立直棒
          fenpei[l] += payAmountByPayer + chang * 300 + lizhi * 1000;
        } else if (l === 0) {
          // 支払い者(親)の収支 = -(親の負担額 + 積み棒 * 100)
          fenpei[l] -= payParent + chang * 100;
        } else {
          // 支払い者(子)の収支 = -(子の負担額 + 積み棒 * 100)
          fenpei[l] -= payChild + chang * 100;
        }
      }
    }
  }

  return {
    /** 和了役一覧 */
    horaYakuInfos: horaYakuInfos,

    /** 和了の符 (役満の場合はundefined) */
    hu: horaHu,

    /** 飜数 (役満の場合はundefined) */
    numHan: numHan,

    /** 役満複合数 (役満ではない場合はundefined) */
    numCompositeYakuman: numYakuman,

    /** 和了点 (供託収入は含まない) */
    horaPoint: payAmountByPayer + payAmountByPao,

    /**
     * 局収支 (供託も含めたその局の点数の収支)
     * その局の東家→南家→西家→北家の順に並ぶ。
     * 立直宣言による1000点減は収支に含まれない
     */
    incomes: fenpei,
  };
};

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// 和了役の判定

/** 状況役の一覧を取得する */
export const getSituationYakus = (meta: SituationMeta): HoraYakuInfo[] => {
  let situationYakus: HoraYakuInfo[] = [];

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
  backDoraDisplayPais: Pai[] | null
): HoraYakuInfo[] => {
  // 手牌に和了牌を加え、文字列形式に変換する
  let newHand = hand.clone();
  if (ronPai) newHand.tsumo(ronPai);
  const paiString = newHand.toPaishi();

  let bonusYakus: HoraYakuInfo[] = [];

  const suitStr = paiString.match(/[mpsz][^mpsz,]*/g);

  // パターンマッチで保有するドラの枚数を数える
  let numDora = 0;
  for (let doraDisplayPai of doraDisplayPais) {
    if (suitStr === null) continue;
    const doraPai = PaiYama.getDora(doraDisplayPai);
    const regexp = new RegExp(doraPai[1], "g");

    for (let m of suitStr) {
      if (m[0] !== doraPai[0]) continue;
      m = m.replace(/0/, "5");
      let nn = m.match(regexp);
      if (nn !== null) {
        numDora += nn.length;
      }
    }
  }
  if (numDora > 0) bonusYakus.push({ name: "ドラ", numHan: numDora });

  // パターンマッチで保有する赤ドラの枚数を数える
  let numRedDora = 0;
  let nn = paiString.match(/0/g);
  if (nn) numRedDora = nn.length;
  if (numRedDora > 0) bonusYakus.push({ name: "赤ドラ", numHan: numRedDora });

  // パターンマッチで保有する裏ドラの枚数を数える
  let numBackDora = 0;
  for (let backDoraDisplayPai of backDoraDisplayPais || []) {
    if (suitStr === null) continue;

    const backDoraPai = PaiYama.getDora(backDoraDisplayPai);
    const regexp = new RegExp(backDoraPai[1], "g");
    for (let m of suitStr) {
      if (m[0] !== backDoraPai[0]) continue;
      m = m.replace(/0/, "5");
      let nn = m.match(regexp);
      if (nn) numBackDora += nn.length;
    }
  }
  if (numBackDora > 0) bonusYakus.push({ name: "裏ドラ", numHan: numBackDora });

  return bonusYakus;
};

/** 和了役の一覧を取得するする */
export const getHoraYakus = (
  mianzi: string[],
  composition: MentsuComposition,
  situationYakus: HoraYakuInfo[],
  post_hupai: HoraYakuInfo[],
  rule: Rule
): HoraYakuInfo[] => {
  /** 門前清自摸和 */
  function menqianqing(): HoraYakuInfo[] {
    if (composition.isMenzen && composition.isTsumoHora)
      return [{ name: "門前清自摸和", numHan: 1 }];
    return [];
  }

  /** 役牌 */
  function fanpai(): HoraYakuInfo[] {
    let kazeList: ["東", "南", "西", "北"] = ["東", "南", "西", "北"];
    let yakuhaiAll: HoraYakuInfo[] = [];

    const bakaze = kazeList[composition.bakaze];

    // 場風
    if (composition.kootsu.z[composition.bakaze + 1]) {
      switch (bakaze) {
        case "東":
          yakuhaiAll.push({ name: "場風 東", numHan: 1 });
          break;

        case "南":
          yakuhaiAll.push({ name: "場風 南", numHan: 1 });
          break;

        case "西":
          yakuhaiAll.push({ name: "場風 西", numHan: 1 });
          break;

        case "北":
          yakuhaiAll.push({ name: "場風 北", numHan: 1 });
          break;
      }
    }

    const jikaze = kazeList[composition.jikaze];

    // 自風
    if (composition.kootsu.z[composition.jikaze + 1]) {
      switch (jikaze) {
        case "東":
          yakuhaiAll.push({ name: "自風 東", numHan: 1 });
          break;

        case "南":
          yakuhaiAll.push({ name: "自風 南", numHan: 1 });
          break;

        case "西":
          yakuhaiAll.push({ name: "自風 西", numHan: 1 });
          break;

        case "北":
          yakuhaiAll.push({ name: "自風 北", numHan: 1 });
          break;
      }
    }

    // 白
    if (composition.kootsu.z[5]) {
      yakuhaiAll.push({ name: "翻牌 白", numHan: 1 });
    }

    // 發
    if (composition.kootsu.z[6]) {
      yakuhaiAll.push({ name: "翻牌 發", numHan: 1 });
    }

    // 中
    if (composition.kootsu.z[7]) {
      yakuhaiAll.push({ name: "翻牌 中", numHan: 1 });
    }

    return yakuhaiAll;
  }

  /** 平和 */
  function pinghu(): HoraYakuInfo[] {
    if (composition.isPinhu) return [{ name: "平和", numHan: 1 }];
    return [];
  }

  /** 断么九 (タンヤオ) */
  function duanyaojiu(): HoraYakuInfo[] {
    if (composition.numYaochuBlock > 0) return [];

    if (rule["クイタンあり"] || composition.isMenzen)
      return [{ name: "断幺九", numHan: 1 }];
    return [];
  }

  /** 一盃口 */
  function yibeikou(): HoraYakuInfo[] {
    if (!composition.isMenzen) return [];

    const shuntsu = composition.shuntsu;

    let beikou = shuntsu.m
      .concat(shuntsu.p)
      .concat(shuntsu.s)
      .map((x) => x >> 1)
      .reduce((a, b) => a + b);

    if (beikou === 1) {
      return [{ name: "一盃口", numHan: 1 }];
    }

    return [];
  }

  /** 三色同順 */
  function sansetongshun(): HoraYakuInfo[] {
    const shuntsu = composition.shuntsu;

    for (let n = 1; n <= 7; n++) {
      if (shuntsu.m[n] && shuntsu.p[n] && shuntsu.s[n])
        return [{ name: "三色同順", numHan: composition.isMenzen ? 2 : 1 }];
    }
    return [];
  }

  /** 一気通貫 */
  function yiqitongguan(): HoraYakuInfo[] {
    const shuntsu = composition.shuntsu;

    const mps: ["m", "p", "s"] = ["m", "p", "s"];

    for (let s of mps) {
      if (shuntsu[s][1] && shuntsu[s][4] && shuntsu[s][7])
        return [{ name: "一気通貫", numHan: composition.isMenzen ? 2 : 1 }];
    }
    return [];
  }

  /** 混全帯幺九 (チャンタ) */
  function hunquandaiyaojiu(): HoraYakuInfo[] {
    if (
      composition.numYaochuBlock === 5 &&
      composition.numShuntsu > 0 &&
      composition.numJihaiBlock > 0
    )
      return [{ name: "混全帯幺九", numHan: composition.isMenzen ? 2 : 1 }];
    return [];
  }

  /** 七対子 */
  function qiduizi(): HoraYakuInfo[] {
    if (mianzi.length === 7) return [{ name: "七対子", numHan: 2 }];
    return [];
  }

  /** 対々和 */
  function duiduihu(): HoraYakuInfo[] {
    if (composition.numKootsu === 4) return [{ name: "対々和", numHan: 2 }];
    return [];
  }

  /** 三暗刻 */
  function sananke(): HoraYakuInfo[] {
    if (composition.numAnko === 3) return [{ name: "三暗刻", numHan: 2 }];
    return [];
  }

  /** 三槓子 */
  function sangangzi(): HoraYakuInfo[] {
    if (composition.numKantsu === 3) return [{ name: "三槓子", numHan: 2 }];
    return [];
  }

  /** 三色同刻 */
  function sansetongke(): HoraYakuInfo[] {
    const kootsu = composition.kootsu;
    for (let n = 1; n <= 9; n++) {
      if (kootsu.m[n] && kootsu.p[n] && kootsu.s[n])
        return [{ name: "三色同刻", numHan: 2 }];
    }
    return [];
  }

  /** 混老頭 */
  function hunlaotou(): HoraYakuInfo[] {
    if (
      composition.numYaochuBlock === mianzi.length &&
      composition.numShuntsu === 0 &&
      composition.numJihaiBlock > 0
    )
      return [{ name: "混老頭", numHan: 2 }];
    return [];
  }

  /** 小三元 */
  function xiaosanyuan(): HoraYakuInfo[] {
    const kootsu = composition.kootsu;
    if (
      kootsu.z[5] + kootsu.z[6] + kootsu.z[7] === 2 &&
      mianzi[0].match(/^z[567]/)
    )
      return [{ name: "小三元", numHan: 2 }];
    return [];
  }

  /** 混一色 */
  function hunyise(): HoraYakuInfo[] {
    const mps: ["m", "p", "s"] = ["m", "p", "s"];

    for (let s of mps) {
      const yise = new RegExp(`^[z${s}]`);

      if (
        mianzi.filter((m) => m.match(yise)).length == mianzi.length &&
        composition.numJihaiBlock > 0
      )
        return [{ name: "混一色", numHan: composition.isMenzen ? 3 : 2 }];
    }
    return [];
  }

  /** 純全帯幺九 (純チャン) */
  function chunquandaiyaojiu(): HoraYakuInfo[] {
    if (
      composition.numYaochuBlock === 5 &&
      composition.numShuntsu > 0 &&
      composition.numJihaiBlock === 0
    )
      return [{ name: "純全帯幺九", numHan: composition.isMenzen ? 3 : 2 }];
    return [];
  }

  /** 二盃口 */
  function erbeikou(): HoraYakuInfo[] {
    if (!composition.isMenzen) return [];

    const shuntsu = composition.shuntsu;

    let beikou = shuntsu.m
      .concat(shuntsu.p)
      .concat(shuntsu.s)
      .map((x) => x >> 1)
      .reduce((a, b) => a + b);

    if (beikou === 2) return [{ name: "二盃口", numHan: 3 }];
    return [];
  }

  /** 清一色 */
  function qingyise(): HoraYakuInfo[] {
    const mps: ["m", "p", "s"] = ["m", "p", "s"];

    for (let s of mps) {
      const yise = new RegExp(`^[${s}]`);
      if (mianzi.filter((m) => m.match(yise)).length == mianzi.length)
        return [{ name: "清一色", numHan: composition.isMenzen ? 6 : 5 }];
    }
    return [];
  }

  /** 国士無双 */
  function guoshiwushuang(): HoraYakuInfo[] {
    if (mianzi.length !== 13) return [];

    if (composition.isTanki) return [{ name: "国士無双十三面", numHan: "**" }];
    else return [{ name: "国士無双", numHan: "*" }];
  }

  /** 四暗刻 */
  function sianke(): HoraYakuInfo[] {
    if (composition.numAnko !== 4) return [];
    if (composition.isTanki) return [{ name: "四暗刻単騎", numHan: "**" }];
    else return [{ name: "四暗刻", numHan: "*" }];
  }

  /** 大三元 */
  function dasanyuan(): HoraYakuInfo[] {
    const kootsu = composition.kootsu;

    if (kootsu.z[5] + kootsu.z[6] + kootsu.z[7] === 3) {
      let bao_mianzi = mianzi.filter((m) =>
        m.match(/^z([567])\1\1(?:[\+\=\-]|\1)(?!\!)/)
      );
      let baojia = bao_mianzi[2] && bao_mianzi[2].match(/[\+\=\-]/);
      if (baojia) {
        const paoTarget = baojia[0] as "+" | "=" | "-";
        return [{ name: "大三元", numHan: "*", paoTarget: paoTarget }];
      } else return [{ name: "大三元", numHan: "*" }];
    }
    return [];
  }

  /** 四喜和 (大四喜 or 小四喜) */
  function sixihu(): HoraYakuInfo[] {
    const kootsu = composition.kootsu;

    if (kootsu.z[1] + kootsu.z[2] + kootsu.z[3] + kootsu.z[4] === 4) {
      let bao_mianzi = mianzi.filter((m) =>
        m.match(/^z([1234])\1\1(?:[\+\=\-]|\1)(?!\!)/)
      );
      let baojia = bao_mianzi[3] && bao_mianzi[3].match(/[\+\=\-]/);

      if (baojia) {
        const paoTarget = baojia[0] as "+" | "=" | "-";
        return [{ name: "大四喜", numHan: "**", paoTarget: paoTarget }];
      } else return [{ name: "大四喜", numHan: "**" }];
    }

    if (
      kootsu.z[1] + kootsu.z[2] + kootsu.z[3] + kootsu.z[4] === 3 &&
      mianzi[0].match(/^z[1234]/)
    )
      return [{ name: "小四喜", numHan: "*" }];
    return [];
  }

  /** 字一色 */
  function ziyise(): HoraYakuInfo[] {
    if (composition.numJihaiBlock === mianzi.length)
      return [{ name: "字一色", numHan: "*" }];
    return [];
  }

  /** 緑一色 */
  function lvyise(): HoraYakuInfo[] {
    if (mianzi.filter((m) => m.match(/^[mp]/)).length > 0) return [];
    if (mianzi.filter((m) => m.match(/^z[^6]/)).length > 0) return [];
    if (mianzi.filter((m) => m.match(/^s.*[1579]/)).length > 0) return [];
    return [{ name: "緑一色", numHan: "*" }];
  }

  /** 清老頭 */
  function qinglaotou(): HoraYakuInfo[] {
    if (
      composition.numYaochuBlock === 5 &&
      composition.numKootsu === 4 &&
      composition.numJihaiBlock === 0
    )
      return [{ name: "清老頭", numHan: "*" }];
    return [];
  }

  /** 四槓子 */
  function sigangzi(): HoraYakuInfo[] {
    if (composition.numKantsu === 4) return [{ name: "四槓子", numHan: "*" }];
    return [];
  }

  /** 九蓮宝燈 */
  function jiulianbaodeng(): HoraYakuInfo[] {
    if (mianzi.length !== 1) return [];
    if (mianzi[0].match(/^[mpsz]1112345678999/))
      return [{ name: "純正九蓮宝燈", numHan: "**" }];
    else return [{ name: "九蓮宝燈", numHan: "*" }];
  }

  // 役満の初期値を設定する
  // 状況役に役満(天和・地和)が含まれる場合はそれを設定し、
  // 含まれない場合は空配列で初期化する
  let damanguan =
    situationYakus.length > 0 && situationYakus[0].numHan === "*"
      ? situationYakus
      : [];

  // 判定できた役満を追加していく
  damanguan = damanguan // 天和・地和
    .concat(guoshiwushuang()) // 国士無双
    .concat(sianke()) // 四暗刻
    .concat(dasanyuan()) // 大三元
    .concat(sixihu()) // 四喜和 (大四喜 or 小四喜)
    .concat(ziyise()) // 字一色
    .concat(lvyise()) // 緑一色
    .concat(qinglaotou()) // 清老頭
    .concat(sigangzi()) // 四槓子
    .concat(jiulianbaodeng()); // 九蓮宝燈

  for (let hupai of damanguan) {
    // 「ダブル役満無し」のルールの場合、判定済みのダブル役満を通常の役満にする
    if (!rule["ダブル役満あり"]) hupai.numHan = "*";

    // 「役満パオなし」のルールの場合、判定済みのパオ情報を削除する
    if (!rule["役満パオあり"]) delete hupai.paoTarget;
  }

  // 役満がある場合は通常役の判定は行わず、役満のみを返す
  if (damanguan.length > 0) return damanguan;

  // 通常役を判定する (判定済みの状況役に判定できた通常役を追加していく)
  let hupai = situationYakus
    .concat(menqianqing())
    .concat(fanpai())
    .concat(pinghu())
    .concat(duanyaojiu())
    .concat(yibeikou())
    .concat(sansetongshun())
    .concat(yiqitongguan())
    .concat(hunquandaiyaojiu())
    .concat(qiduizi())
    .concat(duiduihu())
    .concat(sananke())
    .concat(sangangzi())
    .concat(sansetongke())
    .concat(hunlaotou())
    .concat(xiaosanyuan())
    .concat(hunyise())
    .concat(chunquandaiyaojiu())
    .concat(erbeikou())
    .concat(qingyise());

  // 和了役がある場合は、さらに懸賞役を追加する
  if (hupai.length > 0) {
    hupai = hupai.concat(post_hupai);
  }

  return hupai;
};

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// 符の計算

/** 面子の構成情報を取得する */
export const getMentsuComposition = (
  mentsuList: string[],
  bakaze: 0 | 1 | 2 | 3,
  jikaze: 0 | 1 | 2 | 3,
  rule: Rule
): MentsuComposition => {
  // パターンマッチ用の正規表現
  const regBakazePai = new RegExp(`^z${bakaze + 1}.*$`); // 場風
  const regJikazePai = new RegExp(`^z${jikaze + 1}.*$`); // 自風
  const regSangenPai = /^z[567].*$/; // 三元牌

  const regYaochuuPai = /^.*[z19].*$/; // 么九牌
  const regZiPai = /^z.*$/; // 字牌

  const regKootsu = /^[mpsz](\d)\1\1.*$/; // 刻子
  const regAnko = /^[mpsz](\d)\1\1(?:\1|_\!)?$/; // 暗刻
  const refKantsu = /^[mpsz](\d)\1\1.*\1.*$/; // 槓子

  const regTankiMachi = /^[mpsz](\d)\1[\+\=\-\_]\!$/; // 単騎待ち
  const regKanchanMachi = /^[mps]\d\d[\+\=\-\_]\!\d$/; // カンチャン待ち
  const regPenchanMachi = /^[mps](123[\+\=\-\_]\!|7[\+\=\-\_]\!89)$/; // ペンチャン待ち

  // 面子構成情報の初期値
  let composition: MentsuComposition = {
    /** 符 */
    hu: 20,

    /** 門前フラグ (門前の場合は true ) */
    isMenzen: true,

    /** ツモ和了フラグ (ツモ和了の場合は true) */
    isTsumoHora: true,

    /** 順子の構成情報 */
    shuntsu: {
      m: [0, 0, 0, 0, 0, 0, 0, 0],
      p: [0, 0, 0, 0, 0, 0, 0, 0],
      s: [0, 0, 0, 0, 0, 0, 0, 0],
    },

    /** 刻子の構成情報 */
    kootsu: {
      m: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      p: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      s: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      z: [0, 0, 0, 0, 0, 0, 0, 0],
    },

    /** 順子の数 */
    numShuntsu: 0,

    /** 刻子の数 */
    numKootsu: 0,

    /** 暗刻の数 */
    numAnko: 0,

    /** 槓子の数 */
    numKantsu: 0,

    /** 么九牌を含むブロックの数 */
    numYaochuBlock: 0,

    /** 字牌を含むブロックの数 */
    numJihaiBlock: 0,

    /** 単騎待ちのフラグ (単騎待ちの場合は true ) */
    isTanki: false,

    /** 平和フラグ (平和の場合は true ) */
    isPinhu: false,

    /** 場風 (0: 東、1: 南、2: 西、3: 北) */
    bakaze: bakaze,

    /** 自風 (0: 東、1: 南、2: 西、3: 北) */
    jikaze: jikaze,
  };

  // 和了系の各ブロックについて処理を行う
  for (let m of mentsuList) {
    // 副露している場合は false に変更
    if (m.match(/[\+\=\-](?!\!)/)) composition.isMenzen = false;

    // ロン和了の場合は false に変更
    if (m.match(/[\+\=\-]\!/)) composition.isTsumoHora = false;

    // 九蓮宝燈の場合、以下は処理しない
    if (mentsuList.length === 1) continue;

    // 単騎待ちの場合は true に変更
    if (m.match(regTankiMachi)) composition.isTanki = true;

    // 国士無双13面待ちの場合、以下は処理しない
    if (mentsuList.length === 13) continue;

    // 么九牌を含むブロック数を計算
    if (m.match(regYaochuuPai)) composition.numYaochuBlock++;

    // 字牌を含むブロック数を計算
    if (m.match(regZiPai)) composition.numJihaiBlock++;

    // 七対子の場合、以下は処理しない
    if (mentsuList.length !== 5) continue;

    if (m === mentsuList[0]) {
      /***  雀頭の処理 ***/

      // 雀頭の符を0で初期化
      let hu = 0;

      // 場風の場合は2符追加
      if (m.match(regBakazePai)) hu += 2;

      // 自風の場合は2符追加
      if (m.match(regJikazePai)) hu += 2;

      // 三元牌の場合は2符追加
      if (m.match(regSangenPai)) hu += 2;

      hu = rule["連風牌は2符"] && hu > 2 ? 2 : hu;
      composition.hu += hu;

      // 単騎待ちの場合は2符追加
      if (composition.isTanki) composition.hu += 2;
    } else if (m.match(regKootsu)) {
      /*** 刻子の処理 ***/

      // 刻子の数を加算
      composition.numKootsu++;

      // 刻子の符を2で初期化 (明刻に対応)
      let hu = 2;

      // 么九牌の場合は符を2倍にする
      if (m.match(regYaochuuPai)) {
        hu *= 2;
      }

      // 暗刻の場合
      if (m.match(regAnko)) {
        // 符を2倍にする
        hu *= 2;

        // 暗刻の数を加算
        composition.numAnko++;
      }

      // 槓子の場合
      if (m.match(refKantsu)) {
        // 符を4倍にする
        hu *= 4;

        // 槓子の数を加算
        composition.numKantsu++;
      }

      // 刻子の符を加算
      composition.hu += hu;

      // 刻子の構成情報に追加
      const mps = m[0] as "m" | "p" | "s";
      const numOfPai = Number(m[1]);
      composition.kootsu[mps][numOfPai]++;
    } else {
      /*** 順子の処理 ***/

      // 順子の数を加算
      composition.numShuntsu++;

      // カンチャン待ちの場合、2符加算
      if (m.match(regKanchanMachi)) composition.hu += 2;

      // ペンチャン待ちの場合、2符加算
      if (m.match(regPenchanMachi)) composition.hu += 2;

      // 順子の構成情報に追加
      const mps = m[0] as "m" | "p" | "s";
      const numOfPai = Number(m[1]);

      composition.shuntsu[mps][numOfPai]++;
    }
  }

  // 和了系に関する加符を行う

  if (mentsuList.length === 7) {
    /*** 七対子の場合 ***/
    composition.hu = 25;
  } else if (mentsuList.length === 5) {
    /*** 一般系の場合 ***/

    // 門前 かつ 20符の場合は平和なので、平和フラグを設定
    composition.isPinhu = composition.isMenzen && composition.hu == 20;

    if (composition.isTsumoHora) {
      /*** ツモ和了の場合 ***/
      if (!composition.isPinhu) composition.hu += 2; // 平和以外は2符加算
    } else {
      /*** ロン和了の場合 ***/
      if (composition.isMenzen) composition.hu += 10; // 門前の場合は10符加算
      else if (composition.hu === 20) composition.hu = 30; // 符のない副露手は30符固定
    }

    // 10符未満は切り上げる
    composition.hu = Math.ceil(composition.hu / 10) * 10;
  }

  return composition;
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

/** 九蓮宝燈系の和了系を取得する */
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

/** 雀頭候補を抜き取った12枚の手牌に対して、4面子となる組み合わせをすべて求める */
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

/** 同色内の面子を全て求める */
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

/** 和了牌にマークをつける */
const _addMarkToHoraPai = (
  mentsuList: string[],
  horaPai: string
): string[][] => {
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
};

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// パラメータ関連

/** 場況情報を作成する */
export const createSituationParam = (
  param: {
    rule?: Rule;
    bakaze?: 0 | 1 | 2 | 3;
    jikaze?: 0 | 1 | 2 | 3;
    riichi?: 0 | 1 | 2;
    isOneShot?: boolean;
    isChanKan?: boolean;
    isRinShan?: boolean;
    haitei?: 0 | 1 | 2;
    tenho?: 0 | 1 | 2;
    baopai?: Pai[];
    fubaopai?: Pai[] | null;
    numRiichiBou?: number;
    numTsumibou?: number;
  } = {}
): SituationParam => {
  return {
    rule: param.rule ?? ruleForTest,
    bakaze: param.bakaze ?? 0,
    jikaze: param.jikaze ?? 1,
    situationMeta: {
      riichi: param.riichi ?? 0,
      isOneShot: param.isOneShot ?? false,
      isChanKan: param.isChanKan ?? false,
      isRinShan: param.isRinShan ?? false,
      haitei: param.haitei ?? 0,
      tenho: param.tenho ?? 0,
    },
    baopai: param.baopai ? param.baopai : [],
    fubaopai: param.fubaopai ? param.fubaopai : null,
    kyotaku: {
      numRiichiBou: param.numRiichiBou ?? 0,
      numTsumibou: param.numTsumibou ?? 0,
    },
  };
};
