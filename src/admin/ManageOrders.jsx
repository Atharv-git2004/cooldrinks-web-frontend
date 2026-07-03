import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaClock,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaUser,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("All");

  // ലോക്കൽ സ്റ്റോറേജിൽ നിന്ന് എല്ലാ ഓർഡറുകളും എടുക്കുന്നു
  useEffect(() => {
    const fetchedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    // പുതിയ ഓർഡറുകൾ ആദ്യം കാണിക്കാൻ വേണ്ടി reverse ചെയ്യുന്നു
    setOrders(fetchedOrders.reverse());
  }, []);

  // ഓർഡർ സ്റ്റാറ്റസ് അപ്ഡേറ്റ് ചെയ്യാനുള്ള ഫങ്ക്ഷൻ
  const handleStatusChange = (orderId, newStatus) => {
    const allOrders = JSON.parse(localStorage.getItem("orders")) || [];
    const updatedOrders = allOrders.map((order) => {
      if (order.id === orderId) {
        return { ...order, status: newStatus };
      }
      return order;
    });

    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    // സ്റ്റേറ്റ് അപ്ഡേറ്റ് ചെയ്ത് പേജിൽ ഉടനടി മാറ്റം കാണിക്കുന്നു
    setOrders(updatedOrders.reverse());
  };

  // സ്റ്റാറ്റസ് അനുസരിച്ച് കളർ കൊടുക്കാൻ
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

  // ഫിൽട്ടർ അനുസരിച്ച് ഓർഡറുകൾ വേർതിരിക്കുന്നു
  const filteredOrders = orders.filter((order) => filter === "All" || order.status === filter);

  return (
    <div className="p-6 lg:p-10 min-h-screen text-white bg-[#0d0d0d]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter">
            Manage <span className="text-green-500">Orders</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">Monitor and update customer orders efficiently.</p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10 w-fit">
          {["All", "Pending", "Shipped", "Delivered"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                filter === status ? "bg-green-500 text-black" : "text-gray-400 hover:text-white"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-20 bg-white/5 border border-white/10 rounded-[30px]">
          <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">
            No {filter !== "All" ? filter : ""} Orders Found
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredOrders.map((order) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={order.id}
              className="bg-white/5 border border-white/10 rounded-[30px] p-6 lg:p-8 grid lg:grid-cols-3 gap-8 relative overflow-hidden"
            >
              {/* Customer & Order ID Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-gray-500">{order.id}</span>
                  <span className="text-xs text-gray-400 font-bold">{order.date}</span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-black text-white flex items-center gap-2">
                    <FaUser className="text-green-500 text-sm" /> {order.customerName}
                  </h3>
                  <p className="text-gray-400 text-xs flex items-center gap-2">
                    <FaEnvelope /> {order.email}
                  </p>
                  <p className="text-gray-400 text-xs flex items-center gap-2">
                    <FaPhone /> {order.phone}
                  </p>
                  <p className="text-gray-400 text-xs flex items-start gap-2 pt-2 border-t border-white/5">
                    <FaMapMarkerAlt className="mt-0.5 text-red-400" />
                    <span>{order.address}</span>
                  </p>
                </div>
              </div>

              {/* Product Details Section */}
              <div className="bg-black/30 p-4 rounded-2xl border border-white/5 h-fit space-y-3">
                <h4 className="text-xs uppercase font-black tracking-wider text-gray-500">Items Ordered</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <span className="text-gray-300">
                        {item.title} <span className="text-green-500 font-bold">x{item.quantity}</span>
                      </span>
                      <span className="font-mono text-gray-400">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-white/10 text-lg font-black italic">
                  <span className="text-green-500 uppercase text-xs tracking-widest not-italic">Total Amount</span>
                  <span>₹{order.total}</span>
                </div>
                <div className="text-[10px] uppercase font-bold text-gray-500 text-right">Mode: {order.paymentMethod}</div>
              </div>

              {/* Status Update Actions */}
              <div className="flex flex-col justify-between gap-4">
                <div>
                  <h4 className="text-xs uppercase font-black tracking-wider text-gray-500 mb-2">Current Status</h4>
                  <div
                    className={`w-fit px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${getStatusColor(order.status)}`}
                  >
                    {order.status}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs uppercase font-black tracking-wider text-gray-500">Update Status To</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleStatusChange(order.id, "Pending")}
                      className={`p-2.5 rounded-xl border border-white/10 flex items-center justify-center gap-1 text-xs font-bold hover:bg-yellow-500 hover:text-black transition-all ${order.status === "Pending" ? "opacity-30 pointer-events-none" : ""}`}
                      title="Set to Pending"
                    >
                      <FaClock /> <span className="hidden sm:inline">Pending</span>
                    </button>
                    <button
                      onClick={() => handleStatusChange(order.id, "Shipped")}
                      className={`p-2.5 rounded-xl border border-white/10 flex items-center justify-center gap-1 text-xs font-bold hover:bg-blue-500 hover:text-black transition-all ${order.status === "Shipped" ? "opacity-30 pointer-events-none" : ""}`}
                      title="Set to Shipped"
                    >
                      <FaTruck /> <span className="hidden sm:inline">Shipped</span>
                    </button>
                    <button
                      onClick={() => handleStatusChange(order.id, "Delivered")}
                      className={`p-2.5 rounded-xl border border-white/10 flex items-center justify-center gap-1 text-xs font-bold hover:bg-green-500 hover:text-black transition-all ${order.status === "Delivered" ? "opacity-30 pointer-events-none" : ""}`}
                      title="Set to Delivered"
                    >
                      <FaCheckCircle /> <span className="hidden sm:inline">Delivered</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageOrders;
