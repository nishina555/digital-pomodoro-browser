import { render, screen, act } from "@testing-library/react";
// import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { PomodoroContainer } from "./PomodoroContainer";

describe("初期状態が正しいかテスト", () => {
  describe("startFromの値が現在時刻の分よりも大きい時", () => {
    describe("開始までの残り時間が「work + break」よりも長い時", () => {
      describe("Breakから開始するとき", () => {
        test("正しい初期表示がされること", () => {
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
            "/pomodoro?work=5&break=3&startFrom=20&displaySession=1",
          ); // work15分、break3分、2分から開始
          render(<PomodoroContainer />);
          const displaySession = screen.getByTestId("display-timer-state");
          const displayTimer = screen.getByTestId("display-timer");

          expect(displaySession).toHaveTextContent("Break");
          expect(displayTimer).toHaveTextContent("02:30");

          // Restore the original implementation
          global.Date = RealDate;
        });
      });
      describe("Workから開始するとき", () => {
        test("正しい初期表示がされること", () => {
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
            "/pomodoro?work=7&break=1&startFrom=20&displaySession=1",
          );
          render(<PomodoroContainer />);
          const displaySession = screen.getByTestId("display-timer-state");
          const displayTimer = screen.getByTestId("display-timer");

          expect(displaySession).toHaveTextContent("Work");
          expect(displayTimer).toHaveTextContent("01:30");

          // Restore the original implementation
          global.Date = RealDate;
        });
      });
    });
    describe("開始までの残り時間が「work + break」よりも短い時", () => {
      test("正しい初期表示がされること", () => {
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
          "/pomodoro?work=50&break=3&startFrom=20&displaySession=1",
        );
        render(<PomodoroContainer />);
        const displaySession = screen.getByTestId("display-timer-state");
        const displayTimer = screen.getByTestId("display-timer");

        expect(displaySession).toHaveTextContent("Work");
        expect(displayTimer).toHaveTextContent("15:30");

        // Restore the original implementation
        global.Date = RealDate;
      });
    });
  });
  describe("startFromの値が現在時刻の分よりも小さい時", () => {
    test("正しい初期表示がされること", () => {
      // 現在時刻: 2021年4月25日 10:01:30 のモックを作成
      const mockDate = new Date(2021, 3, 25, 10, 20, 30);
      const RealDate = Date;
      global.Date = class extends RealDate {
        getMinutes = jest.fn(() => 20);
        getSeconds = jest.fn(() => 30);
      } as any;
      global.Date.now = jest.fn(() => mockDate.valueOf());

      window.history.pushState(
        {},
        "Pomodoro page",
        "/pomodoro?work=5&break=4&startFrom=3&displaySession=1",
      );
      render(<PomodoroContainer />);
      const displaySession = screen.getByTestId("display-timer-state");
      const displayTimer = screen.getByTestId("display-timer");

      expect(displaySession).toHaveTextContent("Work");
      expect(displayTimer).toHaveTextContent("02:30");

      // Restore the original implementation
      global.Date = RealDate;
    });
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
    const displaySession = screen.getByTestId("display-timer-state");
    const displayTimer = screen.getByTestId("display-timer");

    expect(displaySession).toBeEmptyDOMElement();
    expect(displayTimer).toHaveTextContent("23:30");

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
      "/pomodoro?work=5&break=3&startFrom=2&displaySession=1",
    ); // work15分、break3分、2分から開始
    render(<PomodoroContainer />);
    const displaySession = screen.getByTestId("display-timer-state");
    const displayTimer = screen.getByTestId("display-timer");

    // 10:02:00 - 10:01:30 = 00:30が表示される
    expect(displaySession).toHaveTextContent("Break");
    expect(displayTimer).toHaveTextContent("00:30");

    act(() => {
      jest.advanceTimersByTime(30000); // 30秒
    });

    expect(displaySession).toHaveTextContent("Break");
    expect(displayTimer).toHaveTextContent("00:00");

    act(() => {
      jest.advanceTimersByTime(1000); // 1秒
    });
    expect(displaySession).toHaveTextContent("Work");
    expect(displayTimer).toHaveTextContent("04:59");

    act(() => {
      jest.advanceTimersByTime(299000); // 4分59秒
    });
    expect(displaySession).toHaveTextContent("Work");
    expect(displayTimer).toHaveTextContent("00:00");

    act(() => {
      jest.advanceTimersByTime(1000); // 1秒
    });
    expect(displaySession).toHaveTextContent("Break");
    expect(displayTimer).toHaveTextContent("02:59");

    act(() => {
      jest.advanceTimersByTime(179000); // 179秒
    });
    expect(displaySession).toHaveTextContent("Break");
    expect(displayTimer).toHaveTextContent("00:00");

    act(() => {
      jest.advanceTimersByTime(1000); // 1秒
    });
    expect(displaySession).toHaveTextContent("Work");
    expect(displayTimer).toHaveTextContent("04:59");

    // Restore the original implementation
    global.Date = RealDate;
  });

  test("パラメータがない場合の経過時間に応じたポモドーロタイマーの表示の遷移", () => {
    jest.useFakeTimers();

    // 現在時刻: 2021年4月25日 10:58:30 のモックを作成
    const mockDate = new Date(2021, 3, 25, 10, 59, 30);
    const RealDate = Date;
    global.Date = class extends RealDate {
      getMinutes = jest.fn(() => 59);
      getSeconds = jest.fn(() => 30);
    } as any;
    global.Date.now = jest.fn(() => mockDate.valueOf());

    window.history.pushState({}, "Pomodoro page", "/pomodoro");
    render(<PomodoroContainer />);
    const displaySession = screen.getByTestId("display-timer-state");
    const displayTimer = screen.getByTestId("display-timer");

    expect(displaySession).not.toHaveTextContent("Break");
    expect(displayTimer).toHaveTextContent("00:30");

    act(() => {
      jest.advanceTimersByTime(30000);
    });
    expect(displaySession).not.toHaveTextContent("Break");
    expect(displayTimer).toHaveTextContent("00:00");

    act(() => {
      jest.advanceTimersByTime(1000); // 1秒
    });
    expect(displaySession).not.toHaveTextContent("Work");
    expect(displayTimer).toHaveTextContent("24:59");

    act(() => {
      jest.advanceTimersByTime(1499000); // 24分59秒
    });
    expect(displaySession).not.toHaveTextContent("Work");
    expect(displayTimer).toHaveTextContent("00:00");

    act(() => {
      jest.advanceTimersByTime(1000); // 1秒
    });
    expect(displaySession).not.toHaveTextContent("Break");
    expect(displayTimer).toHaveTextContent("04:59");

    act(() => {
      jest.advanceTimersByTime(299000); // 4分59秒
    });
    expect(displaySession).not.toHaveTextContent("Break");
    expect(displayTimer).toHaveTextContent("00:00");

    act(() => {
      jest.advanceTimersByTime(1000); // 1秒
    });
    expect(displaySession).not.toHaveTextContent("Work");
    expect(displayTimer).toHaveTextContent("24:59");

    // Restore the original implementation
    global.Date = RealDate;
  });
});
