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

  const pai1 = fuloMentsu.substring(0, 2);
  const pai4 = fuloMentsu.length >= 5 ? fuloMentsu[0] + fuloMentsu[4] : pai1;

  return (
    <div className="comp_fulo-mentsu">
      {/* 1牌目 */}
      <div className="comp_fulo-mentsu__pai">
        <MahojongPai pai={pai1} />
      </div>

      {/* 2牌目 */}
      <div className="comp_fulo-mentsu__pai">
        <MahojongPai pai="back" />
      </div>

      {/* 3牌目 */}
      <div className="comp_fulo-mentsu__pai">
        <MahojongPai pai="back" />
      </div>

      {/* 4牌目 */}
      <div className="comp_fulo-mentsu__pai">
        <MahojongPai pai={pai4} />
      </div>
    </div>
  );
};

export default FuloMentsu;
