import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Pomodoro } from "./Pomodoro";

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/pomodoro" element={<Pomodoro />} />
      </Routes>
    </BrowserRouter>
  );
};
