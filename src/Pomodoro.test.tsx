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
        displayState={true}
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
        displayState={true}
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
        displayState={true}
      />,
    );
    const displayTimerState = screen.getByTestId("display-timer-state");
    const displayTimer = screen.getByTestId("display-timer");

    expect(displayTimerState).toHaveTextContent("Work");
    expect(displayTimer).toHaveTextContent("15:45");
  });

  test("displayStateがfalseのとき、Waitingステータスが表示されること", () => {
    render(
      <Pomodoro
        opacity={0.5}
        timerState={TimerState.Waiting}
        theme={Theme.Light}
        minutes={15}
        seconds={45}
        displayState={false}
      />,
    );
    const displayTimerState = screen.getByTestId("display-timer-state");
    const displayTimer = screen.getByTestId("display-timer");

    expect(displayTimerState).toHaveTextContent("Will start in");
    expect(displayTimer).toHaveTextContent("15:45");
  });

  test("displayStateがfalseのとき、Workステータスが表示されないこと", () => {
    render(
      <Pomodoro
        opacity={0.5}
        timerState={TimerState.Work}
        theme={Theme.Light}
        minutes={15}
        seconds={45}
        displayState={false}
      />,
    );
    const displayTimerState = screen.getByTestId("display-timer-state");
    const displayTimer = screen.getByTestId("display-timer");

    expect(displayTimerState).not.toHaveTextContent("Work");
    expect(displayTimer).toHaveTextContent("15:45");
  });

  test("displayStateがfalseのとき、Breakステータスが表示されないこと", () => {
    render(
      <Pomodoro
        opacity={0.5}
        timerState={TimerState.Break}
        theme={Theme.Light}
        minutes={15}
        seconds={45}
        displayState={false}
      />,
    );
    const displayTimerState = screen.getByTestId("display-timer-state");
    const displayTimer = screen.getByTestId("display-timer");

    expect(displayTimerState).not.toHaveTextContent("Break");
    expect(displayTimer).toHaveTextContent("15:45");
  });
});
