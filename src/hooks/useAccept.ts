import { useMemo } from "react";
import Pai from "../mahojong/pai";
import { PracticeGame } from "../mahojong/practice";
import Hand from "../mahojong/hand";
import { calcImproveShantenPais, calcNumShanten } from "../mahojong/shanten";

/** 受け入れ情報を計算するフックのProps */
interface UseAcceptsProps {
  /** 手牌の牌姿文字列 */
  paishi: string;

  /** ドラ表示牌の配列 */
  doraDisplayPais: string[];

  /** 河(捨て牌)を表現する文字列の配列 */
  kawaPais: string[];
}

/** 受け入れの牌情報 */
type AcceptInfo = {
  /** 捨てる牌 */
  cutPai: string;

  acceptsCount: number;

  acceptsKinds: Pai[];
};

/** 受け入れ情報を計算するフック */
const useAccept = (props: UseAcceptsProps): AcceptInfo[] => {
  const paishi = props.paishi;
  const doraDisplayPais = props.doraDisplayPais;
  const kawaPais = props.kawaPais;

  const acceptInfos = useMemo<AcceptInfo[]>(() => {
    const hand = Hand.fromString(paishi);

    // ツモ牌が存在しない場合は計算しない
    if (hand._tsumoPai === null) {
      return [];
    }

    const acceptInfos: AcceptInfo[] = [];

    const currentNumShanten = calcNumShanten(hand);
    const dapaiCandidates = hand.getDapaiCandidates() ?? [];

    // すべての打牌可能な牌を評価する
    for (let pai of dapaiCandidates) {
      // 打牌後の手牌を作成
      const tmpHand = hand.clone().dapai(pai);

      // シャンテン数を計算する
      const tmpNumShanten = calcNumShanten(tmpHand);

      // シャンテン戻しは対象外とする
      if (tmpNumShanten > currentNumShanten) {
        continue;
      }

      // 有効牌を計算する
      const enablePais = calcImproveShantenPais(tmpHand);
      if (enablePais === null) {
        continue;
      }

      // 有効牌の全体枚数を求める (種類数 × 4枚)
      // (副露はカンのみであり、カンした牌は有効牌とみなさず計算する)
      let remainCount =
        enablePais
          .filter((pai) => pai[1] !== "0")
          .filter((pai) => {
            const fuloPais = tmpHand._fulos.map((fuloMentsu) => {
              const tmpFuloPai = fuloMentsu.substring(0, 2);
              const fuloPai =
                tmpFuloPai[1] === "0" ? tmpFuloPai[0] + "5" : tmpFuloPai;

              return fuloPai;
            });

            const isFuloPaiEqualEnabledPai = fuloPais.includes(pai);

            return !isFuloPaiEqualEnabledPai;
          }).length * 4;

      for (let enablePai of enablePais) {
        /* 手牌(門前)から残り枚数を減算 */
        const mpsz = enablePai[0] as "m" | "p" | "s" | "z";
        const index = Number(enablePai[1]);
        const paiInHandCount = tmpHand._menzenPais[mpsz][index]; // 手中にある該当牌の枚数
        remainCount -= paiInHandCount;

        /* 河から残り枚数を減算 */
        kawaPais.forEach((kawaPai) => {
          if (kawaPai.substring(0, 2) === enablePai.substring(0, 2)) {
            remainCount -= 1;
          }
        });

        /* ドラ表示牌から残り枚数を減算 */
        doraDisplayPais.forEach((doraDisplayPai) => {
          if (doraDisplayPai.substring(0, 2) === enablePai.substring(0, 2)) {
            remainCount -= 1;
          }
        });
      }

      acceptInfos.push({
        cutPai: pai,
        acceptsKinds: enablePais,
        acceptsCount: remainCount,
      });
    }

    // 枚数・種類数で降順ソートする
    const sortedAcceptInfos = acceptInfos.sort((x, y) => {
      if (x.acceptsCount != y.acceptsCount) {
        // 枚数で降順ソート
        return y.acceptsCount - x.acceptsCount;
      } else {
        // 種類数で降順ソート
        return y.acceptsKinds.length - x.acceptsKinds.length;
      }
    });

    return sortedAcceptInfos;
  }, [paishi]);

  return acceptInfos;
};

export default useAccept;
