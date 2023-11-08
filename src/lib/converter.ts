export const calculateLeftSecondsFromCurrentToStart = (
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

export const calculateInitialPeriodRemainingSeconds = (
  startFrom: number,
  workSeconds: number,
  breakSeconds: number,
) => {
  const leftSecondsFromCurrentToStart = calculateLeftSecondsFromCurrentToStart(
    new Date(),
    startFrom,
  );
  const periodSeconds = workSeconds + breakSeconds;
  return leftSecondsFromCurrentToStart % periodSeconds;
};

export const convertToDisplayTime = (
  minutes: number,
  seconds: number,
): string =>
  `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

export const convertToMinutesAndSeconds = (remainingTime: number) => {
  const minutes = Math.floor(Math.max(0, remainingTime) / 60);
  const seconds = Math.max(0, remainingTime) % 60;
  return { minutes, seconds };
};
