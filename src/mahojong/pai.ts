/** 萬子 */
export type ManzuPai =
  | "m0"
  | "m1"
  | "m2"
  | "m3"
  | "m4"
  | "m5"
  | "m6"
  | "m7"
  | "m8"
  | "m9";

/** 筒子 */
export type PinzuPai =
  | "p0"
  | "p1"
  | "p2"
  | "p3"
  | "p4"
  | "p5"
  | "p6"
  | "p7"
  | "p8"
  | "p9";

/** 索子 */
export type SozuPai =
  | "s0"
  | "s1"
  | "s2"
  | "s3"
  | "s4"
  | "s5"
  | "s6"
  | "s7"
  | "s8"
  | "s9";

/**
 * 字牌
 * 東: z1
 * 南: z2
 * 西: z3
 * 北: z4
 * 白: z5
 * 發: z6
 * 中: z7
 * */
export type Jihai = "z1" | "z2" | "z3" | "z4" | "z5" | "z6" | "z7";

/** 牌 */
export type Pai = ManzuPai | PinzuPai | SozuPai | Jihai;

export default Pai;
