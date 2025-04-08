"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";

const HeroSection = () => {
  return (
    <div className="w-3/4 mx-auto mt-20 sm:mt-12 md:mt-16 lg:mt-28 max-w-7xl">
      <div className="flex flex-col w-full gap-6 md:flex-row">
        <div className="w-full md:w-1/3 flex flex-col bg-black text-white rounded-lg p-6 h-[400px] sm:h-[450px] md:h-[550px] lg:h-[600px] xl:h-[650px]">
          <motion.h1
            className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 tracking-tight"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            Amora
            <br />
            Stay
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-auto"
          >
            <Button
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium w-full sm:w-auto"
            >
              Đặt phòng ngay
            </Button>
          </motion.div>

          <motion.p
            className="text-sm sm:text-lg text-white mt-4 mb-6 sm:mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Đặt phòng ngay hôm nay và khám phá trải nghiệm lưu trú đẳng cấp tại
            Amora Stay đang có mặt ở quận 9, Hồ Chí Minh
          </motion.p>
        </div>

        {/* Middle column - Video */}
        <div className="w-full md:w-1/3 relative rounded-lg overflow-hidden h-[250px] sm:h-[300px] md:h-auto">
          <video
            src="/videos/property-video.mp4"
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          />
        </div>

        {/* Right column - Testimonials */}
        <div className="w-full md:w-1/3 bg-white">
          <div className="space-y-6 border-2 border-gray-100 rounded-lg p-4 sm:p-6 md:p-8 lg:p-10 h-full max-h-[500px] md:max-h-none overflow-y-auto">
            <div className="border-b border-gray-100 pb-4 sm:pb-6">
              <div className="flex items-center gap-3 mb-2 sm:mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 overflow-hidden">
                  <Image
                    src="https://i.pinimg.com/736x/26/82/78/2682787e9d8241a3164a67748ac505b6.jpg"
                    width={40}
                    height={40}
                    alt="Neto Travis"
                    className="object-cover"
                  />
                </div>
                <h3 className="font-medium text-sm sm:text-base">
                  Trần Bảo Hoàng
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-600">
                "Amora Stay đã vượt xa mọi kỳ vọng của chúng tôi về một nền tảng
                cho thuê bất động sản nghỉ dưỡng cao cấp. Toàn bộ trải nghiệm,
                từ đặt phòng đến trả phòng, đều diễn ra suôn sẻ và thú vị. Các
                căn hộ đều tuyệt đẹp, được bảo trì tốt và hoàn toàn đúng như mô
                tả. Nhờ Amora Stay, kỳ nghỉ của chúng tôi thực sự khó quên.
                Chúng tôi rất khuyến khích bạn nên thử!"
              </p>
            </div>

            <div className="border-b border-gray-100 pb-4 sm:pb-6">
              <div className="flex items-center gap-3 mb-2 sm:mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 overflow-hidden">
                  <Image
                    src="https://i.pinimg.com/736x/64/bf/60/64bf60f08e226ae662e83a459a28a9bf.jpg"
                    width={40}
                    height={40}
                    alt="Tess Rodrigo"
                    className="object-cover"
                  />
                </div>
                <h3 className="font-medium text-sm sm:text-base">
                  Huỳnh Thanh Hải
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-600">
                "Là một du khách thường xuyên, tôi đã trải qua nhiều kỳ nghỉ du
                lịch, nhưng Amora Stay thực sự đứng out. Sự chú ý đến chi tiết,
                tiện ích cao cấp và quy trình đặt phòng trở nên dễ dàng, làm cho
                kỳ nghỉ của tôi trở nên khó quên. Amora Stay cung cấp một sự kết
                hợp tuyệt vời giữa thoải mái và tinh tế, làm cho nó trở thành
                lựa chọn hàng đầu của tôi cho kỳ nghỉ cao cấp."
              </p>
            </div>

            <div className="pb-4 sm:pb-6">
              <div className="flex items-center gap-3 mb-2 sm:mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 overflow-hidden">
                  <Image
                    src="https://i.pinimg.com/736x/17/79/03/1779032495dffcc9bdf6f5af0a0e9958.jpg"
                    width={40}
                    height={40}
                    alt="Li Brendan"
                    className="object-cover"
                  />
                </div>
                <h3 className="font-medium text-sm sm:text-base">
                  Trần Công Hoàng
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-600">
                "Amora Stay đã vượt xa mọi kỳ vọng của tôi về một nền tảng cho
                thuê bất động sản nghỉ dưỡng cao cấp. Quy trình đặt phòng trở
                nên dễ dàng và thú vị, cùng với sự lựa chọn căn hộ tuyệt vời và
                dịch vụ khách hàng tận tâm. Kỳ nghỉ của tôi thực sự khó quên, và
                tôi sẽ chắc chắn sẽ đặt phòng lại với Amora Stay."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
