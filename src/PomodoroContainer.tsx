import { useEffect, useReducer } from "react";
import "./Pomodoro.css";
import {
  calculateInitialRemainingTime,
  convertToMinutesAndSeconds,
} from "./lib/converter";
import { Pomodoro, TimerState, TimerStateType, Theme } from "./Pomodoro";

type PomodoroReducerPayload = {
  workTime: number;
  breakTime: number;
};

type PomodoroState = {
  timerState: TimerStateType;
  remainingTime: number;
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

export const PomodoroContainer = () => {
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
    <Pomodoro
      opacity={opacity}
      timerState={pomodoroState.timerState}
      theme={theme}
      minutes={minutes}
      seconds={seconds}
    />
  );
};
