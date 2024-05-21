import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import AddUser from "./components/AddUser";
import UserManagement from "./components/UserManagement";
import Login from "./components/Login";
import { useAuth } from "./hooks/useAuth";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/add-user"
          element={
            <ProtectedRoute>
              <AddUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-management"
          element={
            <ProtectedRoute>
              <UserManagement />
            </ProtectedRoute>
          }
        />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
};

export default App;
