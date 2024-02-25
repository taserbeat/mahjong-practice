import Pai, { Mentsu, Paishi } from "./pai";

/** 副露していない手牌の種類と枚数の型 */
export type MenzenPais = {
  /** 伏せられた牌 (対局相手の手牌で使う) */
  _: number;

  /** 萬子 */
  m: number[];

  /** 筒子 */
  p: number[];

  /** 索子 */
  s: number[];

  /** 字牌 */
  z: number[];
};

/** 手牌 */
export class Hand {
  /**
   * 牌を表現する文字列として正しいかチェックする
   * 正しい場合は入力文字列、正しくない場合はnullを返す
   */
  static validatePai(pai: string): string | null {
    return pai.match(/^(?:[mps]\d|z[1-7])_?\*?[\+\=\-]?$/) ? pai : null;
  }

  /**
   * 面子を表現する文字列として正しいかチェックする
   * 正しい場合は正規化した文字列、正しくない場合はnullを返す
   * */
  static validateMentsu(mentsu: Mentsu): string | null {
    // NOTE: 正規表現チェッカー
    // https://www.oh-benri-tools.com/tools/programming/regexp

    // 字牌のエラーチェック
    if (mentsu.match(/^z.*[089]/)) return null;

    // 赤牌を黒牌に置き換える
    let normalizedMentsu = mentsu.replace(/0/g, "5");

    // 刻子か加カンの場合、先頭の'05'を'50'に変換する
    // (m0とm5所持から対面のm5をポンは'm505='が正しいが、'm055='となっていた場合は正しく変換する)
    if (normalizedMentsu.match(/^[mpsz](\d)\1\1[\+\=\-]\1?$/)) {
      return mentsu.replace(/([mps])05/, "$1" + "50");
    }
    // 暗カンか大明カンの場合、鳴いた牌以外の順序を0が後ろになるように並び替える
    else if (normalizedMentsu.match(/^[mpsz](\d)\1\1\1[\+\=\-]?$/)) {
      const mpsz = mentsu[0];
      const fromHandPai = (mentsu.match(/\d(?![\+\=\-])/g) || [""])
        .sort()
        .reverse()
        .join("");
      const stealedPai = (mentsu.match(/\d[\+\=\-]$/) || [""])[0];

      return mpsz + fromHandPai + stealedPai;
    }
    // 順子の場合
    else if (normalizedMentsu.match(/^[mps]\d+\-\d*$/)) {
      // まず順子として正しいかチェックする
      const redpai = mentsu.match(/0/); // 赤牌が含まれているかチェック
      const nums = (normalizedMentsu.match(/\d/g) || [""]).sort(); // 数字部分だけを取り出してソート
      // 数字が3つでなければエラー
      if (nums.length !== 3) return null;

      // 数字が順に並んでいなければエラー
      if (+nums[0] + 1 !== +nums[1] || +nums[1] + 1 !== +nums[2]) return null;

      // ここまでで順子として正しいので、順序を正しくする
      normalizedMentsu =
        normalizedMentsu[0] +
        (normalizedMentsu.match(/\d[\+\=\-]?/g) || [""]).sort().join("");
      return redpai ? normalizedMentsu.replace(/5/, "0") : normalizedMentsu;
    }

    return null;
  }

