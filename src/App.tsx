import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import PageRouter from "./components/pages/PageRouter";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PageRouter />} />
          <Route path="/*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
