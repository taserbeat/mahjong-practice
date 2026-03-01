import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import PageRouter from "./components/pages/PageRouter";

const basename = import.meta.env.PROD ? "/mahjong-practice" : undefined;

const App = () => {
  return (
    <div>
      <BrowserRouter basename={basename}>
        <Routes>
          <Route path="/" element={<PageRouter />} />
          <Route path="/*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
