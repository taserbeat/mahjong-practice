import Pai from "../pai";
import Hand from "../hand";

/** 独自実装の牌山 */
export class CustomPaiYama {
  /**
   * 残り牌
   * 初期状態では、添字0 ~ 13が王牌となる。
   * (添字0 ~ 3: 嶺上牌、添字4 ~ 8: ドラ表示牌、添字9 ~ 13: 裏ドラ表示牌)
   * ツモは常に最後尾から行う。
   */
  _pais: Pai[];

  /** 牌山をロックする */
  _isLocked: boolean;

  /** 新ドラ表示牌をめくる必要がある場合はtrue */
  _shouldOpenNewDora: boolean;

  /** ドラ表示牌の配列 */
  _doraDisplayPais: Pai[];

  /** 裏ドラ表示牌の配列 */
  _backDoraDisplayPais: Pai[];

  /**
   * 独自実装の牌山のコンストラクタ
   * @param {Pai[] | undefined} pais - 牌山の牌配列
   * @param {boolean} shouldShuffle - 牌山をシャッフルするか？
   */
  constructor(
    pais: Pai[] | undefined = undefined,
    shouldShuffle: boolean = true
  ) {
    this._isLocked = false;
    this._shouldOpenNewDora = false;

    this._pais =
      pais === undefined
        ? [
            // #region set pais
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
            // #endregion set pais
          ]
        : [...pais];

    // 牌山をシャッフル
    if (shouldShuffle) {
      this._pais.sort(() => Math.random() - 0.5);
    }

    // ドラ表示牌、裏ドラ表示牌
    this._doraDisplayPais = [this._pais[4]];
    this._backDoraDisplayPais = [this._pais[9]];
  }

  /** ドラ表示牌を指定してドラを返す */
  static getDora(pai: Pai): Pai {
    if (!Hand.validatePai(pai)) throw new Error(`${pai} is invalid.`);

    const s = pai[0] as "m" | "p" | "s" | "z";
    const n = +pai[1] || 5;

    switch (pai) {
      case "m1":
        return "m2";
      case "m2":
        return "m3";
      case "m3":
        return "m4";
      case "m4":
        return "m5";
      case "m5":
        return "m6";
      case "m0":
        return "m6";
      case "m6":
        return "m7";
      case "m7":
        return "m8";
      case "m8":
        return "m9";
      case "m9":
        return "m1";

      case "p1":
        return "p2";
      case "p2":
        return "p3";
      case "p3":
        return "p4";
      case "p4":
        return "p5";
      case "p5":
        return "p6";
      case "p0":
        return "p6";
      case "p6":
        return "p7";
      case "p7":
        return "p8";
      case "p8":
        return "p9";
      case "p9":
        return "p1";

      case "s1":
        return "s2";
      case "s2":
        return "s3";
      case "s3":
        return "s4";
      case "s4":
        return "s5";
      case "s5":
        return "s6";
      case "s0":
        return "s6";
      case "s6":
        return "s7";
      case "s7":
        return "s8";
      case "s8":
        return "s9";
      case "s9":
        return "s1";

      case "z1":
        return "z2";
      case "z2":
        return "z3";
      case "z3":
        return "z4";
      case "z4":
        return "z1";
      case "z5":
        return "z6";
      case "z6":
        return "z7";
      case "z7":
        return "z5";
    }
  }

  /** ツモを行う */
  public tsumo(): Pai {
    if (this._isLocked) throw Error("Paiyama is locked.");
    if (this.remainTsumoCount === 0)
      throw Error("Paiyama doesn't have any pais.");
    if (this._shouldOpenNewDora)
      throw Error("Don't tsumo before open new dora.");

    const tsumoPai = this._pais.pop();
    if (tsumoPai === undefined) throw Error("Tsumo pai is undefined.");

    return tsumoPai;
  }

  /** ツモが可能であればtrueを返す */
  public get canTsumo(): boolean {
    if (
      this._isLocked ||
      this.remainTsumoCount == 0 ||
      this._shouldOpenNewDora
    ) {
      return false;
    }

    return true;
  }

  /** カンツモを行う */
  public kanTsumo(): Pai {
    if (this._isLocked) throw Error("Paiyama is locked.");
    if (this.remainTsumoCount === 0)
      throw new Error("Paiyama doesn't have any pais.");
    if (this._shouldOpenNewDora)
      throw new Error("Don't kan-tsumo before open new dora.");
    if (this._doraDisplayPais.length === 5)
      throw new Error("Don't kan-tsumo after kan called 4 times.");

    this._shouldOpenNewDora = true;

    const kanTsumoPai = this._pais.shift();
    if (kanTsumoPai === undefined) throw Error("kan-tsumo pai is undefined.");

    return kanTsumoPai;
  }

  /** 新ドラ表示牌をめくる */
  public openNewDoraDisplayPai(): CustomPaiYama {
    if (this._isLocked) throw Error("Paiyama is locked.");
    if (!this._shouldOpenNewDora)
      throw Error("Don't open new-dora-display-pai.");

    this._doraDisplayPais.push(this._pais[4]);
    this._backDoraDisplayPais.push(this._pais[9]);

    this._shouldOpenNewDora = false;

    return this;
  }

  /** 牌山をロックする */
  public lock(): CustomPaiYama {
    this._isLocked = true;
    return this;
  }

  /** 残りツモ枚数 */
  public get remainTsumoCount(): number {
    return this._pais.length - 14;
  }

  /** ドラ表示牌の配列 */
  public get doraDisplayPais(): Pai[] {
    return this._doraDisplayPais;
  }

  /**
   * 裏ドラ表示牌の配列
   * ロックしていなければnullを返す。
   * 裏ドラ表示牌がない場合はnullを返す。
   */
  public get backDoraDisplayPais(): Pai[] | null {
    if (!this._isLocked) return null;

    return this._backDoraDisplayPais.length === 0
      ? null
      : this._backDoraDisplayPais.concat();
  }
}

export default CustomPaiYama;
