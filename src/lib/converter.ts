export const convertToSeconds = (timeDigits: string) => {
  const digits = parseInt(timeDigits);
  const hours = Math.floor(digits / 100);
  const minutes = digits % 100;
  const totalSeconds = (hours * 60 + minutes) * 60;
  return totalSeconds;
};

export const calculateLeftSecondsFromCurrentToStart = (
  currentTime: Date,
  startFromSeconds: number,
) => {
  const currentSecondsSinceStartOfHour =
    currentTime.getMinutes() * 60 + currentTime.getSeconds();
  const secondsUntilStartFrom =
    startFromSeconds - currentSecondsSinceStartOfHour;
  return secondsUntilStartFrom < 0
    ? secondsUntilStartFrom + 3600
    : secondsUntilStartFrom;
};

export const calculatePassedSecondsFromStartToCurrent = (
  currentTime: Date,
  startFromSeconds: number,
) => {
  const currentSeconds =
    currentTime.getHours() * 3600 +
    currentTime.getMinutes() * 60 +
    currentTime.getSeconds();
  const passedSeconds = currentSeconds - startFromSeconds;
  if (passedSeconds > 0) {
    return passedSeconds;
  } else {
    return passedSeconds + 60 * 60 * 24;
  }
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

// For debugging
// const formatTimeFromSeconds = (totalSeconds: number) => {
//   const hours = Math.floor(totalSeconds / 3600);
//   const minutes = Math.floor((totalSeconds % 3600) / 60);
//   const seconds = totalSeconds % 60;

//   const formattedTime = [hours, minutes, seconds]
//       .map(unit => unit < 10 ? `0${unit}` : `${unit}`)
//       .join(':');

//   return formattedTime;
// }
