import MahojongPai from "./MahojongPai";

import "../../styles/pai/DoraDisplayPais.scss";

/** ドラ表示牌のProps
 */
interface DoraDisplayPais {
  /** ドラ表示牌を表す文字列の配列 */
  doraDisplayPais: string[];
}

/** ドラ表示牌 */
const DoraDisplayPais = (props: DoraDisplayPais) => {
  const doraDisplayPais =
    props.doraDisplayPais.length >= 4
      ? props.doraDisplayPais
      : [
          ...props.doraDisplayPais,
          ...new Array<string>(4 - props.doraDisplayPais.length).fill("back"),
        ];

  return (
    <div className="dora-displays">
      {doraDisplayPais.map((doraDisplayPai, i) => (
        <div className="dora-displays__pai" key={`dora-display-${i}`}>
          <MahojongPai pai={doraDisplayPai} />
        </div>
      ))}
    </div>
  );
};

export default DoraDisplayPais;
