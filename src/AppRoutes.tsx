import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PomodoroContainer } from "./PomodoroContainer";

export const AppRoutes = () => {
  return (
    // <BrowserRouter basename={process.env.PUBLIC_URL}>
    // <BrowserRouter basename={"/digital-pomodoro-browser/"}>
    <BrowserRouter basename={import.meta.env.PUBLIC_URL}>
      <Routes>
        <Route path="/pomodoro" element={<PomodoroContainer />} />
      </Routes>
    </BrowserRouter>
  );
};
