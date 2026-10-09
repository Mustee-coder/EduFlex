import { useEffect, useState } from "react";
import api from "@/api/apis";
import { AuthContext } from "@/context/authContextValue";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      try {
        const response = await api.get("/profile/getUserDetails");

        if (isMounted) {
          setUser(response.data?.data || null);
        }
      } catch {
        if (isMounted) {
          setUser(null);
          localStorage.removeItem("user");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  // LOGIN FUNCTION
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };
  
  const updateUser = (userData) => {
  setUser(userData);
  localStorage.setItem("user", JSON.stringify(userData));
};
  

  // LOGOUT FUNCTION
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  const value = {
  user,
  setUser,
  updateUser,
  login,
  logout,
  isAuthenticated: !!user,
  loading,
};

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
