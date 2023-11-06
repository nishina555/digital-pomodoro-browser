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

const Theme = {
  Dark: "dark",
  Light: "light",
} as const;

type ThemeType = "dark" | "light";

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
  const theme = getTheme(urlParams.get("theme"));
  const opacity = getOpacity(urlParams.get("opacity"));
  return { workTime, breakTime, startFrom, theme, opacity };
};

const getTheme = (theme: string | null) => {
  // デフォルトのテーマはlight。
  // リクエストパラメータがlightかdarkの場合はその値を、それ以外の場合はlightを使う。
  if (theme === Theme.Dark) {
    return Theme.Dark;
  }
  return Theme.Light;
};

const getOpacity = (opacity: string | null) => {
  // opacityのデフォルトは1（不透過）。
  // opacityは0から1の間の値を取る。リクエストパラメータが0未満の場合は0、1より大きい場合は1にする。
  return Math.max(0, Math.min(1, parseFloat(opacity || "1")));
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
  const { workTime, breakTime, startFrom, theme, opacity } =
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
    <div css={AppStyle(opacity, theme)}>
      <h1
        data-testid={"display-text"}
        id="display-text"
        css={TextStyle(pomodoroState.timerState, theme)}
      >
        {getDisplayText(pomodoroState.timerState, minutes, seconds)}
      </h1>
    </div>
  );
};

const AppStyle = (opacity: number, theme: ThemeType) =>
  css({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor:
      theme === Theme.Light
        ? `rgba(255, 255, 255, ${opacity})`
        : `rgba(0, 0, 0, ${opacity})`,
  });

const getColorByTimerState = (timerState: TimerState, theme: ThemeType) => {
  const colorMap = {
    [TimerState.Break]: "green",
    [TimerState.Work]: "red",
    [TimerState.Waiting]: theme === Theme.Light ? "initial" : "white",
  };

  return colorMap[timerState];
};

const TextStyle = (timerState: TimerState, theme: ThemeType) =>
  css({
    color: getColorByTimerState(timerState, theme),
  });
