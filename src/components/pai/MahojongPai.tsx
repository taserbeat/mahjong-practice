import React from "react";

import m0 from "../../assets/img/pai/m0.png";
import m1 from "../../assets/img/pai/m1.png";
import m2 from "../../assets/img/pai/m2.png";
import m3 from "../../assets/img/pai/m3.png";
import m4 from "../../assets/img/pai/m4.png";
import m5 from "../../assets/img/pai/m5.png";
import m6 from "../../assets/img/pai/m6.png";
import m7 from "../../assets/img/pai/m7.png";
import m8 from "../../assets/img/pai/m8.png";
import m9 from "../../assets/img/pai/m9.png";

import p0 from "../../assets/img/pai/p0.png";
import p1 from "../../assets/img/pai/p1.png";
import p2 from "../../assets/img/pai/p2.png";
import p3 from "../../assets/img/pai/p3.png";
import p4 from "../../assets/img/pai/p4.png";
import p5 from "../../assets/img/pai/p5.png";
import p6 from "../../assets/img/pai/p6.png";
import p7 from "../../assets/img/pai/p7.png";
import p8 from "../../assets/img/pai/p8.png";
import p9 from "../../assets/img/pai/p9.png";

import s0 from "../../assets/img/pai/s0.png";
import s1 from "../../assets/img/pai/s1.png";
import s2 from "../../assets/img/pai/s2.png";
import s3 from "../../assets/img/pai/s3.png";
import s4 from "../../assets/img/pai/s4.png";
import s5 from "../../assets/img/pai/s5.png";
import s6 from "../../assets/img/pai/s6.png";
import s7 from "../../assets/img/pai/s7.png";
import s8 from "../../assets/img/pai/s8.png";
import s9 from "../../assets/img/pai/s9.png";

import z1 from "../../assets/img/pai/z1.png";
import z2 from "../../assets/img/pai/z2.png";
import z3 from "../../assets/img/pai/z3.png";
import z4 from "../../assets/img/pai/z4.png";
import z5 from "../../assets/img/pai/z5.png";
import z6 from "../../assets/img/pai/z6.png";
import z7 from "../../assets/img/pai/z7.png";

import back from "../../assets/img/pai/back.png";

import "../../styles/pai/MahojongPai.scss";

/** 麻雀牌画像のProps */
interface MahojongPaiProps {
  /** 牌を表す文字列 */
  pai: string;

  /** 暗くするか？ */
  isShadow?: boolean;

  /** 横にするか？ */
  isLay?: boolean;
}

/** 麻雀牌画像 */
const MahojongPai = (props: MahojongPaiProps) => {
  const src = getImage(props.pai);
  const isShadow = props.isShadow === undefined ? false : props.isShadow;
  const isLay = props.isLay === undefined ? false : props.isLay;

  const classNames = ["pai"];

  if (isShadow) {
    classNames.push("shadow");
  }

  if (isLay) {
    classNames.push("lay");
  }

  return <img className={classNames.join(" ")} src={src} alt={props.pai} />;
};

const getImage = (pai: string) => {
  const paiString = pai.length >= 2 ? pai.substring(0, 2) : pai;

  switch (paiString) {
    // 萬子
    case "m0":
      return m0;

    case "m1":
      return m1;

    case "m2":
      return m2;

    case "m3":
      return m3;

    case "m4":
      return m4;

    case "m5":
      return m5;

    case "m6":
      return m6;

    case "m7":
      return m7;

    case "m8":
      return m8;

    case "m9":
      return m9;

    // 筒子
    case "p0":
      return p0;

    case "p1":
      return p1;

    case "p2":
      return p2;

    case "p3":
      return p3;

    case "p4":
      return p4;

    case "p5":
      return p5;

    case "p6":
      return p6;

    case "p7":
      return p7;

    case "p8":
      return p8;

    case "p9":
      return p9;

    // 索子
    case "s0":
      return s0;

    case "s1":
      return s1;

    case "s2":
      return s2;

    case "s3":
      return s3;

    case "s4":
      return s4;

    case "s5":
      return s5;

    case "s6":
      return s6;

    case "s7":
      return s7;

    case "s8":
      return s8;

    case "s9":
      return s9;

    // 字牌
    case "z1":
      return z1;

    case "z2":
      return z2;

    case "z3":
      return z3;

    case "z4":
      return z4;

    case "z5":
      return z5;

    case "z6":
      return z6;

    case "z7":
      return z7;
  }

  // それ以外なら裏向きの牌画像
  return back;
};

export default MahojongPai;
