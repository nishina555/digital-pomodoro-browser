import { Session } from "./Pomodoro";
import {
  calculateCurrrentSessionAndRemainingSeconds,
  pomodoroReducer,
} from "./pomodoroReducer";

describe("calculateCurrrentSessionAndRemainingSeconds", () => {
  const mockDate = new Date(2021, 3, 25, 10, 1, 30);
  beforeAll(() => {
    jest.spyOn(global, "Date").mockImplementation(() => mockDate as any);
  });
  afterAll(() => {
    jest.restoreAllMocks(); // これで元の実装に戻す
  });
  describe("passsedSecondsFromStartToCurrent is smaller then periodSeconds", () => {
    describe("workSeconds is larger than currentSessionPassedSeconds", () => {
      it("should be updated correctly", () => {
        const workSeconds = 1500;
        const breakSeconds = 300;
        const startFromSeconds = 36000; // 10:00
        const state = calculateCurrrentSessionAndRemainingSeconds(
          workSeconds,
          breakSeconds,
          startFromSeconds,
        );
        expect(state.session).toBe(Session.Work);
        expect(state.remainingSeconds).toBe(1410);
      });
    });
    describe("workSeconds is smaller than currentSessionPassedSeconds", () => {
      it("should be updated correctly", () => {
        const workSeconds = 60;
        const breakSeconds = 300;
        const startFromSeconds = 36000; // 10:00
        const state = calculateCurrrentSessionAndRemainingSeconds(
          workSeconds,
          breakSeconds,
          startFromSeconds,
        );
        expect(state.session).toBe(Session.Break);
        expect(state.remainingSeconds).toBe(270);
      });
    });
  });
  describe("passsedSecondsFromStartToCurrent is larger then periodSeconds", () => {
    it("should be updated correctly", () => {
      const workSeconds = 3300; // 55:00
      const breakSeconds = 300; // 5:00
      const startFromSeconds = 36120; // 10:02
      const state = calculateCurrrentSessionAndRemainingSeconds(
        workSeconds,
        breakSeconds,
        startFromSeconds,
      );
      expect(state.session).toBe(Session.Break);
      expect(state.remainingSeconds).toBe(30);
    });
  });
});

describe("pomodoroReducer", () => {
  const mockDate = new Date(2021, 3, 25, 10, 1, 30);
  beforeAll(() => {
    jest.spyOn(global, "Date").mockImplementation(() => mockDate as any);
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
  test("should update state correctly", () => {
    const action = {
      workSeconds: 1500, // 25minuts
      breakSeconds: 300, // 5minuts
      startFromSeconds: 36120, // 10:02
    };
    const initialState = {
      session: Session.Work,
      remainingSeconds: 10,
    };
    const newState = pomodoroReducer(initialState, action);
    expect(newState.session).toBe(Session.Break);
    expect(newState.remainingSeconds).toBe(30);
  });
});
