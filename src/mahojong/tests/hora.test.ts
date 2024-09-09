import Hand from "../hand";
import * as Hora from "../hora";
import { RonPai } from "../pai";
import { ruleForTest } from "../rule";

// import data from "./data/hora.json";

describe("getHoraType メソッド", () => {
  it("一般手 (ツモ和了)", () => {
    const hand = Hand.fromString("m123p055s789z11122");
    const actual = Hora.getHoraType(hand, null);

    const expected = [["z22_!", "m123", "p555", "s789", "z111"]];

    expect(actual).toStrictEqual(expected);
  });

  it("一般手(ロン和了)", () => {
    const hand = Hand.fromString("m123p055s789z1112");
    const actual = Hora.getHoraType(hand, "z2+");

    const expected = [["z22+!", "m123", "p555", "s789", "z111"]];

    expect(actual).toStrictEqual(expected);
  });

  it("一般手(副露あり)", () => {
    const hand = Hand.fromString("m123p055z1112,s7-89");
    const actual = Hora.getHoraType(hand, "z2=");

    const expected = [["z22=!", "m123", "p555", "z111", "s7-89"]];

    expect(actual).toStrictEqual(expected);
  });

  it("七対子形", () => {
    const hand = Hand.fromString("m225p4466s1199z33");
    const actual = Hora.getHoraType(hand, "m0-");

    const expected = [["m22", "m55-!", "p44", "p66", "s11", "s99", "z33"]];

    expect(actual).toStrictEqual(expected);
  });

  it("国士無双形(ツモ)", () => {
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

  it("国士無双形(13面待ちロン)", () => {
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

  it("九蓮宝燈形", () => {
    const hand = Hand.fromString("m1112345678999");
    const actual = Hora.getHoraType(hand, "m0=");

    const expected = [
      ["m55=!", "m111", "m234", "m678", "m999"],
      ["m11123456789995=!"],
    ];

    expect(actual).toStrictEqual(expected);
  });

  it("和了形以外(少牌)", () => {
    const hand = Hand.fromString("m123p055s789z1122");
    const actual = Hora.getHoraType(hand, null);

    const expected: string[][] = [];

    expect(actual).toStrictEqual(expected);
  });

  it("和了形以外(三面子)", () => {
    const hand = Hand.fromString("___m123p055z2,s7-89");
    const actual = Hora.getHoraType(hand, "z2=");

    const expected: string[][] = [];

    expect(actual).toStrictEqual(expected);
  });

  it("和了形以外(一対子)", () => {
    const hand = Hand.fromString("m22");
    const actual = Hora.getHoraType(hand, null);

    const expected: string[][] = [];

    expect(actual).toStrictEqual(expected);
  });

  it("和了形以外(国士無双テンパイ)", () => {
    const hand = Hand.fromString("m19p19s19z123456");
    const actual = Hora.getHoraType(hand, "z7=");

    const expected: string[][] = [];

    expect(actual).toStrictEqual(expected);
  });

  it("和了形以外(九蓮宝燈テンパイ)", () => {
    const hand = Hand.fromString("m111234567899");
    const actual = Hora.getHoraType(hand, "m9=");

    const expected: string[][] = [];

    expect(actual).toStrictEqual(expected);
  });

  it("複数の和了形としない(順子優先)", () => {
    const hand = Hand.fromString("m111123p789999z1z1");
    const actual = Hora.getHoraType(hand, null);

    const expected = [["z11_!", "m123", "m111", "p789", "p999"]];

    expect(actual).toStrictEqual(expected);
  });

  it("複数の和了形(二盃口か七対子か)", () => {
    const hand = Hand.fromString("m223344p556677s88");
    const actual = Hora.getHoraType(hand, null);

    const expected = [
      ["s88_!", "m234", "m234", "p567", "p567"],
      ["m22", "m33", "m44", "p55", "p66", "p77", "s88_!"],
    ];

    expect(actual).toStrictEqual(expected);
  });

  it("複数の和了形(順子か刻子か)", () => {
    const hand = Hand.fromString("m111222333p89997");
    const actual = Hora.getHoraType(hand, null);

    const expected = [
      ["p99", "m123", "m123", "m123", "p7_!89"],
      ["p99", "m111", "m222", "m333", "p7_!89"],
    ];

    expect(actual).toStrictEqual(expected);
  });

  it("複数の和了形(雀頭の選択、平和かサンショクか)", () => {
    const hand = Hand.fromString("m2234455p234s234m3");
    const actual = Hora.getHoraType(hand, null);

    const expected = [
      ["m22", "m3_!45", "m345", "p234", "s234"],
      ["m55", "m23_!4", "m234", "p234", "s234"],
    ];

    expect(actual).toStrictEqual(expected);
  });

  it("複数の和了形(暗刻を含む形)", () => {
    const hand = Hand.fromString("m23p567s33345666m1");
    const actual = Hora.getHoraType(hand, null);

    const expected = [
      ["s33", "m1_!23", "p567", "s345", "s666"],
      ["s66", "m1_!23", "p567", "s333", "s456"],
    ];

    expect(actual).toStrictEqual(expected);
  });

  it("複数の和了形(九蓮宝燈形)", () => {
    const hand = Hand.fromString("s1113445678999s2");
    const actual = Hora.getHoraType(hand, null);

    const expected = [
      ["s99", "s111", "s2_!34", "s456", "s789"],
      ["s11134456789992_!"],
    ];

    expect(actual).toStrictEqual(expected);
  });

  it("バグ: 暗槓しているの5枚目の牌で和了", () => {
    const hand = Hand.fromString("s4067999z444s8,s8888");
    const actual = Hora.getHoraType(hand, null);

    const expected = [["s99", "s456", "s78_!9", "z444", "s8888"]];

    expect(actual).toStrictEqual(expected);
  });
});

describe("hule メソッド", () => {
  it("パラメータ不正", () => {
    expect(() => {
      const invalidRonPai = "m1" as RonPai;

      Hora.hora(Hand.fromString(), invalidRonPai, Hora.createSituationParam());
    }).toThrow();
  });

  it("和了形以外", () => {
    const hule = Hora.hora(
      Hand.fromString(),
      null,
      Hora.createSituationParam()
    );

    expect(hule).toBeUndefined();
  });

  it("符計算: 平和ツモは20符", () => {
    const hule = Hora.hora(
      Hand.fromString("m345567p234s33789"),
      null,
      Hora.createSituationParam()
    );

    expect(hule?.hu).toBe(20);
  });

  it("符計算: 平和ロンは30符", () => {
    const hule = Hora.hora(
      Hand.fromString("m345567p234s3378"),
      "s9=",
      Hora.createSituationParam()
    );

    expect(hule?.hu).toBe(30);
  });

  it("符計算: オタ風の雀頭に符はつかない", () => {
    const hule = Hora.hora(
      Hand.fromString("m112233p456z33s78"),
      "s9=",
      Hora.createSituationParam()
    );

    expect(hule?.hu).toBe(30);
  });

  it("符計算: 場風の雀頭は2符", () => {
    const hule = Hora.hora(
      Hand.fromString("m112233p456z11s78"),
      "s9=",
      Hora.createSituationParam()
    );

    expect(hule?.hu).toBe(40);
  });

  it("符計算: 自風の雀頭は2符", () => {
    const hule = Hora.hora(
      Hand.fromString("m112233p456z22s78"),
      "s9=",
      Hora.createSituationParam()
    );

    expect(hule?.hu).toBe(40);
  });

  it("符計算: 三元牌の雀頭は2符", () => {
    const hule = Hora.hora(
      Hand.fromString("m112233p456z55s78"),
      "s9=",
      Hora.createSituationParam()
    );

    expect(hule?.hu).toBe(40);
  });

  it("符計算: 連風牌の雀頭は4符", () => {
    const hule = Hora.hora(
      Hand.fromString("m112233z444z11s78"),
      "s9=",
      Hora.createSituationParam({ jikaze: 0 })
    );

    expect(hule?.hu).toBe(50);
  });

  it("符計算: 中張牌の明刻は2符", () => {
    const hule = Hora.hora(
      Hand.fromString("m123z11m88,p888+,s888-"),
      "m8=",
      Hora.createSituationParam({ jikaze: 0 })
    );

    expect(hule?.hu).toBe(30);
  });

  it("符計算: 幺九牌の明刻は4符", () => {
    const hule = Hora.hora(
      Hand.fromString("m123p22s99,z222+,p111-"),
      "s9=",
      Hora.createSituationParam()
    );

    expect(hule?.hu).toBe(40);
  });

  it("符計算: 中張牌の暗刻は4符", () => {
    const hule = Hora.hora(
      Hand.fromString("z33p222777s888m23"),
      "m4=",
      Hora.createSituationParam()
    );

    expect(hule?.hu).toBe(50);
  });

  it("符計算: 幺九牌の暗刻は8符", () => {
    const hule = Hora.hora(
      Hand.fromString("s33p111999z555m23"),
      "m4=",
      Hora.createSituationParam()
    );

    expect(hule?.hu).toBe(60);
  });

  it("符計算: 中張牌の明槓は8符", () => {
    const hule = Hora.hora(
      Hand.fromString("p33m22245667,s444+4"),
      "m8=",
      Hora.createSituationParam()
    );

    expect(hule?.hu).toBe(40);
  });

  it("符計算: 幺九牌の明槓は16符", () => {
    const hule = Hora.hora(
      Hand.fromString("p33m23445667,z6666-"),
      "m8=",
      Hora.createSituationParam()
    );

    expect(hule?.hu).toBe(40);
  });

  it("符計算: 中張牌の暗槓は16符", () => {
    const hule = Hora.hora(
      Hand.fromString("p33m23445667,s4444"),
      "m8=",
      Hora.createSituationParam()
    );

    expect(hule?.hu).toBe(50);
  });

  it("符計算: 幺九牌の暗槓は32符", () => {
    const hule = Hora.hora(
      Hand.fromString("p33m23445667,z7777"),
      "m8=",
      Hora.createSituationParam()
    );

    expect(hule?.hu).toBe(70);
  });

  it("符計算: ツモ和了は2符加算", () => {
    const hule = Hora.hora(
      Hand.fromString("p33m222s222345,s888-"),
      null,
      Hora.createSituationParam()
    );

    expect(hule?.hu).toBe(40);
  });

  it("符計算: 単騎待ちは2符加算", () => {
    const hule = Hora.hora(
      Hand.fromString("m222s222345p3,s888-"),
      "p3=",
      Hora.createSituationParam()
    );

    expect(hule?.hu).toBe(40);
  });

  it("符計算: 嵌張待ちは2符加算", () => {
    const hule = Hora.hora(
      Hand.fromString("p33m222s22235,s888-"),
      "s4=",
      Hora.createSituationParam()
    );

    expect(hule?.hu).toBe(40);
  });

  it("符計算: 辺張待ちは2符加算", () => {
    const hule = Hora.hora(
      Hand.fromString("p33z111m12389,s222-"),
      "m7=",
      Hora.createSituationParam()
    );

    expect(hule?.hu).toBe(40);
  });

  it("符計算: 喰い平和は30符", () => {
    const hule = Hora.hora(
      Hand.fromString("m22p345678s34,s67-8"),
      "s5=",
      Hora.createSituationParam()
    );

    expect(hule?.hu).toBe(30);
  });

  it("符計算: 七対子は25符", () => {
    const hule = Hora.hora(
      Hand.fromString("m2255p88s1166z1155"),
      null,
      Hora.createSituationParam()
    );

    expect(hule?.hu).toBe(25);
  });

  it("符計算: 国士無双は符なし", () => {
    const hule = Hora.hora(
      Hand.fromString("m19p19s1z12345677s9"),
      null,
      Hora.createSituationParam()
    );

    expect(hule?.hu).toBeUndefined();
  });

  it("符計算: 九蓮宝燈は符なし", () => {
    const hule = Hora.hora(
      Hand.fromString("m11123456789995"),
      null,
      Hora.createSituationParam()
    );

    expect(hule?.hu).toBeUndefined();
  });

  it("和了役: 役なし", () => {
    const hule = Hora.hora(
      Hand.fromString("m344556s24678z66"),
      "s3=",
      Hora.createSituationParam()
    );

    expect(hule?.horaYakuInfos).toBeUndefined();
  });

  it("和了役: 立直", () => {
    const hule = Hora.hora(
      Hand.fromString("m344556s24678z66*"),
      "s3=",
      Hora.createSituationParam({ riichi: 1 })
    );

    // expect(actual).toStrictEqual(expected);
    expect(hule?.horaYakuInfos).toStrictEqual([{ name: "立直", numHan: 1 }]);
  });

  it("和了役: ダブル立直", () => {
    const hule = Hora.hora(
      Hand.fromString("m344556s24678z66*"),
      "s3=",
      Hora.createSituationParam({ riichi: 2 })
    );

    expect(hule?.horaYakuInfos).toStrictEqual([
      { name: "ダブル立直", numHan: 2 },
    ]);
  });

  it("和了役: 立直・一発", () => {
    const hule = Hora.hora(
      Hand.fromString("m344556s24678z66*"),
      "s3=",
      Hora.createSituationParam({ riichi: 1, isOneShot: true })
    );

    expect(hule?.horaYakuInfos).toStrictEqual([
      { name: "立直", numHan: 1 },
      { name: "一発", numHan: 1 },
    ]);
  });

  it("和了役: 海底摸月", () => {
    const hule = Hora.hora(
      Hand.fromString("m344556s24z66s3,s6-78"),
      null,
      Hora.createSituationParam({ haitei: 1 })
    );

    expect(hule?.horaYakuInfos).toStrictEqual([
      { name: "海底摸月", numHan: 1 },
    ]);
  });

  it("和了役: 河底撈魚", () => {
    const hule = Hora.hora(
      Hand.fromString("m344556s24678z66"),
      "s3=",
      Hora.createSituationParam({ haitei: 2 })
    );

    expect(hule?.horaYakuInfos).toStrictEqual([
      { name: "河底撈魚", numHan: 1 },
    ]);
  });

  it("和了役: 嶺上開花", () => {
    const hule = Hora.hora(
      Hand.fromString("m344556s24z66s3,s777+7"),
      null,
      Hora.createSituationParam({ isRinShan: true })
    );

    expect(hule?.horaYakuInfos).toStrictEqual([
      { name: "嶺上開花", numHan: 1 },
    ]);
  });

  it("和了役: 槍槓", () => {
    const hule = Hora.hora(
      Hand.fromString("m344556s24678z66"),
      "s3=",
      Hora.createSituationParam({ isChanKan: true })
    );

    expect(hule?.horaYakuInfos).toStrictEqual([{ name: "槍槓", numHan: 1 }]);
  });

  it("和了役: 天和", () => {
    const hule = Hora.hora(
      Hand.fromString("m344556s24678z66s3"),
      null,
      Hora.createSituationParam({ tenho: 1 })
    );

    expect(hule?.horaYakuInfos).toStrictEqual([{ name: "天和", numHan: "*" }]);
  });

  it("和了役: 地和", () => {
    const hule = Hora.hora(
      Hand.fromString("m344556s24678z66s3"),
      null,
      Hora.createSituationParam({ tenho: 2 })
    );

    expect(hule?.horaYakuInfos).toStrictEqual([{ name: "地和", numHan: "*" }]);
  });

  it("和了役: 門前清自摸和", () => {
    const hule = Hora.hora(
      Hand.fromString("m344556s24678z66s3"),
      null,
      Hora.createSituationParam()
    );

    expect(hule?.horaYakuInfos).toStrictEqual([
      { name: "門前清自摸和", numHan: 1 },
    ]);
  });

  it("和了役: 場風 東", () => {
    const hule = Hora.hora(
      Hand.fromString("m345567s3378z111"),
      "s9=",
      Hora.createSituationParam()
    );

    expect(hule?.horaYakuInfos).toStrictEqual([{ name: "場風 東", numHan: 1 }]);
  });

  it("和了役: 自風 西", () => {
    const hule = Hora.hora(
      Hand.fromString("m345567s33789,z333+"),
      null,
      Hora.createSituationParam({ jikaze: 2 })
    );

    expect(hule?.horaYakuInfos).toStrictEqual([{ name: "自風 西", numHan: 1 }]);
  });

  it("和了役: 連風牌 南", () => {
    const hule = Hora.hora(
      Hand.fromString("m345567s33z22,s789-"),
      "z2=",
      Hora.createSituationParam({ bakaze: 1 })
    );

    expect(hule?.horaYakuInfos).toStrictEqual([
      { name: "場風 南", numHan: 1 },
      { name: "自風 南", numHan: 1 },
    ]);
  });

  it("和了役: 翻牌 白", () => {
    const hule = Hora.hora(
      Hand.fromString("m345567s33789,z555+5"),
      null,
      Hora.createSituationParam()
    );

    expect(hule?.horaYakuInfos).toStrictEqual([{ name: "翻牌 白", numHan: 1 }]);
  });

  it("和了役: 翻牌 發・中", () => {
    const hule = Hora.hora(
      Hand.fromString("m345567s33,z6666+,z7777"),
      null,
      Hora.createSituationParam()
    );

    expect(hule?.horaYakuInfos).toStrictEqual([
      { name: "翻牌 發", numHan: 1 },
      { name: "翻牌 中", numHan: 1 },
    ]);
  });

  it("和了役: 平和", () => {
    const hule = Hora.hora(
      Hand.fromString("z33m234456p78s123"),
      "p9=",
      Hora.createSituationParam()
    );

    expect(hule?.horaYakuInfos).toStrictEqual([{ name: "平和", numHan: 1 }]);
  });

  it("和了役: 平和・ツモ", () => {
    const hule = Hora.hora(
      Hand.fromString("z33m234456p78s123p9"),
      null,
      Hora.createSituationParam()
    );

    expect(hule?.horaYakuInfos).toStrictEqual([
      { name: "門前清自摸和", numHan: 1 },
      { name: "平和", numHan: 1 },
    ]);
  });

  it("和了役: 喰い平和(役なし)", () => {
    const hule = Hora.hora(
      Hand.fromString("z33m234456p78,s1-23"),
      "p9=",
      Hora.createSituationParam()
    );

    expect(hule?.horaYakuInfos).toBeUndefined();
  });

  it("和了役: 断幺九", () => {
    const hule = Hora.hora(
      Hand.fromString("m22555p234s78,p777-"),
      "s6=",
      Hora.createSituationParam()
    );

    expect(hule?.horaYakuInfos).toStrictEqual([{ name: "断幺九", numHan: 1 }]);
  });

  it("和了役: 断幺九(七対子形)", () => {
    const hule = Hora.hora(
      Hand.fromString("m2255p4488s33667"),
      "s7=",
      Hora.createSituationParam()
    );

    expect(hule?.horaYakuInfos).toStrictEqual([
      { name: "断幺九", numHan: 1 },
      { name: "七対子", numHan: 2 },
    ]);
  });

  it("和了役: 一盃口", () => {
    const hule = Hora.hora(
      Hand.fromString("m33455p111s33789"),
      "m4=",
      Hora.createSituationParam()
    );

    expect(hule?.horaYakuInfos).toStrictEqual([{ name: "一盃口", numHan: 1 }]);
  });

  it("和了役: 喰い一盃口(役なし)", () => {
    const hule = Hora.hora(
      Hand.fromString("m33455p111s33,s78-9"),
      "m4=",
      Hora.createSituationParam()
    );

    expect(hule?.horaYakuInfos).toBeUndefined();
  });

  it("和了役: 三色同順", () => {
    const hule = Hora.hora(
      Hand.fromString("m567p567s2256799"),
      "s9=",
      Hora.createSituationParam()
    );

    expect(hule?.horaYakuInfos).toStrictEqual([
      { name: "三色同順", numHan: 2 },
    ]);
  });

  it("和了役: 三色同順(喰い下がり)", () => {
    const hule = Hora.hora(
      Hand.fromString("m567s2256799,p56-7"),
      "s9=",
      Hora.createSituationParam()
    );

    expect(hule?.horaYakuInfos).toStrictEqual([
      { name: "三色同順", numHan: 1 },
    ]);
  });

  it("和了役: 一気通貫", () => {
    const hule = Hora.hora(
      Hand.fromString("m12456789s33789"),
      "m3=",
      Hora.createSituationParam()
    );

    expect(hule?.horaYakuInfos).toStrictEqual([
      { name: "一気通貫", numHan: 2 },
    ]);
  });

  it("和了役: 一気通貫(喰い下がり)", () => {
    const hule = Hora.hora(
      Hand.fromString("m12789s33789,m4-56"),
      "m3=",
      Hora.createSituationParam()
    );

    expect(hule?.horaYakuInfos).toStrictEqual([
      { name: "一気通貫", numHan: 1 },
    ]);
  });

  it("和了役: 混全帯幺九", () => {
    const hule = Hora.hora(
      Hand.fromString("m123999p789z33s12"),
      "s3=",
      Hora.createSituationParam()
    );

    expect(hule?.horaYakuInfos).toStrictEqual([
      { name: "混全帯幺九", numHan: 2 },
    ]);
  });

  it("和了役: 混全帯幺九(喰い下がり)", () => {
    const hule = Hora.hora(
      Hand.fromString("m123p789z33s12,m999+"),
      "s3=",
      Hora.createSituationParam()
    );

    expect(hule?.horaYakuInfos).toStrictEqual([
      { name: "混全帯幺九", numHan: 1 },
    ]);
  });

  it("和了役: 七対子", () => {
    const hule = Hora.hora(
      Hand.fromString("m115599p2233s8z22"),
      "s8=",
      Hora.createSituationParam()
    );

    expect(hule?.horaYakuInfos).toStrictEqual([{ name: "七対子", numHan: 2 }]);
  });

  it("和了役: 対々和", () => {
    const hule = Hora.hora(
      Hand.fromString("m55888z333s22,p111="),
      "s2=",
      Hora.createSituationParam()
    );

    expect(hule?.horaYakuInfos).toStrictEqual([{ name: "対々和", numHan: 2 }]);
  });

  it("和了役: 三暗刻", () => {
    const hule = Hora.hora(
      Hand.fromString("p99s111m555,p345-,s3333"),
      null,
      Hora.createSituationParam()
    );

    expect(hule?.horaYakuInfos).toStrictEqual([{ name: "三暗刻", numHan: 2 }]);
  });

  it("和了役: 三槓子", () => {
    const hule = Hora.hora(
      Hand.fromString("p11m45,s2222+,m888=8,z4444"),
      "m3=",
      Hora.createSituationParam()
    );

    expect(hule?.horaYakuInfos).toStrictEqual([{ name: "三槓子", numHan: 2 }]);
  });

  it("和了役: 三色同刻", () => {
    const hule = Hora.hora(
      Hand.fromString("s12377m22,p222-,s222-"),
      "m2=",
      Hora.createSituationParam()
    );

    expect(hule?.horaYakuInfos).toStrictEqual([
      { name: "三色同刻", numHan: 2 },
    ]);
  });

  it("和了役: 混老頭(対々和形)", () => {
    const hule = Hora.hora(
      Hand.fromString("z11p11199,m111=,z333+"),
      "p9=",
      Hora.createSituationParam()
    );

    expect(hule?.horaYakuInfos).toStrictEqual([
      { name: "対々和", numHan: 2 },
      { name: "混老頭", numHan: 2 },
    ]);
  });

  it("和了役: 混老頭(七対子形)", () => {
    const hule = Hora.hora(
      Hand.fromString("m1199p11s99z11335"),
      "z5=",
      Hora.createSituationParam()
    );

    expect(hule?.horaYakuInfos).toStrictEqual([
      { name: "七対子", numHan: 2 },
      { name: "混老頭", numHan: 2 },
    ]);
  });

  it("和了役: 小三元", () => {
    const hule = Hora.hora(
      Hand.fromString("z55577m567p22,z666-"),
      "p2=",
      Hora.createSituationParam()
    );

    expect(hule?.horaYakuInfos).toStrictEqual([
      { name: "翻牌 白", numHan: 1 },
      { name: "翻牌 發", numHan: 1 },
      { name: "小三元", numHan: 2 },
    ]);
  });

  it("和了役: 混一色", () => {
    const hule = Hora.hora(
      Hand.fromString("m111234789z1133"),
      "z3=",
      Hora.createSituationParam()
    );

    expect(hule?.horaYakuInfos).toStrictEqual([{ name: "混一色", numHan: 3 }]);
  });

  it("和了役: 混一色(喰い下がり)", () => {
    const hule = Hora.hora(
      Hand.fromString("z11333p23478,p111+"),
      "p9=",
      Hora.createSituationParam()
    );

    expect(hule?.horaYakuInfos).toStrictEqual([{ name: "混一色", numHan: 2 }]);
  });

  it("和了役: 混一色(七対子形)", () => {
    const hule = Hora.hora(
      Hand.fromString("s11224488z22557"),
      "z7=",
      Hora.createSituationParam()
    );

    expect(hule?.horaYakuInfos).toStrictEqual([
      { name: "七対子", numHan: 2 },
      { name: "混一色", numHan: 3 },
    ]);
  });

  it("和了役: 純全帯幺九", () => {
    const hule = Hora.hora(
      Hand.fromString("m11s123p789s789m99"),
      "m9=",
      Hora.createSituationParam()
    );

    expect(hule?.horaYakuInfos).toStrictEqual([
      { name: "純全帯幺九", numHan: 3 },
    ]);
  });

  it("和了役: 純全帯幺九(喰い下がり)", () => {
    const hule = Hora.hora(
      Hand.fromString("m11s123p789s78,m999="),
      "s9=",
      Hora.createSituationParam()
    );

    expect(hule?.horaYakuInfos).toStrictEqual([
      { name: "純全帯幺九", numHan: 2 },
    ]);
  });

  it("和了役: 二盃口", () => {
    const hule = Hora.hora(
      Hand.fromString("m223344p667788s9"),
      "s9=",
      Hora.createSituationParam()
    );

    expect(hule?.horaYakuInfos).toStrictEqual([{ name: "二盃口", numHan: 3 }]);
  });

  it("和了役: 二盃口(4枚使い)", () => {
    const hule = Hora.hora(
      Hand.fromString("m222233334444s9"),
      "s9=",
      Hora.createSituationParam()
    );

    expect(hule?.horaYakuInfos).toStrictEqual([{ name: "二盃口", numHan: 3 }]);
  });

  it("和了役: 喰い二盃口(役なし)", () => {
    const hule = Hora.hora(
      Hand.fromString("m223344p678s9,p678-"),
      "s9=",
      Hora.createSituationParam()
    );

    expect(hule?.horaYakuInfos).toBeUndefined();
  });

  it("和了役: 清一色", () => {
    const hule = Hora.hora(
      Hand.fromString("m1113456677778"),
      "m9=",
      Hora.createSituationParam()
    );

    expect(hule?.horaYakuInfos).toStrictEqual([{ name: "清一色", numHan: 6 }]);
  });

  it("和了役: 清一色(喰い下がり)", () => {
    const hule = Hora.hora(
      Hand.fromString("p2344555,p12-3,p7-89"),
      "p1=",
      Hora.createSituationParam()
    );

    expect(hule?.horaYakuInfos).toStrictEqual([{ name: "清一色", numHan: 5 }]);
  });

  it("和了役: 清一色(七対子形)", () => {
    const hule = Hora.hora(
      Hand.fromString("s1122445577889"),
      "s9=",
      Hora.createSituationParam()
    );

    expect(hule?.horaYakuInfos).toStrictEqual([
      { name: "七対子", numHan: 2 },
      { name: "清一色", numHan: 6 },
    ]);
  });

  it("和了役: 国士無双", () => {
    const hule = Hora.hora(
      Hand.fromString("m119p19s19z1234567"),
      null,
      Hora.createSituationParam()
    );

    expect(hule?.horaYakuInfos).toStrictEqual([
      { name: "国士無双", numHan: "*" },
    ]);
  });

  it("和了役: 国士無双十三面", () => {
    const hule = Hora.hora(
      Hand.fromString("m19p19s19z1234567m1"),
      null,
      Hora.createSituationParam()
    );

    expect(hule?.horaYakuInfos).toStrictEqual([
      { name: "国士無双十三面", numHan: "**" },
    ]);
  });

  it("和了役: 四暗刻", () => {
    const hule = Hora.hora(
      Hand.fromString("m33m111p333s777z111"),
      null,
      Hora.createSituationParam()
    );

    expect(hule?.horaYakuInfos).toStrictEqual([
      { name: "四暗刻", numHan: "*" },
    ]);
  });

  it("和了役: 四暗刻単騎", () => {
    const hule = Hora.hora(
      Hand.fromString("m111p333s777z111m3"),
      "m3=",
      Hora.createSituationParam()
    );

    expect(hule?.horaYakuInfos).toStrictEqual([
      { name: "四暗刻単騎", numHan: "**" },
    ]);
  });

  it("和了役: 大三元", () => {
    const hule = Hora.hora(
      Hand.fromString("z555m456p22z66,z777+"),
      "z6=",
      Hora.createSituationParam()
    );

    expect(hule?.horaYakuInfos).toStrictEqual([
      { name: "大三元", numHan: "*" },
    ]);
  });

  it("和了役: 大三元(パオ)", () => {
    const hule = Hora.hora(
      Hand.fromString("m2234,z555-5,z6666,z777+"),
      "m5=",
      Hora.createSituationParam()
    );

    expect(hule?.horaYakuInfos).toStrictEqual([
      { name: "大三元", numHan: "*", paoTarget: "+" },
    ]);
  });

  it("和了役: 小四喜", () => {
    const hule = Hora.hora(
      Hand.fromString("m234z2244,z333+,z111-"),
      "z4=",
      Hora.createSituationParam()
    );

    expect(hule?.horaYakuInfos).toStrictEqual([
      { name: "小四喜", numHan: "*" },
    ]);
  });

  it("和了役: 大四喜", () => {
    const hule = Hora.hora(
      Hand.fromString("m22z22244,z333+,z111-"),
      "z4=",
      Hora.createSituationParam()
    );

    expect(hule?.horaYakuInfos).toStrictEqual([
      { name: "大四喜", numHan: "**" },
    ]);
  });

  it("和了役: 大四喜(パオ)", () => {
    const hule = Hora.hora(
      Hand.fromString("m2,z222+,z4444,z333+,z111-"),
      "m2=",
      Hora.createSituationParam()
    );

    expect(hule?.horaYakuInfos).toStrictEqual([
      { name: "大四喜", numHan: "**", paoTarget: "-" },
    ]);
  });

  it("和了役: 字一色", () => {
    const hule = Hora.hora(
      Hand.fromString("z1112277,z555=,z444+"),
      "z7=",
      Hora.createSituationParam()
    );

    expect(hule?.horaYakuInfos).toStrictEqual([
      { name: "字一色", numHan: "*" },
    ]);
  });

  it("和了役: 字一色(七対子形)", () => {
    const hule = Hora.hora(
      Hand.fromString("z1122334455667"),
      "z7=",
      Hora.createSituationParam()
    );

    expect(hule?.horaYakuInfos).toStrictEqual([
      { name: "字一色", numHan: "*" },
    ]);
  });

  it("和了役: 緑一色", () => {
    const hule = Hora.hora(
      Hand.fromString("s22334466z66,s888+"),
      "z6=",
      Hora.createSituationParam()
    );

    expect(hule?.horaYakuInfos).toStrictEqual([
      { name: "緑一色", numHan: "*" },
    ]);
  });

  it("和了役: 緑一色(發なし)", () => {
    const hule = Hora.hora(
      Hand.fromString("s4466,s222=,s333+,s888-"),
      "s6=",
      Hora.createSituationParam()
    );

    expect(hule?.horaYakuInfos).toStrictEqual([
      { name: "緑一色", numHan: "*" },
    ]);
  });

  it("和了役: 清老頭", () => {
    const hule = Hora.hora(
      Hand.fromString("s11p111m11,s999-,m999="),
      "m1=",
      Hora.createSituationParam()
    );

    expect(hule?.horaYakuInfos).toStrictEqual([
      { name: "清老頭", numHan: "*" },
    ]);
  });

  it("和了役: 四槓子", () => {
    const hule = Hora.hora(
      Hand.fromString("m1,z5555,p222+2,p777-7,s1111-"),
      "m1=",
      Hora.createSituationParam()
    );

    expect(hule?.horaYakuInfos).toStrictEqual([
      { name: "四槓子", numHan: "*" },
    ]);
  });

  it("和了役: 九蓮宝燈", () => {
    const hule = Hora.hora(
      Hand.fromString("m1112235678999"),
      "m4=",
      Hora.createSituationParam()
    );

    expect(hule?.horaYakuInfos).toStrictEqual([
      { name: "九蓮宝燈", numHan: "*" },
    ]);
  });

  it("和了役: 純正九蓮宝燈", () => {
    const hule = Hora.hora(
      Hand.fromString("m1112345678999"),
      "m2=",
      Hora.createSituationParam()
    );

    expect(hule?.horaYakuInfos).toStrictEqual([
      { name: "純正九蓮宝燈", numHan: "**" },
    ]);
  });

  it("ドラ: ドラなし", () => {
    const hule = Hora.hora(
      Hand.fromString("p55m234s78,m4-56,z111+"),
      "s9=",
      Hora.createSituationParam({ baopai: ["s1"] })
    );

    expect(hule?.horaYakuInfos).toStrictEqual([{ name: "場風 東", numHan: 1 }]);
  });

  it("ドラ: 手牌内: 1", () => {
    const hule = Hora.hora(
      Hand.fromString("p55m234s78,m4-56,z111+"),
      "s9=",
      Hora.createSituationParam({ baopai: ["m2"] })
    );

    expect(hule?.horaYakuInfos).toStrictEqual([
      { name: "場風 東", numHan: 1 },
      { name: "ドラ", numHan: 1 },
    ]);
  });

  it("ドラ: 手牌内: 2", () => {
    const hule = Hora.hora(
      Hand.fromString("p55m234s78,m4-56,z111+"),
      "s9=",
      Hora.createSituationParam({ baopai: ["p4"] })
    );

    expect(hule?.horaYakuInfos).toStrictEqual([
      { name: "場風 東", numHan: 1 },
      { name: "ドラ", numHan: 2 },
    ]);
  });

  it("ドラ: 手牌内: 1, 副露内: 1", () => {
    const hule = Hora.hora(
      Hand.fromString("p55m23s789,m4-56,z111+"),
      "m4=",
      Hora.createSituationParam({ baopai: ["m3"] })
    );

    expect(hule?.horaYakuInfos).toStrictEqual([
      { name: "場風 東", numHan: 1 },
      { name: "ドラ", numHan: 2 },
    ]);
  });

  it("ドラ: 槓ドラ: 1", () => {
    const hule = Hora.hora(
      Hand.fromString("p55m234s78,m4-56,z111+"),
      "s9=",
      Hora.createSituationParam({ baopai: ["s1", "m2"] })
    );

    expect(hule?.horaYakuInfos).toStrictEqual([
      { name: "場風 東", numHan: 1 },
      { name: "ドラ", numHan: 1 },
    ]);
  });

  it("ドラ: 赤ドラ: 2", () => {
    const hule = Hora.hora(
      Hand.fromString("p50m234s78,m4-06,z111+"),
      "s9=",
      Hora.createSituationParam({ baopai: ["s1"] })
    );

    expect(hule?.horaYakuInfos).toStrictEqual([
      { name: "場風 東", numHan: 1 },
      { name: "赤ドラ", numHan: 2 },
    ]);
  });

  it("ドラ: 赤のダブドラ", () => {
    const hule = Hora.hora(
      Hand.fromString("p55m234s78,m4-06,z111+"),
      "s9=",
      Hora.createSituationParam({ baopai: ["m4"] })
    );

    expect(hule?.horaYakuInfos).toStrictEqual([
      { name: "場風 東", numHan: 1 },
      { name: "ドラ", numHan: 1 },
      { name: "赤ドラ", numHan: 1 },
    ]);
  });

  it("ドラ: ドラ表示牌が赤牌", () => {
    const hule = Hora.hora(
      Hand.fromString("p55m234s78,m4-56,z111+"),
      "s9=",
      Hora.createSituationParam({ baopai: ["m0"] })
    );

    expect(hule?.horaYakuInfos).toStrictEqual([
      { name: "場風 東", numHan: 1 },
      { name: "ドラ", numHan: 1 },
    ]);
  });

  it("ドラ: 裏ドラなし", () => {
    const hule = Hora.hora(
      Hand.fromString("m344556s24678z66*"),
      "s3=",
      Hora.createSituationParam({ riichi: 1, baopai: ["s9"], fubaopai: ["s9"] })
    );

    expect(hule?.horaYakuInfos).toStrictEqual([{ name: "立直", numHan: 1 }]);
  });

  it("ドラ: 裏ドラ: 1", () => {
    const hule = Hora.hora(
      Hand.fromString("m344556s24678z66*"),
      "s3=",
      Hora.createSituationParam({ riichi: 1, baopai: ["s9"], fubaopai: ["m2"] })
    );

    expect(hule?.horaYakuInfos).toStrictEqual([
      { name: "立直", numHan: 1 },
      { name: "裏ドラ", numHan: 1 },
    ]);
  });

  it("ドラ: ドラ: 1, 裏ドラ: 1", () => {
    const hule = Hora.hora(
      Hand.fromString("m344556s24678z66*"),
      "s3=",
      Hora.createSituationParam({ riichi: 1, baopai: ["m2"], fubaopai: ["m2"] })
    );

    expect(hule?.horaYakuInfos).toStrictEqual([
      { name: "立直", numHan: 1 },
      { name: "ドラ", numHan: 1 },
      { name: "裏ドラ", numHan: 1 },
    ]);
  });

  it("ドラ: ドラのみでの和了は不可", () => {
    const hule = Hora.hora(
      Hand.fromString("m344556s24678z66"),
      "s3=",
      Hora.createSituationParam({ baopai: ["m2"] })
    );

    expect(hule?.horaYakuInfos).toBeUndefined();
  });

  it("ドラ: 役満にドラはつかない", () => {
    const hule = Hora.hora(
      Hand.fromString("m119p19s19z1234567"),
      null,
      Hora.createSituationParam({ baopai: ["m9"] })
    );

    expect(hule?.horaYakuInfos).toStrictEqual([
      { name: "国士無双", numHan: "*" },
    ]);
  });

  it("点計算: 20符 2翻 子 ツモ → 400/700", () => {
    const hule = Hora.hora(
      Hand.fromString("z33m123p456s789m234"),
      null,
      Hora.createSituationParam()
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [
        { name: "門前清自摸和", numHan: 1 },
        { name: "平和", numHan: 1 },
      ],
      hu: 20,
      numHan: 2,
      numCompositeYakuman: undefined,
      horaPoint: 1500,
      incomes: [-700, 1500, -400, -400],
    });
  });

  it("点計算: 20符 3翻 親 ツモ → 1300∀", () => {
    const hule = Hora.hora(
      Hand.fromString("z33m123p456s789m231"),
      null,
      Hora.createSituationParam({ jikaze: 0 })
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [
        { name: "門前清自摸和", numHan: 1 },
        { name: "平和", numHan: 1 },
        { name: "一盃口", numHan: 1 },
      ],
      hu: 20,
      numHan: 3,
      numCompositeYakuman: undefined,
      horaPoint: 3900,
      incomes: [3900, -1300, -1300, -1300],
    });
  });

  it("点計算: 20符 4翻 子 ツモ → 1300/2600", () => {
    const hule = Hora.hora(
      Hand.fromString("z33m123p234s234m234"),
      null,
      Hora.createSituationParam()
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [
        { name: "門前清自摸和", numHan: 1 },
        { name: "平和", numHan: 1 },
        { name: "三色同順", numHan: 2 },
      ],
      hu: 20,
      numHan: 4,
      numCompositeYakuman: undefined,
      horaPoint: 5200,
      incomes: [-2600, 5200, -1300, -1300],
    });
  });

  it("点計算: 25符 2翻 子 ロン → 1600", () => {
    const hule = Hora.hora(
      Hand.fromString("m1122p3344s5566z7"),
      "z7-",
      Hora.createSituationParam({ numRiichiBou: 1, numTsumibou: 1 })
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [{ name: "七対子", numHan: 2 }],
      hu: 25,
      numHan: 2,
      numCompositeYakuman: undefined,
      horaPoint: 1600,
      incomes: [-1900, 2900, 0, 0],
    });
  });

  it("点計算: 25符 3翻 親 ツモ → 1600∀", () => {
    const hule = Hora.hora(
      Hand.fromString("m1122p3344s5566z77"),
      null,
      Hora.createSituationParam({ jikaze: 0, numRiichiBou: 1, numTsumibou: 1 })
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [
        { name: "門前清自摸和", numHan: 1 },
        { name: "七対子", numHan: 2 },
      ],
      hu: 25,
      numHan: 3,
      numCompositeYakuman: undefined,
      horaPoint: 4800,
      incomes: [6100, -1700, -1700, -1700],
    });
  });

  it("点計算: 25符 4翻 子 ツモ → 1600/3200", () => {
    const hule = Hora.hora(
      Hand.fromString("m2277p3344s556688"),
      null,
      Hora.createSituationParam({ numRiichiBou: 1, numTsumibou: 1 })
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [
        { name: "門前清自摸和", numHan: 1 },
        { name: "断幺九", numHan: 1 },
        { name: "七対子", numHan: 2 },
      ],
      hu: 25,
      numHan: 4,
      numCompositeYakuman: undefined,
      horaPoint: 6400,
      incomes: [-3300, 7700, -1700, -1700],
    });
  });

  it("点計算: 30符 1翻 親 ロン → 1500", () => {
    const hule = Hora.hora(
      Hand.fromString("m77234p456s67,m34-5"),
      "s8=",
      Hora.createSituationParam({ jikaze: 0 })
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [{ name: "断幺九", numHan: 1 }],
      hu: 30,
      numHan: 1,
      numCompositeYakuman: undefined,
      horaPoint: 1500,
      incomes: [1500, 0, -1500, 0],
    });
  });

  it("点計算: 30符 2翻 子 ロン → 2000", () => {
    const hule = Hora.hora(
      Hand.fromString("m77234p345s34,m34-5"),
      "s5-",
      Hora.createSituationParam()
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [
        { name: "断幺九", numHan: 1 },
        { name: "三色同順", numHan: 1 },
      ],
      hu: 30,
      numHan: 2,
      numCompositeYakuman: undefined,
      horaPoint: 2000,
      incomes: [-2000, 2000, 0, 0],
    });
  });

  it("点計算: 30符 3翻 親 ツモ → 2000∀", () => {
    const hule = Hora.hora(
      Hand.fromString("m22z111p445566s789"),
      null,
      Hora.createSituationParam({ bakaze: 1, jikaze: 0 })
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [
        { name: "門前清自摸和", numHan: 1 },
        { name: "自風 東", numHan: 1 },
        { name: "一盃口", numHan: 1 },
      ],
      hu: 30,
      numHan: 3,
      numCompositeYakuman: undefined,
      horaPoint: 6000,
      incomes: [6000, -2000, -2000, -2000],
    });
  });

  it("点計算: 30符 4翻 子 ツモ → 2000/3900", () => {
    const hule = Hora.hora(
      Hand.fromString("m11z111p123789s789"),
      null,
      Hora.createSituationParam()
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [
        { name: "門前清自摸和", numHan: 1 },
        { name: "場風 東", numHan: 1 },
        { name: "混全帯幺九", numHan: 2 },
      ],
      hu: 30,
      numHan: 4,
      numCompositeYakuman: undefined,
      horaPoint: 7900,
      incomes: [-3900, 7900, -2000, -2000],
    });
  });

  it("点計算: 40符 1翻 親 ロン → 2000", () => {
    const hule = Hora.hora(
      Hand.fromString("m11234234p456s89"),
      "s7=",
      Hora.createSituationParam({ jikaze: 0 })
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [{ name: "一盃口", numHan: 1 }],
      hu: 40,
      numHan: 1,
      numCompositeYakuman: undefined,
      horaPoint: 2000,
      incomes: [2000, 0, -2000, 0],
    });
  });

  it("点計算: 40符 2翻 子 ロン → 2600", () => {
    const hule = Hora.hora(
      Hand.fromString("m22334455p456s68"),
      "s7-",
      Hora.createSituationParam()
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [
        { name: "断幺九", numHan: 1 },
        { name: "一盃口", numHan: 1 },
      ],
      hu: 40,
      numHan: 2,
      numCompositeYakuman: undefined,
      horaPoint: 2600,
      incomes: [-2600, 2600, 0, 0],
    });
  });

  it("点計算: 40符 3翻 親 ツモ → 2600∀", () => {
    const hule = Hora.hora(
      Hand.fromString("z33222m222,s222=,p999+"),
      null,
      Hora.createSituationParam({ bakaze: 1, jikaze: 0 })
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [
        { name: "場風 南", numHan: 1 },
        { name: "対々和", numHan: 2 },
      ],
      hu: 40,
      numHan: 3,
      numCompositeYakuman: undefined,
      horaPoint: 7800,
      incomes: [7800, -2600, -2600, -2600],
    });
  });

  it("点計算: 40符 4翻 子 ツモ → 2000/4000", () => {
    const hule = Hora.hora(
      Hand.fromString("z33222m222,s222=,p999+"),
      null,
      Hora.createSituationParam({ bakaze: 1 })
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [
        { name: "場風 南", numHan: 1 },
        { name: "自風 南", numHan: 1 },
        { name: "対々和", numHan: 2 },
      ],
      hu: 40,
      numHan: 4,
      numCompositeYakuman: undefined,
      horaPoint: 8000,
      incomes: [-4000, 8000, -2000, -2000],
    });
  });

  it("点計算: 50符 1翻 親 ロン → 2400", () => {
    const hule = Hora.hora(
      Hand.fromString("m123p456s789z2227"),
      "z7=",
      Hora.createSituationParam({ bakaze: 1, jikaze: 0 })
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [{ name: "場風 南", numHan: 1 }],
      hu: 50,
      numHan: 1,
      numCompositeYakuman: undefined,
      horaPoint: 2400,
      incomes: [2400, 0, -2400, 0],
    });
  });

  it("点計算: 50符 2翻 子 ロン → 3200", () => {
    const hule = Hora.hora(
      Hand.fromString("m123p456s789z2227"),
      "z7-",
      Hora.createSituationParam({ bakaze: 1 })
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [
        { name: "場風 南", numHan: 1 },
        { name: "自風 南", numHan: 1 },
      ],
      hu: 50,
      numHan: 2,
      numCompositeYakuman: undefined,
      horaPoint: 3200,
      incomes: [-3200, 3200, 0, 0],
    });
  });

  it("点計算: 50符 3翻 親 ツモ → 3200∀", () => {
    const hule = Hora.hora(
      Hand.fromString("z33m222z222,p8888,s789-"),
      null,
      Hora.createSituationParam({ bakaze: 1, jikaze: 0 })
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [
        { name: "場風 南", numHan: 1 },
        { name: "三暗刻", numHan: 2 },
      ],
      hu: 50,
      numHan: 3,
      numCompositeYakuman: undefined,
      horaPoint: 9600,
      incomes: [9600, -3200, -3200, -3200],
    });
  });

  it("点計算: 50符 4翻 子 ツモ → 2000/4000", () => {
    const hule = Hora.hora(
      Hand.fromString("z33m222z222,p8888,s789-"),
      null,
      Hora.createSituationParam({ bakaze: 1 })
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [
        { name: "場風 南", numHan: 1 },
        { name: "自風 南", numHan: 1 },
        { name: "三暗刻", numHan: 2 },
      ],
      hu: 50,
      numHan: 4,
      numCompositeYakuman: undefined,
      horaPoint: 8000,
      incomes: [-4000, 8000, -2000, -2000],
    });
  });

  it("点計算: 60符 1翻 親 ロン → 2900", () => {
    const hule = Hora.hora(
      Hand.fromString("s789z2227,m2222,p111="),
      "z7=",
      Hora.createSituationParam({ bakaze: 1, jikaze: 0 })
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [{ name: "場風 南", numHan: 1 }],
      hu: 60,
      numHan: 1,
      numCompositeYakuman: undefined,
      horaPoint: 2900,
      incomes: [2900, 0, -2900, 0],
    });
  });

  it("点計算: 60符 2翻 子 ロン → 3900", () => {
    const hule = Hora.hora(
      Hand.fromString("s789z2227,m2222,p111="),
      "z7-",
      Hora.createSituationParam({ bakaze: 1 })
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [
        { name: "場風 南", numHan: 1 },
        { name: "自風 南", numHan: 1 },
      ],
      hu: 60,
      numHan: 2,
      numCompositeYakuman: undefined,
      horaPoint: 3900,
      incomes: [-3900, 3900, 0, 0],
    });
  });

  it("点計算: 60符 3翻 親 ツモ → 3900∀", () => {
    const hule = Hora.hora(
      Hand.fromString("m11222789,z2222,m444="),
      null,
      Hora.createSituationParam({ bakaze: 1, jikaze: 0 })
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [
        { name: "場風 南", numHan: 1 },
        { name: "混一色", numHan: 2 },
      ],
      hu: 60,
      numHan: 3,
      numCompositeYakuman: undefined,
      horaPoint: 11700,
      incomes: [11700, -3900, -3900, -3900],
    });
  });

  it("点計算: 60符 4翻 子 ツモ → 2000/4000", () => {
    const hule = Hora.hora(
      Hand.fromString("m11222789,z2222,m444="),
      null,
      Hora.createSituationParam({ bakaze: 1 })
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [
        { name: "場風 南", numHan: 1 },
        { name: "自風 南", numHan: 1 },
        { name: "混一色", numHan: 2 },
      ],
      hu: 60,
      numHan: 4,
      numCompositeYakuman: undefined,
      horaPoint: 8000,
      incomes: [-4000, 8000, -2000, -2000],
    });
  });

  it("点計算: 70符 1翻 親 ロン → 3400", () => {
    const hule = Hora.hora(
      Hand.fromString("m12377p456s78,z2222"),
      "s9=",
      Hora.createSituationParam({ bakaze: 1, jikaze: 0 })
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [{ name: "場風 南", numHan: 1 }],
      hu: 70,
      numHan: 1,
      numCompositeYakuman: undefined,
      horaPoint: 3400,
      incomes: [3400, 0, -3400, 0],
    });
  });

  it("点計算: 70符 2翻 子 ロン → 4500", () => {
    const hule = Hora.hora(
      Hand.fromString("m12377p456s78,z2222"),
      "s9-",
      Hora.createSituationParam({ bakaze: 1 })
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [
        { name: "場風 南", numHan: 1 },
        { name: "自風 南", numHan: 1 },
      ],
      hu: 70,
      numHan: 2,
      numCompositeYakuman: undefined,
      horaPoint: 4500,
      incomes: [-4500, 4500, 0, 0],
    });
  });

  it("点計算: 70符 3翻 親 ツモ → 4000∀", () => {
    const hule = Hora.hora(
      Hand.fromString("p77s223344,z2222,m2222"),
      null,
      Hora.createSituationParam({ bakaze: 1, jikaze: 0 })
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [
        { name: "門前清自摸和", numHan: 1 },
        { name: "場風 南", numHan: 1 },
        { name: "一盃口", numHan: 1 },
      ],
      hu: 70,
      numHan: 3,
      numCompositeYakuman: undefined,
      horaPoint: 12000,
      incomes: [12000, -4000, -4000, -4000],
    });
  });

  it("点計算: 80符 1翻 親 ロン → 3900", () => {
    const hule = Hora.hora(
      Hand.fromString("m22s888p34,z222+2,z4444"),
      "p5=",
      Hora.createSituationParam({ bakaze: 1, jikaze: 0 })
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [{ name: "場風 南", numHan: 1 }],
      hu: 80,
      numHan: 1,
      numCompositeYakuman: undefined,
      horaPoint: 3900,
      incomes: [3900, 0, -3900, 0],
    });
  });

  it("点計算: 80符 2翻 子 ロン → 5200", () => {
    const hule = Hora.hora(
      Hand.fromString("m22s888p34,z222+2,z4444"),
      "p5-",
      Hora.createSituationParam({ bakaze: 1 })
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [
        { name: "場風 南", numHan: 1 },
        { name: "自風 南", numHan: 1 },
      ],
      hu: 80,
      numHan: 2,
      numCompositeYakuman: undefined,
      horaPoint: 5200,
      incomes: [-5200, 5200, 0, 0],
    });
  });

  it("点計算: 80符 3翻 親 ツモ → 4000∀", () => {
    const hule = Hora.hora(
      Hand.fromString("m11p999s123,z222+2,z1111"),
      null,
      Hora.createSituationParam({ bakaze: 1, jikaze: 0 })
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [
        { name: "場風 南", numHan: 1 },
        { name: "自風 東", numHan: 1 },
        { name: "混全帯幺九", numHan: 1 },
      ],
      hu: 80,
      numHan: 3,
      numCompositeYakuman: undefined,
      horaPoint: 12000,
      incomes: [12000, -4000, -4000, -4000],
    });
  });

  it("点計算: 90符 1翻 親 ロン → 4400", () => {
    const hule = Hora.hora(
      Hand.fromString("p88m123s99,s6666,z2222"),
      "s9=",
      Hora.createSituationParam({ bakaze: 1, jikaze: 0 })
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [{ name: "場風 南", numHan: 1 }],
      hu: 90,
      numHan: 1,
      numCompositeYakuman: undefined,
      horaPoint: 4400,
      incomes: [4400, 0, -4400, 0],
    });
  });

  it("点計算: 90符 2翻 子 ロン → 5800", () => {
    const hule = Hora.hora(
      Hand.fromString("p88m123s99,s6666,z2222"),
      "s9-",
      Hora.createSituationParam({ bakaze: 1 })
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [
        { name: "場風 南", numHan: 1 },
        { name: "自風 南", numHan: 1 },
      ],
      hu: 90,
      numHan: 2,
      numCompositeYakuman: undefined,
      horaPoint: 5800,
      incomes: [-5800, 5800, 0, 0],
    });
  });

  it("点計算: 90符 3翻 親 ツモ → 4000∀", () => {
    const hule = Hora.hora(
      Hand.fromString("m22s345,z5555,z2222,z666-"),
      null,
      Hora.createSituationParam({ bakaze: 1, jikaze: 0 })
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [
        { name: "場風 南", numHan: 1 },
        { name: "翻牌 白", numHan: 1 },
        { name: "翻牌 發", numHan: 1 },
      ],
      hu: 90,
      numHan: 3,
      numCompositeYakuman: undefined,
      horaPoint: 12000,
      incomes: [12000, -4000, -4000, -4000],
    });
  });

  it("点計算: 100符 1翻 親 ロン → 4800", () => {
    const hule = Hora.hora(
      Hand.fromString("m22p345s67,z2222,s9999"),
      "s8=",
      Hora.createSituationParam({ bakaze: 1, jikaze: 0 })
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [{ name: "場風 南", numHan: 1 }],
      hu: 100,
      numHan: 1,
      numCompositeYakuman: undefined,
      horaPoint: 4800,
      incomes: [4800, 0, -4800, 0],
    });
  });

  it("点計算: 100符 2翻 子 ロン → 6400", () => {
    const hule = Hora.hora(
      Hand.fromString("m22p345s67,z2222,s9999"),
      "s8-",
      Hora.createSituationParam({ bakaze: 1 })
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [
        { name: "場風 南", numHan: 1 },
        { name: "自風 南", numHan: 1 },
      ],
      hu: 100,
      numHan: 2,
      numCompositeYakuman: undefined,
      horaPoint: 6400,
      incomes: [-6400, 6400, 0, 0],
    });
  });

  it("点計算: 100符 3翻 親 ツモ → 4000∀", () => {
    const hule = Hora.hora(
      Hand.fromString("z11m999p243,s1111,s9999"),
      null,
      Hora.createSituationParam({ bakaze: 1, jikaze: 0 })
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [
        { name: "門前清自摸和", numHan: 1 },
        { name: "三暗刻", numHan: 2 },
      ],
      hu: 100,
      numHan: 3,
      numCompositeYakuman: undefined,
      horaPoint: 12000,
      incomes: [12000, -4000, -4000, -4000],
    });
  });

  it("点計算: 110符 1翻 親 ロン → 5300", () => {
    const hule = Hora.hora(
      Hand.fromString("m234z1177,p1111,s9999"),
      "z7=",
      Hora.createSituationParam({ jikaze: 0 })
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [{ name: "翻牌 中", numHan: 1 }],
      hu: 110,
      numHan: 1,
      numCompositeYakuman: undefined,
      horaPoint: 5300,
      incomes: [5300, 0, -5300, 0],
    });
  });

  it("点計算: 110符 2翻 子 ロン → 7100", () => {
    const hule = Hora.hora(
      Hand.fromString("m234z2277,p1111,z5555"),
      "z7-",
      Hora.createSituationParam({ bakaze: 1 })
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [
        { name: "翻牌 白", numHan: 1 },
        { name: "翻牌 中", numHan: 1 },
      ],
      hu: 110,
      numHan: 2,
      numCompositeYakuman: undefined,
      horaPoint: 7100,
      incomes: [-7100, 7100, 0, 0],
    });
  });

  it("点計算: 110符 3翻 親 ツモ → 4000∀", () => {
    const hule = Hora.hora(
      Hand.fromString("m243z11,p1111,s9999,z555+5"),
      null,
      Hora.createSituationParam({ bakaze: 1, jikaze: 0 })
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [
        { name: "翻牌 白", numHan: 1 },
        { name: "三槓子", numHan: 2 },
      ],
      hu: 110,
      numHan: 3,
      numCompositeYakuman: undefined,
      horaPoint: 12000,
      incomes: [12000, -4000, -4000, -4000],
    });
  });

  it("点計算: 5翻 親 ロン → 12000", () => {
    const hule = Hora.hora(
      Hand.fromString("m22456p456s44556"),
      "s6=",
      Hora.createSituationParam({ jikaze: 0 })
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [
        { name: "平和", numHan: 1 },
        { name: "断幺九", numHan: 1 },
        { name: "一盃口", numHan: 1 },
        { name: "三色同順", numHan: 2 },
      ],
      hu: 30,
      numHan: 5,
      numCompositeYakuman: undefined,
      horaPoint: 12000,
      incomes: [12000, 0, -12000, 0],
    });
  });

  it("点計算: 6翻 子 ツモ → 3000/6000", () => {
    const hule = Hora.hora(
      Hand.fromString("m22456p456s445566"),
      null,
      Hora.createSituationParam()
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [
        { name: "門前清自摸和", numHan: 1 },
        { name: "平和", numHan: 1 },
        { name: "断幺九", numHan: 1 },
        { name: "一盃口", numHan: 1 },
        { name: "三色同順", numHan: 2 },
      ],
      hu: 20,
      numHan: 6,
      numCompositeYakuman: undefined,
      horaPoint: 12000,
      incomes: [-6000, 12000, -3000, -3000],
    });
  });

  it("点計算: 7翻 親 ロン → 18000", () => {
    const hule = Hora.hora(
      Hand.fromString("m111z3334,z222=,m999-"),
      "z4=",
      Hora.createSituationParam({ bakaze: 1, jikaze: 0 })
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [
        { name: "場風 南", numHan: 1 },
        { name: "対々和", numHan: 2 },
        { name: "混老頭", numHan: 2 },
        { name: "混一色", numHan: 2 },
      ],
      hu: 50,
      numHan: 7,
      numCompositeYakuman: undefined,
      horaPoint: 18000,
      incomes: [18000, 0, -18000, 0],
    });
  });

  it("点計算: 8翻 子 ツモ → 4000/8000", () => {
    const hule = Hora.hora(
      Hand.fromString("m111z333444,z222=,m999-"),
      null,
      Hora.createSituationParam({ bakaze: 1 })
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [
        { name: "場風 南", numHan: 1 },
        { name: "自風 南", numHan: 1 },
        { name: "対々和", numHan: 2 },
        { name: "混老頭", numHan: 2 },
        { name: "混一色", numHan: 2 },
      ],
      hu: 50,
      numHan: 8,
      numCompositeYakuman: undefined,
      horaPoint: 16000,
      incomes: [-8000, 16000, -4000, -4000],
    });
  });

  it("点計算: 9翻 親 ロン → 24000", () => {
    const hule = Hora.hora(
      Hand.fromString("s2223334455567"),
      "s8=",
      Hora.createSituationParam({ jikaze: 0 })
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [
        { name: "断幺九", numHan: 1 },
        { name: "三暗刻", numHan: 2 },
        { name: "清一色", numHan: 6 },
      ],
      hu: 50,
      numHan: 9,
      numCompositeYakuman: undefined,
      horaPoint: 24000,
      incomes: [24000, 0, -24000, 0],
    });
  });

  it("点計算: 10翻 子 ツモ → 4000/8000", () => {
    const hule = Hora.hora(
      Hand.fromString("s22233344555678"),
      null,
      Hora.createSituationParam()
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [
        { name: "門前清自摸和", numHan: 1 },
        { name: "断幺九", numHan: 1 },
        { name: "三暗刻", numHan: 2 },
        { name: "清一色", numHan: 6 },
      ],
      hu: 40,
      numHan: 10,
      numCompositeYakuman: undefined,
      horaPoint: 16000,
      incomes: [-8000, 16000, -4000, -4000],
    });
  });

  it("点計算: 11翻 親 ロン → 36000", () => {
    const hule = Hora.hora(
      Hand.fromString("p2233445566778"),
      "p8=",
      Hora.createSituationParam({ jikaze: 0 })
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [
        { name: "平和", numHan: 1 },
        { name: "断幺九", numHan: 1 },
        { name: "二盃口", numHan: 3 },
        { name: "清一色", numHan: 6 },
      ],
      hu: 30,
      numHan: 11,
      numCompositeYakuman: undefined,
      horaPoint: 36000,
      incomes: [36000, 0, -36000, 0],
    });
  });

  it("点計算: 12翻 子 ツモ → 6000/12000", () => {
    const hule = Hora.hora(
      Hand.fromString("p22334455667788"),
      null,
      Hora.createSituationParam()
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [
        { name: "門前清自摸和", numHan: 1 },
        { name: "平和", numHan: 1 },
        { name: "断幺九", numHan: 1 },
        { name: "二盃口", numHan: 3 },
        { name: "清一色", numHan: 6 },
      ],
      hu: 20,
      numHan: 12,
      numCompositeYakuman: undefined,
      horaPoint: 24000,
      incomes: [-12000, 24000, -6000, -6000],
    });
  });

  it("点計算: 13翻 親 ロン → 48000", () => {
    const hule = Hora.hora(
      Hand.fromString("m1177778888999"),
      "m9=",
      Hora.createSituationParam({ jikaze: 0 })
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [
        { name: "平和", numHan: 1 },
        { name: "純全帯幺九", numHan: 3 },
        { name: "二盃口", numHan: 3 },
        { name: "清一色", numHan: 6 },
      ],
      hu: 30,
      numHan: 13,
      numCompositeYakuman: undefined,
      horaPoint: 48000,
      incomes: [48000, 0, -48000, 0],
    });
  });

  it("点計算: 役満複合 子 ツモ → 24000/48000", () => {
    const hule = Hora.hora(
      Hand.fromString("z77111z444,z222+,z333-"),
      null,
      Hora.createSituationParam()
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [
        { name: "大四喜", numHan: "**" },
        { name: "字一色", numHan: "*" },
      ],
      hu: undefined,
      numHan: undefined,
      numCompositeYakuman: 3,
      horaPoint: 96000,
      incomes: [-48000, 96000, -24000, -24000],
    });
  });

  it("点計算: 役満パオ 放銃者なし、責任払い", () => {
    const hule = Hora.hora(
      Hand.fromString("m11p456,z555+,z666=,z777-"),
      null,
      Hora.createSituationParam({ jikaze: 0, numRiichiBou: 1, numTsumibou: 1 })
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [{ name: "大三元", numHan: "*", paoTarget: "-" }],
      hu: undefined,
      numHan: undefined,
      numCompositeYakuman: 1,
      horaPoint: 48000,
      incomes: [49300, 0, 0, -48300],
    });
  });

  it("点計算: 役満パオ 放銃者あり、放銃者と折半", () => {
    const hule = Hora.hora(
      Hand.fromString("m11p45,z555+,z666=,z777-"),
      "p6=",
      Hora.createSituationParam({ jikaze: 0, numRiichiBou: 1, numTsumibou: 1 })
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [{ name: "大三元", numHan: "*", paoTarget: "-" }],
      hu: undefined,
      numHan: undefined,
      numCompositeYakuman: 1,
      horaPoint: 48000,
      incomes: [49300, 0, -24300, -24000],
    });
  });

  it("点計算: 役満パオ パオが放銃、全額責任払い", () => {
    const hule = Hora.hora(
      Hand.fromString("m11p45,z555+,z666=,z777-"),
      "p6-",
      Hora.createSituationParam({ jikaze: 0, numRiichiBou: 1, numTsumibou: 1 })
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [{ name: "大三元", numHan: "*", paoTarget: "-" }],
      hu: undefined,
      numHan: undefined,
      numCompositeYakuman: 1,
      horaPoint: 48000,
      incomes: [49300, 0, 0, -48300],
    });
  });

  it("点計算: ダブル役満パオ 放銃者なし、関連役満のみ責任払い", () => {
    const hule = Hora.hora(
      Hand.fromString("z77,z111-,z2222,z333=3,z444+"),
      null,
      Hora.createSituationParam({ numRiichiBou: 1, numTsumibou: 1 })
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [
        { name: "大四喜", numHan: "**", paoTarget: "+" },
        { name: "字一色", numHan: "*" },
      ],
      hu: undefined,
      numHan: undefined,
      numCompositeYakuman: 3,
      horaPoint: 96000,
      incomes: [-16100, 97300, -72100, -8100],
    });
  });

  it("点計算: ダブル役満パオ 放銃者あり、関連役満のみ放銃者と折半", () => {
    const hule = Hora.hora(
      Hand.fromString("z7,z111-,z2222,z333=3,z444+"),
      "z7-",
      Hora.createSituationParam({ numRiichiBou: 1, numTsumibou: 1 })
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [
        { name: "大四喜", numHan: "**", paoTarget: "+" },
        { name: "字一色", numHan: "*" },
      ],
      hu: undefined,
      numHan: undefined,
      numCompositeYakuman: 3,
      horaPoint: 96000,
      incomes: [-64300, 97300, -32000, 0],
    });
  });

  it("点計算: ダブル役満パオ パオが放銃、全額責任払い", () => {
    const hule = Hora.hora(
      Hand.fromString("z7,z111-,z2222,z333=3,z444+"),
      "z7+",
      Hora.createSituationParam({ numRiichiBou: 1, numTsumibou: 1 })
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [
        { name: "大四喜", numHan: "**", paoTarget: "+" },
        { name: "字一色", numHan: "*" },
      ],
      hu: undefined,
      numHan: undefined,
      numCompositeYakuman: 3,
      horaPoint: 96000,
      incomes: [0, 97300, -96300, 0],
    });
  });

  it("高点法: 七対子と二盃口の選択", () => {
    const hule = Hora.hora(
      Hand.fromString("m223344p556677s8"),
      "s8=",
      Hora.createSituationParam()
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [
        { name: "断幺九", numHan: 1 },
        { name: "二盃口", numHan: 3 },
      ],
      hu: 40,
      numHan: 4,
      numCompositeYakuman: undefined,
      horaPoint: 8000,
      incomes: [0, 8000, 0, -8000],
    });
  });

  it("高点法: 雀頭候補2つの選択", () => {
    const hule = Hora.hora(
      Hand.fromString("m2234455p234s234"),
      "m3=",
      Hora.createSituationParam()
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [
        { name: "断幺九", numHan: 1 },
        { name: "一盃口", numHan: 1 },
        { name: "三色同順", numHan: 2 },
      ],
      hu: 40,
      numHan: 4,
      numCompositeYakuman: undefined,
      horaPoint: 8000,
      incomes: [0, 8000, 0, -8000],
    });
  });

  it("高点法: 順子と刻子の選択", () => {
    const hule = Hora.hora(
      Hand.fromString("m111222333p8999"),
      "p7=",
      Hora.createSituationParam()
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [
        { name: "一盃口", numHan: 1 },
        { name: "純全帯幺九", numHan: 3 },
      ],
      hu: 40,
      numHan: 4,
      numCompositeYakuman: undefined,
      horaPoint: 8000,
      incomes: [0, 8000, 0, -8000],
    });
  });

  it("高点法: 嵌張待ち両面待ちの選択", () => {
    const hule = Hora.hora(
      Hand.fromString("m12334p567z11z777"),
      "m2=",
      Hora.createSituationParam()
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [{ name: "翻牌 中", numHan: 1 }],
      hu: 50,
      numHan: 1,
      numCompositeYakuman: undefined,
      horaPoint: 1600,
      incomes: [0, 1600, 0, -1600],
    });
  });

  it("高点法: 得点が同じ場合は翻数が多い方を選択", () => {
    const hule = Hora.hora(
      Hand.fromString("m111222333p7899"),
      "p9=",
      Hora.createSituationParam()
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [
        { name: "平和", numHan: 1 },
        { name: "一盃口", numHan: 1 },
        { name: "純全帯幺九", numHan: 3 },
      ],
      hu: 30,
      numHan: 5,
      numCompositeYakuman: undefined,
      horaPoint: 8000,
      incomes: [0, 8000, 0, -8000],
    });
  });

  it("高点法: 得点・翻数が同じ場合は符が多い方を選択", () => {
    const hule = Hora.hora(
      Hand.fromString("s1112223335578"),
      "s9=",
      Hora.createSituationParam()
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [
        { name: "三暗刻", numHan: 2 },
        { name: "清一色", numHan: 6 },
      ],
      hu: 50,
      numHan: 8,
      numCompositeYakuman: undefined,
      horaPoint: 16000,
      incomes: [0, 16000, 0, -16000],
    });
  });

  it("高点法: 役満と数え役満では役満を選択", () => {
    const hule = Hora.hora(
      Hand.fromString("m11123457899996"),
      null,
      Hora.createSituationParam({
        riichi: 1,
        isOneShot: true,
        baopai: ["m2"],
        fubaopai: ["m5"],
      })
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [{ name: "九蓮宝燈", numHan: "*" }],
      hu: undefined,
      numHan: undefined,
      numCompositeYakuman: 1,
      horaPoint: 32000,
      incomes: [-16000, 32000, -8000, -8000],
    });
  });

  it("和了点計算: 10000パターン", () => {
    // TODO: jsonのプロパティと辻褄合わせを行なって、テストができるようにする
    // for (let t of data) {
    //   t.in.param.rule = ruleForTest;
    //   const hule = Hora.hule(
    //     Hand.fromString(t.in.shoupai),
    //     t.in.rongpai,
    //     t.in.param
    //   );
    //   expect(hule).toStrictEqual(t.out, t.in.shoupai);
    // }
  });
});

