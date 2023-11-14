import { useEffect, useReducer } from "react";
import { convertToMinutesAndSeconds } from "./lib/converter";
import { Pomodoro, Theme } from "./Pomodoro";
import {
  calculateCurrrentSessionAndRemainingSeconds,
  pomodoroReducer,
} from "./pomodoroReducer";

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

  const [pomodoroState, dispatch] = useReducer(
    pomodoroReducer,
    calculateCurrrentSessionAndRemainingSeconds(
      workSeconds,
      breakSeconds,
      startFromSeconds,
    ),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ workSeconds, breakSeconds, startFromSeconds });
    }, 1000);
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
