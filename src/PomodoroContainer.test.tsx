import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { PomodoroContainer } from "./PomodoroContainer";

// 初期状態が正しいかテスト
test("ポモドーロタイマーの初期状態", () => {
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
    "/?work=15&break=3&startFrom=2",
  ); // work15分、break3分、2分から開始
  render(<PomodoroContainer />);
  const displayTextElement = screen.getByTestId("display-text");
  expect(displayTextElement).toBeInTheDocument();
  expect(displayTextElement).toHaveStyle("color: initial");
  expect(displayTextElement.textContent).toBe("Pomodoro will start in 00:30"); // 10:02:00 - 10:01:30 = 00:30が表示される

  // Restore the original implementation
  global.Date = RealDate;
});

test("経過時間に応じたポモドーロタイマーの表示の遷移", async () => {
  jest.useFakeTimers();

  // 現在時刻: 2021年4月25日 10:01:30 のモックを作成
  const mockDate = new Date(2021, 3, 25, 10, 1, 30);
  const RealDate = Date;
  global.Date = class extends RealDate {
    getMinutes = jest.fn(() => 1);
    getSeconds = jest.fn(() => 30);
  } as any;
  global.Date.now = jest.fn(() => mockDate.valueOf());

  window.history.pushState({}, "Pomodoro page", "/?work=5&break=3&startFrom=2"); // work15分、break3分、2分から開始
  render(<PomodoroContainer />);
  const displayTextElement = screen.getByTestId("display-text");
  expect(displayTextElement.textContent).toBe("Pomodoro will start in 00:30"); // 10:02:00 - 10:01:30 = 00:30が表示される

  act(() => {
    jest.advanceTimersByTime(50000); // 50秒
  });

  // 30秒後に開始から50秒経過 = Workを始めて20秒経過 = 5分 - 20秒 = 04:40
  expect(displayTextElement.textContent).toMatch(/^Work: 04:40/);

  act(() => {
    jest.advanceTimersByTime(310000); // 310秒 = 5分10秒
  });

  // Work残り4分40秒から5分1０秒経過 = Breakを始めて30秒経過 = 3分 - 30秒 = 02:30
  expect(displayTextElement.textContent).toMatch(/^Break: 02:30/);

  // Restore the original implementation
  global.Date = RealDate;
});
