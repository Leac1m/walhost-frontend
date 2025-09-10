import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import Docs from "./pages/Docs";
import NotFound from "./pages/NotFound";
import DeploymentDetails from "./pages/Deploy/DeploymentDetails";
import Deploy from "./pages/Deploy/index";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/deploy" element={<Deploy />} />
        <Route path="/deploy/:id" element={<DeploymentDetails />} />
        <Route path="/docs" element={<Docs />} />
      </Routes>
    </BrowserRouter>
  );
};
export default App;
