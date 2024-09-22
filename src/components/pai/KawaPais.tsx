import MahojongPai from "./MahojongPai";

import "../../styles/pai/KawaPais.scss";

interface KawaPaisProps {
  /** 捨て牌を表現する文字列の配列 */
  pais: string[];

  /** 1行あたりの列数 */
  columnSize?: number;
}

/** 河の牌 */
const KawaPais = (props: KawaPaisProps) => {
  const pais = props.pais;

  const columnSize =
    props.columnSize === undefined || props.columnSize < 1
      ? 6
      : props.columnSize;

  // columnSize列 * N行にする
  const kawaPais: string[][] = [];
  for (let i = 0; i < pais.length; i += columnSize) {
    kawaPais.push(pais.slice(i, i + columnSize));
  }

  return (
    <div className="kawa">
      {kawaPais.map((kawaRow, numRow) => (
        <div className="kawa__row" key={`kawaRow_${numRow}`}>
          {kawaRow.map((pai, numCol) => (
            <div className="kawa__pai" key={`${pai}_r${numRow}_c${numCol}`}>
              <MahojongPai
                pai={pai}
                isShadow={pai.includes("_")}
                isLay={pai.includes("*")}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

/** 河の牌 */
export default KawaPais;