  /**
   * 牌姿を表現する文字列から手牌を生成する
   * 例: "1m1m1m2m2m3m3m,1p1p1p+,2p2p2p+"の場合は以下と解釈する。
   * 手牌(打牌可能): "1m1m1m2m2m3m3m"
   * 副露済み: ["1p1p1p+", "2p2p2p+"]
   *
   * また、"1m1m1m2m2m3m3m,1p1p1p+,2p2p2p+,"のように','で終わる場合は副露直後を表す。
   */
  static fromString(paishi: Paishi = ""): Hand {
    const fulos = paishi.split(",");
    const menzenPais = fulos.shift() || "";

    // 伏せ牌を配列に追加する
    let haipai: string[] = menzenPais.match(/_/g) || [];

    // 手牌を萬子・筒子・索子ごとに分解し、それぞれを配列に追加する
    const paiStrs = menzenPais.match(/[mpsz]\d+/g) || [];
    for (let paiStr of paiStrs) {
      const s = paiStr[0] as "m" | "p" | "s" | "z";
      for (let n of paiStr.match(/\d/g) || []) {
        const paiId = Number(n); // 牌のID(0 ~ 9)を取得
        if (s === "z" && (paiId < 1 || 7 < paiId)) {
          // 字牌に0, 8, 9はないので無視
          continue;
        }
        haipai.push(s + n);
      }
    }

    // 14枚を超える場合、配牌から取り除く
    haipai = haipai.slice(0, 14 - fulos.filter((x) => x).length * 3);

    // ツモ番で打牌が必要な場合、最後をツモ牌とみなす
    const tsumoPai = (haipai.length - 2) % 3 === 0 ? haipai.slice(-1)[0] : null;

    const hand = new Hand(haipai);

    // 副露面子を順に加えるが、空文字列がある場合は最後に加えた面子を副露した直後とみなす
    let lastFulo: string | null = "";
    for (let fuloMentsu of fulos) {
      // 空文字列の場合、最後に加えた面子を副露した直後として処理を終える
      if (fuloMentsu === "") {
        hand._tsumoPai = lastFulo;
        break;
      }

      // 面子を正しい形式に正規化する
      const normalizedFuloMentsu = Hand.validateMentsu(fuloMentsu);
      if (normalizedFuloMentsu) {
        hand._fulos.push(normalizedFuloMentsu);
        lastFulo = normalizedFuloMentsu;
      }
    }

    // 副露直後でない場合は、ツモ牌を加える
    hand._tsumoPai = hand._tsumoPai || tsumoPai || null;

    // 牌姿の手牌部分が'*'で終端する場合は立直後とみなす
    hand._isRiichi = menzenPais.substring(menzenPais.length - 1) === "*";

    return hand;
  }

  /** 立直しているならtrue */
  _isRiichi: boolean;

  /** 打牌可能な場合はツモ牌、または最後に副露した面子、打牌不可な場合はnull */
  _tsumoPai: Pai | string | null;

  /** 副露面子 */
  _fulos: string[];

  /** 副露していない牌の種類と枚数 */
  _menzenPais: MenzenPais;

  constructor(haipai: string[] = []) {
    this._isRiichi = false;
    this._tsumoPai = null;
    this._fulos = [];
    this._menzenPais = {
      _: 0,
      m: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      p: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      s: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      z: [0, 0, 0, 0, 0, 0, 0, 0],
    };

    // 配牌をカウントする
    for (let pai of haipai) {
      if (pai === "_") {
        this._menzenPais._++;
        continue;
      }

      if (Hand.validatePai(pai) === null) {
        throw new Error(`${pai} is invalid against pai.`);
      }

      const paiType = pai[0] as "m" | "p" | "s" | "z";
      const paiNum = +pai[1];

      if (this._menzenPais[paiType][paiNum] >= 4) {
        throw new Error(paiType + paiNum + "is over 4.");
      }

      this._menzenPais[paiType][paiNum]++; // 手牌の枚数を加算

      if (paiType !== "z" && paiNum == 0) {
        this._menzenPais[paiType][5]++; // 赤牌であれば黒牌の枚数も加算する
      }
    }
  }

  /** インスタンスを複製する */
  public clone(): Hand {
    const hand = new Hand();
    hand._menzenPais = {
      _: this._menzenPais._,
      m: this._menzenPais.m.concat(),
      p: this._menzenPais.p.concat(),
      s: this._menzenPais.s.concat(),
      z: this._menzenPais.z.concat(),
    };
    hand._fulos = this._fulos.concat();
    hand._tsumoPai = this._tsumoPai;
    hand._isRiichi = this._isRiichi;

    return hand;
  }

