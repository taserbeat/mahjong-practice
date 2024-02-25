import Pai from "../pai";
import Paiyama from "../paiyama";

describe("static getDora メソッド", () => {
  it("一萬 → 二萬", () => {
    expect(Paiyama.getDora("m1")).toBe("m2");
  });

  it("九萬 → 一萬", () => {
    expect(Paiyama.getDora("m9")).toBe("m1");
  });

  it("赤五萬 → 六萬", () => {
    expect(Paiyama.getDora("m0")).toBe("m6");
  });

  it("一筒 → 二筒", () => {
    expect(Paiyama.getDora("p1")).toBe("p2");
  });

  it("九筒 → 一筒", () => {
    expect(Paiyama.getDora("p9")).toBe("p1");
  });

  it("赤五筒 → 六筒", () => {
    expect(Paiyama.getDora("p0")).toBe("p6");
  });

  it("一索 → 二索", () => {
    expect(Paiyama.getDora("s1")).toBe("s2");
  });

  it("九索 → 一索", () => {
    expect(Paiyama.getDora("s9")).toBe("s1");
  });

  it("赤五索 → 六索", () => {
    expect(Paiyama.getDora("s0")).toBe("s6");
  });

  it("東 → 南", () => {
    expect(Paiyama.getDora("z1")).toBe("z2");
  });

  it("北 → 東", () => {
    expect(Paiyama.getDora("z4")).toBe("z1");
  });

  it("白 → 發", () => {
    expect(Paiyama.getDora("z5")).toBe("z6");
  });

  it("中 → 白", () => {
    expect(Paiyama.getDora("z7")).toBe("z5");
  });

  it("不正な牌 → エラー", () => {
    const invalidPai = "z0" as Pai;

    expect(() => Paiyama.getDora(invalidPai)).toThrow();
  });
});

describe("コンストラクタ", () => {
  it("インスタンスが生成できること", () => {
    const pais =
      "m0,m1,m1,m1,m1,m2,m2,m2,m2,m3,m3,m3,m3,m4,m4,m4,m4,m5,m5,m5," +
      "m6,m6,m6,m6,m7,m7,m7,m7,m8,m8,m8,m8,m9,m9,m9,m9," +
      "p0,p1,p1,p1,p1,p2,p2,p2,p2,p3,p3,p3,p3,p4,p4,p4,p4,p5,p5,p5," +
      "p6,p6,p6,p6,p7,p7,p7,p7,p8,p8,p8,p8,p9,p9,p9,p9," +
      "s0,s1,s1,s1,s1,s2,s2,s2,s2,s3,s3,s3,s3,s4,s4,s4,s4,s5,s5,s5," +
      "s6,s6,s6,s6,s7,s7,s7,s7,s8,s8,s8,s8,s9,s9,s9,s9," +
      "z1,z1,z1,z1,z2,z2,z2,z2,z3,z3,z3,z3,z4,z4,z4,z4," +
      "z5,z5,z5,z5,z6,z6,z6,z6,z7,z7,z7,z7";

    expect(new Paiyama()._pais.concat().sort().join()).toBe(pais);
  });

  // TODO:
  // 赤牌有無ルールを変更できる機能を実装した場合、赤牌枚数を確認するテストを追加する
  // it("赤牌を指定してインスタンスが生成できること", () => {});
});

describe("remainTsumoCount プロパティ", () => {
  it("牌山生成直後の残牌数は122", () => {
    expect(new Paiyama().remainTsumoCount).toBe(122);
  });
});

describe("doraDisplayPais プロパティ", () => {
  it("牌山生成直後のドラは1枚", () => {
    expect(new Paiyama().doraDisplayPais.length).toBe(1);
  });
});

describe("backDoraDisplayPais プロパティ", () => {
  it("牌山生成直後は null を返す", () => {
    expect(new Paiyama().backDoraDisplayPais).toBeNull();
  });

  it("牌山固定後は裏ドラを返す", () => {
    expect(new Paiyama().lock().backDoraDisplayPais?.length).toBe(1);
  });
});

