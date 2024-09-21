import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setMode } from "../../features/mode/modeSlice";
import { PracticeGame } from "../../mahojong/practice";
import { selectSettings } from "../../features/settings/settingsSlice";
import { defaultRule } from "../../mahojong/rule";
import useRender from "../../hooks/useRender";

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

  const { updateRender } = useRender();

  const displayMenzenPais = (["m", "p", "s", "z"] as ("m" | "p" | "s" | "z")[])
    .map((s) => {
      const pais = game.menzenPais[s];
      const menzenPais: string[] = [];
      for (let i = 0; i < pais.length; i++) {
        const count = pais[i];
        for (let c = 0; c < count; c++) {
          const paiString = s + i.toString();
          menzenPais.push(paiString);
        }
      }

      return menzenPais;
    })
    .flatMap((x) => x)
    .sort();

  const onExitClick = () => {
    dispatch(setMode("Result"));
  };

  // 指定された関数を実行し、レンダリングも行う
  const executeWithRender = (func: () => void) => {
    func();
    updateRender();
  };

  useEffect(() => {
    const newGame = new PracticeGame(settings);
    newGame.initialize();
    setGame(newGame);
  }, []);

  return (
    <div>
      <h2>練習ページ</h2>

      <div>{displayMenzenPais.join(", ")}</div>

      <button onClick={onExitClick}>終了</button>
      <button
        onClick={() =>
          executeWithRender(() => {
            game.initialize();
          })
        }
      >
        初期化
      </button>
    </div>
  );
};

export default PracticePage;
