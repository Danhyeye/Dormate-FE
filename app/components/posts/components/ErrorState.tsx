"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

const ErrorState = ({ error, onRetry }: ErrorStateProps) => (
  <motion.div 
    key="error"
    className="text-center p-10 bg-red-50 rounded-lg border border-red-200"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    transition={{ duration: 0.3 }}
  >
    <div className="text-red-600 text-lg font-medium">{error}</div>
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button 
        onClick={onRetry}
        className="mt-4 bg-red-500 hover:bg-red-600"
      >
        Thử lại
      </Button>
    </motion.div>
  </motion.div>
);

export default ErrorState;