describe("ルール変更", () => {
  it("連風牌は2符のルールで、連風牌が2符となる", () => {
    const hule = Hora.hora(
      Hand.fromString("m123p123z1z1,s1-23,z555="),
      null,
      Hora.createSituationParam({
        jikaze: 0,
        rule: { ...ruleForTest, 連風牌は2符: true },
      })
    );

    expect(hule?.hu).toBe(30);
  });

  it("クイタン無しのルールで、クイタンは役にならない", () => {
    const hule = Hora.hora(
      Hand.fromString("m22555p234s78,p777-"),
      "s6=",
      Hora.createSituationParam({
        rule: { ...ruleForTest, クイタンあり: false },
      })
    );

    expect(hule?.horaYakuInfos).toBeUndefined();
  });

  it("クイタン無しのルールで、門前であればタンヤオの役になる", () => {
    const hule = Hora.hora(
      Hand.fromString("m22555p234777s78"),
      "s6=",
      Hora.createSituationParam({
        rule: { ...ruleForTest, クイタンあり: false },
      })
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [{ name: "断幺九", numHan: 1 }],
      hu: 40,
      numHan: 1,
      numCompositeYakuman: undefined,
      horaPoint: 1300,
      incomes: [0, 1300, 0, -1300],
    });
  });

  it("ダブル役満なしのルールで、国士無双十三面がダブル役満にならない", () => {
    const hule = Hora.hora(
      Hand.fromString("m19p19s19z1234567"),
      "m1+",
      Hora.createSituationParam({
        rule: { ...ruleForTest, ダブル役満あり: false },
      })
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [{ name: "国士無双十三面", numHan: "*" }],
      hu: undefined,
      numHan: undefined,
      numCompositeYakuman: 1,
      horaPoint: 32000,
      incomes: [0, 32000, -32000, 0],
    });
  });

  it("ダブル役満なしのルールで、四暗刻単騎がダブル役満にならない", () => {
    const hule = Hora.hora(
      Hand.fromString("m111p333s777z111m3"),
      "m3=",
      Hora.createSituationParam({
        rule: { ...ruleForTest, ダブル役満あり: false },
      })
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [{ name: "四暗刻単騎", numHan: "*" }],
      hu: undefined,
      numHan: undefined,
      numCompositeYakuman: 1,
      horaPoint: 32000,
      incomes: [0, 32000, 0, -32000],
    });
  });

  it("ダブル役満なしのルールで、大四喜がダブル役満にならない", () => {
    const hule = Hora.hora(
      Hand.fromString("m22z22244,z333+,z111-"),
      "z4=",
      Hora.createSituationParam({
        rule: { ...ruleForTest, ダブル役満あり: false },
      })
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [{ name: "大四喜", numHan: "*" }],
      hu: undefined,
      numHan: undefined,
      numCompositeYakuman: 1,
      horaPoint: 32000,
      incomes: [0, 32000, 0, -32000],
    });
  });

  it("ダブル役満なしのルールで、純正九蓮宝燈がダブル役満にならない", () => {
    const hule = Hora.hora(
      Hand.fromString("m1112345678999"),
      "m2=",
      Hora.createSituationParam({
        rule: { ...ruleForTest, ダブル役満あり: false },
      })
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [{ name: "純正九蓮宝燈", numHan: "*" }],
      hu: undefined,
      numHan: undefined,
      numCompositeYakuman: 1,
      horaPoint: 32000,
      incomes: [0, 32000, 0, -32000],
    });
  });

  it("役満の複合なしのルールで、ダブル役満 + 役満複合 + パオ (ツモ和了) が正しく点数計算される", () => {
    const hule = Hora.hora(
      Hand.fromString("z77,z111-,z2222,z333=3,z444+"),
      null,
      Hora.createSituationParam({
        numRiichiBou: 1,
        numTsumibou: 1,
        rule: { ...ruleForTest, 役満の複合あり: false },
      })
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [
        { name: "大四喜", numHan: "**", paoTarget: "+" },
        { name: "字一色", numHan: "*" },
      ],
      hu: undefined,
      numHan: undefined,
      numCompositeYakuman: 1,
      horaPoint: 32000,
      incomes: [0, 33300, -32300, 0],
    });
  });

  it("役満の複合なしのルールで、ダブル役満 + 役満複合 + パオ (ロン和了) が正しく点数計算される", () => {
    const hule = Hora.hora(
      Hand.fromString("z7,z111-,z2222,z333=3,z444+"),
      "z7-",
      Hora.createSituationParam({
        numRiichiBou: 1,
        numTsumibou: 1,
        rule: { ...ruleForTest, 役満の複合あり: false },
      })
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [
        { name: "大四喜", numHan: "**", paoTarget: "+" },
        { name: "字一色", numHan: "*" },
      ],
      hu: undefined,
      numHan: undefined,
      numCompositeYakuman: 1,
      horaPoint: 32000,
      incomes: [-16300, 33300, -16000, 0],
    });
  });

  it("役満パオなしのルールで、大三元が正しく点数計算される", () => {
    const hule = Hora.hora(
      Hand.fromString("m2234,z555-5,z6666,z777+"),
      "m5=",
      Hora.createSituationParam({
        rule: { ...ruleForTest, 役満パオあり: false },
      })
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [{ name: "大三元", numHan: "*" }],
      hu: undefined,
      numHan: undefined,
      numCompositeYakuman: 1,
      horaPoint: 32000,
      incomes: [0, 32000, 0, -32000],
    });
  });

  it("役満パオなしのルールで、大四喜が正しく点数計算される", () => {
    const hule = Hora.hora(
      Hand.fromString("m2,z222+,z4444,z333+,z111-"),
      "m2=",
      Hora.createSituationParam({
        rule: { ...ruleForTest, 役満パオあり: false },
      })
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [{ name: "大四喜", numHan: "**" }],
      hu: undefined,
      numHan: undefined,
      numCompositeYakuman: 2,
      horaPoint: 64000,
      incomes: [0, 64000, 0, -64000],
    });
  });

  it("数え役満なしのルールで、13翻が3倍満となる", () => {
    const hule = Hora.hora(
      Hand.fromString("p22334455667788*"),
      null,
      Hora.createSituationParam({
        riichi: 1,
        rule: { ...ruleForTest, 数え役満あり: false },
      })
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [
        { name: "立直", numHan: 1 },
        { name: "門前清自摸和", numHan: 1 },
        { name: "平和", numHan: 1 },
        { name: "断幺九", numHan: 1 },
        { name: "二盃口", numHan: 3 },
        { name: "清一色", numHan: 6 },
      ],
      hu: 20,
      numHan: 13,
      numCompositeYakuman: undefined,
      horaPoint: 24000,
      incomes: [-12000, 24000, -6000, -6000],
    });
  });

  it("切り上げ満貫ありのルールで、30符 3翻 親 ツモ → 2000∀ (切り上げなし)", () => {
    const hule = Hora.hora(
      Hand.fromString("m22z111p445566s789"),
      null,
      Hora.createSituationParam({
        bakaze: 1,
        jikaze: 0,
        rule: { ...ruleForTest, 切り上げ満貫あり: true },
      })
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [
        { name: "門前清自摸和", numHan: 1 },
        { name: "自風 東", numHan: 1 },
        { name: "一盃口", numHan: 1 },
      ],
      hu: 30,
      numHan: 3,
      numCompositeYakuman: undefined,
      horaPoint: 6000,
      incomes: [6000, -2000, -2000, -2000],
    });
  });

  it("切り上げ満貫ありのルールで、30符 4翻 子 ツモ → 2000/4000", () => {
    const hule = Hora.hora(
      Hand.fromString("m11z111p123789s789"),
      null,
      Hora.createSituationParam({
        rule: { ...ruleForTest, 切り上げ満貫あり: true },
      })
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [
        { name: "門前清自摸和", numHan: 1 },
        { name: "場風 東", numHan: 1 },
        { name: "混全帯幺九", numHan: 2 },
      ],
      hu: 30,
      numHan: 4,
      numCompositeYakuman: undefined,
      horaPoint: 8000,
      incomes: [-4000, 8000, -2000, -2000],
    });
  });

  it("切り上げ満貫ありのルールで、60符 3翻 親 ツモ → 4000∀", () => {
    const hule = Hora.hora(
      Hand.fromString("m11222789,z2222,m444="),
      null,
      Hora.createSituationParam({
        bakaze: 1,
        jikaze: 0,
        rule: { ...ruleForTest, 切り上げ満貫あり: true },
      })
    );

    expect(hule).toStrictEqual({
      horaYakuInfos: [
        { name: "場風 南", numHan: 1 },
        { name: "混一色", numHan: 2 },
      ],
      hu: 60,
      numHan: 3,
      numCompositeYakuman: undefined,
      horaPoint: 12000,
      incomes: [12000, -4000, -4000, -4000],
    });
  });
});
