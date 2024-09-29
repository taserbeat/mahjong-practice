import MahojongPai from "./MahojongPai";

import "../../styles/pai/FuloMentsu.scss";

/** 副露面子のコンポーネントのProps */
interface FuloMentsuProps {
  /** 副露面子の文字列 */
  fuloMentsu: string;
}

/** 副露面子のコンポーネント */
const FuloMentsu = (props: FuloMentsuProps) => {
  // TODO: 暗カン以外の面子を別コンポーネントで実装する。
  // (1人麻雀では副露は暗カンしかありえないので、暗カンを前提とした実装としている)

  const fuloMentsu = props.fuloMentsu;

  const pai2 = fuloMentsu.substring(0, 2);
  const pai3 = fuloMentsu.length >= 5 ? fuloMentsu[0] + fuloMentsu[4] : pai2;

  return (
    <div className="comp_fulo-mentsu">
      {/* 1牌目 */}
      <div className="comp_fulo-mentsu__pai">
        <MahojongPai pai="back" />
      </div>

      {/* 2牌目 */}
      <div className="comp_fulo-mentsu__pai">
        <MahojongPai pai={pai2} />
      </div>

      {/* 3牌目 */}
      <div className="comp_fulo-mentsu__pai">
        <MahojongPai pai={pai3} />
      </div>

      {/* 4牌目 */}
      <div className="comp_fulo-mentsu__pai">
        <MahojongPai pai="back" />
      </div>
    </div>
  );
};

export default FuloMentsu;
