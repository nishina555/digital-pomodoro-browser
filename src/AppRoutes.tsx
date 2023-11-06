import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PomodoroContainer } from "./PomodoroContainer";

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/pomodoro" element={<PomodoroContainer />} />
      </Routes>
    </BrowserRouter>
  );
};
