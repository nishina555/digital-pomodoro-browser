export const calculateLeftTimeFromCurrentToStart = (
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

export const calculateInitialPeriodRemainingTime = (
  startFrom: number,
  workTime: number,
  breakTime: number,
) => {
  const leftSecondsFromCurrentToStart = calculateLeftTimeFromCurrentToStart(
    new Date(),
    startFrom,
  );
  const periodMinutes = workTime + breakTime;
  // const periodSeconds = workTime + breakTime
  return leftSecondsFromCurrentToStart % periodMinutes;
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
