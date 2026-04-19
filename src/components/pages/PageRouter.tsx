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

    default:
      throw new Error(`不正なモードです。: ${modeName}`);
  }
};

export default PageRouter;
