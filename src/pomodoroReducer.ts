import { Session, SessionType } from "./Pomodoro";

type PomodoroReducerPayload = {
  workSeconds: number;
  breakSeconds: number;
  passedSeconds: number;
};

export type PomodoroState = {
  session: SessionType;
  remainingSeconds: number;
};

export const pomodoroReducer = (
  state: PomodoroState,
  payload: PomodoroReducerPayload,
) => {
  const { workSeconds, breakSeconds, passedSeconds } = payload;

  // passedSecondsがポモドーロの1ピリオドよりも長いケースを考慮し、periodSecondsで割った商で経過時間を算出する。
  const periodSeconds = workSeconds + breakSeconds;
  const appearentPassedSeconds = passedSeconds % periodSeconds;
  const nextRemainingTime = state.remainingSeconds - appearentPassedSeconds;

  if (nextRemainingTime < 0) {
    if (state.session === Session.Break) {
      if (workSeconds - appearentPassedSeconds > 0) {
        return {
          session: Session.Work,
          remainingSeconds: workSeconds - appearentPassedSeconds,
        };
      } else {
        return {
          session: Session.Break,
          remainingSeconds:
            breakSeconds - (workSeconds - appearentPassedSeconds),
        };
      }
    } else if (state.session === Session.Work) {
      if (breakSeconds - appearentPassedSeconds > 0) {
        return {
          session: Session.Break,
          remainingSeconds: breakSeconds - appearentPassedSeconds,
        };
      } else {
        return {
          session: Session.Work,
          remainingSeconds:
            breakSeconds - (breakSeconds - appearentPassedSeconds),
        };
      }
    }
  }
  return { ...state, remainingSeconds: nextRemainingTime };
};
