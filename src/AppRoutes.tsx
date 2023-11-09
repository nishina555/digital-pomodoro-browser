import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PomodoroContainer } from "./PomodoroContainer";

export const AppRoutes = () => {
  return (
    // For GitHub Pages
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/pomodoro" element={<PomodoroContainer />} />
      </Routes>
    </BrowserRouter>
  );
};
