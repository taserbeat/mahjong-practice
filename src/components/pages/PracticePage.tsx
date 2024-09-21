import React from "react";
import { useAppDispatch } from "../../app/hooks";
import { setMode } from "../../features/mode/modeSlice";

/** 練習ページのコンポーネントのProps */
interface PracticePageProps {}

/** 練習ページのコンポーネント */
const PracticePage = (props: PracticePageProps) => {
  const dispatch = useAppDispatch();

  const onExitClick = () => {
    dispatch(setMode("Result"));
  };

  return (
    <div>
      <h2>練習ページ</h2>

      <button onClick={onExitClick}>終了</button>
    </div>
  );
};

export default PracticePage;
