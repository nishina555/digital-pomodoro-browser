import {
  calculateLeftSecondsFromCurrentToStart,
  calculatePassedSecondsFromStartToCurrent,
  convertToDisplayTime,
  convertToMinutesAndSeconds,
  convertToSeconds,
} from "./converter";

describe("calculateLeftSecondsFromCurrentToStart", () => {
  it("should calculate the initial remaining time correctly", () => {
    const currentTime = new Date(2021, 0, 1, 12, 30, 30); // 現在時刻 12時30分30秒
    const startFrom = 3000; // 開始時間 = 3.000秒 = 50分 = 12時50分から開始
    const expectedOutput = 1170; // 残り時間 = 12時50分 - 12時30分30秒 = 24分30秒 = 1170秒が期待値

    const result = calculateLeftSecondsFromCurrentToStart(
      currentTime,
      startFrom,
    );

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

describe("convertToSeconds", () => {
  test('converts "0123" to 4980 seconds', () => {
    const timeDigits = "0123";
    const result = convertToSeconds(timeDigits);

    expect(result).toBe(4980);
  });

  test('converts "0500" to 18000 seconds', () => {
    const timeDigits = "0500";
    const result = convertToSeconds(timeDigits);

    expect(result).toBe(18000);
  });

  test('converts "abc" to 3600 seconds (invalid value)', () => {
    const timeDigits = "abc";
    const result = convertToSeconds(timeDigits);

    expect(result).toBe(3600);
  });
});

describe("calculatePassedSecondsFromStartToCurrent", () => {
  describe("current time is larger than startFromSeconds", () => {
    test("current time is 11:30:00", () => {
      const currentTime = new Date();
      currentTime.setHours(11, 30, 0);
      const startFromSeconds = 10 * 3600; // 10:00:00

      const result = calculatePassedSecondsFromStartToCurrent(
        currentTime,
        startFromSeconds,
      );
      expect(result).toBe(1 * 3600 + 30 * 60); // 1時間30分経過しているはず
    });
  });
  describe("current time is smaller tham startFromSeconds", () => {
    test("current time is 09:00:00 (previous day)", () => {
      const currentTime = new Date();
      currentTime.setHours(9, 0, 0);
      const startFromSeconds = 10 * 3600; // 10:00:00

      const result = calculatePassedSecondsFromStartToCurrent(
        currentTime,
        startFromSeconds,
      );
      expect(result).toBe((24 - 1) * 3600); // 23時間経過しているはず
    });
  });
});