  /** 牌姿を表現する文字列に変換する */
  public toPaishi(): Paishi {
    // 伏せ牌を追加する (ツモ牌が伏せ牌の場合はあとで追加する)
    let paishi = "_".repeat(
      this._menzenPais._ + (this._tsumoPai === "_" ? -1 : 0)
    );

    // 萬子・筒子・索子・字牌の牌姿を作る
    const paiTypes: ("m" | "p" | "s" | "z")[] = ["m", "p", "s", "z"];
    for (let s of paiTypes) {
      let pai: string = s; // 種類を表す文字(m, p, s, z)を追加
      const menzanPais = this._menzenPais[s];
      let numRedPai = s === "z" ? 0 : menzanPais[0]; // 赤牌の枚数

      // 1~9 (字牌は1~7)について牌姿を作っていく
      for (let n = 1; n < menzanPais.length; n++) {
        let numPai = menzanPais[n];

        // 処理中の牌がツモ牌の場合は後で追加する
        if (this._tsumoPai) {
          if (s + n.toString() === this._tsumoPai) {
            numPai--;
          }

          if (n === 5 && s + "0" === this._tsumoPai) {
            numPai--;
            numRedPai--;
          }
        }

        // 赤牌を考慮して牌を追加する
        for (let i = 0; i < numPai; i++) {
          if (n === 5 && numRedPai > 0) {
            pai += "0";
            numRedPai--;
          } else {
            pai += n.toString();
          }
        }
      }
      // その種類の牌がある場合は牌姿に追加する
      if (pai.length > 1) paishi += pai;
    }

    // ツモ牌がある場合は最後に追加する
    if (this._tsumoPai && this._tsumoPai.length <= 2) {
      paishi += this._tsumoPai;
    }

    // 立直後は牌姿の末尾に'*'を追加する
    if (this._isRiichi) {
      paishi += "*";
    }

    // 副露牌を','区切りで追加する
    for (let fulo of this._fulos) {
      paishi += "," + fulo;
    }

    // 副露した直後の場合は末尾に','を追加する
    if (this._tsumoPai && this._tsumoPai.length > 2) {
      paishi += ",";
    }

    return paishi;
  }

  /** 牌姿を表現する文字列から手牌を置き換える */
  public fromPaishi(paishi: Paishi): Hand {
    // 牌姿からインスタンスを生成する
    const hand = Hand.fromString(paishi);

    // インスタンス変数をコピーする
    this._menzenPais = {
      _: hand._menzenPais._,
      m: hand._menzenPais.m.concat(),
      p: hand._menzenPais.p.concat(),
      s: hand._menzenPais.s.concat(),
      z: hand._menzenPais.z.concat(),
    };

    this._fulos = hand._fulos.concat();
    this._tsumoPai = hand._tsumoPai;
    this._isRiichi = hand._isRiichi;

    return this;
  }

  /** 牌をツモる。checkがtrueの場合、多牌となるツモは例外を発生させる。 */
  public tsumo(pai: Pai | "_", check = true): Hand {
    // ツモ直後の場合は多牌となるので例外を発生させる
    if (check && this._tsumoPai) throw new Error("Number of tsumo is over.");

    // 伏せ牌の場合
    if (pai === "_") {
      this._menzenPais._++; // 伏せ牌の枚数を加算する
      this._tsumoPai = pai;
    }
    // 通常の牌の場合
    else {
      // 不正な牌の場合、例外を発生させる
      if (!Hand.validatePai(pai)) throw new Error(`Pai: ${pai} is invalid.`);

      let s = pai[0] as "m" | "p" | "s" | "z";
      let paiIndex = +pai[1];
      let menzenPaisOfType = this._menzenPais[s];

      // 5枚以上になる場合は例外を発生させる
      if (menzenPaisOfType[paiIndex] >= 4) {
        throw new Error(menzenPaisOfType + paiIndex.toString() + " is over 4.");
      }

      menzenPaisOfType[paiIndex]++; // 枚数を加算する

      // 赤牌の場合、対応する黒牌も加算する
      if (paiIndex === 0) {
        if (menzenPaisOfType[5] >= 4)
          throw new Error(menzenPaisOfType + "5" + " is over 4.");
        menzenPaisOfType[5]++;
      }
      this._tsumoPai = s + paiIndex.toString();
    }

    return this;
  }

  /** 打牌する。手牌にない牌または'_'の打牌は例外を発生させる。checkがtrueの場合、少牌となる打牌も例外を発生させる。 */
  public dapai(pai: Pai | string, check = true): Hand {
    // ツモ直後または副露直後以外の場合は少牌となるので例外を発生させる
    if (check && !this._tsumoPai)
      throw new Error("Don't dapai, pai will be starve.");

    // 不正な牌の場合、例外を発生させる
    if (!Hand.validatePai(pai)) throw new Error("pai is invalid.");

    let s = pai[0] as "m" | "p" | "s" | "z";
    let paiIndex = +pai[1];

    this.decrease(s, paiIndex);
    this._tsumoPai = null;
    if (pai.substring(pai.length - 1) === "*") this._isRiichi = true;

    return this;
  }

