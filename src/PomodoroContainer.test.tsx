import { render, screen } from "@testing-library/react";
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
          expect(displayTimer).toHaveTextContent("00:30");
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
          expect(displayTimer).toHaveTextContent("03:30");
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
        expect(displayTimer).toHaveTextContent("00:30");
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
      expect(displayTimer).toHaveTextContent("01:30");
    });
  });

  test("パラメータがない場合、デフォルト値がセットされていること", () => {
    window.history.pushState({}, "Pomodoro page", "/pomodoro");
    render(<PomodoroContainer />);
    const displaySession = screen.getByTestId("display-timer-session");
    const displayTimer = screen.getByTestId("display-timer");

    expect(displaySession).toBeEmptyDOMElement();
    expect(displayTimer).toHaveTextContent("23:30");
  });
});

describe("境界値", () => {
  describe("Break終了", () => {
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

      expect(displaySession).toHaveTextContent("Break");
      expect(displayTimer).toHaveTextContent("00:00");
    });
  });
  describe("Work開始", () => {
    const mockDate = new Date(2021, 3, 25, 10, 2, 1);
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

      expect(displaySession).toHaveTextContent("Work");
      expect(displayTimer).toHaveTextContent("00:00");
    });
  });
  describe("Break開始", () => {
    const mockDate = new Date(2021, 3, 25, 10, 17, 1);
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
