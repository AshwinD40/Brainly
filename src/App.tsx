import { Route, Routes } from "react-router";
import "./App.css";
import ProtectedRoute from "./components/core/ProtectedRoute";
import { Home } from "./components/pages/Home";
import SignInPage from "./components/pages/signIn";
import SignUpPage from "./components/pages/signUp";
import { SharedBrain } from "./components/pages/SharedBrain";

function App() {
  return (
    <Routes>
      <Route path="/signup/*" element={<SignUpPage />} />
      <Route path="/signin/*" element={<SignInPage />} />
      <Route path="/share/:shareId" element={<SharedBrain />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Home />} />
      </Route>
    </Routes>
  );
}

export default App;
