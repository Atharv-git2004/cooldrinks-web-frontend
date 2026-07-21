import React, { useEffect } from "react";
import { Routes, Route, useLocation, Navigate, Outlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { useAuth } from "./context/AuthContext";

// Layout Components
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import BottomNav from "./components/layout/BottomNav";

// User & Auth Pages
import Home from "./pages/Home";
import Flavors from "./pages/Flavors";
import About from "./pages/About";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Admin Pages
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AddProduct from "./admin/AddProduct";
import ManageProducts from "./admin/ManageProducts";
import HomeManager from "./admin/HomeManager";
import ManageOrders from "./admin/ManageOrders";

// 🟢 Axios Global Configuration (Render Backend URL)
axios.defaults.baseURL = "https://cooldrinkbackend.onrender.com";
axios.defaults.withCredentials = true;

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    className="w-full h-full"
  >
    {children}
  </motion.div>
);

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-green-500 font-black uppercase italic tracking-widest">
        Verifying Access...
      </div>
    );
  }

  const isAdmin = user && user.role && user.role.toLowerCase() === "admin";

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

function App() {
  const location = useLocation();
  const { login } = useAuth();

  // Restore session on page refresh (Manual & Google Auth support)
  useEffect(() => {
    // 🟢 URL-ൽ നിന്നും token ഉം user ഡാറ്റയും എടുക്കാൻ
    const queryParams = new URLSearchParams(window.location.search);
    const urlToken = queryParams.get("token");
    const urlUser = queryParams.get("user");

    if (urlToken && urlUser) {
      try {
        // ഗൂഗിൾ ലോഗിൻ വഴി വന്നതാണെങ്കിൽ
        const parsedUser = JSON.parse(decodeURIComponent(urlUser));

        localStorage.setItem("token", urlToken);
        localStorage.setItem("user", JSON.stringify(parsedUser));

        axios.defaults.headers.common["Authorization"] = `Bearer ${urlToken}`;
        login(parsedUser);

        // 🟢 URL ക്ലീൻ ചെയ്യാൻ (token കാണിക്കാതിരിക്കാൻ)
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (error) {
        console.error("Error parsing user data from URL:", error);
      }
    } else {
      // 🟢 മാനുവൽ ലോഗിൻ വഴിയോ നേരത്തെ ലോഗിൻ ചെയ്തതോ ആണെങ്കിൽ (localStorage check)
      const savedToken = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (savedToken && savedUser) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
        login(JSON.parse(savedUser));
      }
    }
  }, [login]);

  const isAdminPath = location.pathname.startsWith("/admin");
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white selection:bg-green-500 selection:text-black flex flex-col overflow-x-hidden">
      {!isAdminPath && !isAuthPage && <Navbar />}

      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* --- USER & AUTH ROUTES --- */}
            <Route
              path="/"
              element={
                <PageWrapper>
                  <Home />
                </PageWrapper>
              }
            />
            <Route
              path="/login"
              element={
                <PageWrapper>
                  <Login />
                </PageWrapper>
              }
            />
            <Route
              path="/register"
              element={
                <PageWrapper>
                  <Register />
                </PageWrapper>
              }
            />
            <Route
              path="/flavors"
              element={
                <PageWrapper>
                  <Flavors />
                </PageWrapper>
              }
            />
            <Route
              path="/product/:id"
              element={
                <PageWrapper>
                  <ProductDetail />
                </PageWrapper>
              }
            />
            <Route
              path="/cart"
              element={
                <PageWrapper>
                  <Cart />
                </PageWrapper>
              }
            />
            <Route
              path="/wishlist"
              element={
                <PageWrapper>
                  <Wishlist />
                </PageWrapper>
              }
            />
            <Route
              path="/checkout"
              element={
                <PageWrapper>
                  <Checkout />
                </PageWrapper>
              }
            />
            <Route
              path="/orders"
              element={
                <PageWrapper>
                  <Orders />
                </PageWrapper>
              }
            />
            <Route
              path="/about"
              element={
                <PageWrapper>
                  <About />
                </PageWrapper>
              }
            />

            {/* --- ADMIN ROUTES (Protected) --- */}
            <Route path="/admin" element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route
                  index
                  element={
                    <PageWrapper>
                      <AdminDashboard />
                    </PageWrapper>
                  }
                />
                <Route
                  path="add"
                  element={
                    <PageWrapper>
                      <AddProduct />
                    </PageWrapper>
                  }
                />
                <Route
                  path="manage"
                  element={
                    <PageWrapper>
                      <ManageProducts />
                    </PageWrapper>
                  }
                />
                <Route
                  path="home"
                  element={
                    <PageWrapper>
                      <HomeManager />
                    </PageWrapper>
                  }
                />
                <Route
                  path="orders"
                  element={
                    <PageWrapper>
                      <ManageOrders />
                    </PageWrapper>
                  }
                />
              </Route>
            </Route>

            {/* 404 / Catch-all Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>

      {!isAdminPath && !isAuthPage && (
        <>
          <footer className="pb-24 md:pb-0">
            <Footer />
          </footer>
          <BottomNav />
        </>
      )}
    </div>
  );
}

export default App;
