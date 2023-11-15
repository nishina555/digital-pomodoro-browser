import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { PomodoroContainer } from "./PomodoroContainer";

describe("初期状態が正しいかテスト", () => {
  const mockDate = new Date(2021, 3, 25, 10, 1, 30);
  beforeAll(() => {
    jest.spyOn(global, "Date").mockImplementation(() => mockDate as any);
  });
  afterAll(() => {
    jest.restoreAllMocks(); // これで元の実装に戻す
  });
  describe("startFromの値が現在時刻の分よりも大きい時", () => {
    describe("開始までの残り時間が「work + break」よりも長い時", () => {
      describe("Breakから開始するとき", () => {
        test("正しい初期表示がされること", () => {
          window.history.pushState(
            {},
            "Pomodoro page",
            "/pomodoro?work=15&break=5&startFrom=02&displaySession=1",
          ); // work 15 minutes、break 5 minutes、 start from xx:02
          render(<PomodoroContainer />);
          const displaySession = screen.getByTestId("display-timer-session");
          const displayTimer = screen.getByTestId("display-timer");

          expect(displaySession).toHaveTextContent("Break");
          expect(displayTimer).toHaveTextContent("00:29");
        });
      });
      describe("Workから開始するとき", () => {
        test("正しい初期表示がされること", () => {
          window.history.pushState(
            {},
            "Pomodoro page",
            "/pomodoro?work=15&break=5&startFrom=25&displaySession=1",
          );
          render(<PomodoroContainer />);
          const displaySession = screen.getByTestId("display-timer-session");
          const displayTimer = screen.getByTestId("display-timer");

          expect(displaySession).toHaveTextContent("Break");
          expect(displayTimer).toHaveTextContent("03:29");
        });
      });
    });
    describe("開始までの残り時間が「work + break」よりも短い時", () => {
      test("正しい初期表示がされること", () => {
        window.history.pushState(
          {},
          "Pomodoro page",
          "/pomodoro?work=50&break=10&startFrom=02&displaySession=1",
        );
        render(<PomodoroContainer />);
        const displaySession = screen.getByTestId("display-timer-session");
        const displayTimer = screen.getByTestId("display-timer");

        expect(displaySession).toHaveTextContent("Break");
        expect(displayTimer).toHaveTextContent("00:29");
      });
    });
  });
  describe("startFromの値が現在時刻の分よりも小さい時", () => {
    test("正しい初期表示がされること", () => {
      window.history.pushState(
        {},
        "Pomodoro page",
        "/pomodoro?work=50&break=10&startFrom=03&displaySession=1",
      );
      render(<PomodoroContainer />);
      const displaySession = screen.getByTestId("display-timer-session");
      const displayTimer = screen.getByTestId("display-timer");

      expect(displaySession).toHaveTextContent("Break");
      expect(displayTimer).toHaveTextContent("01:29");
    });
  });

  test("パラメータがない場合、デフォルト値がセットされていること", () => {
    window.history.pushState({}, "Pomodoro page", "/pomodoro");
    render(<PomodoroContainer />);
    const displaySession = screen.getByTestId("display-timer-session");
    const displayTimer = screen.getByTestId("display-timer");

    expect(displaySession).toBeEmptyDOMElement();
    expect(displayTimer).toHaveTextContent("23:29");
  });
});

