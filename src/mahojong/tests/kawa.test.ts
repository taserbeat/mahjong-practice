import { Kawa } from "../kawa";

describe("コンストラクタ", () => {
  it("インスタンス生成時は捨て牌の長さが0であること", () => {
    expect(new Kawa().pai.length).toBe(0);
  });
});

describe("dapaiメソッド", () => {
  it("不正な打牌ができないこと", () => {
    expect(() => {
      new Kawa().dapai("z8");
    }).toThrow();
  });

  it("打牌後捨て牌の長さが1増えること", () => {
    const kawa = new Kawa();
    const pais = ["m1", "m2", "p3", "p4", "s5", "s6", "z1"];

    for (let pai of pais) {
      const expected = kawa.pai.length + 1;
      kawa.dapai(pai);
      const actual = kawa.pai.length;
      expect(actual).toBe(expected);
    }
  });

  it("ツモ切りを表現できること", () => {
    const kawa = new Kawa();

    expect(kawa.dapai("m1_").pai.pop()).toBe("m1_");
  });

  it("リーチを表現できること", () => {
    const kawa = new Kawa();

    expect(new Kawa().dapai("m1*").pai.pop()).toBe("m1*");
  });

  it("ツモ切りリーチを表現できること", () => {
    const kawa = new Kawa();

    expect(new Kawa().dapai("m1_*").pai.pop()).toBe("m1_*");
  });
});

describe("fuloメソッド", () => {
  it("不正な面子で鳴けないこと", () => {
    expect(() => new Kawa().dapai("m1").fulo("m1-")).toThrow();
    expect(() => new Kawa().dapai("m1").fulo("m1111")).toThrow();
    expect(() => new Kawa().dapai("m1").fulo("m12-3")).toThrow();
  });

  it("鳴かれても捨て牌の長さが変わらないこと", () => {
    const kawa = new Kawa().dapai("m1_");
    expect(kawa.pai.length).toBe(kawa.fulo("m111+").pai.length);
  });

  it("誰から鳴かれたか表現できること", () => {
    const kawa = new Kawa().dapai("m2*");
    expect(kawa.fulo("m12-3").pai.pop()).toBe("m2*-");
  });
});

describe("isFuritenメソッド", () => {
  const kawa = new Kawa();

  it("捨てられた牌を探せること", () => {
    expect(kawa.dapai("m1").isFuriten("m1")).toBeTruthy();
  });

  it("ツモ切りの牌を探せること", () => {
    expect(kawa.dapai("m2_").isFuriten("m2")).toBeTruthy();
  });

  it("リーチ打牌を探せること", () => {
    expect(kawa.dapai("m3*").isFuriten("m3")).toBeTruthy();
  });

  it("赤牌を探せること", () => {
    expect(kawa.dapai("m0").isFuriten("m5")).toBeTruthy();
  });

  it("鳴かれた牌を探せること", () => {
    expect(kawa.dapai("m4_").fulo("m234-").isFuriten("m4")).toBeTruthy();
  });

  it("入力が正規化されていない場合でも探せること", () => {
    expect(kawa.isFuriten("m0_*")).toBeTruthy();
  });
});
