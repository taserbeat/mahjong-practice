import { HoraYakuInfo } from "../../mahojong/hora";
import DoraDisplayPais from "../pai/DoraDisplayPais";
import { useAppSelector } from "../../app/hooks";
import { selectSettings } from "../../features/settings/settingsSlice";
import { Rule } from "../../mahojong/rule";
import Hand from "../../mahojong/hand";
import { shapeMenzenPais } from "../pages/PracticePage";
import MahojongPai from "../pai/MahojongPai";
import FuloMentsu from "../pai/FuloMentsu";

import "../../styles/result/HoraResultDisplay.scss";

/** 和了結果の表示するコンポーネントのProps */
interface HoraResultDisplayProps {
  /** 和了点 */
  horaPoint: number;

  /** 飜数 (役満の場合はundefined) */
  numHan: number | undefined;

  /** 符 (役満の場合はundefined) */
  hu: number | undefined;

  /** 和了役一覧 */
  horaYakuInfos: HoraYakuInfo[] | undefined;

  /** 役満の複合数 (役満ではない場合はundefined) */
  numCompositeYakuman: number | undefined;

  // ドラ表示牌の配列
  doraDisplayPais?: string[];

  // 裏ドラ表示牌の配列
  backDoraDisplayPais?: string[];

  /** 牌姿 */
  paishi: string;
}

/** 和了結果の表示するコンポーネント */
const HoraResultDisplay = (props: HoraResultDisplayProps) => {
  const settings = useAppSelector(selectSettings);

  const manName = getManName(props, settings.rule);

  const doraDisplayPais: string[] = props.doraDisplayPais ?? [];
  const backDoraDisplaypais: string[] = props.backDoraDisplayPais ?? [];

  const hand = Hand.fromString(props.paishi);
  const displaymenzenPais = shapeMenzenPais(hand._menzenPais, hand._tsumoPai);

  return (
    <div className="hora-info">
      {/* 上段コンテナ */}
      <div className="result_upper-container">
        <div className="result_dora-displays">
          {/* ドラ表示牌 */}
          <div className="result_dora-displays__wrapper">
            <div>ドラ表示牌</div>
            <DoraDisplayPais doraDisplayPais={doraDisplayPais} />
          </div>

          {/* 裏ドラ表示牌 */}
          <div className="result_dora-displays__wrapper">
            <div>裏ドラ表示牌</div>
            <DoraDisplayPais doraDisplayPais={backDoraDisplaypais} />
          </div>
        </div>
      </div>

      {/* 中段コンテナ */}
      <div className="result_center-container">
        {/* 役一覧 */}
        <div className="yaku-info-list">
          {props.horaYakuInfos?.map((yakuInfo, i) => (
            // 役情報
            <div className="yaku-info" key={`yakuInfo-${i}`}>
              {yakuInfo.name +
                (typeof yakuInfo.numHan === "number"
                  ? ` ${yakuInfo.numHan}飜`
                  : "")}
            </div>
          ))}
        </div>

        {/* 点数 */}
        <div className="points">
          {props.numHan && props.hu && (
            <div>{`${props.numHan}飜${props.hu}符`}</div>
          )}
          <div>{`${manName} ${props.horaPoint} 点`}</div>
        </div>
      </div>

      {/* 下段コンテナ */}
      <div className="result_lower-container">
        {/* 手牌 */}
        <div className="result_hand">
          {/* 手牌 (ツモ牌以外) */}
          <div className="result_hand__already">
            {displaymenzenPais.map((pai, i) => (
              <div key={`result_pai_${i}`}>
                <MahojongPai pai={pai} />
              </div>
            ))}
          </div>

          {/* 副露 */}
          <div className="result_hand__fulos">
            {hand._fulos.map((fuloMentsu, i) => {
              return (
                <div className="result_fulo-mentsu" key={`fulo-mentsu-${i}`}>
                  <FuloMentsu fuloMentsu={fuloMentsu} />
                </div>
              );
            })}
          </div>

          {/* ツモ牌 */}
          {hand._tsumoPai && (
            <div className="result_hand__tsumopai">
              <MahojongPai pai={hand._tsumoPai} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const getManName = (props: HoraResultDisplayProps, rule: Rule): string => {
  const numHan = props.numHan;
  const hu = props.hu;

  // 満貫以上の名前の場合、飜数に応じて名前を作る
  if (typeof numHan === "number" && typeof hu === "number") {
    if (numHan === 3) {
      // 3飜の場合
      if (rule.切り上げ満貫あり) {
        return hu >= 60 ? "満貫" : "";
      } else {
        return hu >= 70 ? "満貫" : "";
      }
    } else if (numHan === 4) {
      // 4飜の場合
      if (rule.切り上げ満貫あり) {
        return hu >= 30 ? "満貫" : "";
      } else {
        return hu >= 40 ? "満貫" : "";
      }
    } else if (numHan === 5) {
      // 5飜の場合
      return "満貫";
    } else if (6 <= numHan && numHan <= 7) {
      // 6飜 ~ 7飜の場合
      return "跳満";
    } else if (8 <= numHan && numHan <= 10) {
      // 8飜 ~ 10飜の場合
      return "倍満";
    } else if (11 <= numHan && numHan <= 12) {
      // 11飜 ~ 12飜の場合
      return "三倍満";
    } else {
      // 13飜数以上の場合
      return "数え役満";
    }
  }

  // 役満の場合、複合数を考慮する
  if (typeof props.numCompositeYakuman === "number") {
    // おそらく六倍役満まででOKなはずだが、念のため九倍役満まで対応する
    switch (props.numCompositeYakuman) {
      case 1:
        return "役満";
      case 2:
        return "二倍役満";
      case 3:
        return "三倍役満";
      case 4:
        return "四倍役満";
      case 5:
        return "五倍役満";
      case 6:
        return "六倍役満";
      case 7:
        return "七倍役満";
      case 8:
        return "八倍役満";
      case 9:
        return "九倍役満";
    }
  }

  return "";
};

export default HoraResultDisplay;
