import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddUser.css";
import { useAuth } from "../hooks/useAuth";

const AddUser = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    status: "",
    roles: [],
    permissions: [],
    agencyId: "",
  });
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
    fetch("http://localhost:8000/api/roles")
      .then((response) => response.json())
      .then((data) => setRoles(data))
      .catch((error) => console.error("Error fetching roles:", error));

    fetch("http://localhost:8000/api/permissions")
      .then((response) => response.json())
      .then((data) => setPermissions(data))
      .catch((error) => console.error("Error fetching permissions:", error));

    fetch("http://localhost:8000/api/agencies")
      .then((response) => response.json())
      .then((data) => setAgencies(data))
      .catch((error) => console.error("Error fetching agencies:", error));
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      if (name.startsWith("role_")) {
        const roleId = parseInt(value);
        setFormData((prevState) => ({
          ...prevState,
          roles: checked
            ? [...prevState.roles, roleId]
            : prevState.roles.filter((role) => role !== roleId),
        }));
      } else if (name.startsWith("permission_")) {
        const permissionId = parseInt(value);
        setFormData((prevState) => ({
          ...prevState,
          permissions: checked
            ? [...prevState.permissions, permissionId]
            : prevState.permissions.filter(
                (permission) => permission !== permissionId
              ),
        }));
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.phone) newErrors.phone = "Phone is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!formData.status) newErrors.status = "Status is required";
    if (!formData.agencyId) newErrors.agencyId = "Agency is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert("User added successfully");
        navigate("/user-management");
      } else {
        alert("Failed to add user");
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  return (
    <div className="add-user">
      <h2>Ajouter Utilisateur</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Nom</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          {errors.username && <span className="error">{errors.username}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="phone">Téléphone</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
          {errors.phone && <span className="error">{errors.phone}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmer Mot de passe</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && (
            <span className="error">{errors.confirmPassword}</span>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <input
            type="text"
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          />
          {errors.status && <span className="error">{errors.status}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="agencyId">Agency</label>
          <select
            id="agencyId"
            name="agencyId"
            value={formData.agencyId}
            onChange={handleChange}
          >
            <option value="">Select Agency</option>
            {agencies.map((agency) => (
              <option key={agency.agencyId} value={agency.agencyId}>
                {agency.agencyName}
              </option>
            ))}
          </select>
          {errors.agencyId && <span className="error">{errors.agencyId}</span>}
        </div>
        <div className="form-group">
          <label>Rôles</label>
          {roles.map((role) => (
            <div key={role.roleId}>
              <input
                type="checkbox"
                id={`role_${role.roleId}`}
                name={`role_${role.roleId}`}
                value={role.roleId}
                checked={formData.roles.includes(role.roleId)}
                onChange={handleChange}
              />
              <label htmlFor={`role_${role.roleId}`}>{role.roleName}</label>
            </div>
          ))}
        </div>
        <div className="form-group">
          <label>Permissions</label>
          {permissions.map((permission) => (
            <div key={permission.permissionId}>
              <input
                type="checkbox"
                id={`permission_${permission.permissionId}`}
                name={`permission_${permission.permissionId}`}
                value={permission.permissionId}
                checked={formData.permissions.includes(permission.permissionId)}
                onChange={handleChange}
              />
              <label htmlFor={`permission_${permission.permissionId}`}>
                {permission.permissionName}
              </label>
            </div>
          ))}
        </div>
        <button type="submit">Créer</button>
      </form>
      <button
        className="back-button"
        onClick={() => navigate("/user-management")}
      >
        Back to List
      </button>
    </div>
  );
};

export default AddUser;
