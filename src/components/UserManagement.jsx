import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserManagement.css";
import { useAuth } from "../hooks/useAuth";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
    const token = localStorage.getItem("token");
    fetch("http://localhost:8000/api/roles", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setRoles(data))
      .catch((error) => console.error("Error fetching roles:", error));

    fetch("http://localhost:8000/api/permissions", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setPermissions(data))
      .catch((error) => console.error("Error fetching permissions:", error));

    fetch("http://localhost:8000/api/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching users:", error));
  }, [isAuthenticated, navigate]);

  return (
    <div>
      <h1>User Management</h1>
      <button onClick={() => navigate("/add-user")}>Add User</button>
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
                  onClick={() => navigate(`/edit-user/${user.userId}`)}
                  disabled={!user.permissions.includes("Edit")}
                >
                  Edit
                </button>
                <button
                  onClick={() => navigate(`/delete-user/${user.userId}`)}
                  disabled={!user.permissions.includes("Delete")}
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
