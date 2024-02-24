import Hand from "../hand";
import Pai from "../pai";

describe("static validatePai メソッド", () => {
  it("m1  : 正常", () => {
    expect(Hand.validatePai("m1")).toEqual("m1");
  });

  it("p2_  : 正常 (ツモ切り)", () => {
    expect(Hand.validatePai("p2_")).toEqual("p2_");
  });

  it("s3*  : 正常 (立直)", () => {
    expect(Hand.validatePai("s3*")).toEqual("s3*");
  });

  it("z4_*  : 正常 (ツモ切り・立直)", () => {
    expect(Hand.validatePai("z4_*")).toEqual("z4_*");
  });

  it("m0-  : 正常(被副露)", () => {
    expect(Hand.validatePai("m0-")).toEqual("m0-");
  });
  it("p5_+  : 正常(ツモ切り・被副露)", () => {
    expect(Hand.validatePai("p5_+")).toEqual("p5_+");
  });

  it("s6*=  : 正常(立直・被副露)", () => {
    expect(Hand.validatePai("s6*=")).toEqual("s6*=");
  });

  it("z7_*-  : 正常(ツモ切り・立直・被副露)", () => {
    expect(Hand.validatePai("z7_*-")).toEqual("z7_*-");
  });

  it("_  : 不正(裏向き牌)", () => {
    expect(Hand.validatePai("_")).toBeNull();
  });

  it("x  : 不正", () => {
    expect(Hand.validatePai("x")).toBeNull();
  });

  it("mm  : 不正", () => {
    expect(Hand.validatePai("mm")).toBeNull();
  });

  it("z0  : 不正", () => {
    expect(Hand.validatePai("z0")).toBeNull();
  });

  it("z8  : 不正", () => {
    expect(Hand.validatePai("z8")).toBeNull();
  });

  it("m9x  : 不正", () => {
    expect(Hand.validatePai("m9x")).toBeNull();
  });

  it("m9=*  : 不正", () => {
    expect(Hand.validatePai("m9=*")).toBeNull();
  });

  it("m9*_  : 不正", () => {
    expect(Hand.validatePai("m9*_")).toBeNull();
  });

  it("m9=_  : 不正", () => {
    expect(Hand.validatePai("m9=_")).toBeNull();
  });
});

describe("static validateMentsu メソッド", () => {
  it("m111+  : 正常", () => {
    expect(Hand.validateMentsu("m111+")).toEqual("m111+");
  });

  it("p555=  : 正常", () => {
    expect(Hand.validateMentsu("p555=")).toEqual("p555=");
  });

  it("s999-  : 正常", () => {
    expect(Hand.validateMentsu("s999-")).toEqual("s999-");
  });

  it("z777+7 : 正常", () => {
    expect(Hand.validateMentsu("z777+7")).toEqual("z777+7");
  });

  it("m2222  : 正常", () => {
    expect(Hand.validateMentsu("m2222")).toEqual("m2222");
  });

  it("p550=  : 正常", () => {
    expect(Hand.validateMentsu("p550=")).toEqual("p550=");
  });

  it("p5550= : 正常", () => {
    expect(Hand.validateMentsu("p5550=")).toEqual("p5550=");
  });

  it("p055=  : 正常 => p505=", () => {
    expect(Hand.validateMentsu("p055=")).toEqual("p505=");
  });

  it("p055=0 : 正常 => p505=0", () => {
    expect(Hand.validateMentsu("p055=0")).toEqual("p505=0");
  });

  it("p000=0 : 正常", () => {
    expect(Hand.validateMentsu("p000=0")).toEqual("p000=0");
  });

  it("s0555- : 正常 => s5505-", () => {
    expect(Hand.validateMentsu("s0555-")).toEqual("s5505-");
  });

  it("s0055- : 正常 => s5005-", () => {
    expect(Hand.validateMentsu("s0055-")).toEqual("s5005-");
  });

  it("s0005  : 正常 => s5000", () => {
    expect(Hand.validateMentsu("s0005")).toEqual("s5000");
  });

  it("s0000  : 正常 => s0000", () => {
    expect(Hand.validateMentsu("s0000")).toEqual("s0000");
  });

  it("m1-23  : 正常", () => {
    expect(Hand.validateMentsu("m1-23")).toEqual("m1-23");
  });

  it("m12-3  : 正常", () => {
    expect(Hand.validateMentsu("m12-3")).toEqual("m12-3");
  });

  it("m123-  : 正常", () => {
    expect(Hand.validateMentsu("m123-")).toEqual("m123-");
  });

  it("m231-  : 正常 => m1-23", () => {
    expect(Hand.validateMentsu("m231-")).toEqual("m1-23");
  });

  it("m312-  : 正常 => m12-3", () => {
    expect(Hand.validateMentsu("m312-")).toEqual("m12-3");
  });

  it("m3-12  : 正常 => m123-", () => {
    expect(Hand.validateMentsu("m3-12")).toEqual("m123-");
  });

  it("m460-  : 正常 => m40-6", () => {
    expect(Hand.validateMentsu("m460-")).toEqual("m40-6");
  });

  it("m1234- : 不正", () => {
    expect(Hand.validateMentsu("m1234-")).toBeNull();
  });

  it("m135-  : 不正", () => {
    expect(Hand.validateMentsu("m135-")).toBeNull();
  });

  it("m1234  : 不正", () => {
    expect(Hand.validateMentsu("m1234")).toBeNull();
  });

  it("m123   : 不正", () => {
    expect(Hand.validateMentsu("m123")).toBeNull();
  });

  it("m111   : 不正", () => {
    expect(Hand.validateMentsu("m111")).toBeNull();
  });

  it("z111=0 : 不正", () => {
    expect(Hand.validateMentsu("z111=0")).toBeNull();
  });
});

describe("コンストラクタ", () => {
  it("引数なしでインスタンスが生成できる", () => {
    expect(new Hand()).toBeInstanceOf(Hand);
  });

  it("配牌を指定してインスタンスが生成できる", () => {
    const haipai = [
      "m0",
      "m1",
      "m9",
      "p0",
      "p1",
      "p9",
      "s0",
      "s1",
      "s9",
      "z1",
      "z2",
      "z6",
      "z7",
    ];

    expect(new Hand(haipai)).toBeInstanceOf(Hand);
  });

  it("裏向きの牌を指定してインスタンスが生成できる", () => {
    expect(new Hand(["_"])).toBeInstanceOf(Hand);
  });

  it("不正な牌を含む配牌で例外が発生する", () => {
    expect(() => new Hand(["z0"])).toThrow();
  });

  it("5枚目の牌を含む配牌で例外が発生すること", () => {
    expect(() => new Hand(["m1", "m1", "m1", "m1", "m1"])).toThrow();
  });
});

