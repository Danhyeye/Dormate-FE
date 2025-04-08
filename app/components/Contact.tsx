"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Phone, Mail, MapPin } from "lucide-react";

export default function Contact() {
  return (
    <motion.div
      className="bg-gradient-to-br from-white to-red-50 py-16 sm:py-20 md:py-24 lg:py-28"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="container mx-auto px-4 sm:px-6 md:w-5/6 lg:w-4/5 xl:w-3/4">
        <div className="relative overflow-hidden bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl md:rounded-3xl shadow-2xl">
          <div className="absolute right-0 top-0 w-1/2 h-full hidden lg:block">
            <div className="absolute inset-0 bg-black/40 z-10"></div>
            <div className="relative w-full h-full">
              <Image
                alt="Hình ảnh dịch vụ"
                src="https://images.pexels.com/photos/164516/pexels-photo-164516.jpeg"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                priority={true}
              />
            </div>
          </div>

          <div className="relative grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 p-6 sm:p-8 md:p-12 lg:p-16">
            {/* Contact Content */}
            <motion.div
              className="space-y-6 sm:space-y-8"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {/* Heading */}
              <div className="space-y-3 sm:space-y-4">
                <motion.h2
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  Liên hệ với
                  <br className="hidden sm:block" /> chúng tôi ngay
                </motion.h2>

                <motion.div
                  className="w-16 sm:w-20 h-1 bg-red-600 rounded"
                  initial={{ width: 0 }}
                  whileInView={{ width: 80 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  viewport={{ once: true }}
                ></motion.div>

                <motion.p
                  className="text-base sm:text-lg text-gray-300 max-w-md"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  Bạn đang tìm kiếm phòng nghỉ khách sạn, bất động sản nhà phố
                  hoặc muốn mua/bán nhà đất? Chúng tôi luôn sẵn sàng hỗ trợ bạn.
                </motion.p>
              </div>

              {/* Contact info */}
              <motion.div
                className="space-y-4 sm:space-y-5"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="bg-red-600/20 p-2 sm:p-3 rounded-full">
                    <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs sm:text-sm">
                      Điện thoại
                    </p>
                    <p className="text-white text-sm sm:text-base font-medium">
                      0343904061
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="bg-red-600/20 p-2 sm:p-3 rounded-full">
                    <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs sm:text-sm">Email</p>
                    <p className="text-white text-sm sm:text-base font-medium break-words">
                      dangtien9955@gmail.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="bg-red-600/20 p-2 sm:p-3 rounded-full">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs sm:text-sm">Địa chỉ</p>
                    <p className="text-white text-sm sm:text-base font-medium">
                      Vinhome, Quận 9, Hồ Chí Minh
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <Link
                  href="#"
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3.5 rounded-xl font-semibold flex items-center justify-center transition-all duration-300 shadow-lg shadow-red-600/30 hover:shadow-red-600/50"
                >
                  Liên hệ ngay
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="#"
                  className="border border-gray-600 hover:border-gray-400 text-white px-6 py-3.5 rounded-xl font-semibold flex items-center justify-center transition-all duration-300"
                >
                  Tìm hiểu thêm
                </Link>
              </motion.div>
            </motion.div>

            {/* Contact form - visible on mobile, hidden on desktop */}
            <motion.div
              className="lg:hidden"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Image
                alt="Hình ảnh dịch vụ"
                src="https://images.pexels.com/photos/164516/pexels-photo-164516.jpeg"
                width={600}
                height={400}
                className="rounded-xl w-full h-[300px] object-cover"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
