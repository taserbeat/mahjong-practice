import Hand from "../hand";
import {
  calcImproveShantenPais,
  calcNumShanten,
  calcNumShantenAsChiitoi,
  calcNumShantenAsKokushi,
  calcNumShantenAsNormal,
} from "../shanten";

import shanten1 from "./data/shanten1.json";
import shanten2 from "./data/shanten2.json";
import shanten3 from "./data/shanten3.json";
import shanten4 from "./data/shanten4.json";

describe("calcNumShantenAsNormal 関数", () => {
  it("空の手牌は13向聴", () => {
    expect(calcNumShantenAsNormal(Hand.fromString())).toBe(13);
  });

  it("聴牌形", () => {
    expect(calcNumShantenAsNormal(Hand.fromString("m123p406s789z1122"))).toBe(
      0
    );
  });

  it("和了形", () => {
    expect(calcNumShantenAsNormal(Hand.fromString("m123p456s789z11222"))).toBe(
      -1
    );
  });

  it("副露あり", () => {
    expect(
      calcNumShantenAsNormal(Hand.fromString("m123p456s789z2,z111="))
    ).toBe(0);
  });

  it("雀頭なし", () => {
    expect(calcNumShantenAsNormal(Hand.fromString("m12389p456s12789z1"))).toBe(
      1
    );
  });

  it("搭子過多", () => {
    expect(calcNumShantenAsNormal(Hand.fromString("m12389p456s1289z11"))).toBe(
      1
    );
  });

  it("搭子不足", () => {
    expect(calcNumShantenAsNormal(Hand.fromString("m133345568z23677"))).toBe(2);
  });

  it("多牌: 5面子", () => {
    let hand = Hand.fromString("m123,p123-,s456-,m789-");
    hand._fulos.push("z555=");

    expect(calcNumShantenAsNormal(hand)).toBe(0);
  });

  it("少牌: 雀頭なし4面子", () => {
    let hand = Hand.fromString("p234s567,m222=,p0-67");

    expect(calcNumShantenAsNormal(hand)).toBe(1);
  });

  it("刻子＋順子", () => {
    expect(calcNumShantenAsNormal(Hand.fromString("p222345z1234567"))).toBe(4);
  });

  it("順子＋孤立牌＋順子", () => {
    expect(calcNumShantenAsNormal(Hand.fromString("p2344456z123456"))).toBe(4);
  });

  it("対子＋刻子＋順子", () => {
    expect(calcNumShantenAsNormal(Hand.fromString("p11222345z12345"))).toBe(3);
  });

  it("対子＋順子＋順子＋対子", () => {
    expect(calcNumShantenAsNormal(Hand.fromString("p2234556788z123"))).toBe(2);
  });

  it("副露直後の牌姿が和了形", () => {
    expect(
      calcNumShantenAsNormal(Hand.fromString("m11122,p123-,s12-3,z111=,"))
    ).toBe(0);
  });

  it("一般手: 10000パターン", () => {
    for (let data of shanten1) {
      const hand = new Hand(data.q);
      expect(calcNumShantenAsNormal(hand)).toBe(data.x[0]);
    }
  });

  it("混一手: 10000パターン", () => {
    for (let data of shanten2) {
      const hand = new Hand(data.q);
      expect(calcNumShantenAsNormal(hand)).toBe(data.x[0]);
    }
  });

  it("清一手: 10000パターン", () => {
    for (let data of shanten3) {
      const hand = new Hand(data.q);
      expect(calcNumShantenAsNormal(hand)).toBe(data.x[0]);
    }
  });

  it("国士手: 10000パターン", () => {
    for (let data of shanten4) {
      const hand = new Hand(data.q);
      expect(calcNumShantenAsNormal(hand)).toBe(data.x[0]);
    }
  });
});

