import { FormEvent, PropsWithChildren, RefObject, createContext, useContext, useRef, useState } from "react";
import { Board } from "../lib/tictactoe/Board";
import { GameInfo } from "../lib/tictactoe/GameInfo";
import {
  calculateNextValue,
  calculateStatus,
  calculateWinner,
  getDefaultSquares,
  NonNullableUserNames,
  SquareValue,
  UserNames,
} from "../lib/tictactoe/helpers";

type UserNameFormProps = {
  onUserNamesSubmitted: (userNames: NonNullableUserNames) => void;
};

type UseUserNamesFormReturnType = {
  userXRef: RefObject<HTMLInputElement>;
  userORef: RefObject<HTMLInputElement>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

// 🦁 Supprime les props et utilise notre context pour récupérer les valeurs


const useUserNamesForm = (): UseUserNamesFormReturnType => {
const {setUserNames} = useGame()

  const userXRef = useRef<HTMLInputElement>(null);
  const userORef = useRef<HTMLInputElement>(null);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const userX = userXRef.current?.value;
    const userO = userORef.current?.value;
    if (!userX || !userO) {
      return;
    }

    setUserNames({ X: userX, O: userO });
  };

  return {
    userXRef,
    userORef,
    onSubmit,
  };
};

const UserNameForm = () => {
  const { userXRef, userORef, onSubmit } = useUserNamesForm();

  return (
    <form onSubmit={onSubmit} className="vertical-stack">
      <h3>Put players usernames</h3>
      <label htmlFor="user1">User X</label>
      <input id="user1" ref={userXRef} required minLength={2} />
      <label htmlFor="user2">User O</label>
      <input id="user2" ref={userORef} required minLength={2} />
      <button type="submit">Submit</button>
    </form>
  );
};

type UseGameReturnType = {
  squares: SquareValue[];
  xUserName: string | null;
  oUserName: string | null;
  status: string;
  setUserNames: (userNames: UserNames) => void;
  onSquareClick: (index: number) => void;
  winner?: string | null;
  winningSquares?: number[];
};

// 🦁 Utilise le type ci-dessus pour créer un context qui est par défaut à `null`
const GameContext = createContext<UseGameReturnType | null>(null);
// 🦁 Refactor useGame pour qu'il devienne `GameProvider`
// Il doit prendre en paramètre un children
// Il doit retourner le contexte créé plus haut avec le children

const GameProvider = ({ children }: PropsWithChildren) => {
  const [squares, setSquares] = useState<SquareValue[]>(() => getDefaultSquares());
  const [userNames, setUserNames] = useState<UserNames>({
    X: "Player X",
    O: "Player O",
  });

  const nextValue = calculateNextValue(squares);

  const xUserName = userNames.X;
  const oUserName = userNames.O;

  const {winner, winningSquares } = calculateWinner(squares);

  const status = calculateStatus(
    squares,
    `${userNames[nextValue]}'s turn (${nextValue})`,
    winner ? userNames[winner] : winner
  );

  const onSquareClick = (index: number) => {
    if (squares[index] || index < 0 || index > squares.length - 1) {
      return;
    }
    if (winner) {
      return;
    }
    const newSquares = [...squares];
    newSquares[index] = nextValue;
    setSquares(newSquares);
  }

  const value = {
    squares,
    xUserName,
    oUserName,
    status,
    setUserNames,
    onSquareClick,
    winner,
    winningSquares
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

// 🦁 Créer la fonction `useGame` qui retourne le contexte créé plus haut et qui vérifie qu'il n'est pas `null`
// Si c'est le cas, on throw une error

const useGame = (): UseGameReturnType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
const Game = () => {
  const { squares, xUserName, oUserName, status, onSquareClick, winner, winningSquares } = useGame();

  if (!xUserName || !oUserName) {
    return (
      <UserNameForm
        // onUserNamesSubmitted={(userNames) => {
        //   setUserNames(userNames);
        // }}
      />
    );
  }

  return (
    <div className="game">
      <GameInfo
        status={status}
        userNames={{
          X: xUserName,
          O: oUserName,
        }}
      />
      <Board squares={squares} onClick={onSquareClick} winningSquares={winningSquares} />
    </div>
  );
};

export default function App() {
  return (
    // 🦁 Wrap notre composant avec le context
    <div>
      <h2>TicTacToe</h2>
      <GameProvider>
        <Game />
      </GameProvider>
    </div>
  );
}
