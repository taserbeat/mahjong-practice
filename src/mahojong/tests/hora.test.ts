import Hand from "../hand";
import * as Hora from "../hora";

describe("getHoraType メソッド", () => {
  it("一般手 (ツモ和了)", () => {
    const hand = Hand.fromString("m123p055s789z11122");
    const actual = Hora.getHoraType(hand, null);

    const expected = [["z22_!", "m123", "p555", "s789", "z111"]];

    expect(actual).toStrictEqual(expected);
  });

  test("一般手(ロン和了)", () => {
    const hand = Hand.fromString("m123p055s789z1112");
    const actual = Hora.getHoraType(hand, "z2+");

    const expected = [["z22+!", "m123", "p555", "s789", "z111"]];

    expect(actual).toStrictEqual(expected);
  });

  test("一般手(副露あり)", () => {
    const hand = Hand.fromString("m123p055z1112,s7-89");
    const actual = Hora.getHoraType(hand, "z2=");

    const expected = [["z22=!", "m123", "p555", "z111", "s7-89"]];

    expect(actual).toStrictEqual(expected);
  });

  test("七対子形", () => {
    const hand = Hand.fromString("m225p4466s1199z33");
    const actual = Hora.getHoraType(hand, "m0-");

    const expected = [["m22", "m55-!", "p44", "p66", "s11", "s99", "z33"]];

    expect(actual).toStrictEqual(expected);
  });

  test("国士無双形(ツモ)", () => {
    const hand = Hand.fromString("m9p19s19z12345677m1");
    const actual = Hora.getHoraType(hand, null);

    const expected = [
      [
        "z77",
        "m1_!",
        "m9",
        "p1",
        "p9",
        "s1",
        "s9",
        "z1",
        "z2",
        "z3",
        "z4",
        "z5",
        "z6",
      ],
    ];

    expect(actual).toStrictEqual(expected);
  });

  test("国士無双形(13面待ちロン)", () => {
    const hand = Hand.fromString("m19p19s19z1234567");
    const actual = Hora.getHoraType(hand, "m9+");

    const expected = [
      [
        "m99+!",
        "m1",
        "p1",
        "p9",
        "s1",
        "s9",
        "z1",
        "z2",
        "z3",
        "z4",
        "z5",
        "z6",
        "z7",
      ],
    ];

    expect(actual).toStrictEqual(expected);
  });

  test("九蓮宝燈形", () => {
    const hand = Hand.fromString("m1112345678999");
    const actual = Hora.getHoraType(hand, "m0=");

    const expected = [
      ["m55=!", "m111", "m234", "m678", "m999"],
      ["m11123456789995=!"],
    ];

    expect(actual).toStrictEqual(expected);
  });

  test("和了形以外(少牌)", () => {
    const hand = Hand.fromString("m123p055s789z1122");
    const actual = Hora.getHoraType(hand, null);

    const expected: string[][] = [];

    expect(actual).toStrictEqual(expected);
  });

  test("和了形以外(三面子)", () => {
    const hand = Hand.fromString("___m123p055z2,s7-89");
    const actual = Hora.getHoraType(hand, "z2=");

    const expected: string[][] = [];

    expect(actual).toStrictEqual(expected);
  });

  test("和了形以外(一対子)", () => {
    const hand = Hand.fromString("m22");
    const actual = Hora.getHoraType(hand, null);

    const expected: string[][] = [];

    expect(actual).toStrictEqual(expected);
  });

  test("和了形以外(国士無双テンパイ)", () => {
    const hand = Hand.fromString("m19p19s19z123456");
    const actual = Hora.getHoraType(hand, "z7=");

    const expected: string[][] = [];

    expect(actual).toStrictEqual(expected);
  });

  test("和了形以外(九蓮宝燈テンパイ)", () => {
    const hand = Hand.fromString("m111234567899");
    const actual = Hora.getHoraType(hand, "m9=");

    const expected: string[][] = [];

    expect(actual).toStrictEqual(expected);
  });

  test("複数の和了形としない(順子優先)", () => {
    const hand = Hand.fromString("m111123p789999z1z1");
    const actual = Hora.getHoraType(hand, null);

    const expected = [["z11_!", "m123", "m111", "p789", "p999"]];

    expect(actual).toStrictEqual(expected);
  });

  test("複数の和了形(二盃口か七対子か)", () => {
    const hand = Hand.fromString("m223344p556677s88");
    const actual = Hora.getHoraType(hand, null);

    const expected = [
      ["s88_!", "m234", "m234", "p567", "p567"],
      ["m22", "m33", "m44", "p55", "p66", "p77", "s88_!"],
    ];

    expect(actual).toStrictEqual(expected);
  });

  test("複数の和了形(順子か刻子か)", () => {
    const hand = Hand.fromString("m111222333p89997");
    const actual = Hora.getHoraType(hand, null);

    const expected = [
      ["p99", "m123", "m123", "m123", "p7_!89"],
      ["p99", "m111", "m222", "m333", "p7_!89"],
    ];

    expect(actual).toStrictEqual(expected);
  });

  test("複数の和了形(雀頭の選択、平和かサンショクか)", () => {
    const hand = Hand.fromString("m2234455p234s234m3");
    const actual = Hora.getHoraType(hand, null);

    const expected = [
      ["m22", "m3_!45", "m345", "p234", "s234"],
      ["m55", "m23_!4", "m234", "p234", "s234"],
    ];

    expect(actual).toStrictEqual(expected);
  });

  test("複数の和了形(暗刻を含む形)", () => {
    const hand = Hand.fromString("m23p567s33345666m1");
    const actual = Hora.getHoraType(hand, null);

    const expected = [
      ["s33", "m1_!23", "p567", "s345", "s666"],
      ["s66", "m1_!23", "p567", "s333", "s456"],
    ];

    expect(actual).toStrictEqual(expected);
  });

  test("複数の和了形(九蓮宝燈形)", () => {
    const hand = Hand.fromString("s1113445678999s2");
    const actual = Hora.getHoraType(hand, null);

    const expected = [
      ["s99", "s111", "s2_!34", "s456", "s789"],
      ["s11134456789992_!"],
    ];

    expect(actual).toStrictEqual(expected);
  });

  test("バグ: 暗槓しているの5枚目の牌で和了", () => {
    const hand = Hand.fromString("s4067999z444s8,s8888");
    const actual = Hora.getHoraType(hand, null);

    const expected = [["s99", "s456", "s78_!9", "z444", "s8888"]];

    expect(actual).toStrictEqual(expected);
  });
});

// TODO: hule(shoupai, rongpai, param)のテスト
// describe("hule メソッド", () => {});

describe("", () => {});
