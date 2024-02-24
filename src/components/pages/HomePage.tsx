import { useState } from "react";
import BaseTemplate from "../templates/BaseTemplate";
import Hand from "../../mahojong/hand";

interface HomePageProps {}

const initialHand = new Hand();

const HomePage = (props: HomePageProps) => {
  const [paishiInput, setPaishiInput] = useState("");
  const [hand, setHand] = useState(initialHand);
  const [handPais, setHandPais] = useState<{
    menzen: string[];
    fulos: string[];
    tsumoPai: string | null;
  }>({
    fulos: [],
    tsumoPai: null,
    menzen: [],
  });

  const onConvertClick = () => {
    try {
      setHand(hand.fromPaishi(paishiInput));
      setHandPais({
        tsumoPai: hand._tsumoPai,
        fulos: hand._fulos,
        menzen: (["m", "p", "s", "z"] as ("m" | "p" | "s" | "z")[])
          .map((s) => {
            const pais = hand._menzenPais[s];
            let paiStrings: string[] = [];
            for (let i = 0; i < pais.length; i++) {
              const count = pais[i];
              for (let c = 0; c < count; c++) {
                const paiString = s + i.toString();
                paiStrings.push(paiString);
              }
            }

            return paiStrings;
          })
          .flatMap((x) => x)
          .sort(),
      });
    } catch (err) {
      alert(err);
    }
  };

  return (
    <BaseTemplate>
      <div>
        <div>
          {/* 変換ボタン */}
          <div>
            <button
              style={{
                marginBottom: "2rem",
              }}
              onClick={onConvertClick}
            >
              変換
            </button>
          </div>

          {/* 牌姿入力フォーム */}
          <div
            style={{
              marginBottom: "2rem",
            }}
          >
            <span>牌姿: </span>
            <input
              style={{
                backgroundColor: "#ffffff",
                borderStyle: "solid",
                width: "50%",
              }}
              type="text"
              value={paishiInput}
              placeholder="牌姿を入力してください"
              onChange={(e) => setPaishiInput(e.target.value)}
            />
          </div>

          {/* 手牌確認用 */}
          <div>
            <div
              style={{
                marginBottom: "1rem",
              }}
            >
              <p>手牌: {handPais.menzen.join(",")}</p>
            </div>

            <div
              style={{
                marginBottom: "1rem",
              }}
            >
              <p>ツモ: {handPais.tsumoPai ?? "無し"} </p>
            </div>

            <div
              style={{
                marginBottom: "1rem",
              }}
            >
              <p>副露: {handPais.fulos.join(",")}</p>
            </div>

            <div>打牌可能: {hand.getDapaiCandidates()}</div>
          </div>
        </div>
      </div>
    </BaseTemplate>
  );
};

export default HomePage;
