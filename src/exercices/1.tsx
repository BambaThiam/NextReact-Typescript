/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/prefer-ts-expect-error */
import clsx from "clsx";
import { ComponentPropsWithoutRef } from "react";
import { calculateNextValue, calculateStatus } from "../lib/tictactoe/helpers";

// type SquareProps = any;
type SquareProps = {
  children?: React.ReactNode;
  isWinningSquare?: boolean;
} & ComponentPropsWithoutRef<"button">;

type SquareValue = 'X' | 'O' | null;
type BoardProps = {
  squares: SquareValue[];
  onClick?: (i: number) => void;
  winningSquares?: number[];
};

type statusProps = {
  status: string;
}

const Square = ({ children, isWinningSquare, ...props }: SquareProps ) => {
  return (
    <button
      className={clsx("square", {
        "winning-square": isWinningSquare,
      })} {...props}
    >
      {children}
    </button>
  );
};

const GameInfo = ({ status }: statusProps) => {
  return (
    <div className="game-info">
      <div>{status}</div>
    </div>
  );
  
}

const Board = ({ squares, onClick, winningSquares }: BoardProps) => {
  return <div className="game-board">{
    squares.map((square, index) => (
      <Square
        onClick={() => onClick?.(index)}
        isWinningSquare={winningSquares?.includes(index)}
        key={`square-${index}`}
      >
        {square}
      </Square>
    ))
  }</div>;
}
const Game = () => {
  const getDefaultSquares = (): SquareValue[] => [
    null,
    null,
    null,
    null,
    null,
    null,
    "O",
    null,
    "X",
  ];
  const squares = getDefaultSquares();
  const nextValue = calculateNextValue(squares);
  const status = calculateStatus(squares, nextValue);

  return (
    <div className="game">
      {/* <Board squares={getDefaultSquares()} onClick={i => console.log(i)} winningSquares={[0, 1, 2]} /> */}
      <GameInfo status={status} />
      <Board squares={squares} />
    </div>
  );
};



export default function App() {
  return (
    <div>
      <h2>TicTacToe</h2>
      <Game />
    </div>
  );
}
