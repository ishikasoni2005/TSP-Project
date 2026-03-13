import { Navigate, Route, Routes } from "react-router-dom";

import AppLayout from "./layouts/AppLayout";
import AlgorithmComparison from "./pages/AlgorithmComparison";
import DatasetManager from "./pages/DatasetManager";
import Home from "./pages/Home";
import Visualizer from "./pages/Visualizer";


function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="/visualizer" element={<Visualizer />} />
        <Route path="/datasets" element={<DatasetManager />} />
        <Route path="/comparison" element={<AlgorithmComparison />} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Route>
    </Routes>
  );
}

export default App;