describe("tsumo メソッド", () => {
  it("牌山生成直後にツモれること", () => {
    expect(new Paiyama().tsumo()).toBeTruthy();
  });

  it("ツモ後に残牌数が減ること", () => {
    const paiyama = new Paiyama();
    const remainTsumoCountAtInit = paiyama.remainTsumoCount;

    paiyama.tsumo();

    expect(paiyama.remainTsumoCount).toBe(remainTsumoCountAtInit - 1);
  });

  it("王牌はツモれないこと", () => {
    const paiyama = new Paiyama();
    while (paiyama.remainTsumoCount > 0) {
      paiyama.tsumo();
    }

    expect(() => paiyama.tsumo()).toThrow();
  });

  it("牌山固定後はツモれないこと", () => {
    expect(() => new Paiyama().lock().tsumo()).toThrow();
  });
});

describe("kanTsumo メソッド", () => {
  it("牌山生成直後に槓ツモできること", () => {
    expect(new Paiyama().kanTsumo()).toBeTruthy();
  });

  it("槓ツモ後に残牌数が減ること", () => {
    const paiyama = new Paiyama();
    const remainTsumoCountAtInit = paiyama.remainTsumoCount;

    paiyama.kanTsumo();

    expect(paiyama.remainTsumoCount).toBe(remainTsumoCountAtInit - 1);
  });

  it("槓ツモ直後はツモれないこと", () => {
    const paiyama = new Paiyama();
    paiyama.kanTsumo();

    expect(() => paiyama.tsumo()).toThrow();
  });

  it("槓ツモ直後に続けて槓ツモできないこと", () => {
    const paiyama = new Paiyama();
    paiyama.kanTsumo();

    expect(() => paiyama.kanTsumo()).toThrow();
  });

  it("ハイテイで槓ツモできないこと", () => {
    const paiyama = new Paiyama();

    while (paiyama.remainTsumoCount > 0) {
      paiyama.tsumo();
    }

    expect(() => paiyama.kanTsumo()).toThrow();
  });

  it("牌山固定後は槓ツモできないこと", () => {
    expect(() => new Paiyama().lock().kanTsumo()).toThrow();
  });

  it("5つ目の槓ツモができないこと", () => {
    const paiyama = new Paiyama();
    for (let i = 0; i < 4; i++) {
      paiyama.kanTsumo();
      paiyama.openNewDoraDisplayPai();
    }

    expect(() => paiyama.kanTsumo()).toThrow();
  });
});

describe("openNewDoraDisplayPai メソッド", () => {
  it("牌山生成直後に開槓できないこと", () => {
    expect(() => new Paiyama().openNewDoraDisplayPai()).toThrow();
  });

  it("槓ツモ後に開槓できること", () => {
    const paiyama = new Paiyama();
    paiyama.kanTsumo();

    expect(paiyama.openNewDoraDisplayPai()).toBeTruthy();
  });

  it("開槓によりドラが増えること", () => {
    const paiyama = new Paiyama();
    paiyama.kanTsumo();
    const numDora = paiyama.doraDisplayPais.length;

    expect(paiyama.openNewDoraDisplayPai().doraDisplayPais.length).toBe(
      numDora + 1
    );
  });

  it("開槓により裏ドラが増えること", () => {
    const paiyama = new Paiyama();
    paiyama.kanTsumo();

    expect(
      paiyama.openNewDoraDisplayPai().lock().backDoraDisplayPais?.length
    ).toBe(2);
  });

  it("開槓後はツモできること", () => {
    const paiyama = new Paiyama();
    paiyama.kanTsumo();

    expect(paiyama.openNewDoraDisplayPai().tsumo()).toBeTruthy();
  });

  it("開槓後は槓ツモできること", () => {
    const paiyama = new Paiyama();
    paiyama.kanTsumo();

    expect(paiyama.openNewDoraDisplayPai().kanTsumo()).toBeTruthy();
  });

  it("牌山固定後は開槓できないこと", () => {
    const paiyama = new Paiyama();
    paiyama.kanTsumo();

    expect(() => paiyama.lock().openNewDoraDisplayPai()).toThrow();
  });
});