describe("static fromString メソッド", () => {
  it("引数なしでインスタンスが生成できる", () => {
    expect(Hand.fromString().toPaishi()).toEqual("");
  });

  it("空の文字列からインスタンスが生成できる", () => {
    expect(Hand.fromString("").toPaishi()).toEqual("");
  });

  it("副露なしの場合にインスタンスが生成できる", () => {
    expect(Hand.fromString("z7654s987p654m321").toPaishi()).toEqual(
      "m123p456s789z4567"
    );
  });

  it("副露ありの場合でもインスタンスが生成できる", () => {
    expect(Hand.fromString("m1,p123-,s555=,z777+7,m9999").toPaishi()).toEqual(
      "m1,p123-,s555=,z777+7,m9999"
    );
  });

  it("伏せ牌がある場合でもインスタンスが生成できる", () => {
    expect(Hand.fromString("m123p456s789____").toPaishi()).toEqual(
      "____m123p456s789"
    );
  });

  it("伏せ牌がある場合でもインスタンスが生成できること(副露あり)", () => {
    expect(Hand.fromString("m123p456____,s789-").toPaishi()).toEqual(
      "____m123p456,s789-"
    );
  });

  it("少牌の場合でもインスタンスが生成できること", () => {
    expect(Hand.fromString("m111p222s333").toPaishi()).toEqual("m111p222s333");
  });

  it("多牌の場合、14枚としてからインスタンスを生成すること", () => {
    expect(Hand.fromString("m123456789p123456").toPaishi()).toEqual(
      "m123456789p1234p5"
    );
  });

  it("多牌の場合、14枚としてからインスタンスを生成すること(副露あり)", () => {
    expect(Hand.fromString("m123456789p123,z111=").toPaishi()).toEqual(
      "m123456789p1p2,z111="
    );

    expect(Hand.fromString("m123,z111=,p123-,s555=,z777+").toPaishi()).toEqual(
      "m1m2,z111=,p123-,s555=,z777+"
    );
  });

  it("ツモ牌を再現してインスタンスを生成すること", () => {
    expect(Hand.fromString("m11123456789991").toPaishi()).toEqual(
      "m1112345678999m1"
    );
  });

  it("ツモ牌を再現してインスタンスを生成すること(赤牌をツモ)", () => {
    expect(Hand.fromString("m11123456789990").toPaishi()).toEqual(
      "m1112345678999m0"
    );
  });

  it("ツモ牌を再現してインスタンスを生成すること(副露あり)", () => {
    expect(Hand.fromString("m12p345s678z23m3,z111=").toPaishi()).toEqual(
      "m12p345s678z23m3,z111="
    );
  });

  it("手牌中の赤牌を再現してインスタンスを生成すること", () => {
    expect(Hand.fromString("m5550p5500s0000z00").toPaishi()).toEqual(
      "m0555p0055s0000"
    );
  });

  it("リーチを再現してインスタンスを生成すること", () => {
    expect(Hand.fromString("m123p456s789z1112*").toPaishi()).toEqual(
      "m123p456s789z1112*"
    );
  });

  it("リーチを再現してインスタンスを生成すること(暗槓あり)", () => {
    expect(Hand.fromString("m123p456s789z2*,z1111").toPaishi()).toEqual(
      "m123p456s789z2*,z1111"
    );
  });

  it("リーチを再現してインスタンスを生成すること(副露あり)", () => {
    expect(Hand.fromString("m123p456s789z2*,z111+").toPaishi()).toEqual(
      "m123p456s789z2*,z111+"
    );
  });

  it("副露面子を正規化してインスタンスを生成すること(チー)", () => {
    expect(Hand.fromString("m123p456s789z2,m403-").toPaishi()).toEqual(
      "m123p456s789z2,m3-40"
    );

    expect(Hand.fromString("m123p456s789z2,m304-").toPaishi()).toEqual(
      "m123p456s789z2,m34-0"
    );

    expect(Hand.fromString("m123p456s789z2,m345-").toPaishi()).toEqual(
      "m123p456s789z2,m345-"
    );
  });

  it("副露面子を正規化してインスタンスを生成すること(ポン)", () => {
    expect(Hand.fromString("m123p456s789z2,p050+").toPaishi()).toEqual(
      "m123p456s789z2,p500+"
    );

    expect(Hand.fromString("m123p456s789z2,p055+").toPaishi()).toEqual(
      "m123p456s789z2,p505+"
    );

    expect(Hand.fromString("m123p456s789z2,p550+").toPaishi()).toEqual(
      "m123p456s789z2,p550+"
    );
  });

  it("副露面子を正規化してインスタンスを生成すること(カン)", () => {
    expect(Hand.fromString("m123p456s789z2,s0555=").toPaishi()).toEqual(
      "m123p456s789z2,s5505="
    );

    expect(Hand.fromString("m123p456s789z2,s0050=").toPaishi()).toEqual(
      "m123p456s789z2,s5000="
    );

    expect(Hand.fromString("m123p456s789z2,s0505").toPaishi()).toEqual(
      "m123p456s789z2,s5500"
    );
  });

  it("不正な副露面子を無視してインスタンスを生成すること(不正な牌)", () => {
    expect(Hand.fromString("m123p456s789z2,z000+").toPaishi()).toEqual(
      "m123p456s789z2"
    );

    expect(Hand.fromString("m123p456s789z2,z888+").toPaishi()).toEqual(
      "m123p456s789z2"
    );
  });

  it("不正な副露面子を無視してインスタンスを生成すること(字牌でのチー)", () => {
    expect(Hand.fromString("m123p456s789z2,z1-23").toPaishi()).toEqual(
      "m123p456s789z2"
    );
  });

  it("不正な副露面子を無視してインスタンスを生成すること(下家からのチー)", () => {
    expect(Hand.fromString("m123p456s789z2,s1+23").toPaishi()).toEqual(
      "m123p456s789z2"
    );
  });

  it("不正な副露面子を無視してインスタンスを生成すること(対子)", () => {
    expect(Hand.fromString("m123p456s789z2,z11-").toPaishi()).toEqual(
      "m123p456s789z2"
    );
  });

  it("不正な副露面子を無視してインスタンスを生成すること(両嵌)", () => {
    expect(Hand.fromString("m123p456s789z2,s13-5").toPaishi()).toEqual(
      "m123p456s789z2"
    );
  });

  it("不正な副露面子を無視してインスタンスを生成すること(連子)", () => {
    expect(Hand.fromString("m123p456s789z2,m1p2s3-").toPaishi()).toEqual(
      "m123p456s789z2"
    );
  });

  it("副露直後の手牌を再現してインスタンスを生成すること", () => {
    expect(Hand.fromString("p456s789z1,m12-3,p999=,").toPaishi()).toEqual(
      "p456s789z1,m12-3,p999=,"
    );
  });
});

describe("clone メソッド", () => {
  it("インスタンスを複製すると参照が異なる", () => {
    const hand = new Hand();
    expect(hand.clone()).not.toBe(hand);
  });

  it("手牌を再現してインスタンスを複製すること", () => {
    const hand = Hand.fromString("m123p456s789z4567");
    expect(hand.clone().toPaishi()).toBe(hand.toPaishi());
  });

  it("副露を再現してインスタンスを複製すること", () => {
    const hand = Hand.fromString("m1,p123-,s555=,z777+7,m9999");
    expect(hand.clone().toPaishi()).toBe(hand.toPaishi());
  });

  it("ツモ牌を再現してインスタンスを複製すること", () => {
    const hand = Hand.fromString("m11123456789991");
    expect(hand.clone().toPaishi()).toBe(hand.toPaishi());
  });

  it("リーチを再現してインスタンスを複製すること", () => {
    const hand = Hand.fromString("m123p456s789z1112*");
    expect(hand.clone().toPaishi()).toBe(hand.toPaishi());
  });

  it("伏せ牌を再現してインスタンスを複製すること", () => {
    const hand = Hand.fromString("___________,m123-");
    expect(hand.clone().toPaishi()).toBe(hand.toPaishi());
  });

  it("複製後のツモが複製前の手牌に影響しないこと", () => {
    const hand = Hand.fromString("m123p456s789z4567");
    expect(hand.clone().tsumo("m1").toPaishi()).not.toBe(hand.toPaishi());
  });

  it("複製後の打牌が複製前の手牌に影響しないこと", () => {
    const hand = Hand.fromString("m123p456s789z34567");
    expect(hand.clone().dapai("m1").toPaishi()).not.toBe(hand.toPaishi());
  });

  it("複製後の副露が複製前の手牌に影響しないこと", () => {
    const hand = Hand.fromString("m123p456s789z1167");
    expect(hand.clone().fulo("z111=").toPaishi()).not.toBe(hand.toPaishi());
  });

  it("複製後のカンが複製前の手牌に影響しないこと", () => {
    const hand = Hand.fromString("m123p456s789z11112");
    expect(hand.clone().kan("z1111").toPaishi()).not.toBe(hand.toPaishi());
  });

  it("複製後のリーチが複製前の手牌に影響しないこと", () => {
    const hand = Hand.fromString("m123p456s789z11223");
    expect(hand.clone().dapai("z3*").toPaishi()).not.toBe(hand.toPaishi());
  });
});

