import { useEffect, useMemo, useReducer } from "react";
import {
  calculateInitialPeriodRemainingSeconds,
  convertToMinutesAndSeconds,
} from "./lib/converter";
import { Pomodoro, Session, SessionType, Theme } from "./Pomodoro";

type PomodoroReducerPayload = {
  workSeconds: number;
  breakSeconds: number;
};

type PomodoroState = {
  session: SessionType;
  remainingSeconds: number;
};

const getUrlParamsWithDefaults = (locationSearch: string) => {
  const urlParams = new URLSearchParams(locationSearch);
  const workSeconds = parseInt(urlParams.get("work") || "25") * 60;
  const breakSeconds = parseInt(urlParams.get("break") || "5") * 60;
  const startFromSeconds = parseInt(urlParams.get("startFrom") || "0") * 60;
  const theme = getTheme(urlParams.get("theme"));
  const opacity = getOpacity(urlParams.get("opacity"));
  const displaySession = urlParams.get("displaySession") === "1";
  return {
    workSeconds,
    breakSeconds,
    startFromSeconds,
    theme,
    opacity,
    displaySession,
  };
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

const calculateInitialSessionAndRemainingSeconds = (
  workSeconds: number,
  breakSeconds: number,
  startFrom: number,
  currentTime: Date,
) => {
  const initialPeriodRemainingSeconds = calculateInitialPeriodRemainingSeconds(
    startFrom,
    workSeconds,
    breakSeconds,
    currentTime,
  );
  // 前提: initialPeriod(初期表示のピリオド)が完了したら、Workになる。
  if (initialPeriodRemainingSeconds - breakSeconds < 0) {
    // 初期ピリオドの残り時間がBreakよりも短い = 現在はBreak中
    return {
      session: Session.Break,
      remainingSeconds: initialPeriodRemainingSeconds,
    };
  } else {
    // 初期ピリオドの残り時間がBreakよりも長い = 現在はWork中
    // Workの残り時間は、初期ピリオドの残り時間からBreakの時間をひいた値
    return {
      session: Session.Work,
      remainingSeconds: initialPeriodRemainingSeconds - breakSeconds,
    };
  }
};

const pomodoroReducer = (
  state: PomodoroState,
  payload: PomodoroReducerPayload,
) => {
  const { workSeconds, breakSeconds } = payload;
  const nextRemainingTime = state.remainingSeconds - 1;
  if (nextRemainingTime < 0) {
    if (state.session === Session.Break) {
      return { session: Session.Work, remainingSeconds: workSeconds - 1 };
    } else if (state.session === Session.Work) {
      return { session: Session.Break, remainingSeconds: breakSeconds - 1 };
    }
  }
  return { ...state, remainingSeconds: nextRemainingTime };
};

export const PomodoroContainer = () => {
  const locationSearch = window.location.search;
  const {
    workSeconds,
    breakSeconds,
    startFromSeconds,
    theme,
    opacity,
    displaySession,
  } = getUrlParamsWithDefaults(locationSearch);

  const initialSessionAndRemainingTime = useMemo(
    () =>
      calculateInitialSessionAndRemainingSeconds(
        workSeconds,
        breakSeconds,
        startFromSeconds,
        new Date(),
      ),
    [workSeconds, breakSeconds, startFromSeconds],
  );

  const [pomodoroState, dispatch] = useReducer(
    pomodoroReducer,
    initialSessionAndRemainingTime,
  );

  useEffect(() => {
    const interval = setInterval(
      () => dispatch({ workSeconds, breakSeconds }),
      1000,
    );
    return () => clearInterval(interval);
  }, [workSeconds, breakSeconds, locationSearch]);

  const { minutes, seconds } = convertToMinutesAndSeconds(
    pomodoroState.remainingSeconds,
  );

  return (
    <Pomodoro
      opacity={opacity}
      session={pomodoroState.session}
      theme={theme}
      minutes={minutes}
      seconds={seconds}
      displaySession={displaySession}
    />
  );
};
