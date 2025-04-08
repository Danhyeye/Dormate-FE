"use client";

import React from "react";
import { motion } from "framer-motion";
import RegisterForm from "@/app/components/registerForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
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
          className="w-full md:w-1/2 bg-white p-8 sm:p-12"
        >
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-800">
              Đăng ký tài khoản
            </h2>
            <p className="text-gray-600 mt-2">
              Đăng ký để khám phá các homestays tuyệt vời
            </p>
          </div>

          <RegisterForm />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="w-1/2 bg-emerald-600 text-white p-12 hidden md:flex flex-col justify-between"
        >
          <div>
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-3xl font-bold mb-6"
            >
              Tham gia cộng đồng của chúng tôi
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-emerald-100"
            >
              Đăng ký để đặt chỗ ở tuyệt vời, lưu trữ các địa điểm yêu thích và
              nhận các gợi ý cá nhân.
            </motion.p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