describe("fromString メソッド", () => {
  it("牌姿から手牌を更新できること", () => {
    expect(new Hand().fromPaishi("m123p456s789z1122z2").toPaishi()).toBe(
      "m123p456s789z1122z2"
    );
  });

  it("副露あり", () => {
    expect(new Hand().fromPaishi("m123p456s789z2,z111=").toPaishi()).toBe(
      "m123p456s789z2,z111="
    );
  });

  it("リーチ後", () => {
    expect(new Hand().fromPaishi("m123p456s789z1122*").toPaishi()).toBe(
      "m123p456s789z1122*"
    );
  });

  it("伏せ牌あり", () => {
    expect(new Hand().fromPaishi("__________,z111=").toPaishi()).toBe(
      "__________,z111="
    );
  });
});

describe("tsumo メソッド", () => {
  it("萬子をツモれること", () => {
    expect(Hand.fromString("m123p456s789z4567").tsumo("m1").toPaishi()).toBe(
      "m123p456s789z4567m1"
    );
  });

  it("筒子をツモれること", () => {
    expect(Hand.fromString("m123p456s789z4567").tsumo("p1").toPaishi()).toBe(
      "m123p456s789z4567p1"
    );
  });

  it("索子をツモれること", () => {
    expect(Hand.fromString("m123p456s789z4567").tsumo("s1").toPaishi()).toBe(
      "m123p456s789z4567s1"
    );
  });

  it("字牌をツモれること", () => {
    expect(Hand.fromString("m123p456s789z4567").tsumo("z1").toPaishi()).toBe(
      "m123p456s789z4567z1"
    );
  });

  it("赤牌をツモれること", () => {
    expect(Hand.fromString("m123p456s789z4567").tsumo("m0").toPaishi()).toBe(
      "m123p456s789z4567m0"
    );
  });

  it("伏せ牌をツモれること", () => {
    expect(Hand.fromString("m123p456s789z4567").tsumo("_").toPaishi()).toBe(
      "m123p456s789z4567_"
    );
  });

  it("不正な牌はツモれないこと", () => {
    const invalidPai1 = "" as Pai;
    const invalidPai2 = "z0" as Pai;
    const invalidPai3 = "z8" as Pai;
    const invalidPai4 = "mm" as Pai;
    const invalidPai5 = "xx" as Pai;

    expect(() =>
      Hand.fromString("m123p456s789z4567").tsumo(invalidPai1)
    ).toThrow();

    expect(() =>
      Hand.fromString("m123p456s789z4567").tsumo(invalidPai2)
    ).toThrow();

    expect(() =>
      Hand.fromString("m123p456s789z4567").tsumo(invalidPai3)
    ).toThrow();

    expect(() =>
      Hand.fromString("m123p456s789z4567").tsumo(invalidPai4)
    ).toThrow();

    expect(() =>
      Hand.fromString("m123p456s789z4567").tsumo(invalidPai5)
    ).toThrow();
  });

  it("ツモの直後にはツモれないこと", () => {
    expect(() => Hand.fromString("m123p456s789z34567").tsumo("m1")).toThrow();
  });

  it("副露の直後にはツモれないこと", () => {
    expect(() =>
      Hand.fromString("m123p456z34567,s789-,").tsumo("m1")
    ).toThrow();
  });

  it("多牌となる牌をツモることもできること", () => {
    expect(
      Hand.fromString("m123p456s789z34567").tsumo("m1", false).toPaishi()
    ).toBe("m123p456s789z34567m1");
  });

  it("5枚目の牌はツモれないこと", () => {
    expect(() => Hand.fromString("m123p456s789z1111").tsumo("z1")).toThrow();
    expect(() => Hand.fromString("m455556s789z1111").tsumo("m0")).toThrow();
  });
});

describe("dapai メソッド", () => {
  it("萬子を打牌できること", () => {
    expect(Hand.fromString("m123p456s789z34567").dapai("m1").toPaishi()).toBe(
      "m23p456s789z34567"
    );
  });

  it("筒子を打牌できること", () => {
    expect(Hand.fromString("m123p456s789z34567").dapai("p4").toPaishi()).toBe(
      "m123p56s789z34567"
    );
  });

  it("索子を打牌できること", () => {
    expect(Hand.fromString("m123p456s789z34567").dapai("s7").toPaishi()).toBe(
      "m123p456s89z34567"
    );
  });

  it("字牌を打牌できること", () => {
    expect(Hand.fromString("m123p456s789z34567").dapai("z3").toPaishi()).toBe(
      "m123p456s789z4567"
    );
  });

  it("赤牌を打牌できること", () => {
    expect(Hand.fromString("m123p406s789z34567").dapai("p0").toPaishi()).toBe(
      "m123p46s789z34567"
    );
  });

  it("リーチできること", () => {
    expect(Hand.fromString("m123p456s789z34567").dapai("z7*").toPaishi()).toBe(
      "m123p456s789z3456*"
    );
  });

  it("リーチ後にもツモ切り以外の打牌ができること(チェックしない)", () => {
    expect(Hand.fromString("m123p456s789z11223*").dapai("z1").toPaishi()).toBe(
      "m123p456s789z1223*"
    );
  });

  it("伏せ牌がある場合、任意の牌が打牌できること", () => {
    expect(Hand.fromString("______________").dapai("m1").toPaishi()).toBe(
      "_____________"
    );
  });

  it("不正な牌は打牌できないこと", () => {
    expect(() => Hand.fromString("m123p456s789z34567").dapai("z0")).toThrow();
    expect(() => Hand.fromString("m123p456s789z34567").dapai("z8")).toThrow();
    expect(() => Hand.fromString("m123p456s789z34567").dapai("mm")).toThrow();
    expect(() => Hand.fromString("m123p456s789z34567").dapai("xx")).toThrow();
  });

  it("伏せた牌は打牌できないこと", () => {
    expect(() => Hand.fromString("m123p456s789z4567").dapai("_")).toThrow();
  });

  it("打牌の直後には打牌できないこと", () => {
    expect(() => Hand.fromString("m123p456s789z4567").dapai("m1")).toThrow();
  });

  it("少牌となる牌を打牌することもできること", () => {
    expect(
      Hand.fromString("m123p456s789z4567").dapai("m1", false).toPaishi()
    ).toBe("m23p456s789z4567");
  });

  it("手牌にない牌は打牌できないこと", () => {
    expect(() => Hand.fromString("m123p456s789z34567").dapai("z1")).toThrow();
    expect(() => Hand.fromString("m123p456s789z34567").dapai("p0")).toThrow();
    expect(() => Hand.fromString("m123p406s789z34567").dapai("p5")).toThrow();
  });
});

