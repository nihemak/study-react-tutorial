import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Board from "./Board";
import MockedSquare from "./Square";

jest.mock("./Square", () => {
  return function DummySquare(props) {
    return (
      <div className="square" onClick={props.onClick}>
        {props.value}
      </div>
    );
  };
});

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

it("盤面が表示されること", () => {
  const squares = [null, null, "O", null, "X", null, null, null, null];

  act(() => {
    render(<Board squares={squares} />, container);
  });

  const rows = document.querySelectorAll(".board-row");
  expect(rows.length).toBe(3);

  let row = null;

  row = rows[0].querySelectorAll(".square");
  expect(row.length).toBe(3);
  expect(row[0].innerHTML).toBe("");
  expect(row[1].innerHTML).toBe("");
  expect(row[2].innerHTML).toBe("O");

  row = rows[1].querySelectorAll(".square");
  expect(row.length).toBe(3);
  expect(row[0].innerHTML).toBe("");
  expect(row[1].innerHTML).toBe("X");
  expect(row[2].innerHTML).toBe("");

  row = rows[2].querySelectorAll(".square");
  expect(row.length).toBe(3);
  expect(row[0].innerHTML).toBe("");
  expect(row[1].innerHTML).toBe("");
  expect(row[2].innerHTML).toBe("");
});

it("マスをクリックするとマス番号を処理できること", () => {
  const handleClick = jest.fn();

  act(() => {
    render(
      <Board squares={Array(9).fill(null)} onClick={handleClick} />,
      container
    );
  });

  const squares = document.querySelectorAll(".square");
  expect(squares.length).toBe(9);

  act(() => {
    [...Array(9).keys()].forEach((i) => {
      squares[i].dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
  });

  expect(handleClick).toHaveBeenCalledTimes(9);
  [...Array(9).keys()].forEach((i) => {
    expect(handleClick).toHaveBeenNthCalledWith(i + 1, i);
  });
});
