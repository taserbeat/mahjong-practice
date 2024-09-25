import Button from "@mui/material/Button";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setMode } from "../../features/mode/modeSlice";
import BaKazeSelector from "../settings/BakazeSelector";
import JiKazeSelector from "../settings/JikazeSelector";
import {
  addHaipai,
  initializeHaipai,
  removeHaipai,
  selectHaipaiSetting,
  selectPaiyamaSetting,
} from "../../features/haipai/haipaiSlice";
import Pai from "../../mahojong/pai";
import MahojongPai from "../pai/MahojongPai";

import "../../styles/pages/SettingPage.scss";

/** 設定画面のコンポーネントのProps */
interface SettingPageProps {}

/** 設定画面のコンポーネント */
const SettingPage = (props: SettingPageProps) => {
  const dispatch = useAppDispatch();

  const onStartClick = () => {
    dispatch(setMode("Practice"));
  };

  // 牌山の設定 (萬子の表示用)
  const manzuPais: Pai[] = [
    "m1",
    "m2",
    "m3",
    "m4",
    "m5",
    "m6",
    "m7",
    "m8",
    "m9",
  ];

  // 牌山の設定 (筒子の表示用)
  const pinzuPais: Pai[] = [
    "p1",
    "p2",
    "p3",
    "p4",
    "p5",
    "p6",
    "p7",
    "p8",
    "p9",
  ];

  // 牌山の設定 (索子の表示用)
  const sozuPais: Pai[] = [
    "s1",
    "s2",
    "s3",
    "s4",
    "s5",
    "s6",
    "s7",
    "s8",
    "s9",
  ];

  // 牌山の設定 (字牌の表示用)
  const jiPais: Pai[] = ["z1", "z2", "z3", "z4", "z5", "z6", "z7"];

  // 牌山の設定 (赤牌の表示用)
  const redPais: Pai[] = ["m0", "p0", "s0"];

  // 牌山の設定
  const paiyamaSetting = useAppSelector(selectPaiyamaSetting);

  // 配牌の設定
  const haipaiSetting = useAppSelector(selectHaipaiSetting);

  /** 牌山の牌がクリックされた時の処理 */
  const onPaiyamaClick = (pai: Pai) => {
    if (paiyamaSetting.includes(pai)) {
      dispatch(addHaipai(pai));
    }
  };

  /** 配牌の牌がクリックされた時の処理 */
  const onHaipaiClick = (pai: Pai) => {
    dispatch(removeHaipai(pai));
  };

  const onResetClick = () => {
    dispatch(initializeHaipai());
  };

  return (
    <div className="setting-wrappr">
      <h2>設定画面</h2>

      {/* 設定コンテナ */}
      <div className="setting-container">
        {/* 場況設定のコンテナ */}
        <div className="situation-setting-container">
          {/* 場風 */}
          <div>
            <BaKazeSelector />
          </div>

          {/* 自風 */}
          <div>
            <JiKazeSelector />
          </div>
        </div>

        {/* 配牌設定のコンテナ */}
        <div className="haipai-setting-container">
          {/* 牌山 */}
          <div className="haipai-setting-container__paiyama">
            {/* 萬子 */}
            <div className="haipai-setting-container__paiyama__manzu">
              {manzuPais.map((pai, i) => (
                <div
                  key={`manzu_${pai}_${i}`}
                  onClick={() => onPaiyamaClick(pai)}
                >
                  <MahojongPai
                    pai={pai}
                    isShadow={!paiyamaSetting.includes(pai)}
                  />
                </div>
              ))}
            </div>

            {/* 筒子 */}
            <div className="haipai-setting-container__paiyama__pinzu">
              {pinzuPais.map((pai, i) => (
                <div
                  key={`pinzu_${pai}_${i}`}
                  onClick={() => onPaiyamaClick(pai)}
                >
                  <MahojongPai
                    pai={pai}
                    isShadow={!paiyamaSetting.includes(pai)}
                  />
                </div>
              ))}
            </div>

            {/* 索子 */}
            <div className="haipai-setting-container__paiyama__sozu">
              {sozuPais.map((pai, i) => (
                <div
                  key={`sozu_${pai}_${i}`}
                  onClick={() => onPaiyamaClick(pai)}
                >
                  <MahojongPai
                    pai={pai}
                    isShadow={!paiyamaSetting.includes(pai)}
                  />
                </div>
              ))}
            </div>

            {/* 字牌 */}
            <div className="haipai-setting-container__paiyama__jipai">
              {jiPais.map((pai, i) => (
                <div
                  key={`jipai_${pai}_${i}`}
                  onClick={() => onPaiyamaClick(pai)}
                >
                  <MahojongPai
                    pai={pai}
                    isShadow={!paiyamaSetting.includes(pai)}
                  />
                </div>
              ))}
            </div>

            {/* 赤牌 */}
            <div className="haipai-setting-container__paiyama__reds">
              {redPais.map((pai, i) => (
                <div
                  key={`red_${pai}_${i}`}
                  onClick={() => onPaiyamaClick(pai)}
                >
                  <MahojongPai
                    pai={pai}
                    isShadow={!paiyamaSetting.includes(pai)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 配牌 */}
          <div className="haipai-setting-container__haipai">
            {haipaiSetting.map((pai, i) => (
              <div
                key={`haipai_${pai}_${i}`}
                onClick={() => onHaipaiClick(pai)}
              >
                <MahojongPai pai={pai} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="button-container">
        <div className="button-container__button">
          <Button variant="contained" onClick={onStartClick}>
            開始
          </Button>
        </div>

        <div className="button-container__button">
          <Button variant="contained" onClick={onResetClick}>
            リセット
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingPage;
