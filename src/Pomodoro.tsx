import { FC } from "react";
import { convertToDisplayTime } from "./lib/converter";
import { css } from "@emotion/react";

export const TimerState = {
  Waiting: "waiting",
  Work: "work",
  Break: "break",
} as const;

export type TimerStateType = "waiting" | "work" | "break";

export const Theme = {
  Dark: "dark",
  Light: "light",
} as const;

export type ThemeType = "dark" | "light";

type Props = {
  opacity: number;
  timerState: TimerStateType;
  theme: ThemeType;
  minutes: number;
  seconds: number;
};

const getStatusText = (timerState: TimerStateType) => {
  switch (timerState) {
    case TimerState.Waiting:
      return `Will start in`;
    case TimerState.Break:
      return `Break`;
    case TimerState.Work:
      return `Work`;
    default:
      return "";
  }
};

export const Pomodoro: FC<Props> = ({
  opacity,
  timerState,
  theme,
  minutes,
  seconds,
}) => {
  return (
    <div data-testid={"display-app"} css={AppStyle(opacity, theme)}>
      <div data-testid={"display-text"} css={TextStyle(timerState, theme)}>
        <div data-testid={"display-timer-state"} css={TimerStateStyle(theme)}>
          {getStatusText(timerState)}
        </div>
        <div data-testid={"display-timer"} css={TimeStyle(theme)}>
          {convertToDisplayTime(minutes, seconds)}
        </div>
      </div>
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

const getColorByTimerState = (timerState: TimerStateType, theme: ThemeType) => {
  const colorMap = {
    [TimerState.Break]: "green",
    [TimerState.Work]: "red",
    [TimerState.Waiting]: theme === Theme.Light ? "initial" : "white",
  };

  return colorMap[timerState];
};

const TimerStateStyle = (theme: ThemeType) =>
  css({
    fontSize: "15vw",
    WebkitTextStroke: theme === Theme.Dark ? "0.15vw white" : "0.15vw black",
  });

const TimeStyle = (theme: ThemeType) =>
  css({
    fontSize: "30vw",
    WebkitTextStroke: theme === Theme.Dark ? "0.25vw white" : "0.25vw black",
  });

const TextStyle = (timerState: TimerStateType, theme: ThemeType) =>
  css({
    color: getColorByTimerState(timerState, theme),
    fontWeight: "bold",
    fontFamily: "Arial",
    textAlign: "center",
  });