describe("fulo メソッド", () => {
  it("萬子を副露できること", () => {
    expect(Hand.fromString("m23p456s789z34567").fulo("m1-23").toPaishi()).toBe(
      "p456s789z34567,m1-23,"
    );
  });

  it("筒子を副露できること", () => {
    expect(Hand.fromString("m123p46s789z34567").fulo("p45-6").toPaishi()).toBe(
      "m123s789z34567,p45-6,"
    );
  });

  it("索子を副露できること", () => {
    expect(Hand.fromString("m123p456s99z34567").fulo("s999+").toPaishi()).toBe(
      "m123p456z34567,s999+,"
    );
  });

  it("字牌を副露できること", () => {
    expect(Hand.fromString("m123p456s789z1167").fulo("z111=").toPaishi()).toBe(
      "m123p456s789z67,z111=,"
    );
  });

  it("赤牌を副露できること", () => {
    expect(Hand.fromString("m123p500s789z4567").fulo("p5005-").toPaishi()).toBe(
      "m123s789z4567,p5005-"
    );
  });

  it("リーチ後にも副露できること(チェックしない)", () => {
    expect(Hand.fromString("m123p456s789z4567*").fulo("m1-23").toPaishi()).toBe(
      "m1p456s789z4567*,m1-23,"
    );
  });

  it("伏せ牌がある場合、それを使って副露できること", () => {
    expect(Hand.fromString("_____________").fulo("m1-23").toPaishi()).toBe(
      "___________,m1-23,"
    );
  });

  it("不正な面子で副露できないこと", () => {
    expect(() => Hand.fromString("m123p456s789z4567").fulo("z3-45")).toThrow();
    expect(() => Hand.fromString("m123p456s789z4567").fulo("m231-")).toThrow();
  });

  it("暗槓は副露ではない", () => {
    expect(() => Hand.fromString("_____________").fulo("m1111")).toThrow();
  });

  it("加槓は副露ではない", () => {
    expect(() => Hand.fromString("_____________").fulo("m111+1")).toThrow();
  });

  it("ツモの直後に副露できないこと", () => {
    expect(() => Hand.fromString("m123p456s789z11567").fulo("z111=")).toThrow();
  });

  it("副露の直後に副露できないこと", () => {
    expect(() =>
      Hand.fromString("m123p456s789z22,z111=,").fulo("z222=")
    ).toThrow();
  });

  it("多牌となる副露もできること", () => {
    expect(
      Hand.fromString("m123p456s789z11567").fulo("z111=", false).toPaishi()
    ).toBe("m123p456s789z567,z111=,");

    expect(
      Hand.fromString("m123p456s789z22,z111=,").fulo("z222=", false).toPaishi()
    ).toBe("m123p456s789,z111=,z222=,");
  });

  it("手牌にない牌を使って副露できないこと", () => {
    expect(() =>
      Hand.fromString("m123p456s789z2,z111=").fulo("z333=")
    ).toThrow();

    expect(() =>
      Hand.fromString("m123p40s789z22,z111=").fulo("p456-")
    ).toThrow();

    expect(() =>
      Hand.fromString("m123p45s789z22,z111=").fulo("p406-")
    ).toThrow();
  });
});

describe("kan メソッド", () => {
  it("萬子で暗槓できること", () => {
    expect(Hand.fromString("m1111p456s789z4567").kan("m1111").toPaishi()).toBe(
      "p456s789z4567,m1111"
    );
  });

  it("萬子で加槓できること", () => {
    expect(
      Hand.fromString("m1p456s789z4567,m111+").kan("m111+1").toPaishi()
    ).toBe("p456s789z4567,m111+1");
  });

  it("筒子で暗槓できること", () => {
    expect(Hand.fromString("m123p5555s789z4567").kan("p5555").toPaishi()).toBe(
      "m123s789z4567,p5555"
    );
  });

  it("筒子で加槓できること", () => {
    expect(
      Hand.fromString("m123p5s789z4567,p555=").kan("p555=5").toPaishi()
    ).toBe("m123s789z4567,p555=5");
  });

  it("索子で暗槓できること", () => {
    expect(Hand.fromString("m123p456s9999z4567").kan("s9999").toPaishi()).toBe(
      "m123p456z4567,s9999"
    );
  });

  it("索子で加槓できること", () => {
    expect(
      Hand.fromString("m123p456s9z4567,s999-").kan("s999-9").toPaishi()
    ).toBe("m123p456z4567,s999-9");
  });

  it("字牌で暗槓できること", () => {
    expect(Hand.fromString("m123p456s789z67777").kan("z7777").toPaishi()).toBe(
      "m123p456s789z6,z7777"
    );
  });

  it("字牌で加槓できること", () => {
    expect(
      Hand.fromString("m123p456s789z67,z777+").kan("z777+7").toPaishi()
    ).toBe("m123p456s789z6,z777+7");
  });

  it("赤牌を含む暗槓ができること", () => {
    expect(Hand.fromString("m0055p456s789z4567").kan("m5500").toPaishi()).toBe(
      "p456s789z4567,m5500"
    );
  });

  it("赤牌を含む加槓ができること", () => {
    expect(
      Hand.fromString("m123p5s789z4567,p505=").kan("p505=5").toPaishi()
    ).toBe("m123s789z4567,p505=5");
  });

  it("赤牌で加槓できること", () => {
    expect(
      Hand.fromString("m123p0s789z4567,p555=").kan("p555=0").toPaishi()
    ).toBe("m123s789z4567,p555=0");
  });

  it("リーチ後にも暗槓できること(チェックしない)", () => {
    expect(Hand.fromString("m1111p456s789z4567*").kan("m1111").toPaishi()).toBe(
      "p456s789z4567*,m1111"
    );
  });

  it("リーチ後にも加槓できること(チェックしない)", () => {
    expect(
      Hand.fromString("m1p456s789z4567*,m111+").kan("m111+1").toPaishi()
    ).toBe("p456s789z4567*,m111+1");
  });

  it("伏せ牌がある場合、それを使って暗槓できること", () => {
    expect(Hand.fromString("______________").kan("m5550").toPaishi()).toBe(
      "__________,m5550"
    );
  });

  it("伏せ牌がある場合、それを使って加槓できること", () => {
    expect(Hand.fromString("___________,m555=").kan("m555=0").toPaishi()).toBe(
      "__________,m555=0"
    );
  });

  it("順子で槓できないこと", () => {
    expect(() => Hand.fromString("m1112456s789z4567").kan("m456-")).toThrow();
  });

  it("刻子で槓できないこと", () => {
    expect(() => Hand.fromString("m1112456s789z4567").kan("m111+")).toThrow();
  });

  it("不正な面子で槓できないこと", () => {
    expect(() => Hand.fromString("m1112456s789z4567").kan("m1112")).toThrow();
  });

  it("不正な面子で槓できないこと", () => {
    expect(() =>
      Hand.fromString("m2456s789z4567,m111+").kan("m111+2")
    ).toThrow();
  });

  it("打牌の直後に槓できないこと", () => {
    expect(() => Hand.fromString("m1111p456s789z456").kan("m1111")).toThrow();
  });

  it("副露の直後に槓できないこと", () => {
    expect(() =>
      Hand.fromString("m1111s789z4567,p456-,").kan("m1111")
    ).toThrow();
  });

  it("槓の直後に槓できないこと", () => {
    expect(() =>
      Hand.fromString("m1111p4444s789z567").kan("m1111").kan("p4444")
    ).toThrow();
  });

  it("少牌となる槓もできること", () => {
    expect(
      Hand.fromString("m1111p456s789z456").kan("m1111", false).toPaishi()
    ).toBe("p456s789z456,m1111");

    expect(
      Hand.fromString("m1111s789z4567,p456-,").kan("m1111", false).toPaishi()
    ).toBe("s789z4567,p456-,m1111");

    expect(
      Hand.fromString("m1111p4444s789z567")
        .kan("m1111", false)
        .kan("p4444", false)
        .toPaishi()
    ).toBe("s789z567,m1111,p4444");
  });

  it("手牌に4枚ない牌で暗槓できないこと", () => {
    expect(() => Hand.fromString("m1112p456s789z4567").kan("m1111")).toThrow();
  });

  it("手牌にない牌で加槓できないこと", () => {
    expect(() =>
      Hand.fromString("m13p456s789z567,m222=").kan("m2222")
    ).toThrow();
    expect(() =>
      Hand.fromString("m10p456s789z567,m555=").kan("m5555")
    ).toThrow();
    expect(() =>
      Hand.fromString("m15p456s789z567,m555=").kan("m5550")
    ).toThrow();
  });

  it("明刻がない牌で加槓できないこと", () => {
    expect(() =>
      Hand.fromString("m12p456s789z567,m222=").kan("m111=1")
    ).toThrow();
  });
});

