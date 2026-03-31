import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import BottomNav from './components/layout/BottomNav'; // പുതിയ BottomNav ഇംപോർട്ട് ചെയ്തു

// Pages Import
import Home from './pages/Home';
import Flavors from './pages/Flavors';
import About from './pages/About';
import Contact from './pages/Contact';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';

function App() {
  const location = useLocation();

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white selection:bg-green-500 selection:text-black flex flex-col">
      
      {/* 1. Navbar: Desktop-ൽ മെനുവും Mobile-ൽ ലോഗോയും മാത്രം കാണിക്കും */}
      <Navbar />

      {/* 2. Main Content Area */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            
            <Route path="/" element={
              <PageWrapper>
                <Home />
              </PageWrapper>
            } />

            <Route path="/flavors" element={
              <PageWrapper>
                <Flavors />
              </PageWrapper>
            } />

            <Route path="/product/:id" element={
              <PageWrapper>
                <ProductDetail />
              </PageWrapper>
            } />

            <Route path="/cart" element={
              <PageWrapper>
                <Cart />
              </PageWrapper>
            } />

            <Route path="/checkout" element={
              <PageWrapper>
                <Checkout />
              </PageWrapper>
            } />

            <Route path="/about" element={
              <PageWrapper>
                <About />
              </PageWrapper>
            } />

            <Route path="/contact" element={
              <PageWrapper>
                <Contact />
              </PageWrapper>
            } />

          </Routes>
        </AnimatePresence>
      </main>

      {/* 3. Footer: ഇതിന് മൊബൈലിൽ മാത്രം അടിയിൽ അല്പം സ്ഥലം (pb-24) നൽകി */}
      <footer className="pb-24 md:pb-0">
        <Footer />
      </footer>

      {/* 4. Bottom Navigation: മൊബൈലിൽ മാത്രം താഴെ ഐക്കണുകൾ കാണിക്കും */}
      <BottomNav />
      
    </div>
  );
}

/**
 * PageWrapper: പേജുകൾ മാറുമ്പോൾ ഉള്ള സ്മൂത്ത് സ്ലൈഡ് ആനിമേഷൻ
 */
const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.4, ease: "easeInOut" }}
  >
    {children}
  </motion.div>
);

export default App;