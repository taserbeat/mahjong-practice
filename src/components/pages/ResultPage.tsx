import Button from "@mui/material/Button";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectHoraResult } from "../../features/hora/horaSlice";
import { setMode } from "../../features/mode/modeSlice";
import Hand from "../../mahojong/hand";
import HoraResultDisplay from "../result/HoraResultDisplay";

import "../../styles/pages/ResultPage.scss";

/** リザルトページのコンポーネントのProps */
export interface ResultPageProps {}

/** リザルトページのコンポーネント */
const ResultPage = (props: ResultPageProps) => {
  const dispatch = useAppDispatch();

  const horaResult = useAppSelector(selectHoraResult);
  const paishi = horaResult.situationInfo.paisi;
  const hand = Hand.fromString(paishi);

  /** 同じ設定で続ける */
  const onContinueWithSameSetting = () => {
    dispatch(setMode("Practice"));
  };

  /** 設定変更 */
  const onChangeSetting = () => {
    dispatch(setMode("Setting"));
  };

  return (
    <div className="wrapper">
      <h2>リザルト画面</h2>

      <div className="result-wrapper">
        {/* リザルトコンテナ */}
        <div className="result-container">
          {horaResult.isKyusyu ? (
            "九種九牌"
          ) : horaResult.isTenpai ? (
            "テンパイ"
          ) : horaResult.horaInfo === null ? (
            "ノーテン"
          ) : (
            <HoraResultDisplay
              horaPoint={horaResult.horaInfo.horaPoint}
              numHan={horaResult.horaInfo.numHan}
              hu={horaResult.horaInfo.hu}
              horaYakuInfos={horaResult.horaInfo.horaYakuInfos}
              numCompositeYakuman={horaResult.horaInfo.numCompositeYakuman}
              doraDisplayPais={horaResult.situationInfo.doraDisplayPais}
              backDoraDisplayPais={horaResult.situationInfo.backDoraDisplayPais}
              paishi={horaResult.situationInfo.paisi}
            />
          )}
        </div>

        {/* ボタングループ */}
        <div className="btn-group">
          <div className="btn-container">
            <Button variant="contained" onClick={onContinueWithSameSetting}>
              もう一度
            </Button>
          </div>

          <div className="btn-container">
            <Button variant="contained" onClick={onChangeSetting}>
              設定変更
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
