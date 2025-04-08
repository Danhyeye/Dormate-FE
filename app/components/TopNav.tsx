"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { Menu, X, User, LogOut } from "lucide-react";

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userFullname, setUserFullname] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Optimize scroll event handler with requestAnimationFrame
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };

    // Check for user fullname in localStorage
    const checkUserAuth = () => {
      try {
        const fullname = localStorage.getItem("fullname");
        setUserFullname(fullname);
      } catch (e) {
        console.error("Error accessing localStorage:", e);
      }
    };

    // Listen for auth changes
    const handleAuthChange = () => {
      checkUserAuth();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("storage", checkUserAuth);
    window.addEventListener("auth-change", handleAuthChange);
    
    // Check auth on component mount
    checkUserAuth();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", checkUserAuth);
      window.removeEventListener("auth-change", handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userId");
      localStorage.removeItem("fullname");
      localStorage.removeItem("refreshToken");
      
      setUserFullname(null);
      setUserMenuOpen(false);
      setMobileMenuOpen(false);
      
      // Dispatch auth-change event
      window.dispatchEvent(new Event('auth-change'));
      
      // Optionally redirect to home page
      window.location.href = "/";
    }
  };

  // Simplified animation variants to reduce JS execution
  const navVariants = {
    initial: { opacity: 0, y: -20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  const mobileMenuVariants = {
    closed: { x: "100%" },
    open: { x: 0 },
  };

  return (
    <>
      {/* Desktop Navbar */}
      <motion.nav
        initial="initial"
        animate="animate"
        variants={navVariants}
        className={`
          fixed 
          top-4
          left-0 
          right-0 
          z-50 
          bg-white 
          transition-all 
          duration-300 
          ease-in-out 
          w-3/4
          mx-auto
          rounded-2xl
          ${
            isScrolled
              ? "shadow-md py-3 bg-white/90 backdrop-blur-sm"
              : "py-4 bg-white"
          }
          hidden lg:block
        `}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo-amora-stay.png"
                alt="Amora Stay"
                width={50}
                height={50}
                priority={true}
              />
            </Link>
          </div>

          <div className="flex items-center space-x-16 text-sm">
            <Link
              href="/"
              className="relative group py-2 text-gray-700 hover:text-red-600 font-medium transition-colors duration-300"
            >
              <span>Trang chủ</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/about"
              className="relative group py-2 text-gray-700 hover:text-red-600 font-medium transition-colors duration-300"
            >
              <span>Giới thiệu</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/posts"
              className="relative group py-2 text-gray-700 hover:text-red-600 font-medium transition-colors duration-300"
            >
              <span>Đặt phòng</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/#contact"
              className="relative group py-2 text-gray-700 hover:text-red-600 font-medium transition-colors duration-300"
            >
              <span>Liên hệ</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>

          <div className="flex items-center space-x-6 text-sm">
            {isClient && userFullname ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 text-gray-800 hover:text-red-600 transition-colors duration-300"
                >
                  <div className="bg-red-100 p-2 rounded-full">
                    <User className="h-4 w-4 text-red-600" />
                  </div>
                  <span className="font-medium">Xin chào, {userFullname}</span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50"
                    >
                      Hồ sơ của tôi
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : isClient ? (
              <>
                <Link
                  href="/login"
                  className="text-red-600 hover:text-red-700 font-semibold transition-colors duration-300"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700 font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-red-200"
                >
                  Đăng ký
                </Link>
              </>
            ) : null}
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navbar */}
      <motion.nav
        initial="initial"
        animate="animate"
        variants={navVariants}
        className={`
          fixed 
          top-0 
          left-0 
          right-0 
          z-50 
          bg-white 
          transition-all 
          duration-300 
          ease-in-out 
          ${
            isScrolled
              ? "shadow-md py-2 bg-white/95 backdrop-blur-md"
              : "py-4 bg-white"
          }
          lg:hidden
        `}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo-amora-stay.png"
                alt="Amora Stay"
                width={40}
                height={40}
                priority={true}
              />
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-700 focus:outline-none"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        <motion.div
          initial="closed"
          animate={mobileMenuOpen ? "open" : "closed"}
          variants={mobileMenuVariants}
          transition={{ duration: 0.3 }}
          className={`
            fixed top-[60px] right-0 bottom-0 left-0 
            bg-white z-40 
            flex flex-col 
            overflow-y-auto
            shadow-xl
          `}
        >
          <div className="flex flex-col py-6 px-6 space-y-8">
            <div className="flex flex-col space-y-6">
              <Link
                href="/"
                className="text-gray-800 hover:text-red-600 font-medium text-lg border-b border-gray-100 pb-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Trang chủ
              </Link>
              <Link
                href="/about"
                className="text-gray-800 hover:text-red-600 font-medium text-lg border-b border-gray-100 pb-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Giới thiệu
              </Link>
              <Link
                href="/posts"
                className="text-gray-800 hover:text-red-600 font-medium text-lg border-b border-gray-100 pb-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Đặt phòng
              </Link>
              <Link
                href="/#contact"
                className="text-gray-800 hover:text-red-600 font-medium text-lg border-b border-gray-100 pb-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Liên hệ
              </Link>
            </div>

            <div className="flex flex-col space-y-4 mt-auto pt-6">
              {isClient && userFullname ? (
                <>
                  <div className="flex items-center space-x-3 px-2 py-3 bg-gray-50 rounded-lg">
                    <div className="bg-red-100 p-2 rounded-full">
                      <User className="h-5 w-5 text-red-600" />
                    </div>
                    <span className="font-medium text-gray-800">
                      Xin chào, {userFullname}
                    </span>
                  </div>

                  <Link
                    href="/profile"
                    className="text-gray-700 hover:text-red-600 px-2 py-2 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Hồ sơ của tôi
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-red-600 hover:text-red-700 px-2 py-2 font-medium"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Đăng xuất</span>
                  </button>
                </>
              ) : isClient ? (
                <>
                  <Link
                    href="/login"
                    className="text-red-600 hover:text-red-700 font-semibold text-center py-3 border border-red-600 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    href="/register"
                    className="bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 font-semibold text-center transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Đăng ký
                  </Link>
                </>
              ) : null}
            </div>
          </div>
        </motion.div>
      </motion.nav>
    </>
  );
};

export default Navbar;
