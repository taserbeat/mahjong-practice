import CustomPaiYama from "./custom/customPaiyama";
import Hand, { MenzenPais } from "./hand";
import { getHoraType, hora, HoraAmountInfo, SituationParam } from "./hora";
import { Kawa } from "./kawa";
import Pai, { Mentsu, RonPai } from "./pai";
import { Rule } from "./rule";
import * as Shanten from "./shanten";

/** 1人麻雀練習機の設定値 */
export type PracticeSettings = {
  /** ルール */
  rule: Rule;

  /** 場風 (0: 東、1: 南、2: 西、3: 北) */
  bakaze: Kaze;

  /** 自風 (0: 東、1: 南、2: 西、3: 北) */
  jikaze: Kaze;
};

/** 配牌設定 */
type HaipaiSettings =
  | {
      haipai: undefined;
      paiyama: undefined;
    }
  | {
      haipai: Pai[];
      paiyama: Pai[];
    };

/** 風 (0: 東、1: 南、2: 西、3: 北) */
export type Kaze = 0 | 1 | 2 | 3;

/** 実行可能アクション */
export type LegalAction =
  | { name: "Hora" }
  | { name: "Kan"; mentsuList: Mentsu[] }
  | { name: "Dapai"; pais: string[] }
  | { name: "Riichi"; pais: string[] }
  | { name: "Kyusyu" };

/** ステータス (主に実行可能アクションの算出の内部判定処理で使用) */
type PracticeStatus = "Haipai" | "Tsumo" | "Hora" | "Kan" | "Dapai";

/** 1人麻雀練習機のクラス */
export class PracticeGame {
  // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  // privateフィールド

  /** 設定値 */
  private _settings: PracticeSettings;

  /** 牌姿 (初期化用) */
  private _initHaipai: Pai[] | undefined;

  /** 牌山 (初期化用) */
  private _initPaiyama: Pai[] | undefined;

  /** 牌山 */
  private _paiYama: CustomPaiYama;

  /** 河 */
  private _kawa: Kawa;

  /** プレイヤーの手牌 */
  private _hand: Hand;

  /** プレイヤーの持ち点 */
  private _point: number;

  /** ステータス */
  private _status: PracticeStatus;

  /** 第一ツモであるか? */
  private _isFirstTsumo: boolean;

  /** カンの回数 */
  private _numKan: number;

  /** 場況情報 */
  private _situationParam: SituationParam;

  /** 九種九牌が宣言されたか？ */
  private _isKyusyuCalled: boolean;

  /** ツモを行なった回数 (嶺上ツモの回数は含めない) */
  private _tsumoCount: number;

  /** 打牌できる回数 (流局の判定で使用) */
  private readonly _maxDapaiCount = 18;

  constructor(
    settings: PracticeSettings,
    haipaiSettings: HaipaiSettings = {
      haipai: undefined,
      paiyama: undefined,
    }
  ) {
    this._settings = settings;
    this._initHaipai = haipaiSettings.haipai;
    this._initPaiyama = haipaiSettings.paiyama;

    this._hand =
      this._initHaipai === undefined || this._initHaipai.length === 0
        ? new Hand()
        : new Hand(this._initHaipai);
    this._paiYama = new CustomPaiYama(this._initPaiyama, true);
    this._kawa = new Kawa();
    this._point = 25000;
    this._status = "Haipai";
    this._isFirstTsumo = true;
    this._numKan = 0;
    this._situationParam = {
      bakaze: settings.bakaze,
      jikaze: settings.jikaze,
      baopai: [],
      fubaopai: null,
      rule: this._settings.rule,
      situationMeta: {
        riichi: 0,
        isOneShot: false,
        isChanKan: false,
        isRinShan: false,
        haitei: 0,
        tenho: 0,
      },
      kyotaku: {
        numRiichiBou: 0,
        numTsumibou: 0,
      },
    };
    this._isKyusyuCalled = false;
    this._tsumoCount = 0;
  }

  // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  // publicメソッド

