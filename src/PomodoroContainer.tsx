import { useEffect, useMemo, useReducer } from "react";
import {
  calculateInitialPeriodRemainingTime,
  convertToMinutesAndSeconds,
} from "./lib/converter";
import { Pomodoro, Session, SessionType, Theme } from "./Pomodoro";

type PomodoroReducerPayload = {
  workTime: number;
  breakTime: number;
};

type PomodoroState = {
  session: SessionType;
  remainingTime: number;
};

const getUrlParamsWithDefaults = (locationSearch: string) => {
  const urlParams = new URLSearchParams(locationSearch);
  const workTime = parseInt(urlParams.get("work") || "25") * 60;
  const breakTime = parseInt(urlParams.get("break") || "5") * 60;
  const startFrom = parseInt(urlParams.get("startFrom") || "0") * 60;
  const theme = getTheme(urlParams.get("theme"));
  const opacity = getOpacity(urlParams.get("opacity"));
  const displayState = urlParams.get("displayState") === "1";
  return { workTime, breakTime, startFrom, theme, opacity, displayState };
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

const calculateInitialSessionAndRemainingTime = (
  workTime: number,
  breakTime: number,
  startFrom: number,
) => {
  const initialPeriodRemainingTime = calculateInitialPeriodRemainingTime(
    startFrom,
    workTime,
    breakTime,
  );

  // 前提: initialPeriod(初期表示のピリオド)が完了したら、Workになる。
  if (initialPeriodRemainingTime - breakTime < 0) {
    // 初期ピリオドの残り時間がBreakよりも短い = 現在はBreak中
    return {
      session: Session.Break,
      remainingTime: initialPeriodRemainingTime,
    };
  } else {
    // 初期ピリオドの残り時間がBreakよりも長い = 現在はWork中
    // Workの残り時間は、初期ピリオドの残り時間からBreakの時間をひいた値
    return {
      session: Session.Work,
      remainingTime: initialPeriodRemainingTime - breakTime,
    };
  }
};

const pomodoroReducer = (
  state: PomodoroState,
  payload: PomodoroReducerPayload,
) => {
  const { workTime, breakTime } = payload;
  const nextRemainingTime = state.remainingTime - 1;
  if (nextRemainingTime < 0) {
    if (state.session === Session.Waiting || state.session === Session.Break) {
      return { session: Session.Work, remainingTime: workTime - 1 };
    } else if (state.session === Session.Work) {
      return { session: Session.Break, remainingTime: breakTime - 1 };
    }
  }
  return { ...state, remainingTime: nextRemainingTime };
};

export const PomodoroContainer = () => {
  const locationSearch = window.location.search;
  const { workTime, breakTime, startFrom, theme, opacity, displayState } =
    getUrlParamsWithDefaults(locationSearch);

  const [pomodoroState, dispatch] = useReducer(
    pomodoroReducer,
    calculateInitialSessionAndRemainingTime(workTime, breakTime, startFrom),
  );

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
      session={pomodoroState.session}
      theme={theme}
      minutes={minutes}
      seconds={seconds}
      displayState={displayState}
    />
  );
};
