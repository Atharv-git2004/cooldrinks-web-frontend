import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // അക്ഷിയോസ് ക്രെഡൻഷ്യൽസ് ഡിഫോൾട്ട് ആക്കുക (സെഷൻ കുക്കീസ് ബാക്കെൻഡിലേക്ക് പോകാൻ ഇത് നിർബന്ധമാണ്)
  axios.defaults.withCredentials = true;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // ലോക്കൽ സ്റ്റോറേജിൽ നിന്ന് ടോക്കൺ എടുക്കുന്നു
        const token = localStorage.getItem("token");

        // ടോക്കൺ ഉണ്ടെങ്കിൽ ഹെഡറിൽ ഉൾപ്പെടുത്താൻ config സെറ്റ് ചെയ്യുന്നു
        const config = token
          ? {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          : {};

        // ഓരോ തവണ പേജ് റീഫ്രഷ് ചെയ്യുമ്പോഴും ബാക്കെൻഡിൽ സെഷൻ ലൈവ് ആണോ എന്ന് നോക്കുന്നു
        const response = await axios.get("https://cooldrinkbackend.onrender.com/api/users/me", config);

        if (response.data.success && response.data.user) {
          setUser(response.data.user);
          localStorage.setItem("user", JSON.stringify(response.data.user)); // സ്റ്റോറേജിലും സേവ് ചെയ്യുന്നു
        } else {
          // ഡാറ്റ ഇല്ലെങ്കിൽ സ്റ്റേറ്റ് ക്ലിയർ ചെയ്യുക
          setUser(null);
          localStorage.removeItem("user");
          localStorage.removeItem("token"); // 💡 പഴയ ടോക്കൺ ക്ലിയർ ചെയ്യുന്നു
        }
      } catch (error) {
        // ബാക്കെൻഡിൽ സെഷൻ ഇല്ലെങ്കിൽ (401 Error) യൂസറെ ലോഗൗട്ട് ചെയ്യുന്നു
        console.warn("User not logged in or session expired.");
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token"); // 💡 എറർ വന്നാലും ടോക്കൺ ക്ലിയർ ചെയ്യണം
      } finally {
        setLoading(false); // എന്തായാലും ലോഡിങ് അവസാനിപ്പിക്കുക
      }
    };

    checkAuth();
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    if (token) {
      localStorage.setItem("token", token); // 💡 ലോഗിൻ ചെയ്യുമ്പോൾ ടോക്കൺ കൂടി സേവ് ചെയ്യാം
    }
  };

  const logout = async () => {
    try {
      // ബാക്കെൻഡിലെ കുക്കി/സെഷൻ ക്ലിയർ ചെയ്യാൻ
      await axios.get("https://cooldrinkbackend.onrender.com/api/users/logout");
    } catch (err) {
      console.error("Logout Error:", err);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token"); // 💡 ലോഗൗട്ട് ചെയ്യുമ്പോൾ നിർബന്ധമായും ടോക്കൺ കളയണം
      window.location.href = "/login"; // ലോഗിൻ പേജിലേക്ക് തിരിച്ചുവിടുന്നു
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
