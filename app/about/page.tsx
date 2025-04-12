"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2, Home, Users, Shield, Search, Building, Wallet } from "lucide-react";

const AboutPage = () => {
  return (
    <main className="pt-28 w-3/4 mx-auto">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <Image
          src="/images/cover-page-aroma-03.png"
          alt="Dormate"
          fill
          sizes="(max-inline-size: 768px) 100vw, 100vw"
          className="object-cover rounded-lg"
          priority
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
          <div className="container mx-auto px-6 text-center">
            <motion.h1
              className="text-4xl md:text-6xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Về Dormate
            </motion.h1>
            <motion.p
              className="text-xl text-white/90 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Nền tảng kết nối người thuê và chủ nhà một cách hiệu quả, mang đến trải nghiệm tìm phòng và cho thuê phòng đơn giản, an toàn và tiện lợi
            </motion.p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="pt-20 pb-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Câu chuyện của chúng tôi
              </h2>
              <div className="w-20 h-1 bg-red-600 mb-8"></div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Dormate được thành lập với sứ mệnh giải quyết những thách thức trong thị trường thuê phòng trọ tại Việt Nam. Chúng tôi nhận thấy việc tìm kiếm phòng trọ phù hợp thường gặp nhiều khó khăn, thiếu minh bạch và mất nhiều thời gian cho cả người thuê và chủ nhà.
              </p>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Với nền tảng công nghệ hiện đại, Dormate kết nối trực tiếp người thuê phòng với chủ nhà, loại bỏ trung gian không cần thiết, giúp quá trình tìm kiếm và cho thuê phòng trở nên đơn giản, minh bạch và hiệu quả hơn.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Tên gọi Dormate - kết hợp từ "Dormitory" (ký túc xá) và "Mate" (bạn đồng hành) - thể hiện cam kết của chúng tôi trong việc trở thành người bạn đồng hành đáng tin cậy trên hành trình tìm kiếm tổ ấm của mỗi người.
              </p>
            </motion.div>
            <motion.div
              className="relative rounded-lg overflow-hidden w-full h-auto"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Image
                src="/images/logo.jpg"
                alt="Our story"
                width={1200}
                height={800}
                className="w-full object-contain"
                quality={100}
                priority={true}
                sizes="(max-inline-size: 800px) 100vw, (max-inline-size: 1200px) 90vw, 70vw"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Giá trị cốt lõi của chúng tôi
            </h2>
            <p className="text-gray-700 max-w-3xl mx-auto">
              Tại Dormate, chúng tôi định hướng mọi hoạt động dựa trên những
              giá trị cốt lõi sau đây
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <CheckCircle2 className="h-12 w-12 text-red-600" />,
                title: "Chính trực",
                description:
                  "Chúng tôi cam kết duy trì tính minh bạch và trung thực trong mọi giao dịch và thông tin.",
              },
              {
                icon: <Users className="h-12 w-12 text-red-600" />,
                title: "Kết nối",
                description:
                  "Chúng tôi tạo ra cầu nối hiệu quả giữa người thuê phòng và chủ nhà, xây dựng cộng đồng gắn kết.",
              },
              {
                icon: <Building className="h-12 w-12 text-red-600" />,
                title: "Chất lượng",
                description:
                  "Chúng tôi không ngừng nâng cao chất lượng dịch vụ để đảm bảo trải nghiệm tốt nhất cho người dùng.",
              },
              {
                icon: <Wallet className="h-12 w-12 text-red-600" />,
                title: "Giá trị",
                description:
                  "Chúng tôi tạo ra giá trị thực sự cho cả người thuê và chủ nhà thông qua nền tảng hiệu quả và tiết kiệm chi phí.",
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="mb-6">{value.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-700">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden h-[60vh] md:h-[70vh]">
        <Image
          src="/images/cover-page-aroma-05.png"
          alt="Dormate background"
          fill
          className="object-cover rounded-lg"
          sizes="200vw"
          priority={false}
          quality={85}
        />
        <div className="absolute inset-0 bg-black/50 rounded-lg"></div>
        <div className="container relative z-10 mx-auto px-6 text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Bắt đầu ngay hôm nay với Dormate
          </motion.h2>
          <motion.p
            className="max-w-3xl mx-auto mb-10 text-white/90"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Dù bạn đang tìm kiếm phòng trọ lý tưởng hay muốn cho thuê phòng một cách hiệu quả, 
            Dormate là nền tảng đáng tin cậy dành cho bạn. Tham gia cùng hàng nghìn người dùng khác 
            trên hành trình tìm kiếm tổ ấm của mình!
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <a href="/posts" className="inline-flex items-center justify-center rounded-md bg-red-600 px-8 py-3 text-sm font-medium text-white shadow transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-700">
              Tìm phòng ngay
            </a>
            <a href="/login" className="inline-flex items-center justify-center rounded-md border border-red-600 px-8 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-600/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-700">
              Đăng phòng cho thuê
            </a>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
