import { useEffect, useRef, useState } from "react";
import "./App.css";
import { wordList } from "./words";

const keyboard = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  [">", "Z", "X", "C", "V", "B", "N", "M", "<"],
];

function App() {
  const [word, setWord] = useState(
    wordList[Math.floor(Math.random() * 5757)].toUpperCase()
  );
  const [tiles, setTiles] = useState([
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
  ]);

  const [status, setStatus] = useState([
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
  ]);

  const [letterStatus, setLetterStatus] = useState([
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
  ]);

  const [notificationText, setNotificationText] = useState("");

  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  const [currentPosition, setCurrentPosition] = useState<{
    key: string;
    index: number;
  }>({ key: "", index: -1 });

  const positionRef = useRef<{
    key: string;
    index: number;
  }>({ key: "", index: -1 });
  const wordRef = useRef<number>(0);
  const letterStatusRef = useRef<string[]>([
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
  ]);

  const detectKeydown = (e: KeyboardEvent) => {
    if (e.repeat) return;

    const input = e.key.toUpperCase();
    if (
      input.length === 1 &&
      input.charCodeAt(0) >= "A".charCodeAt(0) &&
      input.charCodeAt(0) <= "Z".charCodeAt(0)
    ) {
      if (wordRef.current === Math.floor((positionRef.current.index + 1) / 5)) {
        positionRef.current.index++;
        positionRef.current.key = input;
        setCurrentPosition((prev) => {
          return { key: input, index: prev.index + 1 };
        });
      }
    } else if (input === "ENTER") {
      positionRef.current.key = input;
      setCurrentPosition((prev) => {
        return { key: input, index: prev.index };
      });
    } else if (input === "BACKSPACE") {
      if (positionRef.current.index >= wordRef.current * 5) {
        positionRef.current.key = input;
        positionRef.current.index--;
        setCurrentPosition((prev) => {
          if (prev.index >= 0) {
            return { key: input, index: prev.index - 1 };
          } else {
            return prev;
          }
        });
      }
    }
  };

  const resetGame = () => {
    setWord(wordList[Math.floor(Math.random() * 5757)].toUpperCase());
    setTiles([
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
    ]);
    setStatus([
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
    ]);
    setLetterStatus([
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
    ]);
    setNotificationText("");
    setCurrentWordIndex(0);
    setCurrentPosition({ key: "", index: -1 });
    positionRef.current = { key: "", index: -1 };
    wordRef.current = 0;
    letterStatusRef.current = [
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
      ".",
    ];
  };

  useEffect(() => {
    if (currentPosition.key === "BACKSPACE") {
      setTiles((prev) =>
        prev.map((item, index) =>
          index === currentPosition.index + 1 ? "." : item
        )
      );
    } else if (currentPosition.key === "ENTER") {
      if (currentPosition.index % 5 !== 4) {
        setNotificationText("Not enough letters");
        setTimeout(() => setNotificationText(""), 2000);
      } else {
        const startingIndex = currentPosition.index - 4;
        let guess = "";
        for (let i = startingIndex; i <= currentPosition.index; i++) {
          guess += tiles[i];
        }
        if (!wordList.includes(guess.toLowerCase())) {
          setNotificationText("Not in word list");
          setTimeout(() => setNotificationText(""), 2000);
        } else {
          const result: string[] = [".", ".", ".", ".", "."];
          const correctIndex = [];
          const wordLetter = word.split("");
          const mp = new Map();
          for (let i = 0; i < 5; i++) {
            mp.set(wordLetter[i], 0);
          }
          for (let i = 0; i < 5; i++) {
            mp.set(word[i], mp.get(word[i]) + 1);
          }
          let count = 0;
          for (let i = startingIndex; i <= currentPosition.index; i++) {
            if (word[i % 5] === guess[i % 5]) {
              result[i % 5] = "C";
              letterStatusRef.current[
                word[i % 5].charCodeAt(0) - "A".charCodeAt(0)
              ] = "C";
              correctIndex.push(i % 5);
              count++;
            }
          }
          for (let i = startingIndex; i <= currentPosition.index; i++) {
            if (wordLetter.includes(guess[i % 5])) {
              if (!correctIndex.includes(i % 5)) {
                if (mp.get(guess[i % 5]) === 0) {
                  result[i % 5] = "W";
                } else {
                  result[i % 5] = "E";
                  if (
                    letterStatusRef.current[
                      guess[i % 5].charCodeAt(0) - "A".charCodeAt(0)
                    ] !== "C"
                  ) {
                    letterStatusRef.current[
                      guess[i % 5].charCodeAt(0) - "A".charCodeAt(0)
                    ] = "E";
                  }
                  mp.set(guess[i % 5], mp.get(guess[i % 5]) - 1);
                }
              } else {
                mp.set(guess[i % 5], mp.get(guess[i % 5]) - 1);
              }
            } else {
              result[i % 5] = "W";
              letterStatusRef.current[
                guess[i % 5].charCodeAt(0) - "A".charCodeAt(0)
              ] = "W";
            }
          }
          setStatus((prev) =>
            prev.map((item, index) => {
              if (index >= startingIndex && index <= currentPosition.index) {
                return result[index % 5];
              } else {
                return item;
              }
            })
          );
          setLetterStatus(letterStatusRef.current);
          if (count === 5) {
            setNotificationText("you win!");
            setCurrentWordIndex(999);
            wordRef.current = 999;
          } else {
            if (wordRef.current === 5) {
              setNotificationText(`the word is ${word}`);
              setCurrentWordIndex(999);
              wordRef.current = 999;
            } else {
              wordRef.current++;
              setCurrentWordIndex((prev) => prev + 1);
            }
          }
        }
      }
    } else {
      setTiles((prev) =>
        prev.map((item, index) =>
          index === currentPosition.index ? currentPosition.key : item
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPosition]);

  useEffect(() => {
    document.addEventListener("keydown", detectKeydown, true);
  }, []);
  return (
    <div className="App">
      <div className="notification-container">
        {notificationText !== "" && (
          <div className="notification">
            <p>{notificationText}</p>
          </div>
        )}
        {currentWordIndex === 999 && (
          <div className="btn-reload" onClick={resetGame}>
            <p>Play again?</p>
          </div>
        )}
      </div>
      <div className="container">
        <h1 className="title">Junhordle</h1>
        <div className="grid">
          {tiles.map((value, index) => {
            if (value === ".") {
              return <div className="tile"></div>;
            } else {
              if (status[index] === "C") {
                return <div className="tile green">{value}</div>;
              } else if (status[index] === "E") {
                return <div className="tile yellow">{value}</div>;
              } else if (status[index] === "W") {
                return <div className="tile dark">{value}</div>;
              } else {
                return <div className="tile">{value}</div>;
              }
            }
          })}
        </div>
        <div className="keyboard">
          <div className="top">
            {keyboard[0].map((value) => {
              let style = "";
              if (
                letterStatus[value.charCodeAt(0) - "A".charCodeAt(0)] === "C"
              ) {
                style = "btn-keyboard green";
              } else if (
                letterStatus[value.charCodeAt(0) - "A".charCodeAt(0)] === "E"
              ) {
                style = "btn-keyboard yellow";
              } else if (
                letterStatus[value.charCodeAt(0) - "A".charCodeAt(0)] === "W"
              ) {
                style = "btn-keyboard dark";
              } else {
                style = "btn-keyboard";
              }
              return (
                <button
                  className={style}
                  onClick={() => {
                    if (
                      wordRef.current ===
                      Math.floor((positionRef.current.index + 1) / 5)
                    ) {
                      positionRef.current.index++;
                      positionRef.current.key = value;
                      setCurrentPosition((prev) => {
                        return { key: value, index: prev.index + 1 };
                      });
                    }
                  }}
                >
                  {value}
                </button>
              );
            })}
          </div>
          <div className="middle">
            {keyboard[1].map((value) => {
              let style = "";
              if (
                letterStatus[value.charCodeAt(0) - "A".charCodeAt(0)] === "C"
              ) {
                style = "btn-keyboard green";
              } else if (
                letterStatus[value.charCodeAt(0) - "A".charCodeAt(0)] === "E"
              ) {
                style = "btn-keyboard yellow";
              } else if (
                letterStatus[value.charCodeAt(0) - "A".charCodeAt(0)] === "W"
              ) {
                style = "btn-keyboard dark";
              } else {
                style = "btn-keyboard";
              }
              return (
                <button
                  className={style}
                  onClick={() => {
                    if (
                      wordRef.current ===
                      Math.floor((positionRef.current.index + 1) / 5)
                    ) {
                      positionRef.current.index++;
                      positionRef.current.key = value;
                      setCurrentPosition((prev) => {
                        return { key: value, index: prev.index + 1 };
                      });
                    }
                  }}
                >
                  {value}
                </button>
              );
            })}
          </div>
          <div className="bottom">
            {keyboard[2].map((value) => {
              if (value === ">") {
                return (
                  <button
                    className="btn-enter"
                    onClick={() => {
                      positionRef.current.key = "ENTER";
                      setCurrentPosition((prev) => {
                        return { key: "ENTER", index: prev.index };
                      });
                    }}
                  >
                    ENTER
                  </button>
                );
              } else if (value === "<") {
                return (
                  <button
                    className="btn-backspace"
                    onClick={() => {
                      if (positionRef.current.index >= wordRef.current * 5) {
                        positionRef.current.key = "BACKSPACE";
                        positionRef.current.index--;
                        setCurrentPosition((prev) => {
                          if (prev.index >= 0) {
                            return { key: "BACKSPACE", index: prev.index - 1 };
                          } else {
                            return prev;
                          }
                        });
                      }
                    }}
                  >
                    <img
                      className="backspace"
                      width="24"
                      height="24"
                      src="https://img.icons8.com/material-outlined/24/FFFFFF/clear-symbol--v1.png"
                      alt="clear-symbol--v1"
                    />
                  </button>
                );
              } else {
                let style = "";
                if (
                  letterStatus[value.charCodeAt(0) - "A".charCodeAt(0)] === "C"
                ) {
                  style = "btn-keyboard green";
                } else if (
                  letterStatus[value.charCodeAt(0) - "A".charCodeAt(0)] === "E"
                ) {
                  style = "btn-keyboard yellow";
                } else if (
                  letterStatus[value.charCodeAt(0) - "A".charCodeAt(0)] === "W"
                ) {
                  style = "btn-keyboard dark";
                } else {
                  style = "btn-keyboard";
                }
                return (
                  <button
                    className={style}
                    onClick={() => {
                      if (
                        wordRef.current ===
                        Math.floor((positionRef.current.index + 1) / 5)
                      ) {
                        positionRef.current.index++;
                        positionRef.current.key = value;
                        setCurrentPosition((prev) => {
                          return { key: value, index: prev.index + 1 };
                        });
                      }
                    }}
                  >
                    {value}
                  </button>
                );
              }
            })}
          </div>
        </div>
        <div>
          <p className="credit">
            <a href="https://icons8.com/icon/82777/backspace">Backspace</a> icon
            by <a href="https://icons8.com">Icons8</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