  /** 副露する。手牌にない構成での副露は例外を発生させる。checkが真の場合、多牌となる副露も例外を発生させる。リーチ後の副露はチェックしない。 */
  public fulo(mentsu: Mentsu, check = true): Hand {
    // ツモ直後の場合、多牌となるので例外を発生させる
    if (check && this._tsumoPai)
      throw new Error("Don't fulo, pai will be overflow.");

    // 不正な面子の場合、例外を発生させる
    if (mentsu !== Hand.validateMentsu(mentsu))
      throw new Error("mentsu is invalid.");

    // 暗カンの場合、例外を発生させる
    if (mentsu.match(/\d{4}$/))
      throw new Error("Don't closed-kan on fulo method.");

    // 加カンの場合、例外を発生させる
    if (mentsu.match(/\d{3}[\+\=\-]\d$/))
      throw new Error("Don't added-kan on fulo method.");

    // 副露に使う牌の枚数を減算する
    let s = mentsu[0] as "m" | "p" | "s" | "z";
    const releasedPais = mentsu.match(/\d(?![\+\=\-])/g) || [""];
    for (let paiIndexStr of releasedPais) {
      this.decrease(s, Number(paiIndexStr));
    }

    // 副露面子に加える
    this._fulos.push(mentsu);

    // 大明カン以外の場合は副露直後の状態にする
    if (!mentsu.match(/\d{4}/)) {
      this._tsumoPai = mentsu;
    }

    return this;
  }

  /** 暗カンまたは加カンする。手牌にない構成でのカンは例外を発生させる。checkがtrueの場合、少牌となるカンも例外を発生させる */
  public kan(mentsu: Mentsu, check = true): Hand {
    // ツモの直後以外はカンできないので例外を発生させる
    if (check && !this._tsumoPai)
      throw new Error("Don't kan (closed or added) except after tsumo");

    // 副露直後はカンできないので例外を発生させる
    if (check && this._tsumoPai && this._tsumoPai.length > 2)
      throw new Error("Don't kan (closed or added) after fulo.");

    // 不正な面子の場合、例外を発生させる
    if (mentsu !== Hand.validateMentsu(mentsu))
      throw new Error("mentsu is invalid.");

    let s = mentsu[0] as "m" | "p" | "s" | "z";
    // 暗カンの場合
    if (mentsu.match(/\d{4}$/)) {
      // カンに使う牌の枚数を減算する
      const releasedPais = mentsu.match(/\d/g) || [""];
      for (let paiIndexStr of releasedPais) {
        this.decrease(s, Number(paiIndexStr));
      }
      // 副露面子に加える
      this._fulos.push(mentsu);
    }
    // 加カンの場合
    else if (mentsu.match(/\d{3}[\+\=\-]\d$/)) {
      // 加カン前の刻子と一致する面子が副露されているかチェックし、副露されていない場合は例外を発生させる
      const kootsu = mentsu.substring(0, 5);
      const i = this._fulos.findIndex((x) => x === kootsu);
      if (i < 0) throw new Error("kootsu before kan is unmatch to kantsu.");

      this._fulos[i] = mentsu;
      this.decrease(
        s,
        Number(mentsu.substring(mentsu.length - 1, mentsu.length))
      );
    } else {
      throw new Error("The kan is unknown.");
    }

    this._tsumoPai = null;

    return this;
  }

  /** 門前の場合にtrueを返す */
  public get isMenzen(): boolean {
    // 暗カン以外の副露数が0個であれば門前となる
    return this._fulos.filter((mentsu) => mentsu.match(/[\+\=\-]/)).length == 0;
  }

  /** 立直している場合にtrueを返す */
  public get isRiichi(): boolean {
    return this._isRiichi;
  }

