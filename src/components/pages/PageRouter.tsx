import { useAppSelector } from "../../app/hooks";
import SettingPage from "./SettingPage";
import PracticePage from "./PracticePage";
import ResultPage from "./ResultPage";
import {
  selectCurrentMode,
  type ModeName,
} from "../../features/mode/modeSlice";

/** ページルーター */
const PageRouter = () => {
  const currentModeName = useAppSelector(selectCurrentMode);

  return routePage(currentModeName);
};

/** モードに応じたページを取得する */
const routePage = (modeName: ModeName) => {
  switch (modeName) {
    case "Setting":
      return <SettingPage />;

    case "Practice":
      return <PracticePage />;

    case "Result":
      return <ResultPage />;
  }

  // NOTE: ここに到達することはないが、念の為returnする
  return <></>;
};

export default PageRouter;
