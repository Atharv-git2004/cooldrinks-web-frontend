import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. Context ക്രിയേറ്റ് ചെയ്യുന്നു
const AuthContext = createContext();

// 2. Provider Component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // ആപ്പ് ലോഡ് ചെയ്യുമ്പോൾ localStorage-ൽ നിന്ന് യൂസർ ഡാറ്റ ഉണ്ടോ എന്ന് നോക്കുന്നു
    useEffect(() => {
        const loadUser = () => {
            try {
                const savedUser = localStorage.getItem('user');
                // ഡാറ്റ ഉണ്ടെങ്കിൽ അത് സ്റ്റേറ്റിലേക്ക് മാറ്റുന്നു
                if (savedUser && savedUser !== "undefined") {
                    setUser(JSON.parse(savedUser));
                }
            } catch (error) {
                console.error("AuthContext: Error parsing user data", error);
                localStorage.removeItem('user');
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    /**
     * Login Function: ലോഗിൻ സക്സസ് ആകുമ്പോൾ ഈ ഫംഗ്ഷൻ വിളിക്കണം
     * @param {Object} userData - ബാക്കെൻഡിൽ നിന്ന് കിട്ടുന്ന യൂസർ ഒബ്ജക്റ്റ്
     */
    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    /**
     * Logout Function: സ്റ്റേറ്റും ലോക്കൽ സ്റ്റോറേജും ക്ലിയർ ചെയ്യുന്നു
     */
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        // ലോഗൗട്ട് ചെയ്യുമ്പോൾ യൂസറെ ലോഗിൻ പേജിലേക്ക് വിടുന്നത് നല്ലതാണ്
        window.location.href = '/login'; 
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {/* യൂസർ ഉണ്ടോ എന്ന് ചെക്ക് ചെയ്ത് കഴിയുന്നത് വരെ (loading: true) 
                ഒരു ചെറിയ ലോഡിങ് സ്ക്രീൻ കാണിക്കുന്നത് നല്ലതാണ്.
            */}
            {!loading ? children : (
                <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center">
                    <div className="w-12 h-12 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin mb-4"></div>
                    <p className="text-green-500 font-black italic uppercase tracking-widest animate-pulse">
                        Arctic Sip Loading...
                    </p>
                </div>
            )}
        </AuthContext.Provider>
    );
};

// 3. Custom Hook: മറ്റ് പേജുകളിൽ ഇംപോർട്ട് ചെയ്യാൻ എളുപ്പത്തിന്
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};