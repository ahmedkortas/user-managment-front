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
import EditUser from "./components/EditUser";

const ProtectedRoute = ({ children }) => {
  const { checkAuth } = useAuth();

  if (!checkAuth()) {
    return <Navigate to="/login" />;
  }

  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
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
        />{" "}
        <Route
          path="/edit-user/:userId"
          element={
            <ProtectedRoute>
              <EditUser />
            </ProtectedRoute>
          }
        />
        <Route path="/*" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