describe("calcNumShantenAsKokushi 関数", () => {
  it("空の手牌は13向聴", () => {
    expect(calcNumShantenAsKokushi(Hand.fromString())).toBe(13);
  });

  it("幺九牌なし", () => {
    expect(calcNumShantenAsKokushi(Hand.fromString("m23455p345s45678"))).toBe(
      13
    );
  });

  it("雀頭なし", () => {
    expect(calcNumShantenAsKokushi(Hand.fromString("m189p12s249z12345"))).toBe(
      4
    );
  });

  it("雀頭あり", () => {
    expect(calcNumShantenAsKokushi(Hand.fromString("m119p12s299z12345"))).toBe(
      3
    );
  });

  it("聴牌形", () => {
    expect(calcNumShantenAsKokushi(Hand.fromString("m11p19s19z1234567"))).toBe(
      0
    );
  });

  it("聴牌形(13面張)", () => {
    expect(calcNumShantenAsKokushi(Hand.fromString("m19p19s19z1234567"))).toBe(
      0
    );
  });

  it("和了形", () => {
    expect(calcNumShantenAsKokushi(Hand.fromString("m119p19s19z1234567"))).toBe(
      -1
    );
  });

  it("副露あり", () => {
    expect(
      calcNumShantenAsKokushi(Hand.fromString("m19p19s19z1234,z777="))
    ).toBe(Infinity);
  });

  it("多牌", () => {
    expect(
      calcNumShantenAsKokushi(
        Hand.fromString("m19p19s19z12345677").tsumo("m1", false)
      )
    ).toBe(-1);
  });

  it("少牌", () => {
    expect(calcNumShantenAsKokushi(Hand.fromString("m119p19s19z12345"))).toBe(
      1
    );
  });

  it("一般手: 10000パターン", () => {
    for (let data of shanten1) {
      const hand = new Hand(data.q);
      expect(calcNumShantenAsKokushi(hand)).toBe(data.x[1]);
    }
  });

  it("混一手: 10000パターン", () => {
    for (let data of shanten2) {
      const hand = new Hand(data.q);
      expect(calcNumShantenAsKokushi(hand)).toBe(data.x[1]);
    }
  });

  it("清一手: 10000パターン", () => {
    for (let data of shanten3) {
      const hand = new Hand(data.q);
      expect(calcNumShantenAsKokushi(hand)).toBe(data.x[1]);
    }
  });

  it("国士手: 10000パターン", () => {
    for (let data of shanten4) {
      const hand = new Hand(data.q);
      expect(calcNumShantenAsKokushi(hand)).toBe(data.x[1]);
    }
  });
});

describe("calcNumShantenAsChiitoi 関数", () => {
  it("空の手牌は13向聴", () => {
    expect(calcNumShantenAsChiitoi(Hand.fromString())).toBe(13);
  });

  it("対子なし", () => {
    expect(calcNumShantenAsChiitoi(Hand.fromString("m19p19s19z1234567"))).toBe(
      6
    );
  });

  it("槓子あり", () => {
    expect(calcNumShantenAsChiitoi(Hand.fromString("m1188p288s05z1111"))).toBe(
      2
    );
  });

  it("暗刻あり", () => {
    expect(calcNumShantenAsChiitoi(Hand.fromString("m1188p2388s05z111"))).toBe(
      1
    );
  });

  it("暗刻2つ", () => {
    expect(calcNumShantenAsChiitoi(Hand.fromString("m1188p288s055z111"))).toBe(
      2
    );
  });

  it("聴牌形", () => {
    expect(calcNumShantenAsChiitoi(Hand.fromString("m1188p288s05z1177"))).toBe(
      0
    );
  });

  it("和了形", () => {
    expect(
      calcNumShantenAsChiitoi(Hand.fromString("m1188p288s05z1177p2"))
    ).toBe(-1);
  });

  it("副露あり", () => {
    expect(
      calcNumShantenAsChiitoi(Hand.fromString("m1188p288s05z2,z111="))
    ).toBe(Infinity);
  });

  it("多牌: 8対子", () => {
    expect(
      calcNumShantenAsChiitoi(
        Hand.fromString("m1188p2288s05z1122")
          .tsumo("z7", false)
          .tsumo("z7", false)
      )
    ).toBe(-1);
  });

  it("少牌", () => {
    expect(calcNumShantenAsChiitoi(Hand.fromString("m1188s05z1122"))).toBe(3);
  });

  it("一般手: 10000パターン", () => {
    for (let data of shanten1) {
      const hand = new Hand(data.q);
      expect(calcNumShantenAsChiitoi(hand)).toBe(data.x[2]);
    }
  });

  it("混一手: 10000パターン", () => {
    for (let data of shanten2) {
      const hand = new Hand(data.q);
      expect(calcNumShantenAsChiitoi(hand)).toBe(data.x[2]);
    }
  });

  it("清一手: 10000パターン", () => {
    for (let data of shanten3) {
      const hand = new Hand(data.q);
      expect(calcNumShantenAsChiitoi(hand)).toBe(data.x[2]);
    }
  });

  it("国士手: 10000パターン", () => {
    for (let data of shanten4) {
      const hand = new Hand(data.q);
      expect(calcNumShantenAsChiitoi(hand)).toBe(data.x[2]);
    }
  });
});

