"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2, Heart, Users, Award } from "lucide-react";

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
              Khám phá câu chuyện về hành trình của chúng tôi và những giá trị
              cốt lõi định hình nên dịch vụ lưu trú độc đáo này
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
                Dormate được thành lập vào năm 2025 với tầm nhìn đổi mới trải
                nghiệm lưu trú tại Việt Nam. Chúng tôi bắt đầu với một khách sạn
                nhỏ tại Quảng Ngãi và từng bước phát triển thành chuỗi khách sạn
                cao cấp được yêu thích trên khắp cả nước.
              </p>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Điều làm nên sự khác biệt của Dormate chính là cam kết mang
                đến dịch vụ cá nhân hóa, thiết kế độc đáo kết hợp hiện đại với
                văn hóa địa phương, và sự tận tâm trong từng chi tiết.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Tên gọi Dormate lấy cảm hứng từ tình yêu (Dorm) với nghề và niềm
                đam mê phục vụ khách hàng một cách tận tâm. Mỗi khách sạn trong
                hệ thống Dormate đều được thiết kế để phản ánh vẻ đẹp của địa
                phương, tạo nên không gian độc đáo cho du khách khám phá và thư
                giãn.
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
                src="/images/cover-page-aroma-04.png"
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
      <section className="py-20 ">
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
                icon: <Heart className="h-12 w-12 text-red-600" />,
                title: "Hiếu khách",
                description:
                  "Chúng tôi chào đón mỗi vị khách với sự ấm áp và thân thiện, tạo cảm giác như họ đang trở về nhà.",
              },
              {
                icon: <Award className="h-12 w-12 text-red-600" />,
                title: "Chất lượng",
                description:
                  "Chúng tôi cam kết mang đến trải nghiệm lưu trú cao cấp thông qua các tiêu chuẩn chất lượng nghiêm ngặt.",
              },
              {
                icon: <Users className="h-12 w-12 text-red-600" />,
                title: "Cộng đồng",
                description:
                  "Chúng tôi tạo cơ hội việc làm và đóng góp vào phát triển kinh tế địa phương tại mỗi địa điểm.",
              },
              {
                icon: <CheckCircle2 className="h-12 w-12 text-red-600" />,
                title: "Trách nhiệm",
                description:
                  "Chúng tôi cam kết hoạt động kinh doanh có trách nhiệm, bảo vệ môi trường và tôn trọng văn hóa địa phương.",
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
        {/* <div className="absolute inset-0 bg-red-600/50"></div> */}
        <div className="container relative z-10 mx-auto px-6 text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-red-600 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Trải nghiệm sự khác biệt tại Dormate
          </motion.h2>
          <motion.p
            className="max-w-3xl mx-auto mb-10 text-white/90"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Đặt phòng ngay hôm nay và khám phá trải nghiệm lưu trú đẳng cấp tại
            các khách sạn Dormate trên khắp Việt Nam
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