describe("isMenzen プロパティ", () => {
  it("副露がない場合、メンゼンと判定すること", () => {
    expect(Hand.fromString("m123p0s789z4567").isMenzen).toBeTruthy();
  });

  it("副露がある場合、メンゼンと判定しないこと", () => {
    expect(Hand.fromString("p0s789z4567,m123-").isMenzen).toBeFalsy();
  });

  it("暗カンを副露と判定しないこと", () => {
    expect(Hand.fromString("m123p0s789,z1111").isMenzen).toBeTruthy();
  });
});

describe("isRiichi プロパティ", () => {
  it("配牌時はリーチ状態でないこと", () => {
    expect(Hand.fromString("_____________").isRiichi).toBeFalsy();
  });

  it("リーチ宣言によりリーチ状態になること", () => {
    expect(
      Hand.fromString("_____________").tsumo("z7").dapai("z7_*").isRiichi
    ).toBeTruthy();
  });
});

describe("getDapaiCandidates メソッド", () => {
  it("ツモ直後または副露直後以外は打牌できないこと", () => {
    expect(
      Hand.fromString("m123p406s789z4567").getDapaiCandidates()
    ).toBeNull();

    expect(
      Hand.fromString("m123p406s789z2,z111+").getDapaiCandidates()
    ).toBeNull();

    expect(Hand.fromString("_____________").getDapaiCandidates()).toBeNull();
    expect(Hand.fromString("__________,z111+").getDapaiCandidates()).toBeNull();
  });

  it("ツモ直後は任意の手牌を打牌できること(メンゼン手)", () => {
    expect(Hand.fromString("m123p406s789z11123").getDapaiCandidates()).toEqual(
      expect.arrayContaining([
        "m1",
        "m2",
        "m3",
        "p4",
        "p0",
        "p6",
        "s7",
        "s8",
        "s9",
        "z1",
        "z2",
        "z3_",
      ])
    );
  });

  it("ツモ直後は任意の手牌を打牌できること(副露手)", () => {
    expect(
      Hand.fromString("m123p406s789z12,z111+").getDapaiCandidates()
    ).toEqual(
      expect.arrayContaining([
        "m1",
        "m2",
        "m3",
        "p4",
        "p0",
        "p6",
        "s7",
        "s8",
        "s9",
        "z1",
        "z2_",
      ])
    );
  });

  it("リーチ後はツモ切りしかできないこと", () => {
    expect(
      Hand.fromString("m123p456s789z1234m1*").getDapaiCandidates()
    ).toEqual(expect.arrayContaining(["m1_"]));
  });

  it("赤牌を単独の牌として区別すること", () => {
    expect(Hand.fromString("m123p405s789z11123").getDapaiCandidates()).toEqual(
      expect.arrayContaining([
        "m1",
        "m2",
        "m3",
        "p4",
        "p0",
        "p5",
        "s7",
        "s8",
        "s9",
        "z1",
        "z2",
        "z3_",
      ])
    );

    expect(Hand.fromString("m123p45s789z11123p0").getDapaiCandidates()).toEqual(
      expect.arrayContaining([
        "m1",
        "m2",
        "m3",
        "p4",
        "p5",
        "s7",
        "s8",
        "s9",
        "z1",
        "z2",
        "z3",
        "p0_",
      ])
    );
  });

  it("手出しとツモ切りを区別すること", () => {
    expect(Hand.fromString("m123p45s789z11123p5").getDapaiCandidates()).toEqual(
      expect.arrayContaining([
        "m1",
        "m2",
        "m3",
        "p4",
        "p5",
        "s7",
        "s8",
        "s9",
        "z1",
        "z2",
        "z3",
        "p5_",
      ])
    );

    expect(Hand.fromString("m123p405s789z1112p0").getDapaiCandidates()).toEqual(
      expect.arrayContaining([
        "m1",
        "m2",
        "m3",
        "p4",
        "p0",
        "p5",
        "s7",
        "s8",
        "s9",
        "z1",
        "z2",
        "p0_",
      ])
    );
  });

  it("伏せ牌のみの手牌では空配列を返すこと", () => {
    expect(Hand.fromString("______________").getDapaiCandidates()).toEqual(
      expect.arrayContaining([])
    );

    expect(Hand.fromString("___________,m123-,").getDapaiCandidates()).toEqual(
      expect.arrayContaining([])
    );
  });

  it("喰い替えとなる打牌が許されないこと(両面鳴き)", () => {
    expect(
      Hand.fromString("m145p406s789z23,m1-23,").getDapaiCandidates()
    ).toEqual(
      expect.arrayContaining([
        "m5",
        "p4",
        "p0",
        "p6",
        "s7",
        "s8",
        "s9",
        "z2",
        "z3",
      ])
    );

    expect(
      Hand.fromString("m145p406s789z23,m234-,").getDapaiCandidates()
    ).toEqual(
      expect.arrayContaining([
        "m5",
        "p4",
        "p0",
        "p6",
        "s7",
        "s8",
        "s9",
        "z2",
        "z3",
      ])
    );
  });

  it("喰替えとなる打牌が許されないこと(嵌張鳴き)", () => {
    expect(
      Hand.fromString("m123p258s789z23,p45-6,").getDapaiCandidates()
    ).toEqual(
      expect.arrayContaining([
        "m1",
        "m2",
        "m3",
        "p2",
        "p8",
        "s7",
        "s8",
        "s9",
        "z2",
        "z3",
      ])
    );
  });

  it("喰替えとなる打牌が許されないこと(辺張鳴き)", () => {
    expect(
      Hand.fromString("m123p456s467z23,s7-89,").getDapaiCandidates()
    ).toEqual(
      expect.arrayContaining([
        "m1",
        "m2",
        "m3",
        "p4",
        "p5",
        "p6",
        "s4",
        "s6",
        "z2",
        "z3",
      ])
    );
  });

  it("喰替えとなる打牌が許されないこと(ポン)", () => {
    expect(
      Hand.fromString("m123p456s789z12,z111+,").getDapaiCandidates()
    ).toEqual(
      expect.arrayContaining([
        "m1",
        "m2",
        "m3",
        "p4",
        "p5",
        "p6",
        "s7",
        "s8",
        "s9",
        "z2",
      ])
    );
  });

  it("喰替えとなる打牌が許されないこと(赤牌入りの鳴き)", () => {
    expect(
      Hand.fromString("m256p456s789z12,m340-,").getDapaiCandidates()
    ).toEqual(
      expect.arrayContaining([
        "m6",
        "p4",
        "p5",
        "p6",
        "s7",
        "s8",
        "s9",
        "z1",
        "z2",
      ])
    );
  });

  it("喰替えとなる打牌が許されないこと(赤牌打牌)", () => {
    expect(
      Hand.fromString("m206p456s789z12,m345-,").getDapaiCandidates()
    ).toEqual(
      expect.arrayContaining([
        "m6",
        "p4",
        "p5",
        "p6",
        "s7",
        "s8",
        "s9",
        "z1",
        "z2",
      ])
    );
  });

  it("赤牌によるポンの際に正しく喰い替え判定すること", () => {
    expect(
      Hand.fromString("m25p1s12678,z666+,m550-,").getDapaiCandidates()
    ).toEqual(
      expect.arrayContaining(["m2", "p1", "s1", "s2", "s6", "s7", "s8"])
    );
  });

  it("喰替えのため打牌できない場合があること", () => {
    expect(
      Hand.fromString("m14,p456-,s789-,z111+,m234-,").getDapaiCandidates()
    ).toEqual(expect.arrayContaining([]));

    expect(
      Hand.fromString("m14,p456-,s789-,z111+,m1-23,").getDapaiCandidates()
    ).toEqual(expect.arrayContaining([]));

    expect(
      Hand.fromString("m22,p456-,s789-,z111+,m12-3,").getDapaiCandidates()
    ).toEqual(expect.arrayContaining([]));
  });

  it("喰い替えを許すこともできること", () => {
    expect(
      Hand.fromString("m145p406s789z23,m1-23,").getDapaiCandidates(false)
    ).toEqual(
      expect.arrayContaining([
        "m1",
        "m4",
        "m5",
        "p4",
        "p0",
        "p6",
        "s7",
        "s8",
        "s9",
        "z2",
        "z3",
      ])
    );
  });
});

