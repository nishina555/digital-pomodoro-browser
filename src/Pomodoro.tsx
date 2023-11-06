import { useEffect, useReducer } from "react";
import "./Pomodoro.css";
import {
  calculateInitialRemainingTime,
  convertToDisplayTime,
  convertToMinutesAndSeconds,
} from "./lib/converter";
import { css } from "@emotion/react";

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
    <div css={AppStyle}>
      <h1
        data-testid={"display-text"}
        id="display-text"
        css={TextStyle(pomodoroState.timerState)}
      >
        {getDisplayText(pomodoroState.timerState, minutes, seconds)}
      </h1>
    </div>
  );
};

const AppStyle = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
});

const getColorByTimerState = (timerState: TimerState) => {
  const colorMap = {
    [TimerState.Break]: "green",
    [TimerState.Work]: "red",
    [TimerState.Waiting]: "initial",
  };

  return colorMap[timerState];
};

const TextStyle = (timerState: TimerState) =>
  css({
    color: getColorByTimerState(timerState),
  });
