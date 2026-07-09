import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const DrinkBottle = ({ bottleImage, title, id }) => {
  // 🟢 ഇമേജ് URL കൃത്യമായി സെറ്റ് ചെയ്യാനുള്ള ഫംഗ്ഷൻ (ഡബിൾ URL ആകാതിരിക്കാനും സ്പേസ് ഒഴിവാക്കാനും)
  const getFormattedImageUrl = (imagePath) => {
    if (!imagePath) return "";

    // 1. ഓൾറെഡി ഫുൾ URL ആണെങ്കിൽ അത് തന്നെ ഉപയോഗിക്കുക
    if (imagePath.startsWith("http")) {
      return imagePath;
    }

    // 2. ഫയലിന്റെ പേര് മാത്രമാണെങ്കിൽ അത് എൻകോഡ് ചെയ്ത് ബാക്കെൻഡ് URL ആക്കുക
    const cleanPath = imagePath.replace(/\\/g, "/");
    const fileName = cleanPath.split("/").pop();
    const encodedFileName = encodeURIComponent(fileName);

    return `http://localhost:5000/uploads/${encodedFileName}`;
  };

  const backendImageUrl = getFormattedImageUrl(bottleImage);
  const localImageUrl = `/drinks/${bottleImage}`;

  return (
    <div className="relative flex justify-center items-center w-full h-[500px] md:h-[650px] overflow-visible perspective-[1000px]">
      {/* 1. Background Glow with Optimization */}
      <motion.div
        key={`glow-${id}`}
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: [0.2, 0.5, 0.2],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ translateZ: 0 }}
        className="absolute w-72 h-72 md:w-[450px] md:h-[450px] bg-white/20 blur-[100px] rounded-full z-0 will-change-[opacity,transform]"
      />

      <AnimatePresence mode="wait">
        {/* Entrance & Exit Animation Wrapper */}
        <motion.div
          key={id}
          initial={{ opacity: 0, y: 300, scale: 0.2, rotateY: 180, rotateZ: 45 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotateY: 0, rotateZ: 0 }}
          exit={{ opacity: 0, y: -300, scale: 0.5, rotateY: -180, rotateZ: -45 }}
          transition={{
            type: "spring",
            stiffness: 70,
            damping: 15,
            duration: 0.8,
          }}
          style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
          className="relative z-10 flex justify-center items-center w-full h-full will-change-transform"
        >
          {/* 2. Floating Bottle with GPU Acceleration */}
          <motion.img
            // ആദ്യം ബാക്കെൻഡിൽ നോക്കും
            src={backendImageUrl}
            // 🟢 ബാക്കെൻഡിൽ ഇമേജ് ഇല്ലെങ്കിൽ (പഴയ ഇമേജ് ആണെങ്കിൽ) ഈ കോഡ് വർക്ക് ആകും
            onError={(e) => {
              e.target.onerror = null; // അനന്തമായ ലൂപ്പ് ഒഴിവാക്കാൻ
              e.target.src = localImageUrl; // ഫ്രണ്ട്‌എൻഡിലെ ഫോൾഡറിലേക്ക് മാറും
            }}
            alt={title || "Drink Bottle"}
            loading="eager"
            animate={{
              y: [-15, 15, -15],
              rotateZ: [-2, 2, -2],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ translateZ: 0 }}
            className="relative z-50 h-[85%] w-auto object-contain drop-shadow-[0_40px_50px_rgba(0,0,0,0.5)] cursor-pointer will-change-transform"
            whileHover={{ scale: 1.05 }}
          />
        </motion.div>
      </AnimatePresence>

      {/* 3. Dynamic Shadow with Optimization */}
      <motion.div
        key={`shadow-${id}`}
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: [0.2, 0.6, 0.2],
          scale: [0.8, 1.2, 0.8],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ translateZ: 0 }}
        className="absolute bottom-5 w-52 h-8 bg-black/40 blur-2xl rounded-[100%] z-5 will-change-[opacity,transform]"
      />
    </div>
  );
};

export default DrinkBottle;