describe("getChiCandidates メソッド", () => {
  it("ツモ直後と副露の直後にチーできないこと", () => {
    expect(
      Hand.fromString("m123p456s789z12345").getChiCandidates("m1-")
    ).toBeNull();

    expect(
      Hand.fromString("m123p456s789z12,z333=,").getChiCandidates("m1-")
    ).toBeNull();

    expect(
      Hand.fromString("______________").getChiCandidates("m1-")
    ).toBeNull();
  });

  it("チーできるメンツがない場合", () => {
    expect(
      Hand.fromString("m123p456s789z1234").getChiCandidates("m5-")
    ).toEqual(expect.arrayContaining([]));

    expect(Hand.fromString("_____________").getChiCandidates("m5-")).toEqual(
      expect.arrayContaining([])
    );
  });

  it("チーできるメンツが1つの場合", () => {
    expect(
      Hand.fromString("m123p456s789z1234").getChiCandidates("m3-")
    ).toEqual(expect.arrayContaining(["m123-"]));
  });

  it("チーできるメンツが2つの場合", () => {
    expect(
      Hand.fromString("m1234p456s789z123").getChiCandidates("m3-")
    ).toEqual(expect.arrayContaining(["m123-", "m23-4"]));
  });

  it("チーできるメンツが3つの場合", () => {
    expect(
      Hand.fromString("m12345p456s789z12").getChiCandidates("m3-")
    ).toEqual(expect.arrayContaining(["m123-", "m23-4", "m3-45"]));
  });

  it("赤牌でチーできること", () => {
    expect(
      Hand.fromString("m123p456s789z1234").getChiCandidates("p0-")
    ).toEqual(expect.arrayContaining(["p40-6"]));
  });

  it("赤牌含みでチーできること", () => {
    expect(
      Hand.fromString("m123p34067s789z12").getChiCandidates("p3-")
    ).toEqual(expect.arrayContaining(["p3-40"]));

    expect(
      Hand.fromString("m123p34067s789z12").getChiCandidates("p4-")
    ).toEqual(expect.arrayContaining(["p34-0", "p4-06"]));

    expect(
      Hand.fromString("m123p34067s789z12").getChiCandidates("p6-")
    ).toEqual(expect.arrayContaining(["p406-", "p06-7"]));

    expect(
      Hand.fromString("m123p34067s789z12").getChiCandidates("p7-")
    ).toEqual(expect.arrayContaining(["p067-"]));
  });

  it("赤牌なしのメンツも選択すること", () => {
    expect(
      Hand.fromString("m123p340567s789z1").getChiCandidates("p3-")
    ).toEqual(expect.arrayContaining(["p3-40", "p3-45"]));

    expect(
      Hand.fromString("m123p340567s789z1").getChiCandidates("p4-")
    ).toEqual(expect.arrayContaining(["p34-0", "p34-5", "p4-06", "p4-56"]));

    expect(
      Hand.fromString("m123p340567s789z1").getChiCandidates("p6-")
    ).toEqual(expect.arrayContaining(["p406-", "p456-", "p06-7", "p56-7"]));

    expect(
      Hand.fromString("m123p340567s789z1").getChiCandidates("p7-")
    ).toEqual(expect.arrayContaining(["p067-", "p567-"]));
  });

  it("ツモ切りの牌をチーできること", () => {
    expect(
      Hand.fromString("m123p456s789z1234").getChiCandidates("m3_-")
    ).toEqual(expect.arrayContaining(["m123-"]));
  });

  it("リーチ宣言牌をチーできること", () => {
    expect(
      Hand.fromString("m123p456s789z1234").getChiCandidates("m3*-")
    ).toEqual(expect.arrayContaining(["m123-"]));
  });

  it("ツモ切りリーチの宣言牌をチーできること", () => {
    expect(
      Hand.fromString("m123p456s789z1234").getChiCandidates("m3_*-")
    ).toEqual(expect.arrayContaining(["m123-"]));
  });

  it("リーチ後はチーできないこと", () => {
    expect(
      Hand.fromString("m123p456s789z1234*").getChiCandidates("m3-")
    ).toEqual(expect.arrayContaining([]));
  });

  it("打牌選択できなくなる鳴き方を含めないこと", () => {
    expect(
      Hand.fromString("s6789,m123-,p456-,z111+").getChiCandidates("s6-")
    ).toEqual(expect.arrayContaining([]));

    expect(
      Hand.fromString("s6789,m123-,p456-,z111+").getChiCandidates("s9-")
    ).toEqual(expect.arrayContaining([]));

    expect(
      Hand.fromString("s7889,m123-,p456-,z111+").getChiCandidates("s8-")
    ).toEqual(expect.arrayContaining([]));

    expect(
      Hand.fromString("s7899,m123-,p456-,z111+").getChiCandidates("s9-")
    ).toEqual(expect.arrayContaining([]));

    expect(
      Hand.fromString("s7789,m123-,p456-,z111+").getChiCandidates("s7-")
    ).toEqual(expect.arrayContaining([]));

    expect(
      Hand.fromString("s6678999,m123-,p456-").getChiCandidates("s6-")
    ).toEqual(expect.arrayContaining([]));
  });

  it("喰い替えをとなる鳴きを許すこともできること", () => {
    expect(
      Hand.fromString("s6789,m123-,p456-,z111+").getChiCandidates("s6-", false)
    ).toEqual(expect.arrayContaining(["s6-78"]));

    expect(
      Hand.fromString("s6789,m123-,p456-,z111+").getChiCandidates("s9-", false)
    ).toEqual(expect.arrayContaining(["s789-"]));

    expect(
      Hand.fromString("s7889,m123-,p456-,z111+").getChiCandidates("s8-", false)
    ).toEqual(expect.arrayContaining(["s78-9"]));

    expect(
      Hand.fromString("s7899,m123-,p456-,z111+").getChiCandidates("s9-", false)
    ).toEqual(expect.arrayContaining(["s789-"]));

    expect(
      Hand.fromString("s7789,m123-,p456-,z111+").getChiCandidates("s7-", false)
    ).toEqual(expect.arrayContaining(["s7-89"]));

    expect(
      Hand.fromString("s6678999,m123-,p456-").getChiCandidates("s6-", false)
    ).toEqual(expect.arrayContaining(["s6-78"]));
  });

  it("不正な牌でチーできないこと", () => {
    expect(() =>
      Hand.fromString("m123p456s789z1234").getChiCandidates("mm-")
    ).toThrow();

    expect(() =>
      Hand.fromString("m123p456s789z1234").getChiCandidates("m1")
    ).toThrow();
  });

  it("字牌でチーできないこと", () => {
    expect(
      Hand.fromString("m123p456s789z1234").getChiCandidates("z1-")
    ).toEqual(expect.arrayContaining([]));
  });

  it("上家以外からチーできないこと", () => {
    expect(
      Hand.fromString("m123p456s789z1234").getChiCandidates("m1+")
    ).toEqual(expect.arrayContaining([]));

    expect(
      Hand.fromString("m123p456s789z1234").getChiCandidates("m1=")
    ).toEqual(expect.arrayContaining([]));
  });
});

