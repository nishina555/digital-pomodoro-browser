import { Session, SessionType } from "./Pomodoro";
import { calculatePassedSecondsFromStartToCurrent } from "./lib/converter";

type PomodoroReducerPayload = {
  workSeconds: number;
  breakSeconds: number;
  startFromSeconds: number;
};

export type PomodoroState = {
  session: SessionType;
  remainingSeconds: number;
};

export const calculateCurrrentSessionAndRemainingSeconds = (
  workSeconds: number,
  breakSeconds: number,
  startFromSeconds: number,
): PomodoroState => {
  const passsedSecondsFromStartToCurrent =
    calculatePassedSecondsFromStartToCurrent(new Date(), startFromSeconds);
  const periodSeconds = workSeconds + breakSeconds;
  const currentSessionPassedSeconds =
    passsedSecondsFromStartToCurrent % periodSeconds;

  if (workSeconds - currentSessionPassedSeconds > 0) {
    return {
      session: Session.Work,
      remainingSeconds: workSeconds - currentSessionPassedSeconds - 1,
    };
  } else {
    return {
      session: Session.Break,
      remainingSeconds:
        breakSeconds - (currentSessionPassedSeconds - workSeconds) - 1,
    };
  }
};

// NOTE: 時刻の00秒とタイマーの00秒を合わせる場合、以下のようなReducerになる。ただし、実際の画面で確認すると1秒遅れずれた表示に見えるため、このロジックは採用していない。備忘録としてコメントアウトして実装を残しておく。
// if (workSeconds - currentSessionPassedSeconds > 0) {
//   if (currentSessionPassedSeconds === 0) {
//     return {
//       session: Session.Break,
//       remainingSeconds: 0,
//     };
//   } else {
//     return {
//       session: Session.Work,
//       remainingSeconds: workSeconds - currentSessionPassedSeconds,
//     };
//   }
// } else {
//   if (workSeconds - currentSessionPassedSeconds === 0) {
//     return {
//       session: Session.Work,
//       remainingSeconds: 0,
//     };
//   } else {
//     return {
//       session: Session.Break,
//       remainingSeconds:
//         breakSeconds - (currentSessionPassedSeconds - workSeconds),
//     };
//   }
// }

export const pomodoroReducer = (
  state: PomodoroState,
  payload: PomodoroReducerPayload,
) => {
  const { workSeconds, breakSeconds, startFromSeconds } = payload;
  const { session, remainingSeconds } =
    calculateCurrrentSessionAndRemainingSeconds(
      workSeconds,
      breakSeconds,
      startFromSeconds,
    );

  return {
    ...state,
    session,
    remainingSeconds,
  };
};
