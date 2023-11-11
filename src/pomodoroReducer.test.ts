import { Session } from "./Pomodoro";
import { pomodoroReducer } from "./pomodoroReducer";

describe("pomodoroReducer", () => {
  describe("通常更新（1秒経過）", () => {
    const action = {
      workSeconds: 1500,
      breakSeconds: 300,
      passedSeconds: 1,
    };
    describe("Session切り替わりなし", () => {
      it("残り時間が1秒減ること", () => {
        const initialState = {
          session: Session.Work,
          remainingSeconds: 10,
        };
        const newState = pomodoroReducer(initialState, action);

        expect(newState.session).toBe(Session.Work);
        expect(newState.remainingSeconds).toBe(9);
      });
    });
    describe("Session切り替わりあり", () => {
      it("WorkからBreakに切り替わること", () => {
        const initialState = {
          session: Session.Work,
          remainingSeconds: 0,
        };
        const newState = pomodoroReducer(initialState, action);

        expect(newState.session).toBe(Session.Break);
        expect(newState.remainingSeconds).toBe(299);
      });
      it("BreakからWorkに切り替わること", () => {
        const initialState = {
          session: Session.Break,
          remainingSeconds: 0,
        };
        const newState = pomodoroReducer(initialState, action);

        expect(newState.session).toBe(Session.Work);
        expect(newState.remainingSeconds).toBe(1499);
      });
    });
  });
  describe("スリープ状態からの更新（2秒以上経過）", () => {
    describe("period(workSeconds + breakSeconds)以上経過していない", () => {
      const action = {
        workSeconds: 1500,
        breakSeconds: 300,
        passedSeconds: 2,
      };
      describe("Session切り替わりなし", () => {
        it("残り時間がpassedSeconds減ること", () => {
          const initialState = {
            session: Session.Work,
            remainingSeconds: 10,
          };
          const newState = pomodoroReducer(initialState, action);

          expect(newState.session).toBe(Session.Work);
          expect(newState.remainingSeconds).toBe(8);
        });
      });
      describe("Session切り替わりあり", () => {
        it("WorkからBreakに切り替わること", () => {
          const initialState = {
            session: Session.Work,
            remainingSeconds: 0,
          };
          const newState = pomodoroReducer(initialState, action);

          expect(newState.session).toBe(Session.Break);
          expect(newState.remainingSeconds).toBe(298);
        });
        it("BreakからWorkに切り替わること", () => {
          const initialState = {
            session: Session.Break,
            remainingSeconds: 0,
          };
          const newState = pomodoroReducer(initialState, action);

          expect(newState.session).toBe(Session.Work);
          expect(newState.remainingSeconds).toBe(1498);
        });
      });
    });
    describe("period(workSeconds + breakSeconds)以上経過している", () => {
      const action = {
        workSeconds: 1500,
        breakSeconds: 300,
        passedSeconds: 1801,
      };
      describe("Session切り替わりなし", () => {
        it("残り時間がpassedSeconds減ること", () => {
          const initialState = {
            session: Session.Work,
            remainingSeconds: 10,
          };
          const newState = pomodoroReducer(initialState, action);

          expect(newState.session).toBe(Session.Work);
          expect(newState.remainingSeconds).toBe(9);
        });
      });
      describe("Session切り替わりあり", () => {
        it("WorkからBreakに切り替わること", () => {
          const initialState = {
            session: Session.Work,
            remainingSeconds: 0,
          };
          const newState = pomodoroReducer(initialState, action);

          expect(newState.session).toBe(Session.Break);
          expect(newState.remainingSeconds).toBe(299);
        });
        it("BreakからWorkに切り替わること", () => {
          const initialState = {
            session: Session.Break,
            remainingSeconds: 0,
          };
          const newState = pomodoroReducer(initialState, action);

          expect(newState.session).toBe(Session.Work);
          expect(newState.remainingSeconds).toBe(1499);
        });
      });
    });
  });

  // it("should handle WORK session when remainingSeconds is less than passedSeconds", () => {
  //   const action = {
  //     workSeconds: 1500,
  //     breakSeconds: 300,
  //     passedSeconds: 1800,
  //   };

  //   const newState = pomodoroReducer(initialState, action);

  //   expect(newState.session).toBe("Work");
  //   expect(newState.remainingSeconds).toBe(1200); // 20 minutes in seconds
  // });

  // it("should handle BREAK session when remainingSeconds is greater than passedSeconds", () => {
  //   const initialStateBreak = {
  //     session: "Break",
  //     remainingSeconds: 300, // 5 minutes in seconds
  //   };

  //   const action = {
  //     workSeconds: 1500,
  //     breakSeconds: 300,
  //     passedSeconds: 100,
  //   };

  //   const newState = pomodoroReducer(initialStateBreak, action);

  //   expect(newState.session).toBe("Break");
  //   expect(newState.remainingSeconds).toBe(200); // 3 minutes and 20 seconds in seconds
  // });

  // it("should handle BREAK session when remainingSeconds is less than passedSeconds", () => {
  //   const initialStateBreak = {
  //     session: "Break",
  //     remainingSeconds: 120, // 2 minutes in seconds
  //   };

  //   const action = {
  //     workSeconds: 1500,
  //     breakSeconds: 300,
  //     passedSeconds: 500,
  //   };

  //   const newState = pomodoroReducer(initialStateBreak, action);

  //   expect(newState.session).toBe("Break");
  //   expect(newState.remainingSeconds).toBe(0);
  // });
});
