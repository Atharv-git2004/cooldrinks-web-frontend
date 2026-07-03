import React from "react";
import { Routes, Route, useLocation, Navigate, Outlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "./context/AuthContext";

// Layout Components
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import BottomNav from "./components/layout/BottomNav";

// User & Auth Pages
import Home from "./pages/Home";
import Flavors from "./pages/Flavors";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders"; // പുതിയ Orders പേജ് ഇംപോർട്ട് ചെയ്തു
import Login from "./pages/Login";
import Register from "./pages/Register";

// Admin Pages
import AdminLayout from "./admin/AdminLayout";
import AddProduct from "./admin/AddProduct";
import ManageProducts from "./admin/ManageProducts";
import HomeManager from "./admin/HomeManager";
import ManageOrders from "./admin/ManageOrders"; // പുതിയ ManageOrders പേജ് ഇംപോർട്ട് ചെയ്തു

/**
 * PageWrapper: ഓരോ പേജും മാറുമ്പോൾ വരുന്ന സ്മൂത്ത് ആനിമേഷൻ.
 * initial, animate, exit എന്നിവ കൃത്യമായി നൽകിയിട്ടുണ്ട്.
 */
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

/**
 * ProtectedRoute: അഡ്മിൻ ലോഗിൻ പരിശോധിക്കുന്നു
 */
const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-green-500 font-black uppercase italic tracking-widest">
        Verifying Access...
      </div>
    );
  }

  // Role "admin" ആണോ എന്ന് ചെക്ക് ചെയ്യുന്നു
  const isAdmin = user && user.role && user.role.toLowerCase() === "admin";

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

function App() {
  const location = useLocation();

  // Admin പാത്തുകളിലും Auth പേജുകളിലും Navbar/Footer ഒഴിവാക്കാൻ
  const isAdminPath = location.pathname.startsWith("/admin");
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white selection:bg-green-500 selection:text-black flex flex-col overflow-x-hidden">
      {/* Navbar: Admin അല്ലെങ്കിലും Auth പേജ് അല്ലെങ്കിലും മാത്രം കാണിക്കും */}
      {!isAdminPath && !isAuthPage && <Navbar />}

      <main className="flex-grow">
        {/* AnimatePresence: പേജ് ട്രാൻസിഷൻ എനേബിൾ ചെയ്യുന്നു */}
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
            {/* യൂസർക്ക് ഓർഡറുകൾ കാണാനുള്ള റൂട്ട് */}
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
            <Route
              path="/contact"
              element={
                <PageWrapper>
                  <Contact />
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
                      <div className="p-10 text-4xl font-black italic uppercase text-green-500">Admin Dashboard</div>
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
                {/* അഡ്മിന് ഓർഡറുകൾ മാനേജ് ചെയ്യാനുള്ള റൂട്ട് */}
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

            {/* Default Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>

      {/* Footer & BottomNav: Admin അല്ലെങ്കിലും Auth പേജ് അല്ലെങ്കിലും മാത്രം കാണിക്കും */}
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
