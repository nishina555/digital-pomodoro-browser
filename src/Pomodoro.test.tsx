import { render, screen } from "@testing-library/react";
import { Pomodoro, Session, Theme } from "./Pomodoro"; // パスは実際のファイルの場所に合わせて修正
import "@testing-library/jest-dom";

describe("Pomodoroコンポーネント", () => {
  test("Waiting状態のテキストが正しく表示されること", () => {
    render(
      <Pomodoro
        opacity={0.5}
        session={Session.Waiting}
        theme={Theme.Light}
        minutes={5}
        seconds={30}
        displayState={true}
      />,
    );
    const displaySession = screen.getByTestId("display-timer-state");
    const displayTimer = screen.getByTestId("display-timer");

    expect(displaySession).toHaveTextContent("Will start in");
    expect(displayTimer).toHaveTextContent("05:30");
  });

  test("Break状態のテキストが正しく表示されること", () => {
    render(
      <Pomodoro
        opacity={0.5}
        session={Session.Break}
        theme={Theme.Dark}
        minutes={3}
        seconds={15}
        displayState={true}
      />,
    );
    const displaySession = screen.getByTestId("display-timer-state");
    const displayTimer = screen.getByTestId("display-timer");

    expect(displaySession).toHaveTextContent("Break");
    expect(displayTimer).toHaveTextContent("03:15");
  });

  test("Work状態のテキストが正しく表示されること", () => {
    render(
      <Pomodoro
        opacity={0.5}
        session={Session.Work}
        theme={Theme.Light}
        minutes={15}
        seconds={45}
        displayState={true}
      />,
    );
    const displaySession = screen.getByTestId("display-timer-state");
    const displayTimer = screen.getByTestId("display-timer");

    expect(displaySession).toHaveTextContent("Work");
    expect(displayTimer).toHaveTextContent("15:45");
  });

  test("displayStateがfalseのとき、Waitingステータスが表示されること", () => {
    render(
      <Pomodoro
        opacity={0.5}
        session={Session.Waiting}
        theme={Theme.Light}
        minutes={15}
        seconds={45}
        displayState={false}
      />,
    );
    const displaySession = screen.getByTestId("display-timer-state");
    const displayTimer = screen.getByTestId("display-timer");

    expect(displaySession).toHaveTextContent("Will start in");
    expect(displayTimer).toHaveTextContent("15:45");
  });

  test("displayStateがfalseのとき、Workステータスが表示されないこと", () => {
    render(
      <Pomodoro
        opacity={0.5}
        session={Session.Work}
        theme={Theme.Light}
        minutes={15}
        seconds={45}
        displayState={false}
      />,
    );
    const displaySession = screen.getByTestId("display-timer-state");
    const displayTimer = screen.getByTestId("display-timer");

    expect(displaySession).not.toHaveTextContent("Work");
    expect(displayTimer).toHaveTextContent("15:45");
  });

  test("displayStateがfalseのとき、Breakステータスが表示されないこと", () => {
    render(
      <Pomodoro
        opacity={0.5}
        session={Session.Break}
        theme={Theme.Light}
        minutes={15}
        seconds={45}
        displayState={false}
      />,
    );
    const displaySession = screen.getByTestId("display-timer-state");
    const displayTimer = screen.getByTestId("display-timer");

    expect(displaySession).not.toHaveTextContent("Break");
    expect(displayTimer).toHaveTextContent("15:45");
  });
});
