import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setMode } from "../../features/mode/modeSlice";
import { PracticeGame } from "../../mahojong/practice";
import { selectSettings } from "../../features/settings/settingsSlice";
import { defaultRule } from "../../mahojong/rule";
import useRender from "../../hooks/useRender";
import MahojongPai from "../pai/MahojongPai";
import { MenzenPais } from "../../mahojong/hand";
import {
  setNoTenpaiResult,
  setHoraResult,
  setKyusyuResult,
  setTenpaiResult,
} from "../../features/hora/horaSlice";
import KawaPais from "../pai/KawaPais";
import DoraDisplayPais from "../pai/DoraDisplayPais";
import { HoraAmountInfo } from "../../mahojong/hora";
import FuloMentsu from "../pai/FuloMentsu";
import {
  selectHaipaiSetting,
  selectPaiyamaSetting,
} from "../../features/haipai/haipaiSlice";

import "../../styles/pages/PracticePage.scss";
/** 練習ページのコンポーネントのProps */
interface PracticePageProps {}

const dummyGame = new PracticeGame({
  rule: defaultRule,
  bakaze: 0,
  jikaze: 0,
});

/** 練習ページのコンポーネント */
const PracticePage = (props: PracticePageProps) => {
  const dispatch = useAppDispatch();

  const settings = useAppSelector(selectSettings);
  const haipaiSettings = useAppSelector(selectHaipaiSetting);
  const paiyamaSettings = useAppSelector(selectPaiyamaSetting);

  const [game, setGame] = useState(dummyGame);

  const [isRiichiSelectMode, setIsRiichiSelectMode] = useState(false);
  const [isKanSelectMode, setisKanSelectMode] = useState(false);

  const { updateRender, lastRenderdAt } = useRender();

  // ツモ牌
  const tsumoPai = game.tsumoPai;

  // 手牌
  const displayMenzenPais = shapeMenzenPais(game.menzenPais, tsumoPai);

  // 副露面子
  const fulos = game.fulos;

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

  // 流局であるか？
  const isDrawnGame = game.isDrawnGame;

  // 自動的にツモ切りを行うべきか？
  const shouldAutoTsumoCut =
    !isDrawnGame &&
    isRiichied &&
    legalActions.length === 1 &&
    legalActions[0].name === "Dapai" &&
    tsumoPai !== null;

  /** 打牌する */
  const executeDapai = (
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

  /** カンする */
  const executeKan = (mentsu: string) => {
    game.kan(mentsu);
    setisKanSelectMode(false);
    updateRender();
  };

  /** 流局する */
  const executeDraw = () => {
    const paishi = game.paishi;

    if (game.isTenpai) {
      dispatch(
        setTenpaiResult({
          paisi: paishi,
          doraDisplayPais: doraDisplayPais,
          backDoraDisplayPais: [],
        })
      );
    } else {
      dispatch(
        setNoTenpaiResult({
          paisi: paishi,
          doraDisplayPais: doraDisplayPais,
          backDoraDisplayPais: [],
        })
      );
    }

    dispatch(setMode("Result"));
  };

  /** 九種九牌する */
  const executeKyusyu = () => {
    dispatch(
      setKyusyuResult({
        paisi: game.paishi,
        doraDisplayPais: doraDisplayPais,
        backDoraDisplayPais: [],
      })
    );
    dispatch(setMode("Result"));
  };

  /** 和了する */
  const executeHora = (
    hora: HoraAmountInfo,
    paishi?: string,
    backDoraDisplayPais?: string[]
  ) => {
    dispatch(
      setHoraResult({
        horaInfo: hora,
        situationInfo: {
          paisi: paishi ?? "",
          doraDisplayPais: doraDisplayPais,
          backDoraDisplayPais: backDoraDisplayPais ?? [],
        },
      })
    );
    dispatch(setMode("Result"));
  };

  // 指定された関数を実行し、レンダリングも行う
  const executeWithRender = (func: () => void) => {
    func();
    updateRender();
  };

  // マウント時のフック
  useEffect(() => {
    dispatch(setNoTenpaiResult());
    const newGame = new PracticeGame(settings, {
      haipai: haipaiSettings,
      paiyama: paiyamaSettings,
    });
    newGame.initialize();
    newGame.tsumo();
    setGame(newGame);
  }, []);

  // 自動的にアクションを実行するフック
  useEffect(() => {
    let drawTimer: NodeJS.Timeout | undefined = undefined;
    let autoTsumoCutTimer: NodeJS.Timeout | undefined = undefined;

    // 流局した場合
    if (isDrawnGame) {
      drawTimer = setTimeout(() => {
        executeDraw();
      }, 1500);

      return () => {
        clearTimeout(drawTimer);
        drawTimer = undefined;
      };
    }

    // 立直済みで、ツモ切りしかできない場合
    if (shouldAutoTsumoCut) {
      autoTsumoCutTimer = setTimeout(() => {
        executeDapai(tsumoPai, { isTsumoCut: true });
      }, 1000);

      return () => {
        clearTimeout(autoTsumoCutTimer);
        autoTsumoCutTimer = undefined;
      };
    }

    return () => {
      clearTimeout(drawTimer);
      drawTimer = undefined;

      clearTimeout(autoTsumoCutTimer);
      autoTsumoCutTimer = undefined;
    };
  }, [isDrawnGame, shouldAutoTsumoCut, tsumoPai, lastRenderdAt]);

  return (
    <div>
      <div className="game">
        {/* 左コンテナ */}
        <div className="left-container">
          {/* ドラ表示牌 */}
          <div className="dora-displays-wrapper">
            <DoraDisplayPais doraDisplayPais={doraDisplayPais} />
          </div>
        </div>

        {/* 中央コンテナ */}
        <div className="center-container">
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
                  <Button
                    variant="contained"
                    onClick={() => {
                      if (kanMentsuList.length > 1) {
                        setisKanSelectMode(true);
                        return;
                      }

                      executeKan(kanMentsuList[0]);
                    }}
                  >
                    カン
                  </Button>
                </div>
              )}

              {horaAction && (
                <div className="legal-action">
                  <Button
                    variant="contained"
                    onClick={() => {
                      const hora = game.hora();
                      const paishi = game.paishi;
                      const backDoraDisplayPais =
                        game.backDoraDisplayPais ?? [];
                      executeHora(hora, paishi, backDoraDisplayPais);
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
                      executeKyusyu();
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
                    // 流局の場合は打牌できない
                    if (isDrawnGame) {
                      return;
                    }

                    // 立直済みの場合は門前の手牌を打牌できない
                    if (isRiichied) {
                      return;
                    }

                    // 立直をかけるのに、テンパイが崩れる牌は打牌できない
                    if (isRiichiSelectMode && !riichiDapais.includes(pai)) {
                      return;
                    }

                    // 打牌する
                    executeDapai(pai, {
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
                  // 流局の場合は打牌できない
                  if (isDrawnGame) {
                    return;
                  }

                  // 立直をかけるのに、テンパイが崩れる牌は打牌できない
                  if (
                    isRiichiSelectMode &&
                    !riichiDapais.includes(tsumoPai + "_")
                  ) {
                    return;
                  }

                  // 自動ツモ切り中の場合は、ユーザーが打牌できないようにする
                  // (自動ツモ切りの処理側で打牌する)
                  if (shouldAutoTsumoCut) {
                    return;
                  }

                  executeDapai(tsumoPai, {
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
              {/* ゲームを初期化するデバッグ向けボタン */}
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

            {/* カン選択を表示するデバッグ向けボタン */}
            <div className="debug-button">
              <Button
                variant="contained"
                onClick={() => {
                  setisKanSelectMode(true);
                }}
              >
                カン選択
              </Button>
            </div>

            {/* 和了するデバッグ向けボタン */}
            <div className="debug-button">
              <Button
                variant="contained"
                onClick={() => {
                  // 和了情報
                  const hora: HoraAmountInfo = {
                    horaPoint: 12000,
                    hu: 20,
                    incomes: [],
                    horaYakuInfos: [
                      { name: "立直", numHan: 1 },
                      { name: "門前清自摸和", numHan: 1 },
                      { name: "平和", numHan: 1 },
                      { name: "断幺九", numHan: 1 },
                      { name: "ドラ", numHan: 1 },
                    ],
                    numHan: 5,
                  };

                  // 牌姿
                  const paishi = "m234678p345s2267s8";

                  // 裏ドラ表示牌
                  const backDoraDisplayPais: string[] = [];

                  executeHora(hora, paishi, backDoraDisplayPais);
                }}
              >
                和了
              </Button>
            </div>
          </div>
        </div>

        {/* 右コンテナ */}
        <div className="right-container">
          <div className="fulo-wrapper">
            {fulos.map((fuloMentsu, i) => (
              <div className="fulo-box" key={`fulo-box_${i}`}>
                <FuloMentsu fuloMentsu={fuloMentsu} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 副露選択のモーダル */}
      <Modal
        open={isKanSelectMode}
        onClose={() => {
          setisKanSelectMode(false);
        }}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="fulo-selector-wrapper">
          {/* 副露のキャンセルボタン */}
          <div className="fulo-cancel-btn-wrapper">
            <Button
              variant="contained"
              onClick={() => {
                setisKanSelectMode(false);
              }}
              style={{
                margin: "1rem 1rem",
              }}
            >
              キャンセル
            </Button>
          </div>

          {/* 副露の選択エリア */}
          <div className="fulo-selector">
            {kanMentsuList.map((fuloMentsu, i) => {
              return (
                // 副露の選択肢
                <div
                  className="fulo-selection"
                  key={`fulo-selection_${i}`}
                  onClick={() => executeKan(fuloMentsu)}
                >
                  <FuloMentsu fuloMentsu={fuloMentsu} />
                </div>
              );
            })}
          </div>
        </div>
      </Modal>
    </div>
  );
};

/** 手牌を文字列配列に整形する */
export const shapeMenzenPais = (
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

export default PracticePage;
