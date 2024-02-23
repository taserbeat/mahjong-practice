import { ReactNode } from "react";
import { Link } from "react-router-dom";

import "../../styles/templates/BaseTemplate.scss";

/** ベースのテンプレートのプロパティ */
interface BaseTemplateProps {
  children?: ReactNode;
}

/** ベースのテンプレート */
const BaseTemplate = (props: BaseTemplateProps) => {
  return (
    <div className="wrapper">
      {/* ナビゲーション */}
      <div className="nav_wrap">
        <ul className="nav_lists">
          <li className="nav_list">
            <Link className="nav_link" to="/">
              ホーム
            </Link>
          </li>

          <li className="nav_list">
            <Link className="nav_link" to="/counter">
              カウンター
            </Link>
          </li>
        </ul>
      </div>

      {/* コンテンツ */}
      <div className="main">{props.children}</div>
    </div>
  );
};

export default BaseTemplate;
