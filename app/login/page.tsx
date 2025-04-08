"use client";

import React from "react";
import { motion } from "framer-motion";
import LoginForm from "@/app/components/loginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl flex rounded-xl shadow-lg overflow-hidden"
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="w-1/2 bg-red-600 text-white p-12 hidden md:flex flex-col justify-between"
        >
          <div>
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-3xl font-bold mb-6"
            >
              Chào mừng bạn đến với Amora Stay
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-red-100"
            >
              Đăng nhập để truy cập vào tài khoản của bạn và khám phá các
              homestays tuyệt vời cho chuyến phượt của bạn.
            </motion.p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="w-full md:w-1/2 bg-white p-8 sm:p-12"
        >
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-800">
              Đăng nhập vào tài khoản của bạn
            </h2>
          </div>

          <LoginForm />
        </motion.div>
      </motion.div>
    </div>
  );
}
