import { useEffect, useReducer } from "react";
import "./Pomodoro.css";

const TimerState = {
  Waiting: "waiting",
  Work: "work",
  Break: "break",
} as const;

type TimerState = "waiting" | "work" | "break";

type PomodoroReducerPayload = {
  workTime: number;
  breakTime: number;
};

type PomodoroState = {
  timerState: TimerState;
  remainingTime: number;
};

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

const pomodoroReducer = (
  state: PomodoroState,
  payload: PomodoroReducerPayload,
) => {
  const { workTime, breakTime } = payload;
  const nextRemainingTime = state.remainingTime - 1;
  if (nextRemainingTime < 0) {
    if (
      state.timerState === TimerState.Waiting ||
      state.timerState === TimerState.Break
    ) {
      return { timerState: TimerState.Work, remainingTime: workTime - 1 };
    } else if (state.timerState === TimerState.Work) {
      return { timerState: TimerState.Break, remainingTime: breakTime - 1 };
    }
  }
  return { ...state, remainingTime: nextRemainingTime };
};

export const Pomodoro = () => {
  const locationSearch = window.location.search;
  const { workTime, breakTime, startFrom } =
    getUrlParamsWithDefaults(locationSearch);

  const [pomodoroState, dispatch] = useReducer(pomodoroReducer, {
    timerState: TimerState.Waiting,
    remainingTime: calculateInitialRemainingTime(new Date(), startFrom),
  });

  useEffect(() => {
    const interval = setInterval(() => dispatch({ workTime, breakTime }), 1000);
    return () => clearInterval(interval);
  }, [workTime, breakTime, locationSearch]);

  const { minutes, seconds } = convertToMinutesAndSeconds(
    pomodoroState.remainingTime,
  );

  return (
    <div className="App">
      <h1 id="display-text" className={pomodoroState.timerState}>
        {getDisplayText(pomodoroState.timerState, minutes, seconds)}
      </h1>
    </div>
  );
};
