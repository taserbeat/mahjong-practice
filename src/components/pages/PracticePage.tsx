import { useEffect, useState } from "react";
import Button from "@mui/material/Button";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setMode } from "../../features/mode/modeSlice";
import { PracticeGame } from "../../mahojong/practice";
import { selectSettings } from "../../features/settings/settingsSlice";
import { defaultRule } from "../../mahojong/rule";
import useRender from "../../hooks/useRender";
import MahojongPai from "../pai/MahojongPai";
import { MenzenPais } from "../../mahojong/hand";

import "../../styles/pages/PracticePage.scss";
import {
  initializeHoraResult,
  setHoraResult,
} from "../../features/hora/horaSlice";
import KawaPais from "../pai/KawaPais";
import DoraDisplayPais from "../pai/DoraDisplayPais";

/** 練習ページのコンポーネントのProps */
interface PracticePageProps {}

let dummyGame = new PracticeGame({
  rule: defaultRule,
  bakaze: 0,
  jikaze: 0,
});

/** 練習ページのコンポーネント */
const PracticePage = (props: PracticePageProps) => {
  const dispatch = useAppDispatch();

  const settings = useAppSelector(selectSettings);
  const [game, setGame] = useState(dummyGame);

  const [isRiichiSelectMode, setIsRiichiSelectMode] = useState(false);

  const { updateRender } = useRender();

  // ツモ牌
  const tsumoPai = game.tsumoPai;

  // 手牌
  const displayMenzenPais = shapeMenzenPais(game.menzenPais, tsumoPai);

  // ドラ表示牌
  const doraDisplayPais = game.doraDisplayPais;

  // 河
  const kawa = game.kawa;

  // 立直済みであるか？
  const isRiichied = game.isRiichied;

  // 実行可能アクション
  const legalActions = game.getLegalActions();

  const riichiAction = legalActions.find((action) => action.name === "Riichi");
  const riichiDapais = riichiAction?.name === "Riichi" ? riichiAction.pais : [];

  const kanAction = legalActions.find((action) => action.name === "Kan");
  const kanMentsuList = kanAction?.name === "Kan" ? kanAction.mentsuList : [];

  const horaAction = legalActions.find((action) => action.name === "Hora");

  const kyusyuAction = legalActions.find((action) => action.name === "Kyusyu");

  useEffect(() => {
    dispatch(initializeHoraResult());
    const newGame = new PracticeGame(settings);
    newGame.initialize();
    newGame.tsumo();
    setGame(newGame);
  }, []);

  const dapai = (
    pai: string,
    options?: {
      isTsumoCut?: boolean;
      isRiichi?: boolean;
    }
  ) => {
    const istsumoCut =
      options?.isTsumoCut === undefined ? false : options.isTsumoCut;
    if (istsumoCut) {
      pai += "_";
    }

    const isRiichi = options?.isRiichi === undefined ? false : options.isRiichi;
    if (isRiichi) {
      pai += "*";
    }

    game.dapai(pai);
    setIsRiichiSelectMode(false);
    updateRender();
  };

  // 指定された関数を実行し、レンダリングも行う
  const executeWithRender = (func: () => void) => {
    func();
    updateRender();
  };

  const onExitClick = () => {
    dispatch(setMode("Result"));
  };

  return (
    <div>
      <h2>練習ページ</h2>

      <div className="game">
        <div className="info-container">
          {/* ドラ表示牌 */}
          <div className="dora-displays-wrapper">
            <DoraDisplayPais doraDisplayPais={doraDisplayPais} />
          </div>
        </div>

        <div className="game-container">
          {/* 河 */}
          <div className="kawa-wrapper">
            <KawaPais pais={kawa.pai} />
          </div>

          {/* 実行可能アクション */}
          {isRiichiSelectMode ? (
            // 立直モードで打牌を選択中
            <div className="legal-actions">
              <div className="legal-action">
                <Button
                  variant="contained"
                  onClick={() => {
                    setIsRiichiSelectMode(false);
                  }}
                >
                  キャンセル
                </Button>
              </div>
            </div>
          ) : (
            // 通常の打牌を選択中
            <div className="legal-actions">
              {riichiAction?.name === "Riichi" && (
                <div className="legal-action">
                  <Button
                    variant="contained"
                    onClick={() => {
                      setIsRiichiSelectMode(true);
                    }}
                  >
                    立直
                  </Button>
                </div>
              )}

              {kanAction && (
                <div className="legal-action">
                  <Button variant="contained">カン</Button>
                </div>
              )}

              {horaAction && (
                <div className="legal-action">
                  <Button
                    variant="contained"
                    onClick={() => {
                      const hora = game.hora();
                      dispatch(setHoraResult(hora));
                      dispatch(setMode("Result"));
                    }}
                  >
                    ツモ
                  </Button>
                </div>
              )}

              {kyusyuAction && (
                <div className="legal-action">
                  <Button
                    variant="contained"
                    onClick={() => {
                      dispatch(setMode("Result"));
                    }}
                  >
                    流局
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* 手牌 */}
          <div className="hand_menzen">
            <div className="hand_menzen__already">
              {displayMenzenPais.map((pai, i) => (
                <div
                  key={`${pai}_${i}`}
                  onClick={() => {
                    if (isRiichied) {
                      return;
                    }

                    if (isRiichiSelectMode && !riichiDapais.includes(pai)) {
                      return;
                    }

                    dapai(pai, {
                      isTsumoCut: false,
                      isRiichi: isRiichiSelectMode,
                    });
                  }}
                >
                  <MahojongPai
                    pai={pai}
                    isShadow={isRiichiSelectMode && !riichiDapais.includes(pai)}
                  />
                </div>
              ))}
            </div>

            {tsumoPai && (
              <div
                className="hand_menzen__tsumopai"
                onClick={() => {
                  if (
                    isRiichiSelectMode &&
                    !riichiDapais.includes(tsumoPai + "_")
                  ) {
                    return;
                  }
                  dapai(tsumoPai, {
                    isTsumoCut: true,
                    isRiichi: isRiichiSelectMode,
                  });
                }}
              >
                <MahojongPai
                  pai={tsumoPai}
                  isShadow={
                    isRiichiSelectMode && !riichiDapais.includes(tsumoPai + "_")
                  }
                />
              </div>
            )}
          </div>

          {/* デバッグ用のボタン */}

          <div className="debug-buttons">
            <div className="debug-button">
              <Button variant="contained" onClick={onExitClick}>
                終了
              </Button>
            </div>

            <div className="debug-button">
              <Button
                variant="contained"
                onClick={() =>
                  executeWithRender(() => {
                    game.initialize();
                    game.tsumo();
                  })
                }
              >
                初期化
              </Button>
            </div>

            <div className="debug-button">
              <Button
                variant="contained"
                onClick={() => {
                  executeWithRender(() => {
                    game.tsumo();
                  });
                }}
              >
                ツモ
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/** 手牌を文字列配列に整形する */
const shapeMenzenPais = (
  menzenPais: MenzenPais,
  tsumoPai: string | null
): string[] => {
  const pais: string[] = [];

  // 数牌のインデックス配列 (ソートされることを考慮)
  const suuhaiIndexsWithSort = [1, 2, 3, 4, 0, 5, 6, 7, 8, 9];

  // 萬子
  const menzenManzuPais = menzenPais.m;
  for (let i = 0; i < suuhaiIndexsWithSort.length; i++) {
    // 数牌のインデックス
    const suuhaiIndex = suuhaiIndexsWithSort[i];

    // 牌の個数
    const numOfPai =
      suuhaiIndex !== 5
        ? menzenManzuPais[suuhaiIndex]
        : menzenManzuPais[suuhaiIndex] - menzenManzuPais[0]; // 赤牌は黒牌の数にもカウントされていることを考慮する

    // 牌を表す文字列 (例: "m1")
    const paiString = `m${suuhaiIndex}`;

    const manzuPais: string[] = new Array(numOfPai).fill(paiString);
    pais.push(...manzuPais);
  }

  // 筒子
  const menzenPinzuPais = menzenPais.p;
  for (let i = 0; i < suuhaiIndexsWithSort.length; i++) {
    // 数牌のインデックス
    const suuhaiIndex = suuhaiIndexsWithSort[i];

    // 牌の個数
    const numOfPai =
      suuhaiIndex !== 5
        ? menzenPinzuPais[suuhaiIndex]
        : menzenPinzuPais[suuhaiIndex] - menzenPinzuPais[0]; // 赤牌は黒牌の数にもカウントされていることを考慮する

    // 牌を表す文字列 (例: "p1")
    const paiString = `p${suuhaiIndex}`;

    const pinzuPais: string[] = new Array(numOfPai).fill(paiString);
    pais.push(...pinzuPais);
  }

  // 索子
  const menzenSozuPais = menzenPais.s;
  for (let i = 0; i < suuhaiIndexsWithSort.length; i++) {
    // 数牌のインデックス
    const suuhaiIndex = suuhaiIndexsWithSort[i];

    // 牌の個数
    const numOfPai =
      suuhaiIndex !== 5
        ? menzenSozuPais[suuhaiIndex]
        : menzenSozuPais[suuhaiIndex] - menzenSozuPais[0];

    // 牌を表す文字列 (例: "s1")
    const paiString = `s${suuhaiIndex}`;

    const sozuPais: string[] = new Array(numOfPai).fill(paiString);
    pais.push(...sozuPais);
  }

  // 字牌
  const menzenJihais = menzenPais.z;
  for (let num = 1; num < menzenJihais.length; num++) {
    // 牌の個数
    const numOfPai = menzenJihais[num];

    // 牌を表す文字列 (例: "z1")
    const paiString = `z${num}`;
    const jihais: string[] = new Array(numOfPai).fill(paiString);
    pais.push(...jihais);
  }

  // ツモ牌を別で表示するため、手牌からツモ牌を取り除く
  if (tsumoPai !== null && tsumoPai[0] !== "_") {
    const mpsz = tsumoPai[0] as "m" | "p" | "s" | "z";
    const n = Number(tsumoPai[1]);
    const paiString = mpsz + n;

    const index = pais.indexOf(paiString);
    if (index !== -1) {
      return [...pais.slice(0, index), ...pais.slice(index + 1)];
    }
  }

  return pais;
};

/** (デバッグ向け) */
const debugMenzenPais = (game: PracticeGame) => {
  return (
    <div>
      {Object.entries(game.menzenPais).map(([key, values]) => {
        if (typeof values === "number") return [];

        return (
          <div key={key}>
            <h2>{key}:</h2>
            <ul>{values.join(", ")}</ul>
          </div>
        );
      })}
    </div>
  );
};

export default PracticePage;
