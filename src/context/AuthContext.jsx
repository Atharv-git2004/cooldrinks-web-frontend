import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 💡 1. പേജ് റിഫ്രഷ് ചെയ്യുമ്പോൾ ലോക്കൽ സ്റ്റോറേജിൽ നിന്ന് യൂസറെ നേരിട്ട് എടുക്കുന്നു (UI ഫ്ലാഷ് ഒഴിവാക്കാൻ)
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // അക്ഷിയോസ് ക്രെഡൻഷ്യൽസ് ഡിഫോൾട്ട് ആക്കുന്നു
  axios.defaults.withCredentials = true;

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      // 💡 2. ടോക്കൺ ഇല്ലെങ്കിൽ ബാക്കെൻഡിലേക്ക് റിക്വസ്റ്റ് അയക്കാതെ തന്നെ ലോഡിങ് നിർത്തുന്നു
      if (!token || token === "undefined" || token === "null") {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setLoading(false);
        return;
      }

      try {
        // 💡 3. ടോക്കൺ ഉണ്ടെങ്കിൽ അത് അക്ഷിയോസ് ഹെഡറിലേക്ക് ഗ്ലോബൽ ആയി സെറ്റ് ചെയ്യുന്നു
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // ബാക്കെൻഡിൽ സെഷൻ ലൈവ് ആണോ എന്ന് നോക്കുന്നു
        const response = await axios.get("https://cooldrinkbackend.onrender.com/api/users/me");

        if (response.data.success && response.data.user) {
          setUser(response.data.user);
          localStorage.setItem("user", JSON.stringify(response.data.user));
        } else {
          setUser(null);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          delete axios.defaults.headers.common["Authorization"];
        }
      } catch (error) {
        console.warn("Auth check failed or session expired:", error.message);

        // 💡 4. കൃത്യമായി 401 (Unauthorized) എറർ വന്നാൽ മാത്രം സ്റ്റേറ്റ് ക്ലിയർ ചെയ്യുക
        if (error.response && error.response.status === 401) {
          setUser(null);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          delete axios.defaults.headers.common["Authorization"];
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    if (token) {
      localStorage.setItem("token", token);
      // ലോഗിൻ ചെയ്യുമ്പോൾ തന്നെ ഗ്ലോബൽ ഹെഡർ സെറ്റ് ചെയ്യുന്നു
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  };

  const logout = async () => {
    try {
      await axios.get("https://cooldrinkbackend.onrender.com/api/users/logout");
    } catch (err) {
      console.error("Logout Error:", err);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading ? (
        children
      ) : (
        <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin mb-4"></div>
          <p className="text-green-500 font-black italic uppercase tracking-widest animate-pulse">Arctic Sip Loading...</p>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