  /** 初期化処理 */
  public initialize(): void {
    // 点棒をリセット
    this._point = 25000;

    // ステータスをリセット
    this._status = "Haipai";

    // フラグをリセット
    this._isFirstTsumo = true;
    this._isKyusyuCalled = false;

    // カンの回数をリセット
    this._numKan = 0;

    // 牌山をリセット
    this._paiYama = new CustomPaiYama(this._initPaiyama, true);

    const haipai: string[] = [];
    if (this._initHaipai === undefined) {
      // 牌山から13枚をツモリ、配牌とする
      for (let i = 0; i < 13; i++) {
        const pai = this._paiYama.tsumo();
        haipai.push(pai);
      }
    } else {
      // 指定の配牌から始める (13枚になるまでツモる)
      for (let i = 0; i < 13; i++) {
        const pai = this._initHaipai[i] ?? this._paiYama.tsumo();
        haipai.push(pai);
      }
    }
    this._hand = new Hand(haipai);

    // 場況情報をリセット
    this._situationParam = {
      bakaze: this._settings.bakaze,
      jikaze: this._settings.jikaze,
      baopai: [],
      fubaopai: null,
      rule: this._settings.rule,
      situationMeta: {
        riichi: 0,
        isOneShot: false,
        isChanKan: false,
        isRinShan: false,
        haitei: 0,
        tenho: 0,
      },
      kyotaku: {
        numRiichiBou: 0,
        numTsumibou: 0,
      },
    };

    // 捨て牌をリセット
    this._kawa = new Kawa();

    // ツモ回数をリセット
    this._tsumoCount = 0;
  }

  /** ツモ処理 */
  public tsumo(): void {
    const pai = this._paiYama.tsumo();
    this._hand.tsumo(pai);
    this._tsumoCount += 1;

    // 通常の牌をツモった状態にする
    this._status = "Tsumo";
  }

  /** 実行可能アクションを取得する */
  public getLegalActions(): LegalAction[] {
    const legalActions: LegalAction[] = [];

    // 和了
    if (this.canHora(null)) {
      legalActions.push({ name: "Hora" });
    }

    // カン
    const kanCandidateMentsuList = this.getKanCandidateMentsuList();
    if (kanCandidateMentsuList.length > 0) {
      legalActions.push({ name: "Kan", mentsuList: kanCandidateMentsuList });
    }

    // 打牌
    const dapaiCandidates = this.getDapaiCandidates();
    if (dapaiCandidates.length > 0) {
      legalActions.push({ name: "Dapai", pais: dapaiCandidates });
    }

    // 立直
    const riichiCandidateDapais = this.getRiichiCandidateDapais();
    if (riichiCandidateDapais.length > 0) {
      legalActions.push({ name: "Riichi", pais: riichiCandidateDapais });
    }

    // 九種九牌
    if (this.canKyuusyu()) {
      legalActions.push({ name: "Kyusyu" });
    }

    return legalActions;
  }

  /**
   * カン処理
   * @param {Mentsu} mentsu - カンする面子
   */
  public kan(mentsu: Mentsu): void {
    // 手牌をカンする
    this._hand.kan(mentsu);

    // カンした回数をインクリメント
    this._numKan++;

    // 第一ツモではなくなる
    this._isFirstTsumo = false;

    // 一発フラグをOFFにする
    this._situationParam.situationMeta.isOneShot = false;

    // リンシャン牌をツモる
    const pai = this._paiYama.kanTsumo();
    this._hand.tsumo(pai);

    // カンドラ即乗せ または 暗カンの場合は新ドラをめくる
    // (1人麻雀なので暗カンしかありえない)
    if (!this._settings.rule.カンドラ後乗せ || mentsu.match(/^[mpsz]\d{4}$/)) {
      this._paiYama.openNewDoraDisplayPai();
    }

    // カンツモした状態にする
    this._status = "Kan";
  }

