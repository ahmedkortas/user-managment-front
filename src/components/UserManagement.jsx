import React, { useEffect, useState } from "react";
import "./UserManagement.css";
import { useAuth } from "../hooks/useAuth";
import fetchWithAuth from "../helpers/fetchWithAuth";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [currentUserPermissions, setCurrentUserPermissions] = useState([]);
  const { isAuthenticated, checkAuth } = useAuth();

  useEffect(() => {
    if (!checkAuth()) {
      window.location.href = "/login";
      return;
    }

    // Fetch users
    fetchWithAuth("http://localhost:8000/api/users")
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching users:", error));

    // Fetch current user permissions
    fetchWithAuth("http://localhost:8000/api/current-user-permissions")
      .then((response) => response.json())
      .then((data) => setCurrentUserPermissions(data.permissions))
      .catch((error) => console.error("Error fetching permissions:", error));
  }, []);

  console.log(currentUserPermissions);

  return (
    <div>
      <h1>User Management</h1>
      <button onClick={() => (window.location.href = "/add-user")}>
        Add User
      </button>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>E-Mail</th>
            <th>Nom</th>
            <th>Phone</th>
            <th>Rôle(s)</th>
            <th>Permission(s)</th>
            <th>Agence</th>
            <th>Date de creation</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.userId}>
              <td>{index + 1}</td>
              <td>{user.email}</td>
              <td>{user.username}</td>
              <td>{user.phone}</td>
              <td>{user.roles.join(", ")}</td>
              <td>{user.permissions.join(", ")}</td>
              <td>{user.agencyName}</td>
              <td>{user.createdAt}</td>
              <td>{user.status}</td>
              <td>
                <button
                  onClick={() =>
                    (window.location.href = `/edit-user/${user.userId}`)
                  }
                  disabled={!currentUserPermissions.includes("Execute")}
                  style={{
                    backgroundColor: !currentUserPermissions.includes("Execute")
                      ? "grey"
                      : "#4CAF50",
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() =>
                    (window.location.href = `/delete-user/${user.userId}`)
                  }
                  disabled={!currentUserPermissions.includes("Delete")}
                  style={{
                    backgroundColor: !currentUserPermissions.includes("Delete")
                      ? "grey"
                      : "#4CAF50",
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
