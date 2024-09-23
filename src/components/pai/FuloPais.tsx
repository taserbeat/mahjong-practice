import MahojongPai from "./MahojongPai";

import "../../styles/pai/FuloPais.scss";

/** 副露中の牌を表示するコンポーネントのProps */
interface FuloPaisProps {
  /** 副露した面子を表現する文字列の配列 */
  fulos: string[];
}

/** 副露中の牌を表示するコンポーネント */
const FuloPais = (props: FuloPaisProps) => {
  const fulos = props.fulos;

  return (
    <div className="fulo-mentsu-list">
      {fulos.map((fuloMentsu, i) => {
        // NOTE:
        // 1人麻雀では副露は暗カンしかありえないので、暗カンを前提とした実装としている。
        const pai1 = fuloMentsu.substring(0, 2);
        const pai4 =
          fuloMentsu.length >= 5 ? fuloMentsu[0] + fuloMentsu[4] : pai1;

        return (
          <div className="fulo-mentsu" key={`${fuloMentsu}_${i}`}>
            {/* 1牌目 */}
            <div className="fulo-mentsu__pai">
              <MahojongPai pai={pai1} />
            </div>

            {/* 2牌目 */}
            <div className="fulo-mentsu__pai">
              <MahojongPai pai="back" />
            </div>

            {/* 3牌目 */}
            <div className="fulo-mentsu__pai">
              <MahojongPai pai="back" />
            </div>

            {/* 4牌目 */}
            <div className="fulo-mentsu__pai">
              <MahojongPai pai={pai4} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FuloPais;