describe("境界値", () => {
  describe("Break終了", () => {
    const mockDate = new Date(2021, 3, 25, 10, 1, 59);
    beforeAll(() => {
      jest.spyOn(global, "Date").mockImplementation(() => mockDate as any);
    });
    afterAll(() => {
      jest.restoreAllMocks();
    });
    test("正しい初期表示がされること", () => {
      window.history.pushState(
        {},
        "Pomodoro page",
        "/pomodoro?work=15&break=5&startFrom=02&displaySession=1",
      ); // work 15 minutes、break 5 minutes、 start from xx:02
      render(<PomodoroContainer />);
      const displaySession = screen.getByTestId("display-timer-session");
      const displayTimer = screen.getByTestId("display-timer");

      expect(displaySession).toHaveTextContent("Break");
      expect(displayTimer).toHaveTextContent("00:00");
    });
  });
  describe("Work開始", () => {
    const mockDate = new Date(2021, 3, 25, 10, 2, 0);
    beforeAll(() => {
      jest.spyOn(global, "Date").mockImplementation(() => mockDate as any);
    });
    afterAll(() => {
      jest.restoreAllMocks();
    });
    test("正しい初期表示がされること", () => {
      window.history.pushState(
        {},
        "Pomodoro page",
        "/pomodoro?work=15&break=5&startFrom=02&displaySession=1",
      ); // work 15 minutes、break 5 minutes、 start from xx:02
      render(<PomodoroContainer />);
      const displaySession = screen.getByTestId("display-timer-session");
      const displayTimer = screen.getByTestId("display-timer");

      expect(displaySession).toHaveTextContent("Work");
      expect(displayTimer).toHaveTextContent("14:59");
    });
  });
  describe("Work終了", () => {
    const mockDate = new Date(2021, 3, 25, 10, 16, 59);
    beforeAll(() => {
      jest.spyOn(global, "Date").mockImplementation(() => mockDate as any);
    });
    afterAll(() => {
      jest.restoreAllMocks();
    });
    test("正しい初期表示がされること", () => {
      window.history.pushState(
        {},
        "Pomodoro page",
        "/pomodoro?work=15&break=5&startFrom=02&displaySession=1",
      ); // work 15 minutes、break 5 minutes、 start from xx:02
      render(<PomodoroContainer />);
      const displaySession = screen.getByTestId("display-timer-session");
      const displayTimer = screen.getByTestId("display-timer");

      expect(displaySession).toHaveTextContent("Work");
      expect(displayTimer).toHaveTextContent("00:00");
    });
  });
  describe("Break開始", () => {
    const mockDate = new Date(2021, 3, 25, 10, 17, 0);
    beforeAll(() => {
      jest.spyOn(global, "Date").mockImplementation(() => mockDate as any);
    });
    afterAll(() => {
      jest.restoreAllMocks();
    });
    test("正しい初期表示がされること", () => {
      window.history.pushState(
        {},
        "Pomodoro page",
        "/pomodoro?work=15&break=5&startFrom=02&displaySession=1",
      ); // work 15 minutes、break 5 minutes、 start from xx:02
      render(<PomodoroContainer />);
      const displaySession = screen.getByTestId("display-timer-session");
      const displayTimer = screen.getByTestId("display-timer");

      expect(displaySession).toHaveTextContent("Break");
      expect(displayTimer).toHaveTextContent("04:59");
    });
  });
});

describe.skip("タイマーの推移に関するテスト", () => {
  // NOTE: テストケースは用意したが、カウントダウン毎にDate.now()をもとに経過時間を計算している都合上、モックを利用した時間経過ではタイマー更新のテストがうまく表現できないためskipにしている。時間経過にともなう状態の変化のテストはpomodoroReducer.test.tsで実施する
  // 時間経過にともない画面がどのように変化するかだけ明記しておきたいのでドキュメント代わりにテスト自体は残しておく。
  test("パラメータがある場合の経過時間に応じたポモドーロタイマーの表示の遷移", async () => {
    jest.useFakeTimers();

    // 現在時刻: 2021年4月25日 10:01:30 のモックを作成
    const mockDate = new Date(2021, 3, 25, 10, 1, 30);
    const RealDate = Date;
    global.Date = class extends RealDate {
      getHours = jest.fn(() => 10);
      getMinutes = jest.fn(() => 1);
      getSeconds = jest.fn(() => 30);
    } as any;
    global.Date.now = jest.fn(() => mockDate.valueOf());

    window.history.pushState(
      {},
      "Pomodoro page",
      "/pomodoro?work=5&break=3&startFrom=02&displaySession=1",
    ); // work15分、break3分、2分から開始
    render(<PomodoroContainer />);
    const displaySession = screen.getByTestId("display-timer-session");
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
    const displaySession = screen.getByTestId("display-timer-session");
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
