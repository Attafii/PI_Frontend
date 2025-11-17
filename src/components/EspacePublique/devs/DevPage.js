import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UsersList from "./components/UsersList";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/users" element={<UsersList />} />
      </Routes>
    </Router>
  );
}

export default App;
