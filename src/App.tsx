// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import React, { useEffect, useState } from "react";
import "./App.css";

const App = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const workTime = parseInt(urlParams.get("work") || "25") * 60;
  const breakTime = parseInt(urlParams.get("break") || "5") * 60;
  const startFrom = parseInt(urlParams.get("startFrom") || "0") * 60;

  const calculateInitialRemainingTime = () => {
    const currentTime = new Date();
    const currentSecondsSinceStartOfHour =
      currentTime.getMinutes() * 60 + currentTime.getSeconds();
    const secondsUntilStartFrom = startFrom - currentSecondsSinceStartOfHour;
    return secondsUntilStartFrom < 0
      ? secondsUntilStartFrom + 3600
      : secondsUntilStartFrom;
  };

  const [state, setState] = useState("waiting");
  const [remainingTime, setRemainingTime] = useState(
    calculateInitialRemainingTime(),
  );

  useEffect(() => {
    const tick = setInterval(() => {
      setRemainingTime((prevRemainingTime) => {
        let nextRemainingTime = prevRemainingTime - 1;
        if (nextRemainingTime < 0) {
          if (state === "waiting") {
            setState("work");
            nextRemainingTime = workTime;
          } else if (state === "work") {
            setState("break");
            nextRemainingTime = breakTime;
          } else if (state === "break") {
            setState("work");
            nextRemainingTime = workTime;
          }
        }
        return nextRemainingTime;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, [state, workTime, breakTime]);

  const minutes = Math.floor(Math.max(0, remainingTime) / 60);
  const seconds = Math.max(0, remainingTime) % 60;

  return (
    <div className="App">
      <h1 id="display-text" className={state}>
        {state === "waiting"
          ? `Pomodoro will start in ${minutes
              .toString()
              .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
          : `${state.charAt(0).toUpperCase() + state.slice(1)}: ${minutes
              .toString()
              .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`}
      </h1>
    </div>
  );
};

export default App;
