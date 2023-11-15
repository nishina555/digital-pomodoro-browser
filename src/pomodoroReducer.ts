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
    if (currentSessionPassedSeconds === 0) {
      return {
        session: Session.Break,
        remainingSeconds: 0,
      };
    } else {
      return {
        session: Session.Work,
        remainingSeconds: workSeconds - currentSessionPassedSeconds,
      };
    }
  } else {
    if (workSeconds - currentSessionPassedSeconds === 0) {
      return {
        session: Session.Work,
        remainingSeconds: 0,
      };
    } else {
      return {
        session: Session.Break,
        remainingSeconds:
          breakSeconds - (currentSessionPassedSeconds - workSeconds),
      };
    }
  }

  // NOTE: 実際の画面で確認したときポモドーロタイマーの秒と実際の時刻の秒を合計して00にならない（ポモドーロの進みが1秒遅くてずれている）のであれば、以下のロジックを採用してもいいかもしれない。
  // if (workSeconds - currentSessionPassedSeconds > 0) {
  //   return {
  //     session: Session.Work,
  //     remainingSeconds: workSeconds - currentSessionPassedSeconds - 1,
  //   };
  // } else {
  //   return {
  //     session: Session.Break,
  //     remainingSeconds:
  //       breakSeconds - (currentSessionPassedSeconds - workSeconds) - 1,
  //   };
  // }
};

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
