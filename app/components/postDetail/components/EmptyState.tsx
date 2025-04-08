"use client";

import { motion } from "framer-motion";

const EmptyState = () => (
  <motion.div 
    key="empty"
    className="text-center p-10 bg-gray-50 rounded-lg"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="text-gray-500 text-lg">Không tìm thấy thông tin phòng</div>
  </motion.div>
);

export default EmptyState;
