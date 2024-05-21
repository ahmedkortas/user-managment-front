import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Correct import statement

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;
      if (decoded.exp > now) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  return { isAuthenticated };
};