  /**
   * 和了処理
   */
  public hora(): HoraAmountInfo {
    // 牌山をロックし、裏ドラを見れるようにする
    this._paiYama.lock();

    // 和了時の手牌を複製
    const tmpHand = this._hand.clone();

    /* 和了時に更新が必要な場況情報を更新する */
    this._situationParam = {
      ...this._situationParam,

      // ドラ表示牌を取得
      baopai: this._paiYama.doraDisplayPais,

      // 裏ドラを取得 (立直していなければnull)
      fubaopai: tmpHand.isRiichi ? this._paiYama.backDoraDisplayPais : null,

      // 状況役の取得
      situationMeta: {
        ...this._situationParam.situationMeta,

        // 嶺上開花
        isRinShan: this._status === "Kan",

        // 海底/河底
        // 海底の役が付くのは牌山の残りツモ回数が0回 且つ 嶺上開花では無いときである
        // また、1人麻雀なので、河底はありえない
        haitei: this.remainTsumoCount > 0 || this._status === "Kan" ? 0 : 1,

        // 天和/地和
        // 第一ツモ和了でない場合は天和/地和ではない。
        // 第一ツモ和了の場合、自風が東なら天和、東以外なら地和
        tenho: !this._isFirstTsumo
          ? 0
          : this._situationParam.jikaze === 0
          ? 1
          : 2,
      },
    };

    // 和了役の判定と和了点の計算を行う
    const tmpHora = hora(tmpHand, null, this._situationParam);

    if (tmpHora === undefined) {
      throw new Error("和了処理に失敗しました。");
    }

    // 和了した状態にする
    this._status = "Hora";

    return tmpHora;
  }

  /**
   * 打牌処理
   * @param {string} pai
   * 続く文字が _ の場合、ツモ切りを表す。
   * 続く文字が * の場合、リーチ宣言を表す。
   * `p7*`: 七筒切りリーチ、`p7_*`: 七筒ツモ切りリーチ
   */
  public dapai(pai: string): void {
    // 一発フラグをOFFにする
    this._situationParam.situationMeta.isOneShot = false;

    // 手牌から打つ牌を取り出す
    this._hand.dapai(pai);

    // 打つ牌を河に捨てる
    this._kawa.dapai(pai);

    // 立直の場合
    if (pai.endsWith("*")) {
      // ダブル立直か判定する
      this._situationParam.situationMeta.riichi = this._isFirstTsumo ? 2 : 1;

      // 一発フラグをONにする
      if (this._settings.rule.一発あり) {
        this._situationParam.situationMeta.isOneShot = true;
      }
    }

    // 第一ツモではなくなる
    this._isFirstTsumo = false;

    // 打牌した状態にする
    this._status = "Dapai";

    // 流局していなければ、ツモを行う
    if (!this.isDrawnGame) {
      this.tsumo();
    }
  }

  /** 九種九牌を宣言する */
  public callKyusyu(): void {
    this._isKyusyuCalled = true;
    this._paiYama.lock();
  }

  // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  // getter

  /** 牌姿文字列 */
  public get paishi(): string {
    return this._hand.toPaishi();
  }

  /** 手牌 (門前) */
  public get menzenPais(): MenzenPais {
    return this._hand._menzenPais;
  }

  /** 副露面子 */
  public get fulos(): string[] {
    return this._hand._fulos;
  }

  /** ツモ牌 */
  public get tsumoPai(): string | null {
    return this._hand._tsumoPai;
  }

  /** ドラ表示牌の配列 */
  public get doraDisplayPais(): string[] {
    return this._paiYama.doraDisplayPais;
  }

  /** 裏ドラ表示牌の配列 */
  public get backDoraDisplayPais(): string[] | null {
    if (this._hand.isRiichi) {
      return this._paiYama.backDoraDisplayPais;
    }

    return [];
  }

  /** 河 */
  public get kawa(): Kawa {
    return this._kawa;
  }

  /** 残りツモ回数 */
  public get remainTsumoCount(): number {
    const remainTsumoCount = this._maxDapaiCount - this._tsumoCount;
    return remainTsumoCount >= 0 ? remainTsumoCount : 0;
  }

