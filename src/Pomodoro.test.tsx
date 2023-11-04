import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Pomodoro } from "./Pomodoro";

// Pomodoroコンポーネントが正常にレンダリングされるかテスト
test("Pomodoro component renders correctly", () => {
  render(<Pomodoro />);
  const element = screen.getByTestId("display-text");
  expect(element).toBeInTheDocument();
});

// 初期状態が正しいかテスト
test("Pomodoro component initializes with correct state", () => {
  const { rerender } = render(<Pomodoro />);
  const displayTextElement = screen.getByTestId("display-text");
  expect(displayTextElement).toHaveClass("waiting");
  // expect(displayTextElement.textContent).toBe('Pomodoro will start in 10:07');

  // URLのクエリパラメータを変更して、状態を調整
  window.history.pushState({}, "Test page", "/?work=15&break=3");
  rerender(<Pomodoro />);
  expect(displayTextElement).toHaveClass("waiting");
  // expect(displayTextElement.textContent).toBe('Work: 15:00');
});
