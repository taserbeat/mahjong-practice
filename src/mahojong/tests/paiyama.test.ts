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
