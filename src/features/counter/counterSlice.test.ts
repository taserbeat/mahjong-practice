import counterReducer, {
  CounterState,
  decrement,
  increment,
  incrementByAmount,
} from "./counterSlice";

describe("counter reducer", () => {
  const initialState: CounterState = {
    value: 0,
    status: "idle",
  };

  it("should handle initial state", () => {
    const expected = initialState;
    const actual = counterReducer(undefined, { type: "" });

    expect(actual).toEqual(expected);
  });

  it("should increment count", () => {
    const expected: CounterState = {
      value: 1,
      status: "idle",
    };

    const actual = counterReducer(initialState, increment());

    expect(actual).toEqual(expected);
  });

  it("should decrement count", () => {
    const expected: CounterState = {
      value: -1,
      status: "idle",
    };

    const actual = counterReducer(initialState, decrement());

    expect(actual).toEqual(expected);
  });

  it("should add specific count", () => {
    const expected: CounterState = {
      value: 2,
      status: "idle",
    };

    const actual = counterReducer(initialState, incrementByAmount(2));

    expect(actual).toEqual(expected);
  });
});
