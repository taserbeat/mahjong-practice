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

  // NOTE:
  // 1人麻雀では副露は暗カンしかありえないので、暗カンを前提とした実装としている。
  const fuloKantsuPais = fulos.map((fulo) => {
    const kantsuPai = fulo.substring(0, 2);
    return kantsuPai;
  });

  return (
    <div className="fulo-mentsu-list">
      {fuloKantsuPais.map((fuloKantsuPai, i) => (
        <div className="fulo-mentsu" key={`${fuloKantsuPai}_${i}`}>
          {/* 1牌目 */}
          <div className="fulo-mentsu__pai">
            <MahojongPai pai={fuloKantsuPai} />
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
            <MahojongPai pai={fuloKantsuPai} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default FuloPais;
