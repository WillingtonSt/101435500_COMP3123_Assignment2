import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { UserContext, UserProvider } from "./components/UserContext";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Employee from "./components/Employee";
import ProtectedRoute from "./components/ProtectedRoute";
import './App.css';  

function App() {
  const { isLoggedIn, logout } = useContext(UserContext);

  return (
    <Router>
      <div id="app-container">
        {/* Navigation bar */}
        <nav id="app-navbar">
          <ul>
            {isLoggedIn ? (
              <li>
                <button onClick={logout}>Logout</button>
              </li>
            ) : (
              <>
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/signup">Signup</Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* Main content */}
        <div id="app-main-content">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/employees"
              element={
                <ProtectedRoute>
                  <Employee />
                </ProtectedRoute>
              }
            />
            <Route exact path="/" element={<h2 id="welcome-message">Welcome to the app</h2>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default function WrappedApp() {
  return (
    <UserProvider>
      <App />
    </UserProvider>
  );
}