  /**
   * 打牌可能な牌の一覧を取得する。
   * 赤牌およびツモ切りは別の牌として区別する。
   * 立直後はツモ切りのみを返す。
   * check が true の場合、喰い替えとなる打牌は含まない。
   * 打牌すると少牌となる場合はnullを返す
   */
  public getDapaiCandidates(check = true): string[] | null {
    // ツモ直後または副露直後以外は少牌となるので null を返す
    if (!this._tsumoPai) return null;

    // 喰い替えとなる牌をdenyに格納する
    let deny: { [key: string]: boolean } = {};

    // 副露直後の場合
    if (check && this._tsumoPai.length > 2) {
      const mentsu = this._tsumoPai;
      const s = mentsu[0] as "m" | "p" | "s" | "z";
      const fuloPaiIndex = Number(mentsu.match(/\d(?=[\+\=\-])/)) || 5;
      const pai = (s + fuloPaiIndex.toString()) as Pai;
      deny[pai] = true;

      // 順子の場合、スジの喰い替えも禁止する
      if (!mentsu.replace(/0/, "5").match(/^[mpsz](\d)\1\1/)) {
        if (fuloPaiIndex < 7 && mentsu.match(/^[mps]\d\-\d\d$/))
          deny[s + (fuloPaiIndex + 3)] = true;
        if (3 < fuloPaiIndex && mentsu.match(/^[mps]\d\d\d\-$/))
          deny[s + (fuloPaiIndex - 3)] = true;
      }
    }

    // 打牌可能な牌を追加していく。
    // 副露面子以外から重複しないように追加するが、赤牌とツモ牌は別の牌として扱う
    const dapai: string[] = [];

    // 立直していない場合
    if (!this._isRiichi) {
      const paiTypes: ("m" | "p" | "s" | "z")[] = ["m", "p", "s", "z"];
      for (let s of paiTypes) {
        let menzenPais = this._menzenPais[s];
        for (let n = 1; n < menzenPais.length; n++) {
          // 0枚の牌は打牌できない
          if (menzenPais[n] == 0) continue;

          // 喰い替えとなる牌は打牌できない
          if (deny[s + n]) continue;

          // ツモ牌は最後に加える
          if (s + n == this._tsumoPai && menzenPais[n] == 1) continue;

          // 赤牌以外はそのまま加える
          if (s == "z" || n != 5) {
            const pai = (s + n) as Pai;
            dapai.push(pai);
          }
          // 赤牌を考慮する場合
          else {
            // 赤牌として加える
            if (
              (menzenPais[0] > 0 && s + "0" != this._tsumoPai) ||
              menzenPais[0] > 1
            ) {
              const pai = (s + "0") as Pai;
              dapai.push(pai);
            }

            // 赤牌以外として加える
            if (menzenPais[0] < menzenPais[5]) {
              const pai = (s + n) as Pai;
              dapai.push(pai);
            }
          }
        }
      }
    }

    // 最後にツモ牌を加える
    if (this._tsumoPai.length == 2) {
      dapai.push(this._tsumoPai + "_");
    }

    return dapai;
  }

