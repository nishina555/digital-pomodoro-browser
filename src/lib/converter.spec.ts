import {
  calculatePassedSecondsFromStartToCurrent,
  convertToDisplayTime,
  convertToMinutesAndSeconds,
} from "./converter";

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

describe("calculatePassedSecondsFromStartToCurrent", () => {
  describe("current time is larger than startFromSeconds", () => {
    test("current time is 11:30:00", () => {
      const currentTime = new Date();
      currentTime.setHours(11, 30, 0); // 11:30
      const startFromSeconds = 10 * 60; // xx:10

      const result = calculatePassedSecondsFromStartToCurrent(
        currentTime,
        startFromSeconds,
      );
      expect(result).toBe(20 * 60); // should pass 20 minutes
    });
  });
  describe("current time is smaller tham startFromSeconds", () => {
    test("current time is 09:00:00 (previous day)", () => {
      const currentTime = new Date();
      currentTime.setHours(9, 0, 0); // 09:00
      const startFromSeconds = 10 * 60; // xx:10

      const result = calculatePassedSecondsFromStartToCurrent(
        currentTime,
        startFromSeconds,
      );
      expect(result).toBe(50 * 60); // eaquls to pass 50 minutes
    });
  });
});