describe("getPonCandidates メソッド", () => {
  it("ツモ直後と副露の直後にポンできないこと", () => {
    expect(
      Hand.fromString("m112p456s789z12345").getPonCandidates("m1+")
    ).toBeNull();

    expect(
      Hand.fromString("m112p456s789z12,z333=,").getPonCandidates("m1=")
    ).toBeNull();

    expect(
      Hand.fromString("______________").getPonCandidates("m1-")
    ).toBeNull();
  });

  it("ポンできるメンツがない場合", () => {
    expect(
      Hand.fromString("m123p456s789z1234").getPonCandidates("m1+")
    ).toEqual(expect.arrayContaining([]));

    expect(Hand.fromString("_____________").getPonCandidates("m1=")).toEqual(
      expect.arrayContaining([])
    );
  });

  it("下家からポンできること", () => {
    expect(
      Hand.fromString("m112p456s789z1234").getPonCandidates("m1+")
    ).toEqual(expect.arrayContaining(["m111+"]));
  });

  it("対面からポンできること", () => {
    expect(
      Hand.fromString("m123p445s789z1234").getPonCandidates("p4=")
    ).toEqual(expect.arrayContaining(["p444="]));
  });

  it("上家からポンできること", () => {
    expect(
      Hand.fromString("m123p345s778z1234").getPonCandidates("s7-")
    ).toEqual(expect.arrayContaining(["s777-"]));
  });

  it("赤牌でポンできること", () => {
    expect(
      Hand.fromString("m123p455s789z1234").getPonCandidates("p0+")
    ).toEqual(expect.arrayContaining(["p550+"]));

    expect(
      Hand.fromString("m123p405s789z1234").getPonCandidates("p0+")
    ).toEqual(expect.arrayContaining(["p500+"]));

    expect(
      Hand.fromString("m123p400s789z1234").getPonCandidates("p0+")
    ).toEqual(expect.arrayContaining(["p000+"]));
  });

  it("赤牌なしのメンツも選択すること", () => {
    expect(
      Hand.fromString("m123p055s789z1234").getPonCandidates("p5=")
    ).toEqual(expect.arrayContaining(["p505=", "p555="]));

    expect(
      Hand.fromString("m123p005s789z1234").getPonCandidates("p5=")
    ).toEqual(expect.arrayContaining(["p005=", "p505="]));

    expect(
      Hand.fromString("m123p000s789z1234").getPonCandidates("p5=")
    ).toEqual(expect.arrayContaining(["p005="]));
  });

  it("ツモ切りの牌をポンできること", () => {
    expect(
      Hand.fromString("m112p456s789z1234").getPonCandidates("m1_+")
    ).toEqual(expect.arrayContaining(["m111+"]));
  });

  it("リーチ宣言牌をポンできること", () => {
    expect(
      Hand.fromString("m112p456s789z1234").getPonCandidates("m1*+")
    ).toEqual(expect.arrayContaining(["m111+"]));
  });

  it("ツモ切りリーチの宣言牌をポンできること", () => {
    expect(
      Hand.fromString("m112p456s789z1234").getPonCandidates("m1_*+")
    ).toEqual(expect.arrayContaining(["m111+"]));
  });

  it("リーチ後はポンできないこと", () => {
    expect(
      Hand.fromString("m112p456s789z1234*").getPonCandidates("m1+")
    ).toEqual(expect.arrayContaining([]));
  });

  it("不正な牌でポンできないこと", () => {
    expect(() =>
      Hand.fromString("m123p456s789z1234").getPonCandidates("mm+")
    ).toThrow();

    expect(() =>
      Hand.fromString("m112p456s789z1234").getPonCandidates("m1")
    ).toThrow();
  });
});