  /**
   * 牌でチー可能な面子の一覧を返す。
   * 赤牌のありなしは別の面子として区別する。
   * 立直後は空配列を返す。
   * check が真の場合、喰い替えが必ず起きる面子は含まない。
   * チーすると多牌になる場合は null を返す。
   * */
  public getChiCandidates(pai: Pai | string, check = true): Mentsu[] | null {
    // ツモ直後の場合、多牌となるのでnullを返す
    if (this._tsumoPai) return null;

    // 不正な牌の場合、例外を発生させる
    if (!Hand.validatePai(pai)) throw new Error("pai is invalid.");

    let mianChiCandidates: Mentsu[] = [];
    let s = pai[0] as "m" | "p" | "s" | "z";
    let n = +pai[1] || 5;
    const directionOrNull = pai.match(/[\+\=\-]$/);

    // 方向 (下家: +, 対面: =, 上家: -)が指定されていない場合は例外を発生させる
    if (!directionOrNull) throw new Error("direction is null.");

    const direction = directionOrNull.toString();

    // 上家からの数牌以外はチーできない
    if (s === "z" || direction !== "-") return mianChiCandidates;

    // 立直後はチーできない
    if (this._isRiichi) return mianChiCandidates;

    let menzenPais = this._menzenPais[s];

    // 喰い替えと赤牌を考慮してmianChiCandidatesにチー可能な面子を追加していく

    // 鳴く牌が左に当たる場合
    if (3 <= n && menzenPais[n - 2] > 0 && menzenPais[n - 1] > 0) {
      if (
        !check ||
        (3 < n ? menzenPais[n - 3] : 0) + menzenPais[n] <
          14 - (this._fulos.length + 1) * 3
      ) {
        if (n - 2 == 5 && menzenPais[0] > 0) mianChiCandidates.push(s + "067-");
        if (n - 1 == 5 && menzenPais[0] > 0) mianChiCandidates.push(s + "406-");
        if ((n - 2 != 5 && n - 1 != 5) || menzenPais[0] < menzenPais[5])
          mianChiCandidates.push(
            s + (n - 2) + (n - 1) + (pai[1] + directionOrNull)
          );
      }
    }
    // 鳴く牌が中央に当たる場合
    if (2 <= n && n <= 8 && menzenPais[n - 1] > 0 && menzenPais[n + 1] > 0) {
      if (!check || menzenPais[n] < 14 - (this._fulos.length + 1) * 3) {
        if (n - 1 == 5 && menzenPais[0] > 0) mianChiCandidates.push(s + "06-7");
        if (n + 1 == 5 && menzenPais[0] > 0) mianChiCandidates.push(s + "34-0");
        if ((n - 1 != 5 && n + 1 != 5) || menzenPais[0] < menzenPais[5])
          mianChiCandidates.push(
            s + (n - 1) + (pai[1] + directionOrNull) + (n + 1)
          );
      }
    }
    // 鳴く牌が右に当たる場合
    if (n <= 7 && menzenPais[n + 1] > 0 && menzenPais[n + 2] > 0) {
      if (
        !check ||
        menzenPais[n] + (n < 7 ? menzenPais[n + 3] : 0) <
          14 - (this._fulos.length + 1) * 3
      ) {
        if (n + 1 == 5 && menzenPais[0] > 0) mianChiCandidates.push(s + "4-06");
        if (n + 2 == 5 && menzenPais[0] > 0) mianChiCandidates.push(s + "3-40");
        if ((n + 1 != 5 && n + 2 != 5) || menzenPais[0] < menzenPais[5])
          mianChiCandidates.push(
            s + (pai[1] + directionOrNull) + (n + 1) + (n + 2)
          );
      }
    }
    return mianChiCandidates;
  }

  /**
   * 牌でポン可能な面子の一覧を返す。
   * 赤牌のありなしは別の面子として区別する。
   * 立直後は空配列を返す。
   * ポンすると多牌になる場合は null を返す。
   */
  public getPonCandidates(pai: Pai | string): Mentsu[] | null {
    // ツモ直後の場合、多牌となるのでnullを返す
    if (this._tsumoPai) return null;

    // 不正な牌の場合、例外を発生させる
    if (!Hand.validatePai(pai)) throw new Error("pai is invalid.");

    let ponCandidates: Mentsu[] = [];
    const s = pai[0] as "m" | "p" | "s" | "z";
    const n = +pai[1] || 5;
    const directionOrNull = pai.match(/[\+\=\-]$/);

    // 方向 (下家: +, 対面: =, 上家: -)が指定されていない場合は例外を発生させる
    if (!directionOrNull) throw new Error("direction is null.");

    const direction = directionOrNull.toString();

    // 立直後はポンできない
    if (this._isRiichi) return ponCandidates;

    let menzenPais = this._menzenPais[s];

    // 赤牌を考慮してポン可能な面子を追加していく

    if (menzenPais[n] >= 2) {
      if (n === 5 && menzenPais[0] >= 2)
        ponCandidates.push(s + "00" + pai[1] + direction);
      if (n === 5 && menzenPais[0] >= 1 && menzenPais[5] - menzenPais[0] >= 1)
        ponCandidates.push(s + "50" + pai[1] + direction);
      if (n !== 5 || menzenPais[5] - menzenPais[0] >= 2)
        ponCandidates.push(s + n + n + pai[1] + direction);
    }
    return ponCandidates;
  }

