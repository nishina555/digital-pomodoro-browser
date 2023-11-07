import { render, screen, act } from "@testing-library/react";
// import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { PomodoroContainer } from "./PomodoroContainer";

describe("初期状態が正しいかテスト", () => {
  test("パラメータで指定された時間がセットされていること", () => {
    // 現在時刻: 2021年4月25日 10:01:30 のモックを作成
    const mockDate = new Date(2021, 3, 25, 10, 1, 30);
    const RealDate = Date;
    global.Date = class extends RealDate {
      getMinutes = jest.fn(() => 1);
      getSeconds = jest.fn(() => 30);
    } as any;
    global.Date.now = jest.fn(() => mockDate.valueOf());

    window.history.pushState(
      {},
      "Pomodoro page",
      "/pomodoro?work=15&break=3&startFrom=2",
    ); // work15分、break3分、2分から開始
    render(<PomodoroContainer />);
    const displayTimerState = screen.getByTestId("display-timer-state");
    const displayTimer = screen.getByTestId("display-timer");

    // 10:02:00 - 10:01:30 = 00:30が表示される
    expect(displayTimerState).toHaveTextContent("Will start in");
    expect(displayTimer).toHaveTextContent("00:30");

    // Restore the original implementation
    global.Date = RealDate;
  });

  test("パラメータがない場合、デフォルト値がセットされていること", () => {
    // 現在時刻: 2021年4月25日 10:01:30 のモックを作成
    const mockDate = new Date(2021, 3, 25, 10, 1, 30);
    const RealDate = Date;
    global.Date = class extends RealDate {
      getMinutes = jest.fn(() => 1);
      getSeconds = jest.fn(() => 30);
    } as any;
    global.Date.now = jest.fn(() => mockDate.valueOf());

    window.history.pushState({}, "Pomodoro page", "/pomodoro");
    render(<PomodoroContainer />);
    const displayTimerState = screen.getByTestId("display-timer-state");
    const displayTimer = screen.getByTestId("display-timer");

    // 11::00 - 10:01:30 = 58:30が表示される
    expect(displayTimerState).toHaveTextContent("Will start in");
    expect(displayTimer).toHaveTextContent("58:30");

    // Restore the original implementation
    global.Date = RealDate;
  });
});

describe("初期状態が正しいかテスト", () => {
  test("パラメータがある場合の経過時間に応じたポモドーロタイマーの表示の遷移", async () => {
    jest.useFakeTimers();

    // 現在時刻: 2021年4月25日 10:01:30 のモックを作成
    const mockDate = new Date(2021, 3, 25, 10, 1, 30);
    const RealDate = Date;
    global.Date = class extends RealDate {
      getMinutes = jest.fn(() => 1);
      getSeconds = jest.fn(() => 30);
    } as any;
    global.Date.now = jest.fn(() => mockDate.valueOf());

    window.history.pushState(
      {},
      "Pomodoro page",
      "/pomodoro?work=5&break=3&startFrom=2&displayState=1",
    ); // work15分、break3分、2分から開始
    render(<PomodoroContainer />);
    const displayTimerState = screen.getByTestId("display-timer-state");
    const displayTimer = screen.getByTestId("display-timer");

    // 10:02:00 - 10:01:30 = 00:30が表示される
    expect(displayTimerState).toHaveTextContent("Will start in");
    expect(displayTimer).toHaveTextContent("00:30");

    act(() => {
      jest.advanceTimersByTime(30000); // 30秒
    });

    expect(displayTimerState).toHaveTextContent("Will start in");
    expect(displayTimer).toHaveTextContent("00:00");

    act(() => {
      jest.advanceTimersByTime(1000); // 1秒
    });
    expect(displayTimerState).toHaveTextContent("Work");
    expect(displayTimer).toHaveTextContent("04:59");

    act(() => {
      jest.advanceTimersByTime(299000); // 4分59秒
    });
    expect(displayTimerState).toHaveTextContent("Work");
    expect(displayTimer).toHaveTextContent("00:00");

    act(() => {
      jest.advanceTimersByTime(1000); // 1秒
    });
    expect(displayTimerState).toHaveTextContent("Break");
    expect(displayTimer).toHaveTextContent("02:59");

    act(() => {
      jest.advanceTimersByTime(179000); // 179秒
    });
    expect(displayTimerState).toHaveTextContent("Break");
    expect(displayTimer).toHaveTextContent("00:00");

    act(() => {
      jest.advanceTimersByTime(1000); // 1秒
    });
    expect(displayTimerState).toHaveTextContent("Work");
    expect(displayTimer).toHaveTextContent("04:59");

    // Restore the original implementation
    global.Date = RealDate;
  });

  test("パラメータがない場合の経過時間に応じたポモドーロタイマーの表示の遷移", () => {
    jest.useFakeTimers();

    // 現在時刻: 2021年4月25日 10:01:30 のモックを作成
    const mockDate = new Date(2021, 3, 25, 10, 1, 30);
    const RealDate = Date;
    global.Date = class extends RealDate {
      getMinutes = jest.fn(() => 1);
      getSeconds = jest.fn(() => 30);
    } as any;
    global.Date.now = jest.fn(() => mockDate.valueOf());

    window.history.pushState({}, "Pomodoro page", "/pomodoro"); // work15分、break3分、2分から開始
    render(<PomodoroContainer />);
    const displayTimerState = screen.getByTestId("display-timer-state");
    const displayTimer = screen.getByTestId("display-timer");

    expect(displayTimerState).toHaveTextContent("Will start in");
    expect(displayTimer).toHaveTextContent("58:30");

    act(() => {
      jest.advanceTimersByTime(3510000); // 58分30秒
    });
    expect(displayTimerState).toHaveTextContent("Will start in");
    expect(displayTimer).toHaveTextContent("00:00");

    act(() => {
      jest.advanceTimersByTime(1000); // 1秒
    });
    expect(displayTimerState).not.toHaveTextContent("Work");
    expect(displayTimer).toHaveTextContent("24:59");

    act(() => {
      jest.advanceTimersByTime(1499000); // 24分59秒
    });
    expect(displayTimerState).not.toHaveTextContent("Work");
    expect(displayTimer).toHaveTextContent("00:00");

    act(() => {
      jest.advanceTimersByTime(1000); // 1秒
    });
    expect(displayTimerState).not.toHaveTextContent("Break");
    expect(displayTimer).toHaveTextContent("04:59");

    act(() => {
      jest.advanceTimersByTime(299000); // 4分59秒
    });
    expect(displayTimerState).not.toHaveTextContent("Break");
    expect(displayTimer).toHaveTextContent("00:00");

    act(() => {
      jest.advanceTimersByTime(1000); // 1秒
    });
    expect(displayTimerState).not.toHaveTextContent("Work");
    expect(displayTimer).toHaveTextContent("24:59");

    // Restore the original implementation
    global.Date = RealDate;
  });
});
