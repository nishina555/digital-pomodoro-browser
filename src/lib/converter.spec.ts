import {
  calculateInitialRemainingTime,
  convertToDisplayTime,
  convertToMinutesAndSeconds,
} from "./converter"; // Replace 'your_file' with the actual file name

describe("calculateInitialRemainingTime", () => {
  it("should calculate the initial remaining time correctly", () => {
    const currentTime = new Date(2021, 0, 1, 12, 30, 30); // 現在時刻 12時30分30秒
    const startFrom = 3000; // 開始時間 = 3.000秒 = 50分 = 12時50分から開始
    const expectedOutput = 1170; // 残り時間 = 12時50分 - 12時30分30秒 = 24分30秒 = 1170秒が期待値

    const result = calculateInitialRemainingTime(currentTime, startFrom);

    expect(result).toEqual(expectedOutput);
  });
});

describe("convertToDisplayTime", () => {
  it("should convert time to correct display format", () => {
    const minutes = 7;
    const seconds = 5;
    const expectedOutput = "07:05";

    const result = convertToDisplayTime(minutes, seconds);

    expect(result).toEqual(expectedOutput);
  });
});

describe("convertToMinutesAndSeconds", () => {
  it("should convert remaining time to minutes and seconds", () => {
    const remainingTime = 660;
    const expectedOutput = { minutes: 11, seconds: 0 };

    const result = convertToMinutesAndSeconds(remainingTime);

    expect(result).toEqual(expectedOutput);
  });
});
