import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // പേജ് റിഫ്രഷ് ചെയ്യുമ്പോൾ ലോക്കൽ സ്റ്റോറേജിൽ നിന്ന് യൂസറെ നേരിട്ട് എടുക്കുന്നു
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      return null;
    }
  });

  // യൂസർ ഡാറ്റ മുൻപ് തന്നെ ഉണ്ടെങ്കിൽ ലോഡിങ് സ്ക്രീൻ ഒഴിവാക്കാം, അല്ലെങ്കിൽ ട്രൂ ആക്കാം
  const [loading, setLoading] = useState(true);

  // അക്ഷിയോസ് ക്രെഡൻഷ്യൽസ് ഡിഫോൾട്ട് ആക്കുന്നു
  axios.defaults.withCredentials = true;

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      // ടോക്കൺ ഇല്ലെങ്കിൽ ക്ലിയർ ചെയ്യുന്നു
      if (!token || token === "undefined" || token === "null") {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setLoading(false);
        return;
      }

      try {
        // ടോക്കൺ ഗ്ലോബൽ ഹെഡറിലേക്ക് സെറ്റ് ചെയ്യുന്നു
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // ബാക്കെൻഡിൽ സെഷൻ ലൈവ് ആണോ എന്ന് നോക്കുന്നു
        const response = await axios.get("https://cooldrinkbackend.onrender.com/api/users/me");

        // ബാക്കെൻഡ് തരുന്നത് { success: true, user: {...} } ആയാലും
        // അല്ലെങ്കിൽ നേരിട്ട് {...userData} ആയാലും വർക്ക് ചെയ്യാൻ വേണ്ടി:
        const userData = response.data?.user || response.data;

        // യൂസർ ഡാറ്റ കിട്ടിയിട്ടുണ്ടെങ്കിൽ അത് സെറ്റ് ചെയ്യുക
        if (userData && (userData._id || userData.id || userData.email)) {
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        }
      } catch (error) {
        console.warn("Auth check warning:", error.message);

        // കൃത്യമായി 401 (Unauthorized - ടോക്കൺ എക്സ്പയർ ആയി) എറർ വന്നാൽ മാത്രം ലോഗൗട്ട് ചെയ്യുക.
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

  // 💡 FIX: useCallback ഉപയോഗിച്ച് ഫംഗ്ഷൻ പൊതിഞ്ഞു (Infinite loop ഒഴിവാക്കാൻ)
  const login = useCallback((userData, token) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    if (token) {
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  // 💡 FIX: logout-നും useCallback നൽകി
  const logout = useCallback(async () => {
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
  }, []);

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
