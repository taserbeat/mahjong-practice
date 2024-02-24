import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import HomePage from "./HomePage";

describe("Rendering tests", () => {
  it("Title is exists.", () => {
    const { asFragment } = render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    // TODO: ダミーのテストなので、必要なテストを書く
    expect(2).toEqual(1 + 1);
  });
});
