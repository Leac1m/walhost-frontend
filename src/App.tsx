import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import Deploy from "./pages/Deploy";
import Docs from "./pages/Docs";
import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/deploy" element={<Deploy />} />
        <Route path="/docs" element={<Docs />} />
      </Routes>
    </BrowserRouter>
  );
};
export default App;
