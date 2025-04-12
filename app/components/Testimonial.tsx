"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Quote } from "lucide-react";

export default function Testimonial() {
  return (
    <motion.section
      className="relative overflow-hidden bg-white py-24 md:py-32"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.red.50),white)] opacity-30" />
      <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl shadow-red-600/5 ring-1 ring-red-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />

      <div className="container mx-auto px-6 sm:px-8 lg:px-16 max-w-6xl">
        <div className="flex flex-col items-center">
          {/* Logo */}
          <motion.div
            className="rounded-full bg-white p-4 w-16 h-16 flex items-center justify-center mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Image
              src="/images/logo.jpg"
              alt="Dormate logo"
              width={1000}
              height={1000}
              className="w-16 h-16 object-contain"
            />
          </motion.div>

          {/* Testimonial content */}
          <motion.div
            className="max-w-4xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <blockquote className="text-center">
              <p className="text-2xl md:text-3xl font-medium text-gray-900 leading-relaxed">
                &quot; Dormate là công ty mà tôi tin tưởng sử dụng bất động sản để mua nhà và thuê phòng,
                hoặc chỉ để xem những ngôi nhà mơ ước ở những khu vực mới. Cảm
                  ơn Dormate! &quot;
              </p>
            </blockquote>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
