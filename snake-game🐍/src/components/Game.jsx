import React, { useState, useEffect } from "react";
import Snake from "./Snake";
import Food from "./Food";

const Game = () => {
  const [snakeDots, setSnakeDots] = useState([[0, 0]]);
  const [foodDot, setFoodDot] = useState([6, 8]);
  const [direction, setDirection] = useState("RIGHT");
  const [speed, setSpeed] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === " ") {
        // Se la barra spaziatrice viene premuta, inverte lo stato di pausa
        setIsPaused(!isPaused);
      } else if (!isPaused) {
        // Ignora i comandi direzionali quando il gioco è in pausa
        switch (e.key) {
          case "ArrowUp":
            setDirection("UP");
            break;
          case "ArrowDown":
            setDirection("DOWN");
            break;
          case "ArrowLeft":
            setDirection("LEFT");
            break;
          case "ArrowRight":
            setDirection("RIGHT");
            break;
          default:
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [isPaused]);
  useEffect(() => {
    // Aggiungi un timeout per far ripartire il gioco dopo un certo periodo
    if (isGameOver) {
      const timeoutId = setTimeout(() => {
        resetGame();
        setIsGameOver(false);
      }, 1000); // Riparte dopo 3 secondi (puoi cambiare il periodo come preferisci)

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [isGameOver]);

  useEffect(() => {
    let moveSnake;

    if (!isPaused) {
      moveSnake = setInterval(() => {
        moveSnakeHandler();
      }, speed);
    }

    return () => {
      clearInterval(moveSnake);
    };
  }, [snakeDots, direction, speed, isPaused]);

  const getRandomCoordinates = () => {
    let min = 1;
    let max = 98;
    let x = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
    let y = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
    return [x, y];
  };

  const checkCollision = () => {
    let snake = [...snakeDots];
    let head = snake[snake.length - 1];
    snake.pop();
    if (head[0] >= 100 || head[0] < 0 || head[1] >= 100 || head[1] < 0) {
      setIsGameOver(true); // Imposta il Game Over su true
      // Aggiungi la classe CSS "paused" per fermare il serpente
      setIsPaused(true);

      // Imposta un timeout per riavviare il gioco dopo 2 secondi
      setTimeout(() => {
        resetGame();
        setIsGameOver(false);

        // Rimuovi la classe CSS "paused" per far ripartire il serpente
        setIsPaused(false);
      }, 1000);
      return;
    }
    snake.forEach((dot) => {
      if (head[0] === dot[0] && head[1] === dot[1]) {
        resetGame();
      }
    });
  };

  const resetGame = () => {
    setSnakeDots([[0, 0]]);
    setFoodDot(getRandomCoordinates());
    setDirection("RIGHT");
    setSpeed(100);
  };

  const moveSnakeHandler = () => {
    let dots = [...snakeDots];
    let head = dots[dots.length - 1];

    switch (direction) {
      case "RIGHT":
        head = [head[0] + 2, head[1]];
        break;
      case "LEFT":
        head = [head[0] - 2, head[1]];
        break;
      case "DOWN":
        head = [head[0], head[1] + 2];
        break;
      case "UP":
        head = [head[0], head[1] - 2];
        break;
      default:
        break;
    }

    dots.push(head);
    dots.shift();
    setSnakeDots(dots);
    checkCollision();
    checkFoodCollision();
  };

  const checkFoodCollision = () => {
    let head = snakeDots[snakeDots.length - 1];
    let food = foodDot;
    if (head[0] === food[0] && head[1] === food[1]) {
      let newFood = getRandomCoordinates();
      setFoodDot(newFood);
      increaseSpeed();
      enlargeSnake();
    }
  };

  const increaseSpeed = () => {
    if (speed > 3) {
      // Calcola la nuova velocità in base alla lunghezza del serpente
      const newSpeed = Math.max(3, speed - snakeDots.length / 12);
      setSpeed(newSpeed);
    }
  };

  const enlargeSnake = () => {
    let newSnake = [...snakeDots];
    newSnake.unshift([]);
    setSnakeDots(newSnake);
  };

  return (
    <div className="game-container " tabIndex="0" style={{ outline: "none" }}>
      {isPaused && <div className="paused-message"></div>}
      {isGameOver && (
        <div className="game-over">
          <p style={{ color: "yellow", fontFamily: "Rubik Pixels" }}>
            Game Over
          </p>
        </div>
      )}
      <Snake snakeDots={snakeDots} />
      <Food foodDot={foodDot} />
    </div>
  );
};

export default Game;
