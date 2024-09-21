import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import HomePage from "./components/pages/HomePage";
import CounterPage from "./components/pages/CounterPage";
import PageRouter from "./components/pages/PageRouter";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PageRouter />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/counter" element={<CounterPage />} />
          <Route path="/*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