describe("getKanCandidates メソッド", () => {
  it("ツモ直後と副露の直後に大明槓できないこと", () => {
    expect(
      Hand.fromString("m111p456s789z12345").getKanCandidates("m1+")
    ).toBeNull();

    expect(
      Hand.fromString("m111p456s789z12,z333=,").getKanCandidates("m1+")
    ).toBeNull();

    expect(
      Hand.fromString("______________").getKanCandidates("m1-")
    ).toBeNull();
  });

  it("大明槓できるメンツがない場合", () => {
    expect(
      Hand.fromString("m123p456s789z1122").getKanCandidates("z1+")
    ).toEqual(expect.arrayContaining([]));

    expect(Hand.fromString("_____________").getKanCandidates("z1=")).toEqual(
      expect.arrayContaining([])
    );
  });

  it("下家から大明槓できること", () => {
    expect(
      Hand.fromString("m111p456s789z1234").getKanCandidates("m1+")
    ).toEqual(expect.arrayContaining(["m1111+"]));
  });

  it("対面から大明槓できること", () => {
    expect(
      Hand.fromString("m123p444s789z1234").getKanCandidates("p4=")
    ).toEqual(expect.arrayContaining(["p4444="]));
  });

  it("上家から大明槓できること", () => {
    expect(
      Hand.fromString("m123p456s777z1234").getKanCandidates("s7-")
    ).toEqual(expect.arrayContaining(["s7777-"]));
  });

  it("赤牌で大明槓できること", () => {
    expect(
      Hand.fromString("m123p555s789z1234").getKanCandidates("p0+")
    ).toEqual(expect.arrayContaining(["p5550+"]));
  });

  it("赤牌入りの大明槓ができること", () => {
    expect(
      Hand.fromString("m123p055s789z1234").getKanCandidates("p5+")
    ).toEqual(expect.arrayContaining(["p5505+"]));

    expect(
      Hand.fromString("m123p005s789z1234").getKanCandidates("p5+")
    ).toEqual(expect.arrayContaining(["p5005+"]));

    expect(
      Hand.fromString("m123p000s789z1234").getKanCandidates("p5+")
    ).toEqual(expect.arrayContaining(["p0005+"]));
  });

  it("ツモ切りの牌を大明槓できること", () => {
    expect(
      Hand.fromString("m111p456s789z1234").getKanCandidates("m1_+")
    ).toEqual(expect.arrayContaining(["m1111+"]));
  });

  it("リーチ宣言牌を大明槓できること", () => {
    expect(
      Hand.fromString("m111p456s789z1234").getKanCandidates("m1*+")
    ).toEqual(expect.arrayContaining(["m1111+"]));
  });

  it("ツモ切りリーチの宣言牌を大明槓できること", () => {
    expect(
      Hand.fromString("m111p456s789z1234").getKanCandidates("m1_*+")
    ).toEqual(expect.arrayContaining(["m1111+"]));
  });

  it("リーチ後は大明槓できないこと", () => {
    expect(
      Hand.fromString("m111p456s789z1234").getKanCandidates("m1+")
    ).toEqual(expect.arrayContaining([]));
  });

  it("不正な牌で大明槓できないこと", () => {
    expect(() =>
      Hand.fromString("m111p555s999z1234").getKanCandidates("mm+")
    ).toThrow();

    expect(() =>
      Hand.fromString("m111p555s999z1234").getKanCandidates("m1")
    ).toThrow();
  });

  it("打牌と副露の直後には暗槓できないこと", () => {
    expect(
      Hand.fromString("m1111p555s999z123").getKanCandidates(undefined)
    ).toBeNull();

    expect(
      Hand.fromString("m1111p555s999,z333=").getKanCandidates(undefined)
    ).toBeNull();

    expect(
      Hand.fromString("m11112p555s999,z333=,").getKanCandidates(undefined)
    ).toBeNull();

    expect(
      Hand.fromString("_____________").getKanCandidates(undefined)
    ).toBeNull();
  });

  it("暗槓できるメンツがない場合", () => {
    expect(
      Hand.fromString("m123p456s789z12345").getKanCandidates(undefined)
    ).toEqual(expect.arrayContaining([]));

    expect(
      Hand.fromString("______________").getKanCandidates(undefined)
    ).toEqual(expect.arrayContaining([]));
  });

  it("萬子で暗槓できること", () => {
    expect(
      Hand.fromString("m1111p456s789z1234").getKanCandidates(undefined)
    ).toEqual(expect.arrayContaining(["m1111"]));
  });

  it("筒子で暗槓できること", () => {
    expect(
      Hand.fromString("m123p4444s789z1234").getKanCandidates(undefined)
    ).toEqual(expect.arrayContaining(["p4444"]));
  });

  it("索子で暗槓できること", () => {
    expect(
      Hand.fromString("m123p456s7777z1234").getKanCandidates(undefined)
    ).toEqual(expect.arrayContaining(["s7777"]));
  });

  it("字牌で暗槓できること", () => {
    expect(
      Hand.fromString("m123p456s789z11112").getKanCandidates(undefined)
    ).toEqual(expect.arrayContaining(["z1111"]));
  });

  it("赤牌入りで暗槓できること", () => {
    expect(
      Hand.fromString("m123p0555s789z1234").getKanCandidates(undefined)
    ).toEqual(expect.arrayContaining(["p5550"]));

    expect(
      Hand.fromString("m123p0055s789z1234").getKanCandidates(undefined)
    ).toEqual(expect.arrayContaining(["p5500"]));

    expect(
      Hand.fromString("m123p0005s789z1234").getKanCandidates(undefined)
    ).toEqual(expect.arrayContaining(["p5000"]));

    expect(
      Hand.fromString("m123p0000s789z1234").getKanCandidates(undefined)
    ).toEqual(expect.arrayContaining(["p0000"]));
  });

  it("リーチ後も暗槓できること", () => {
    expect(
      Hand.fromString("m111p456s789z1122m1").getKanCandidates(undefined)
    ).toEqual(expect.arrayContaining(["m1111"]));
  });

  it("リーチ後は送り槓できないこと", () => {
    expect(
      Hand.fromString("m111123p456s78z11m4*").getKanCandidates(undefined)
    ).toEqual(expect.arrayContaining([]));
  });

  it("暗槓できるメンツが複数の場合", () => {
    expect(
      Hand.fromString("m1111p456s789z1111").getKanCandidates(undefined)
    ).toEqual(expect.arrayContaining(["m1111", "z1111"]));
  });

  it("打牌と副露の直後には加槓できないこと", () => {
    expect(
      Hand.fromString("m1p555s999z123,m111-").getKanCandidates(undefined)
    ).toBeNull();

    expect(
      Hand.fromString("m1p555s999,z333=,m111-").getKanCandidates(undefined)
    ).toBeNull();

    expect(
      Hand.fromString("m12p555s999,z333=,m111-,").getKanCandidates(undefined)
    ).toBeNull();

    expect(
      Hand.fromString("__________,m111-,").getKanCandidates(undefined)
    ).toBeNull();
  });

  it("加槓できるメンツがない場合", () => {
    expect(
      Hand.fromString("m123p456s789z12,z777+").getKanCandidates(undefined)
    ).toEqual(expect.arrayContaining([]));

    expect(
      Hand.fromString("___________,z777+").getKanCandidates(undefined)
    ).toEqual(expect.arrayContaining([]));
  });

  it("萬子で加槓できること", () => {
    expect(
      Hand.fromString("m1p456s789z1234,m111+").getKanCandidates(undefined)
    ).toEqual(expect.arrayContaining(["m111+1"]));
  });

  it("筒子で加槓できること", () => {
    expect(
      Hand.fromString("m123p4s789z1234,p444=").getKanCandidates(undefined)
    ).toEqual(expect.arrayContaining(["p444=4"]));
  });

  it("索子で加槓できること", () => {
    expect(
      Hand.fromString("m123p456s7z1234,s777-").getKanCandidates(undefined)
    ).toEqual(expect.arrayContaining(["s777-7"]));
  });

  it("字牌で加槓できること", () => {
    expect(
      Hand.fromString("m123p456s789z12,z111+").getKanCandidates(undefined)
    ).toEqual(expect.arrayContaining(["z111+1"]));
  });

  it("赤牌で加槓できること", () => {
    expect(
      Hand.fromString("m123p0s789z1234,p555=").getKanCandidates(undefined)
    ).toEqual(expect.arrayContaining(["p555=0"]));
  });

  it("赤牌入りで加槓できること", () => {
    expect(
      Hand.fromString("m123p5s789z1234,p550-").getKanCandidates(undefined)
    ).toEqual(expect.arrayContaining(["p550-5"]));
  });

  it("リーチ後は加槓できないこと", () => {
    expect(
      Hand.fromString("p456s789z1234m1*,m111+").getKanCandidates(undefined)
    ).toEqual(expect.arrayContaining([]));
  });

  it("加槓できるメンツが複数の場合", () => {
    expect(
      Hand.fromString("m1p4s789z123,m111+,p444=").getKanCandidates(undefined)
    ).toEqual(expect.arrayContaining(["m111+1", "p444=4"]));
  });

  it("暗槓と加槓が同時にできる場合", () => {
    expect(
      Hand.fromString("m1p456s789z1111,m111+").getKanCandidates(undefined)
    ).toEqual(expect.arrayContaining(["m111+1", "z1111"]));
  });
});
