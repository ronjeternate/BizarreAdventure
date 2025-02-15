import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebase"; // Ensure Firebase auth is imported
import { onAuthStateChanged, signOut } from "firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // ✅ Force logout when the app starts
    signOut(auth).then(() => {
      console.log("User signed out on app start");
      setCurrentUser(null);
    });

    // ✅ Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed:", user);
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ currentUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
