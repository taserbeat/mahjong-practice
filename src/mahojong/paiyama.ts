import Pai from "./pai";

/** 牌山 */
export class PaiYama {
  /**
   * 残り牌
   * 初期状態では、添字0~13が王牌となる。
   * (添字0~3: 嶺上牌、添字4~8: ドラ表示牌、添字9~13: 裏ドラ表示牌)
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

  constructor() {
    this._isLocked = false;
    this._shouldOpenNewDora = false;

    this._pais = [
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
    ];

    // 牌山をシャッフル
    this._pais.sort(() => Math.random() - 0.5);

    // ドラ表示牌、裏ドラ表示牌
    this._doraDisplayPais = [this._pais[4]];
    this._backDoraDisplayPais = [this._pais[9]];
  }

  /** ツモを行う */
  public tsumo(): Pai {
    if (this._isLocked) throw Error("Yama is locked.");
    if (this.remainTsumoCount == 0) throw Error("Yama doesn't have any pais.");
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
    if (this._isLocked) throw Error("Yama is locked.");
    if (this.remainTsumoCount == 0)
      throw new Error("Yama doesn't have any pais.");
    if (this._shouldOpenNewDora)
      throw new Error("Don't kan-tsumo before open new dora.");
    if (this._doraDisplayPais.length == 5)
      throw new Error("Don't kan-tsumo after kan called 4 times.");

    const kanTsumoPai = this._pais.shift();
    if (kanTsumoPai === undefined) throw Error("kan-tsumo pai is undefined.");

    return kanTsumoPai;
  }

  /** 新ドラ表示牌をめくる */
  public openNewDoraDisplayPai(): void {
    if (this._isLocked) throw Error("Yama is locked.");
    if (!this._shouldOpenNewDora)
      throw Error("Don't open new-dora-display-pai.");

    this._doraDisplayPais.push(this._pais[4]);
    this._backDoraDisplayPais.push(this._pais[9]);
  }

  /** 牌山をロックする */
  public lock(): void {
    this._isLocked = true;
  }

  /** 残りツモ枚数 */
  public get remainTsumoCount(): number {
    return this._pais.length - 14;
  }

  /** ドラ表示牌の配列 */
  public get doraDisplayPais(): Pai[] {
    return this.doraDisplayPais;
  }

  /** 裏ドラ表示牌の配列 */
  public get backDoraDisplayPais(): Pai[] {
    return this._backDoraDisplayPais;
  }
}

export default PaiYama;
