import { useAppDispatch } from "../../app/hooks";
import Button from "@mui/material/Button";

import { setMode } from "../../features/mode/modeSlice";
import BaKazeSelector from "../settings/BakazeSelector";
import JiKazeSelector from "../settings/JikazeSelector";

/** 設定画面のコンポーネントのProps */
interface SettingPageProps {}

/** 設定画面のコンポーネント */
const SettingPage = (props: SettingPageProps) => {
  const dispatch = useAppDispatch();

  const onStartClick = () => {
    dispatch(setMode("Practice"));
  };

  return (
    <div>
      <h2>設定画面</h2>

      {/* 場風 */}
      <div>
        <BaKazeSelector />
      </div>

      {/* 自風 */}
      <div>
        <JiKazeSelector />
      </div>

      <Button variant="contained" onClick={onStartClick}>
        開始
      </Button>
    </div>
  );
};

export default SettingPage;
