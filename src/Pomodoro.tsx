import { FC } from "react";
import { convertToDisplayTime } from "./lib/converter";
import { css } from "@emotion/react";

export const Session = {
  Work: "work",
  Break: "break",
} as const;

export type SessionType = "work" | "break";

export const Theme = {
  Dark: "dark",
  Light: "light",
} as const;

export type ThemeType = "dark" | "light";

type Props = {
  opacity: number;
  session: SessionType;
  theme: ThemeType;
  minutes: number;
  seconds: number;
  displaySession: boolean;
};

const getStatusText = (session: SessionType, displaySession: boolean) => {
  switch (session) {
    case Session.Break:
      return displaySession ? `Break` : "";
    case Session.Work:
      return displaySession ? `Work` : "";
    default:
      return "";
  }
};

export const Pomodoro: FC<Props> = ({
  opacity,
  session,
  theme,
  minutes,
  seconds,
  displaySession,
}) => {
  return (
    <div data-testid={"display-app"} css={AppStyle(opacity, theme)}>
      <div css={TextStyle(session)}>
        <div data-testid={"display-timer-session"} css={SessionStyle(theme)}>
          {getStatusText(session, displaySession)}
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

const getColorBySession = (session: SessionType) => {
  const colorMap = {
    [Session.Break]: "green",
    [Session.Work]: "red",
  };

  return colorMap[session];
};

const SessionStyle = (theme: ThemeType) =>
  css({
    fontSize: "15vw",
    WebkitTextStroke: theme === Theme.Dark ? "0.15vw white" : "0.15vw black",
  });

const TimeStyle = (theme: ThemeType) =>
  css({
    fontSize: "30vw",
    WebkitTextStroke: theme === Theme.Dark ? "0.25vw white" : "0.25vw black",
  });

const TextStyle = (session: SessionType) =>
  css({
    color: getColorBySession(session),
    fontWeight: "bold",
    fontFamily: "Arial",
    textAlign: "center",
  });
