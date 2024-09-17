import Hand from "./hand";
import { Mentsu } from "./pai";

/** 河を表現するクラス */
export class Kawa {
  /** 捨て牌が順に格納される配列 */
  private _pai: string[];

  /** フリテンをチェックするためのキャッシュ */
  private _find: { [key: string]: boolean };

  constructor() {
    this._pai = [];
    this._find = {};
  }

  /**
   * 捨て牌を河に追加する
   * @param {string} pai - 捨て牌
   */
  public dapai(pai: string): Kawa {
    // 不正な牌の場合、例外を発生させる
    if (!Hand.validatePai(pai)) {
      throw new Error(`牌ではありません: ${pai}`);
    }

    // 捨て牌に追加
    this._pai.push(pai.replace(/[\+\=\-]$/, ""));

    // フリテンチェック用のキャッシュに追加
    // (フリテンに赤牌であるかは関係しないので、変換してキャッシュに追加)
    this._find[pai[0] + (+pai[1] || 5)] = true;

    return this;
  }

  /**
   * フリテンであるかをチェックする (フリテンの場合はtrueを返す)
   * @param {string} pai - フリテンを確認したい牌
   */
  public isFuriten(pai: string): boolean {
    const key = pai[0] + (+pai[1] || 5);

    if (!(key in this._find)) {
      return false;
    }

    return this._find[key];
  }

  /**
   * 指定された面子で鳴かれた状態にする
   * @param {Mentsu} mentsu - 面子
   */
  public fulo(mentsu: Mentsu): Kawa {
    // 不正な面子の場合、例外を発生させる
    if (!Hand.validateMentsu(mentsu)) {
      throw new Error(`面子ではありません: ${mentsu}`);
    }

    // 面子から鳴いた牌を取得する
    const pai = mentsu[0] + mentsu.match(/\d(?=[\+\=\-])/);

    // 鳴いていない場合、例外を発生させる
    const d = mentsu.match(/[\+\=\-]/);
    if (!d) {
      throw new Error(mentsu);
    }

    // 鳴いた牌が河と一致しない場合、例外を発生させる
    if (this._pai[this._pai.length - 1].slice(0, 2) != pai) {
      throw new Error(mentsu);
    }

    this._pai[this._pai.length - 1] += d;
    return this;
  }

  /** 捨て牌の一覧を取得する */
  public get pai(): string[] {
    return this._pai;
  }
}
