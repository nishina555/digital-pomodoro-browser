export const TimerState = {
  Waiting: "waiting",
  Work: "work",
  Break: "break",
} as const;

export type TimerState = "waiting" | "work" | "break";

export const calculateInitialRemainingTime = (
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

export const convertToMinutesAndSeconds = (remainingTime: number) => {
  const minutes = Math.floor(Math.max(0, remainingTime) / 60);
  const seconds = Math.max(0, remainingTime) % 60;
  return { minutes, seconds };
};

const getStatusText = (timerState: TimerState) => {
  if (timerState === TimerState.Waiting) {
    return `Pomodoro will start in`;
  } else if (timerState === TimerState.Break) {
    return `Break:`;
  } else if (timerState === TimerState.Work) {
    return `Work:`;
  } else {
    return "";
  }
};

export const getDisplayText = (
  timerState: TimerState,
  minutes: number,
  seconds: number,
): string => {
  const time = convertToDisplayTime(minutes, seconds);
  const statusText = getStatusText(timerState);
  return `${statusText} ${time}`;
};
