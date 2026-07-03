import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiPackage, FiClock, FiTruck, FiCheckCircle } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    // ഓർഡറുകൾ എടുക്കാനുള്ള ഫങ്ഷൻ വേർതിരിച്ച് എഴുതുന്നു
    const fetchOrders = () => {
      const allOrders = JSON.parse(localStorage.getItem("orders")) || [];
      const userOrders = user?.email ? allOrders.filter((order) => order.email === user.email) : allOrders;

      // അറേ മ്യൂട്ടേഷൻ ഒഴിവാക്കാൻ spread operator ഉപയോഗിച്ച് reverse ചെയ്യുന്നു
      setOrders([...userOrders].reverse());
    };

    // 1. കോമ്പോണന്റ് ലോഡ് ആകുമ്പോൾ ആദ്യം ഈ ഫങ്ഷൻ പ്രവർത്തിക്കും
    fetchOrders();

    // 2. അഡ്മിൻ വേറൊരു ടാബിലിരുന്ന് മാറ്റം വരുത്തിയാൽ അപ്പൊൾ തന്നെ അപ്ഡേറ്റ് ആവാൻ
    window.addEventListener("storage", fetchOrders);

    // 3. ഓട്ടോമാറ്റിക് റിഫ്രഷിന് വേണ്ടി ഓരോ 2 സെക്കൻഡിലും ഡാറ്റ ചെക്ക് ചെയ്യുന്നു (Polling)
    const intervalId = setInterval(() => {
      fetchOrders();
    }, 2000);

    // കോമ്പോണന്റ് അൺമൗണ്ട് ആകുമ്പോൾ ഇവന്റ് ലിസണറുകളും ഇന്റർവലും ക്ലീൻ ചെയ്യുന്നു
    return () => {
      window.removeEventListener("storage", fetchOrders);
      clearInterval(intervalId);
    };
  }, [user]);

  // സ്റ്റാറ്റസ് അനുസരിച്ച് ഐക്കൺ മാറ്റാൻ
  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <FiClock className="text-yellow-400 text-lg" />;
      case "Shipped":
        return <FiTruck className="text-blue-400 text-lg" />;
      case "Delivered":
        return <FiCheckCircle className="text-green-400 text-lg" />;
      default:
        return <FiPackage className="text-gray-400 text-lg" />;
    }
  };

  // സ്റ്റാറ്റസ് അനുസരിച്ച് നിറം മാറ്റാൻ
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "Shipped":
        return "text-blue-400 bg-blue-400/10 border-blue-400/20";
      case "Delivered":
        return "text-green-400 bg-green-400/10 border-green-400/20";
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-10"
        >
          <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            <FiPackage className="text-2xl text-blue-500" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-white">
              My <span className="text-blue-500">Orders</span>
            </h1>
            <p className="text-gray-400 text-xs md:text-sm font-bold tracking-widest uppercase mt-1">
              Track your recent purchases
            </p>
          </div>
        </motion.div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/5 border border-white/10 rounded-[30px] p-12 text-center flex flex-col items-center justify-center shadow-2xl"
          >
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
              <FiPackage className="text-4xl text-gray-500" />
            </div>
            <h2 className="text-2xl font-black uppercase italic text-white mb-2 tracking-tighter">No Orders Yet</h2>
            <p className="text-gray-400 mb-8 text-sm font-medium">
              Looks like you haven't placed any orders. Start exploring our premium flavors!
            </p>
            <Link
              to="/flavors"
              className="bg-green-500 text-black px-8 py-3.5 rounded-full font-black uppercase tracking-widest text-xs hover:bg-green-400 transition-all duration-300 shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:scale-105"
            >
              Start Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 hover:border-white/20 transition-all duration-300 relative overflow-hidden group"
              >
                {/* Subtle gradient background effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                {/* Order Meta Info */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-6 relative z-10">
                  <div>
                    <p className="text-xs text-gray-500 font-mono mb-1 uppercase tracking-wider">
                      Order ID: <span className="text-gray-300">{order.id}</span>
                    </p>
                    <p className="text-sm text-gray-400 font-bold">{order.date}</p>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border flex items-center gap-2 w-fit ${getStatusColor(order.status)}`}
                  >
                    {getStatusIcon(order.status)}
                    {order.status}
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-4 relative z-10">
                  {order.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-black/20 p-3 rounded-2xl border border-white/5"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center p-2 border border-white/5">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-contain drop-shadow-lg"
                            />
                          ) : (
                            <FiPackage className="text-gray-500 text-xl" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-white font-black text-sm tracking-wide">{item.title}</h3>
                          <p className="text-gray-400 text-xs mt-1 font-bold">
                            Qty: <span className="text-green-400">{item.quantity}</span>
                          </p>
                        </div>
                      </div>
                      <p className="text-white font-mono font-bold pr-2">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>

                {/* Order Summary & Address */}
                <div className="mt-6 pt-6 border-t border-white/10 flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
                  <div className="bg-black/30 p-4 rounded-2xl border border-white/5 max-w-sm">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black mb-2">Shipping To:</p>
                    <p className="text-xs text-gray-300 leading-relaxed font-medium">{order.address}</p>
                  </div>
                  <div className="text-right bg-green-500/10 p-4 rounded-2xl border border-green-500/20 md:w-48 flex flex-col items-end justify-center">
                    <p className="text-[10px] text-green-500 uppercase tracking-widest font-black mb-1">Total Amount:</p>
                    <p className="text-2xl font-black italic text-white tracking-tighter">₹{order.total}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
