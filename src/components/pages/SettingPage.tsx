import { useState } from "react";
import { PracticeSettings } from "../../mahojong/practice";
import { defaultRule } from "../../mahojong/rule";
import { useAppDispatch } from "../../app/hooks";
import { setMode } from "../../features/mode/modeSlice";

/** 設定画面のコンポーネントのProps */
interface SettingPageProps {}

/** デフォルトの設定 */
const defaultSetting: PracticeSettings = {
  rule: defaultRule,
};

/** 設定画面のコンポーネント */
const SettingPage = (props: SettingPageProps) => {
  const dispatch = useAppDispatch();

  const [setting, setSetting] = useState(defaultSetting);

  const onStartClick = () => {
    dispatch(setMode("Practice"));
  };

  return (
    <div>
      <h2>設定画面</h2>

      <button onClick={onStartClick}>開始</button>
    </div>
  );
};

export default SettingPage;
