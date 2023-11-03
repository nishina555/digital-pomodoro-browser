import { useCallback, useEffect, useState } from "react";
import "./Pomodoro.css";

const TimerState = {
  Waiting: "waiting",
  Work: "work",
  Break: "break",
} as const;

type TimerState = "waiting" | "work" | "break";

const calculateInitialRemainingTime = (
  currentTime: Date,
  startFrom: number,
) => {
  const currentSecondsSinceStartOfHour =
    currentTime.getMinutes() * 60 + currentTime.getSeconds();
  const secondsUntilStartFrom = startFrom - currentSecondsSinceStartOfHour;
  return secondsUntilStartFrom < 0
    ? secondsUntilStartFrom + 3600
    : secondsUntilStartFrom;
};

const convertToDisplayTime = (minutes: number, seconds: number): string =>
  `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

const convertToMinutesAndSeconds = (remainingTime: number) => {
  const minutes = Math.floor(Math.max(0, remainingTime) / 60);
  const seconds = Math.max(0, remainingTime) % 60;
  return { minutes, seconds };
};

const getStatusText = (timerState: TimerState) => {
  switch (timerState) {
    case TimerState.Waiting:
      return `Pomodoro will start in`;
    case TimerState.Break:
      return `Break:`;
    case TimerState.Work:
      return `Work:`;
    default:
      return "";
  }
};

const getDisplayText = (
  timerState: TimerState,
  minutes: number,
  seconds: number,
): string => {
  const time = convertToDisplayTime(minutes, seconds);
  const statusText = getStatusText(timerState);
  return `${statusText} ${time}`;
};

const getUrlParamsWithDefaults = (locationSearch: string) => {
  const urlParams = new URLSearchParams(locationSearch);
  const workTime = parseInt(urlParams.get("work") || "25") * 60;
  const breakTime = parseInt(urlParams.get("break") || "5") * 60;
  const startFrom = parseInt(urlParams.get("startFrom") || "0") * 60;

  return { workTime, breakTime, startFrom };
};

export const Pomodoro = () => {
  const { workTime, breakTime, startFrom } = getUrlParamsWithDefaults(
    window.location.search,
  );

  const [timerState, setTimerState] = useState<TimerState>(TimerState.Waiting);
  const [remainingTime, setRemainingTime] = useState(
    calculateInitialRemainingTime(new Date(), startFrom),
  );

  const handleSetRemainingTime = useCallback(
    (prevRemainingTime: number) => {
      let nextRemainingTime = prevRemainingTime - 1;
      if (nextRemainingTime < 0) {
        if (timerState === TimerState.Waiting) {
          setTimerState(TimerState.Work);
          nextRemainingTime = workTime - 1;
        } else if (timerState === TimerState.Work) {
          setTimerState(TimerState.Break);
          nextRemainingTime = breakTime - 1;
        } else if (timerState === TimerState.Break) {
          setTimerState(TimerState.Work);
          nextRemainingTime = workTime - 1;
        }
      }
      return nextRemainingTime;
    },
    [breakTime, timerState, workTime],
  );

  useEffect(() => {
    const tick = setInterval(() => {
      setRemainingTime((prevRemainingTime) =>
        handleSetRemainingTime(prevRemainingTime),
      );
    }, 1000);
    return () => clearInterval(tick);
  }, [handleSetRemainingTime]);

  const { minutes, seconds } = convertToMinutesAndSeconds(remainingTime);

  return (
    <div className="App">
      <h1 id="display-text" className={timerState}>
        {getDisplayText(timerState, minutes, seconds)}
      </h1>
    </div>
  );
};
