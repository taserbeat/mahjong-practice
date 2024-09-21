import React from "react";
import { useAppDispatch } from "../../app/hooks";
import { setMode } from "../../features/mode/modeSlice";

/** リザルトページのコンポーネントのProps */
export interface ResultPageProps {}

/** リザルトページのコンポーネント */
const ResultPage = (props: ResultPageProps) => {
  const dispatch = useAppDispatch();

  /** 同じ設定で続ける */
  const onContinueWithSameSetting = () => {
    dispatch(setMode("Practice"));
  };

  /** 設定変更 */
  const onChangeSetting = () => {
    dispatch(setMode("Setting"));
  };

  return (
    <div>
      <h2>リザルト画面</h2>

      <button onClick={onContinueWithSameSetting}>同じ設定で続ける</button>
      <button onClick={onChangeSetting}>設定変更</button>
    </div>
  );
};

export default ResultPage;