  /** 流局か判定する */
  public get isDrawnGame(): boolean {
    // 九種九牌が宣言されていれば流局となる
    if (this._isKyusyuCalled) return true;

    // 打牌した回数が上限に達すると、流局となる
    if (this._kawa.pai.length >= this._maxDapaiCount) {
      return true;
    }

    return false;
  }

  /** 立直済みであるか取得する */
  public get isRiichied(): boolean {
    return this._hand._isRiichi;
  }

  /** テンパイ状態を取得する */
  public get isTenpai(): boolean {
    // シャンテンが0であればテンパイ
    const numShanten = Shanten.calcNumShanten(this._hand.clone());

    return numShanten === 0;
  }

  // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  // privateメソッド

  /** 打牌可能な牌の一覧を取得する */
  private getDapaiCandidates(): string[] {
    const dapaiCandidates = this._hand.getDapaiCandidates();

    return dapaiCandidates ?? [];
  }

  /**
   * 指定された牌を打牌して立直が可能であるか判定する
   * true: 立直可能、 false: 立直不可
   */
  private canRiichi(pai: string | null = null): boolean {
    // 打牌できない場合は立直不可
    if (this._hand._tsumoPai === null) return false;

    // 立直後は立直不可
    if (this._hand.isRiichi) return false;

    // 門前ではない場合は立直不可
    if (!this._hand.isMenzen) return false;

    // ツモ番無し無しの場合、残り牌数が4枚未満は立直不可
    if (
      !this._settings.rule.ツモ番なしリーチあり &&
      this._paiYama.remainTsumoCount < 4
    )
      return false;

    // トビ終了ありの場合、持ち点1000未満は立直不可
    if (this._settings.rule.トビ終了あり && this._point < 1000) return false;

    // テンパイしていない場合は立直不可
    if (Shanten.calcNumShanten(this._hand) > 0) return false;

    // 牌が未指定の場合は立直不可
    if (pai === null) return false;

    // 指定牌を打牌した牌姿がテンパイしていれば立直可能
    const tmpHand = this._hand.clone().dapai(pai);
    const improveShantenPais = Shanten.calcImproveShantenPais(tmpHand);
    if (improveShantenPais === null) throw new Error("多牌になる手牌です");
    if (
      Shanten.calcNumShanten(tmpHand) === 0 &&
      improveShantenPais.length > 0
    ) {
      return true;
    }

    return false;
  }

  /** 立直可能な打牌(立直宣言が可能な牌)のリストを取得する */
  private getRiichiCandidateDapais(): string[] {
    const riichiCandidateDapais: string[] = [];

    const dapaiCandidates = this._hand.getDapaiCandidates(false);
    if (dapaiCandidates === null) {
      return [];
    }

    for (let pai of dapaiCandidates) {
      if (this.canRiichi(pai)) {
        riichiCandidateDapais.push(pai);
      }
    }

    return riichiCandidateDapais;
  }