  /**
   * 牌が指定された場合、その牌で大明カン可能な面子の一覧を返す。
   * 牌が指定されていない場合、加カンまたは暗カン可能な面子の一覧を返す。
   * 立直後は送りカンを含まない。
   * カンすると少牌あるいは多牌になる場合はnullを返す。
   */
  public getKanCandidates(
    paiOrUndefined: Pai | string | undefined
  ): Mentsu[] | null {
    let kanCandidates: Mentsu[] = [];

    // 大明カンの場合
    if (paiOrUndefined !== undefined) {
      // ツモ直後の場合、多牌となるのでnullを返す
      if (this._tsumoPai) return null;

      // 不正な牌の場合、例外を発生させる
      if (!Hand.validatePai(paiOrUndefined)) throw new Error("pai is invalid.");

      const s = paiOrUndefined[0] as "m" | "p" | "s" | "z";
      const n = +paiOrUndefined[1] || 5;
      const directionOrNull = paiOrUndefined.match(/[\+\=\-]$/);

      // 方向 (下家: +, 対面: =, 上家: -)が指定されていない場合は例外を発生させる
      if (!directionOrNull) throw new Error("direction is null.");

      const direction = directionOrNull.toString();

      // 立直後はポンできない
      if (this._isRiichi) return kanCandidates;

      let menzenPais = this._menzenPais[s];
      if (menzenPais[n] === 3) {
        if (n === 5) {
          kanCandidates = [
            s +
              "5".repeat(3 - menzenPais[0]) +
              "0".repeat(menzenPais[0]) +
              paiOrUndefined[1] +
              direction,
          ];
        } else {
          kanCandidates = [s + n + n + n + n + direction];
        }
      }
    }
    // 暗カン・加カンの場合
    else {
      //ツモの直後以外は暗カン・加カンできないのでnullを返す
      if (!this._tsumoPai) return null;
      if (this._tsumoPai.length > 2) return null;

      let pai = this._tsumoPai.replace(/0/, "5");

      const paiTypes: ("m" | "p" | "s" | "z")[] = ["m", "p", "s", "z"];
      for (let s of paiTypes) {
        let menzenPais = this._menzenPais[s];

        for (let n = 1; n < menzenPais.length; n++) {
          // 0枚の牌はカンできない
          if (menzenPais[n] === 0) continue;

          // 暗カン可能な場合
          if (menzenPais[n] === 4) {
            // 立直後は送りカンできない
            if (this._isRiichi && s + n != pai) continue;

            // 赤牌を考慮して暗カンを加える
            if (n === 5) {
              kanCandidates.push(
                s + "5".repeat(4 - menzenPais[0]) + "0".repeat(menzenPais[0])
              );
            } else kanCandidates.push(s + n + n + n + n);
          }
          // その他の場合
          else {
            // 立直後は加カンできない
            if (this._isRiichi) continue;

            // 副露面子に該当の牌で加カンできる刻子があれば、槓子として追加する
            for (let fuloMentsu of this._fulos) {
              if (
                fuloMentsu.replace(/0/g, "5").substring(0, 4) ===
                s + n + n + n
              ) {
                if (n == 5 && menzenPais[0] > 0)
                  kanCandidates.push(fuloMentsu + 0);
                else kanCandidates.push(fuloMentsu + n);
              }
            }
          }
        }
      }
    }
    return kanCandidates;
  }

  /** 牌の枚数を減算する内部メソッド */
  private decrease(s: "m" | "p" | "s" | "z", paiIndex: number): void {
    let menzenPaisOfType = this._menzenPais[s];

    // 存在しない牌を打牌しようとしている場合、伏せ牌があれば伏せ牌を打牌すると解釈する
    // 伏せ牌がなければ例外を発生させる
    if (
      menzenPaisOfType[paiIndex] === 0 ||
      (paiIndex === 5 && menzenPaisOfType[0] === menzenPaisOfType[5])
    ) {
      if (this._menzenPais._ == 0)
        throw new Error("Could not decrese.The pai does not exist.");
      this._menzenPais._--;
    } else {
      // FIXME:
      // ここでは本来はインスタンス変数を減算したいはずだが、インスタンス変数の参照(?)を減算している
      // menzenPaisOfType を書き換えれば this._menzenPais[s] も書き換わっているか確認する。
      // https://github.com/kobalab/majiang-core/blob/master/lib/shoupai.js#L158

      // 牌の枚数を減算する
      // 赤牌の場合は対応する黒牌も減算する
      menzenPaisOfType[paiIndex]--;
      if (paiIndex === 0) menzenPaisOfType[5]--;
    }
  }
}

export default Hand;
