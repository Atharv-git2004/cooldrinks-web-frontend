import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCheckCircle, FaCreditCard } from "react-icons/fa";

const Checkout = () => {
  const navigate = useNavigate();
  const [isOrdered, setIsOrdered] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  // Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");

  // Card Details States
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  // ലോക്കൽ സ്റ്റോറേജിൽ നിന്ന് കാർട്ട് ഡാറ്റ എടുക്കുന്നു
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(savedCart);
  }, []);

  // ആകെ തുക കണക്കാക്കുന്നു
  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleOrder = (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    // പുതിയ ഓർഡർ ഒബ്ജക്റ്റ് ഉണ്ടാക്കുന്നു
    const newOrder = {
      id: "ORD" + Date.now(),
      customerName: name,
      email: email,
      address: address,
      phone: phone,
      items: cartItems,
      total: totalAmount,
      paymentMethod: paymentMethod,
      status: "Pending", // അഡ്മിന് മാറ്റാൻ വേണ്ടി ഡിഫോൾട്ട് സ്റ്റാറ്റസ്
      date: new Date().toLocaleDateString("en-IN"),
    };

    // നിലവിലുള്ള ഓർഡറുകളിലേക്ക് പുതിയത് ചേർക്കുന്നു
    const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
    existingOrders.push(newOrder);
    localStorage.setItem("orders", JSON.stringify(existingOrders));

    // ഓർഡർ കഴിഞ്ഞ സ്ഥിതിക്ക് കാർട്ട് ക്ലിയർ ചെയ്യുന്നു
    localStorage.removeItem("cart");
    window.dispatchEvent(new Event("storage")); // Navbar കൗണ്ട് പുതുക്കാൻ

    setIsOrdered(true);

    // 3 സെക്കന്റിന് ശേഷം ഹോം പേജിലേക്ക് റീഡയറക്ട് ചെയ്യുന്നു
    setTimeout(() => navigate("/"), 3000);
  };

  if (isOrdered) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-white bg-black p-6 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-green-500 text-8xl mb-6">
          <FaCheckCircle />
        </motion.div>
        <h1 className="text-4xl font-black uppercase italic mb-2">Order Confirmed!</h1>
        <p className="text-gray-400">Thank you for shopping with Sprite. Redirecting to home...</p>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto min-h-screen text-white">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-400 hover:text-green-500 transition-all mb-10 uppercase text-xs font-bold tracking-widest"
      >
        <FaArrowLeft /> Back
      </button>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-4xl font-black uppercase italic tracking-tighter">
            Shipping <span className="text-green-500">Details</span>
          </h2>

          <form onSubmit={handleOrder} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase font-bold text-gray-500">Full Name</label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Atharv P"
                  className="bg-white/5 border border-white/10 p-4 rounded-2xl focus:border-green-500 outline-none transition-all"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase font-bold text-gray-500">Email Address</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="atharv@example.com"
                  className="bg-white/5 border border-white/10 p-4 rounded-2xl focus:border-green-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase font-bold text-gray-500">Shipping Address</label>
              <textarea
                required
                rows="3"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street name, City, Kerala"
                className="bg-white/5 border border-white/10 p-4 rounded-2xl focus:border-green-500 outline-none transition-all"
              ></textarea>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase font-bold text-gray-500">Phone Number</label>
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 0000000000"
                  className="bg-white/5 border border-white/10 p-4 rounded-2xl focus:border-green-500 outline-none transition-all"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase font-bold text-gray-500">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="bg-white/5 border border-white/10 p-4 rounded-2xl focus:border-green-500 outline-none transition-all text-white"
                >
                  <option value="Cash on Delivery" className="bg-[#111]">
                    Cash on Delivery
                  </option>
                  <option value="Card Payment" className="bg-[#111]">
                    Card Payment (Mock)
                  </option>
                </select>
              </div>
            </div>

            {/* Card Details (Card Payment സെലക്ട് ചെയ്താൽ മാത്രം കാണിക്കും) */}
            {paymentMethod === "Card Payment" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-4"
              >
                <h4 className="text-sm font-black uppercase tracking-wider text-green-400 flex items-center gap-2">
                  <FaCreditCard /> Card Information
                </h4>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase font-bold text-gray-500">Card Number</label>
                  <input
                    required={paymentMethod === "Card Payment"}
                    type="text"
                    maxLength="16"
                    placeholder="1234 5678 9101 1121"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="bg-black/40 border border-white/10 p-4 rounded-xl focus:border-green-500 outline-none text-sm transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase font-bold text-gray-500">Expiry Date</label>
                    <input
                      required={paymentMethod === "Card Payment"}
                      type="text"
                      maxLength="5"
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      className="bg-black/40 border border-white/10 p-4 rounded-xl focus:border-green-500 outline-none text-sm transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase font-bold text-gray-500">CVV</label>
                    <input
                      required={paymentMethod === "Card Payment"}
                      type="password"
                      maxLength="3"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      className="bg-black/40 border border-white/10 p-4 rounded-xl focus:border-green-500 outline-none text-sm transition-all"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            <button
              type="submit"
              className="w-full bg-green-500 text-black font-black py-5 rounded-[2rem] hover:bg-green-400 transition-all uppercase tracking-widest shadow-xl shadow-green-900/20"
            >
              Place Order (₹{totalAmount})
            </button>
          </form>
        </div>

        {/* Dynamic Order Summary */}
        <div className="bg-white/5 border border-white/10 p-8 rounded-[40px] h-fit sticky top-32">
          <h3 className="text-xl font-black mb-6 italic uppercase text-green-500">Your Order</h3>

          {cartItems.length === 0 ? (
            <p className="text-gray-500 text-sm">No items in cart.</p>
          ) : (
            <div className="space-y-4 text-sm border-b border-white/10 pb-6 max-h-60 overflow-y-auto pr-2">
              {cartItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-300">
                    {item.title} <span className="text-green-500 font-bold">x {item.quantity}</span>
                  </span>
                  <span className="font-bold">₹{item.price * item.quantity}</span>
                </div>
              ))}
              <div className="flex justify-between text-green-400 pt-2">
                <span>Shipping</span>
                <span>FREE</span>
              </div>
            </div>
          )}

          <div className="flex justify-between text-2xl font-black pt-6 italic">
            <span>Total</span>
            <span>₹{totalAmount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
