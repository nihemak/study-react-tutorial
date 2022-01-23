import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Game from "./Game";
import MockedBoard from "./Board";

jest.mock("./Board", () => {
  return function DummyBoard(props) {
    return (
      <div>
        {[...Array(9).keys()].map((i) => (
          <div
            className="square"
            key={i.toString()}
            onClick={() => props.onClick(i)}
          >
            {props.squares[i]}
          </div>
        ))}
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
  act(() => {
    render(<Game />, container);
  });

  const status = document.querySelector(".game-info div");
  expect(status.innerHTML).toBe("Next player: X");

  const squares = document.querySelectorAll(".square");
  expect(squares.length).toBe(9);

  squares.forEach((square) => {
    expect(square.innerHTML).toBe("");
  });
});

it("ゲームできること", () => {
  act(() => {
    render(<Game />, container);
  });

  const status = document.querySelector(".game-info div");
  const squares = document.querySelectorAll(".square");

  [
    {
      putIndex: 1,
      resultStatus: "Next player: O",
      resultBoard: ["", "X", "", "", "", "", "", "", ""],
    },
    {
      // クリック済みの場合は結果が変わらない
      putIndex: 1,
      resultStatus: "Next player: O",
      resultBoard: ["", "X", "", "", "", "", "", "", ""],
    },
    {
      putIndex: 0,
      resultStatus: "Next player: X",
      resultBoard: ["O", "X", "", "", "", "", "", "", ""],
    },
    {
      putIndex: 4,
      resultStatus: "Next player: O",
      resultBoard: ["O", "X", "", "", "X", "", "", "", ""],
    },
    {
      putIndex: 8,
      resultStatus: "Next player: X",
      resultBoard: ["O", "X", "", "", "X", "", "", "", "O"],
    },
    {
      putIndex: 7,
      resultStatus: "Winner: X",
      resultBoard: ["O", "X", "", "", "X", "", "", "X", "O"],
    },
    {
      // 勝敗が決まったら結果が変わらない
      putIndex: 2,
      resultStatus: "Winner: X",
      resultBoard: ["O", "X", "", "", "X", "", "", "X", "O"],
    },
  ].forEach(({ putIndex, resultStatus, resultBoard }) => {
    act(() => {
      squares[putIndex].dispatchEvent(
        new MouseEvent("click", { bubbles: true })
      );
    });

    expect(status.innerHTML).toBe(resultStatus);
    squares.forEach((square, index) => {
      expect(square.innerHTML).toBe(resultBoard[index]);
    });
  });
});

it("タイムトラベルできること", () => {
  act(() => {
    render(<Game />, container);
  });

  let moves = document.querySelectorAll(".game-info ol li button");
  const squares = document.querySelectorAll(".square");

  expect(moves.length).toBe(1);
  expect(moves[0].innerHTML).toBe("Go to game start");

  [0, 1, 3, 8, 7].forEach((putIndex) => {
    act(() => {
      squares[putIndex].dispatchEvent(
        new MouseEvent("click", { bubbles: true })
      );
    });
  });

  let resultBoard = ["X", "O", "", "X", "", "", "", "X", "O"];
  squares.forEach((square, index) => {
    expect(square.innerHTML).toBe(resultBoard[index]);
  });

  let status = document.querySelector(".game-info div");
  expect(status.innerHTML).toBe("Next player: O");

  moves = document.querySelectorAll(".game-info ol li button");

  const resultMoves = [
    "Go to game start",
    "Go to move #1",
    "Go to move #2",
    "Go to move #3",
    "Go to move #4",
    "Go to move #5",
  ];
  expect(moves.length).toBe(resultMoves.length);
  moves.forEach((move, index) => {
    expect(move.innerHTML).toBe(resultMoves[index]);
  });

  // タイムトラベル実施
  act(() => {
    moves[2].dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

  resultBoard = ["X", "O", "", "", "", "", "", "", ""];
  squares.forEach((square, index) => {
    expect(square.innerHTML).toBe(resultBoard[index]);
  });

  status = document.querySelector(".game-info div");
  expect(status.innerHTML).toBe("Next player: X");
});
