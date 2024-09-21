import React from "react";
import { useAppSelector } from "../../app/hooks";
import { ModeName, selectCurrentMode } from "../../features/mode/modeSlice";
import SettingPage from "./SettingPage";
import PracticePage from "./PracticePage";
import ResultPage from "./ResultPage";

/** ページルーターのProps */
interface PageRouterProps {}

/** ページルーター */
const PageRouter = (props: PageRouterProps) => {
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
