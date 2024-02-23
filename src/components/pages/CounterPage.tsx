import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import BaseTemplate from "../templates/BaseTemplate";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  decrement,
  increment,
  selectCount,
} from "../../features/counter/counterSlice";

import "../../styles/pages/CounterPage.scss";

interface CounterPageProps {}

const CounterPage = (props: CounterPageProps) => {
  const countRedux = useAppSelector(selectCount);
  const dispatch = useAppDispatch();

  const [countReact, setCountReact] = useState(0);

  return (
    <BaseTemplate>
      <div className="counter-page">
        <h2 className="counter-page__title">カウンターページ</h2>

        <div className="counter-page__counter-containers">
          <div className="counter-page__counter counter-redux">
            <h3 className="counter-page__counter__title title-redux">
              Redux Counter (useDispatch)
            </h3>

            <div className="counter-page__counter__button-container">
              <button
                className="counter-page__counter__button button-redux"
                onClick={() => dispatch(decrement())}
              >
                -
              </button>

              <button
                className="counter-page__counter__button button-redux"
                onClick={() => dispatch(increment())}
              >
                +
              </button>
            </div>
            <div className="counter-page__counter__value value-redux">
              {countRedux.value}
            </div>
          </div>

          <div className="counter-page__counter counter-react">
            <h3 className="counter-page__counter__title title-react">
              React Counter (useState)
            </h3>

            <div className="counter-page__counter__button-container">
              <button
                className="counter-page__counter__button button-react"
                onClick={() => setCountReact((prev) => prev - 1)}
              >
                -
              </button>

              <button
                className="counter-page__counter__button button-react"
                onClick={() => setCountReact((prev) => prev + 1)}
              >
                +
              </button>
            </div>
            <div className="counter-page__counter__value value-react">
              {countReact}
            </div>
          </div>
        </div>
      </div>
    </BaseTemplate>
  );
};

export default CounterPage;
