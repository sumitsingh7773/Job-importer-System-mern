import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Jobs from "./Jobs";
import ImportLogs from "./ImportLogs";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Jobs />} />
        <Route path="/logs" element={<ImportLogs />} />
      </Routes>
    </Router>
  );
}

export default App;
