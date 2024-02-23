import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import HomePage from "./components/pages/HomePage";
import CounterPage from "./components/pages/CounterPage";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/counter" element={<CounterPage />} />
          <Route path="/*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
