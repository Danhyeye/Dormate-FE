import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Users,
  Ruler,
  Clock,
  Award,
  Bed as BedIcon,
  Mountain,
} from "lucide-react";
import { formatCurrency } from "@/app/services/RequestManager";
import { Post } from "@/app/types/post";

const TabContent = ({ post }: { post: Post }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const truncateDescription = (
    text: string | undefined,
    maxLength: number = 250
  ): string => {
    if (!text || text.length <= maxLength) return text || "";
    return showFullDescription ? text : `${text.substring(0, maxLength)}...`;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="max-w-7xl mx-auto text-black">
      {/* Main Features Section */}
      <motion.section className="mb-10">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
          Tổng quan phòng
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            className="flex items-start p-4 bg-white border border-gray-100 rounded-xl shadow-sm"
            variants={itemVariants}
            whileHover={{
              y: -5,
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Users className="mr-2 w-5 h-5 text-rose-500" />
            <div>
              <div className="text-sm text-gray-500">Liên hệ</div>
              <div className="font-medium">{post.phoneNumber || "Không có"}</div>
            </div>
          </motion.div>

          <motion.div
            className="flex items-start p-4 bg-white border border-gray-100 rounded-xl shadow-sm"
            variants={itemVariants}
            whileHover={{
              y: -5,
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Ruler className="mr-2 w-5 h-5 text-rose-500" />
            <div>
              <div className="text-sm text-gray-500">Diện tích</div>
              <div className="font-medium">{post.area} m²</div>
            </div>
          </motion.div>

          <motion.div
            className="flex items-start p-4 bg-white border border-gray-100 rounded-xl shadow-sm"
            variants={itemVariants}
            whileHover={{
              y: -5,
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            }}
          >
            <BedIcon className="mr-2 w-5 h-5 text-rose-500" />
            <div>
              <div className="text-sm text-gray-500">Địa chỉ</div>
              <div className="font-medium">{post.address}</div>
            </div>
          </motion.div>

          <motion.div
            className="flex items-start p-4 bg-white border border-gray-100 rounded-xl shadow-sm"
            variants={itemVariants}
            whileHover={{
              y: -5,
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Clock className="mr-2 w-5 h-5 text-rose-500" />
            <div>
              <div className="text-sm text-gray-500">Giá</div>
              <div className="font-medium">
                {formatCurrency(post.price)}/tháng
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Description Section */}
      <motion.section
        className="mb-10 bg-white p-6 rounded-xl border border-gray-100 shadow-sm"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2
          className="text-xl font-semibold text-gray-900 mb-4 flex items-center"
          variants={itemVariants}
        >
          <Award className="w-5 h-5 mr-2 text-rose-500" />
          Mô tả phòng
        </motion.h2>

        <motion.div
          variants={itemVariants}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <p className="text-gray-700 leading-relaxed">
            {truncateDescription(post.description)}
          </p>
        </motion.div>

        {post.description?.length > 250 && (
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            variants={itemVariants}
          >
            <Button
              variant="link"
              className="p-0 h-auto text-rose-500 font-medium mt-2"
              onClick={() => setShowFullDescription(!showFullDescription)}
            >
              {showFullDescription ? "Show less" : "Show more"}
              <motion.span
                animate={{ rotate: showFullDescription ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="inline-block ml-1"
              >
                ↓
              </motion.span>
            </Button>
          </motion.div>
        )}
      </motion.section>

      {/* Location Section */}
      <motion.section
        className="mb-10 bg-white p-6 rounded-xl border border-gray-100 shadow-sm"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2
          className="text-xl font-semibold text-gray-900 mb-4 flex items-center"
          variants={itemVariants}
        >
          <Mountain className="w-5 h-5 mr-2 text-rose-500" />
          Địa chỉ chi tiết
        </motion.h2>

        <motion.div
          variants={itemVariants}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="space-y-2"
        >
          <p className="text-gray-700">
            <span className="font-medium">Tỉnh/Thành phố:</span> {post.province}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Quận/Huyện:</span> {post.district}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Phường/Xã:</span> {post.ward}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Địa chỉ cụ thể:</span> {post.address}
          </p>
          {post.note && (
            <p className="text-gray-700">
              <span className="font-medium">Ghi chú:</span> {post.note}
            </p>
          )}
        </motion.div>
      </motion.section>
    </div>
  );
};

export default TabContent;