  /** カン可能な面子を取得する */
  private getKanCandidateMentsuList(): Mentsu[] {
    // 残りツモ0回 または 5回目はカンできない
    if (this.remainTsumoCount === 0 || this._numKan >= 4) {
      return [];
    }

    const mentsuList = this._hand.getKanCandidates(undefined);

    // カンできない手牌構成の場合
    if (mentsuList === null || mentsuList.length === 0) {
      return [];
    }

    // 立直後の暗カン可否を確認する
    if (this._hand.isRiichi) {
      if (this._settings.rule.リーチ後暗槓許可レベル === 0) {
        // 暗カンが禁止の場合
        return [];
      } else if (this._settings.rule.リーチ後暗槓許可レベル === 1) {
        // 牌姿の変わる暗カンが禁止の場合

        const tsumoPai = this._hand._tsumoPai;
        if (tsumoPai === null) {
          return [];
        }

        /* 暗カン前の牌姿から和了可能な和了系をすべて求める */
        const handBeforeKan = this._hand.clone().dapai(tsumoPai);
        let numHoraMentsuBeforeKan = 0;
        for (let p of Shanten.calcImproveShantenPais(handBeforeKan) ?? []) {
          // 和了系を求めればよいので、ダミーのロン牌で和了系を計算する
          const ronPaiDummy = (p + "+") as RonPai;
          numHoraMentsuBeforeKan += getHoraType(
            handBeforeKan,
            ronPaiDummy
          ).length;
        }

        /* 暗カン後の牌姿から和了可能な和了系をすべて求める */
        const handAfterKan = this._hand.clone().kan(mentsuList[0]);
        let numHoraMentsuAfterKan = 0;
        for (let p of Shanten.calcImproveShantenPais(handAfterKan) ?? []) {
          // 和了系を求めればよいので、ダミーのロン牌で和了系を計算する
          const ronPaiDummy = (p + "+") as RonPai;
          numHoraMentsuAfterKan += getHoraType(
            handAfterKan,
            ronPaiDummy
          ).length;
        }

        // 両者が一致しない場合は暗カンできない
        if (numHoraMentsuBeforeKan !== numHoraMentsuAfterKan) {
          return [];
        }
      } else {
        // 待ちの変わる暗カンが禁止の場合

        const tsumoPai = this._hand._tsumoPai;
        if (tsumoPai === null) {
          return [];
        }

        /* 暗カン前の牌姿から和了可能な和了牌一覧を求める */
        const handBeforeKan = this._hand.clone().dapai(tsumoPai);
        const numTenpaiPaisBeforeKan =
          Shanten.calcImproveShantenPais(handBeforeKan)?.length ?? 0;

        /* 暗カン後の牌姿から和了可能な和了牌一覧を求める */
        const handAfterKan = this._hand.clone().kan(mentsuList[0]);
        if (Shanten.calcNumShanten(handAfterKan) > 0) {
          // テンパイが崩れるカンはできない
          return [];
        }
        const numTenpaiPaisAfterKan =
          Shanten.calcImproveShantenPais(handAfterKan)?.length ?? [];

        // 両者が一致しない場合は暗カンできない
        if (numTenpaiPaisBeforeKan !== numTenpaiPaisAfterKan) {
          return [];
        }
      }
    }

    return mentsuList;
  }

  /**
   * 指定の牌で和了可能であるか判定する
   * @param {Pai | null} pai - null の場合、ツモ和了可能であれば true を返す
   */
  private canHora(pai: Pai | null): boolean {
    const tmpHand = this._hand.clone();

    // ロン牌も含めて和了系(シャンテン数が-1)になっていない場合は和了できない
    if (pai !== null) {
      tmpHand.tsumo(pai);
    }
    if (Shanten.calcNumShanten(tmpHand) !== -1) return false;

    // 和了系になっており、状況役があれば和了できる
    // (状況役の有無だけ判断しており、すべてを調べ上げる必要はない)
    const hasSituationYaku =
      // 立直している場合は和了可能
      this._hand.isRiichi ||
      // 嶺上開花の場合は和了可能
      this._status === "Kan" ||
      // 海底摸月の場合は和了可能
      this.remainTsumoCount === 0;

    if (hasSituationYaku) {
      return true;
    }

    // 和了点計算処理を呼び出して和了可能か判定する
    const tmpHora = hora(this._hand, null, this._situationParam);
    const isHora = tmpHora !== undefined;

    return isHora;
  }

  /** 九種九牌が可能か判定する */
  private canKyuusyu(): boolean {
    // 途中流局無しのルールでは、九種九牌は成立しない
    if (!this._settings.rule.途中流局あり) return false;

    // 第一ツモでなければ九種九牌は成立しない
    if (this._hand._tsumoPai === null || !this._isFirstTsumo) return false;

    // 手牌の么九牌の種類数を数える
    let numYaochu = 0;
    const mpsz: ["m", "p", "s", "z"] = ["m", "p", "s", "z"];
    for (let x of mpsz) {
      const pais = this._hand._menzenPais[x];
      const nn = x === "z" ? [1, 2, 3, 4, 5, 6, 7] : [1, 9];
      for (let n of nn) {
        if (pais[n] > 0) {
          numYaochu++;
        }
      }
    }

    // 么九牌が9枚以上であれば、九種九牌が成立する
    return numYaochu >= 9;
  }
}
