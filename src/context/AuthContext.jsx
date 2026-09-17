import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Current user state (student/participant)
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('savadan_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    // Default demo student user
    return {
      uid: "user-101",
      email: "aarav.sharma@college.edu",
      displayName: "Aarav Sharma",
      phone: "9876543210",
      college: "National Institute of Technology (NIT)",
      nssId: "NSS-2023-8821",
      role: "student"
    };
  });

  // Admin state
  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem('savadan_admin');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('savadan_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('savadan_user');
    }
  }, [currentUser]);

  useEffect(() => {
    if (adminUser) {
      localStorage.setItem('savadan_admin', JSON.stringify(adminUser));
    } else {
      localStorage.removeItem('savadan_admin');
    }
  }, [adminUser]);

  // Student Login
  const login = async (email, password) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600)); // Smooth simulation
    
    // Create or retrieve session for student
    const userObj = {
      uid: `user-${Date.now().toString().slice(-4)}`,
      email: email,
      displayName: email.split('@')[0].replace('.', ' ').toUpperCase(),
      phone: "9876543210",
      college: "College of Engineering & Technology",
      role: "student"
    };
    setCurrentUser(userObj);
    setLoading(false);
    return userObj;
  };

  // Student Signup
  const signup = async (email, password, name, phone, college, nssId) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    const userObj = {
      uid: `user-${Date.now().toString().slice(-4)}`,
      email,
      displayName: name,
      phone,
      college,
      nssId: nssId || '',
      role: "student"
    };
    setCurrentUser(userObj);
    setLoading(false);
    return userObj;
  };

  // Logout student
  const logout = () => {
    setCurrentUser(null);
  };

  // Admin Login
  const loginAdmin = async (email, password) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    
    // Verify admin credentials
    if (email.trim().toLowerCase() === "admin@savadan.nss" && password === "admin123") {
      const adminObj = {
        uid: "admin-master-01",
        email: "admin@savadan.nss",
        displayName: "Prof. S. Narayanan (NSS Head)",
        role: "admin",
        permissions: ["full_access", "verify_payments", "export_reports"]
      };
      setAdminUser(adminObj);
      setLoading(false);
      return { success: true, admin: adminObj };
    } else {
      setLoading(false);
      return { success: false, error: "Invalid admin credentials. Use admin@savadan.nss / admin123" };
    }
  };

  // Logout admin
  const logoutAdmin = () => {
    setAdminUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        adminUser,
        loading,
        login,
        signup,
        logout,
        loginAdmin,
        logoutAdmin,
        setCurrentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
