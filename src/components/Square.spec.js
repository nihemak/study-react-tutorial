import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Square from "./Square";

let container = null;
beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("ボタンが表示されること", () => {
  const value = "hoge";

  act(() => {
    render(<Square value={value} />, container);
  });

  const button = document.querySelector(".square");
  expect(button.innerHTML).toBe(value);
});

it("ボタンをクリックするとコールバックがよばれること", () => {
  const onClick = jest.fn();

  act(() => {
    render(<Square onClick={onClick} />, container);
  });

  const button = document.querySelector(".square");

  act(() => {
    button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

  expect(onClick).toHaveBeenCalledTimes(1);
});