describe("calcNumShanten 関数", () => {
  it("一般形聴牌", () => {
    expect(calcNumShanten(Hand.fromString("m123p406s789z1122"))).toBe(0);
  });

  it("国士無双形聴牌", () => {
    expect(calcNumShanten(Hand.fromString("m19p19s19z1234567"))).toBe(0);
  });

  it("七対子形聴牌", () => {
    expect(calcNumShanten(Hand.fromString("m1188p288s05z1177"))).toBe(0);
  });

  it("一般手: 10000パターン", () => {
    for (let data of shanten1) {
      const hand = new Hand(data.q);
      const actual = calcNumShanten(hand);
      const expected = Math.min(...data.x);
      expect(actual).toBe(expected);
    }
  });

  it("混一手: 10000パターン", () => {
    for (let data of shanten2) {
      const hand = new Hand(data.q);
      const actual = calcNumShanten(hand);
      const expected = Math.min(...data.x);
      expect(actual).toBe(expected);
    }
  });

  it("清一手: 10000パターン", () => {
    for (let data of shanten3) {
      const hand = new Hand(data.q);
      const actual = calcNumShanten(hand);
      const expected = Math.min(...data.x);
      expect(actual).toBe(expected);
    }
  });

  it("国士手: 10000パターン", () => {
    for (let data of shanten4) {
      const hand = new Hand(data.q);
      const actual = calcNumShanten(hand);
      const expected = Math.min(...data.x);
      expect(actual).toBe(expected);
    }
  });
});

describe("calcImproveShantenPais 関数", () => {
  it("打牌可能な状態のとき、エラーとなること", () => {
    expect(
      calcImproveShantenPais(Hand.fromString("m123p456s789z12345"))
    ).toBeNull();

    expect(
      calcImproveShantenPais(Hand.fromString("m123p456z12345,s789-,"))
    ).toBeNull();
  });

  it("副露なし", () => {
    expect(
      calcImproveShantenPais(Hand.fromString("m123p456s789z1234"))
    ).toEqual(expect.arrayContaining(["z1", "z2", "z3", "z4"]));
  });

  it("副露あり", () => {
    expect(
      calcImproveShantenPais(Hand.fromString("m123p456z1234,s789-"))
    ).toEqual(expect.arrayContaining(["z1", "z2", "z3", "z4"]));
  });

  it("国士無双13面待ち", () => {
    expect(
      calcImproveShantenPais(Hand.fromString("m19p19s19z1234567"))
    ).toEqual(
      expect.arrayContaining([
        "m1",
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
        "z7",
      ])
    );
  });

  it("打牌可能な手牌に4枚ある牌は待ち牌としないこと", () => {
    expect(calcImproveShantenPais(Hand.fromString("m1234444p456s789"))).toEqual(
      expect.arrayContaining(["m1"])
    );
  });

  it("暗刻の牌は待ち牌とできること", () => {
    expect(
      calcImproveShantenPais(Hand.fromString("m13p456s789z11,m2222"))
    ).toEqual(expect.arrayContaining(["m2"]));
  });

  it("七対子と面子手で同じ向聴数", () => {
    expect(
      calcImproveShantenPais(Hand.fromString("m11155p2278s66z17"))
    ).toEqual(
      expect.arrayContaining([
        "m5",
        "p2",
        "p6",
        "p7",
        "p8",
        "p9",
        "s6",
        "z1",
        "z7",
      ])
    );
  });

  it("向聴数算出ルーチンを指定できること", () => {
    expect(
      calcImproveShantenPais(
        Hand.fromString("m11155p2278s66z17"),
        calcNumShantenAsChiitoi
      )
    ).toEqual(expect.arrayContaining(["p7", "p8", "z1", "z7"]));
  });
});
