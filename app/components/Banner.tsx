"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail } from "lucide-react";

interface BannerProps {
  address: string;
  phone: string;
  email: string;
}

const Banner: React.FC<BannerProps> = ({ address, phone, email }) => {
  const bannerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 20,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={bannerVariants}
      className="bg-[#B91B1E] text-white max-lg:hidden"
    >
      <div className="container mx-auto px-4 py-2.5 flex items-center justify-between">
        {/* Left side: Location */}
        <div className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-white" />
          <span className="text-sm font-medium">{address}</span>
        </div>

        {/* Right side: Contact Info */}
        <div className="flex items-center space-x-6">
          {/* Phone Number */}
          <div className="flex items-center space-x-2">
            <Phone className="h-5 w-5 text-white" />
            <a
              href={`tel:${phone}`}
              className="text-sm font-medium hover:underline hover:text-gray-200"
            >
              {phone}
            </a>
          </div>

          {/* Email Address */}
          <div className="flex items-center space-x-2">
            <Mail className="h-5 w-5 text-white" />
            <a
              href={`mailto:${email}`}
              className="text-sm font-medium hover:underline hover:text-gray-200"
            >
              {email}
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Banner;