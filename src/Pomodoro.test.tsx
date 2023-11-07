import { render, screen } from "@testing-library/react";
import { Pomodoro, TimerState, Theme } from "./Pomodoro"; // パスは実際のファイルの場所に合わせて修正
import "@testing-library/jest-dom";

describe("Pomodoroコンポーネント", () => {
  test("Waiting状態のテキストが正しく表示されること", () => {
    render(
      <Pomodoro
        opacity={0.5}
        timerState={TimerState.Waiting}
        theme={Theme.Light}
        minutes={5}
        seconds={30}
      />,
    );
    const displayTimerState = screen.getByTestId("display-timer-state");
    const displayTimer = screen.getByTestId("display-timer");

    expect(displayTimerState).toHaveTextContent("Will start in");
    expect(displayTimer).toHaveTextContent("05:30");
  });

  test("Break状態のテキストが正しく表示されること", () => {
    render(
      <Pomodoro
        opacity={0.5}
        timerState={TimerState.Break}
        theme={Theme.Dark}
        minutes={3}
        seconds={15}
      />,
    );
    const displayTimerState = screen.getByTestId("display-timer-state");
    const displayTimer = screen.getByTestId("display-timer");

    expect(displayTimerState).toHaveTextContent("Break");
    expect(displayTimer).toHaveTextContent("03:15");
  });

  test("Work状態のテキストが正しく表示されること", () => {
    render(
      <Pomodoro
        opacity={0.5}
        timerState={TimerState.Work}
        theme={Theme.Light}
        minutes={15}
        seconds={45}
      />,
    );
    const displayTimerState = screen.getByTestId("display-timer-state");
    const displayTimer = screen.getByTestId("display-timer");

    expect(displayTimerState).toHaveTextContent("Work");
    expect(displayTimer).toHaveTextContent("15:45");
  });
});
