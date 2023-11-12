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
  // console.log('passsedSecondsFromStartToCurrent', passsedSecondsFromStartToCurrent)
  const currentSessionPassedSeconds =
    passsedSecondsFromStartToCurrent % periodSeconds;
  // console.log('currentSessionPassedSeconds', currentSessionPassedSeconds)
  if (workSeconds - currentSessionPassedSeconds > 0) {
    return {
      session: Session.Work,
      remainingSeconds: workSeconds - currentSessionPassedSeconds,
    };
  } else {
    return {
      session: Session.Break,
      remainingSeconds:
        breakSeconds - (currentSessionPassedSeconds - workSeconds),
    };
  }
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
