"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

export function Footer() {
  const mainLinks = [
    { label: "Trang chủ", href: "/" },
    // { label: "Vị trí", href: "/locations" },
    // { label: "Khách hàng yêu thích", href: "/guest-favourite" },
    // { label: "Tin tức", href: "/innfacts" },
  ];

  return (
    <footer className="w-3/4 mt-10 mx-auto flex flex-col items-center">
      <div className="container mx-auto px-4 py-4 bg-red-950 rounded-lg">
        <div className="flex items-center justify-between">
          <nav className="flex items-center space-x-8">
            {mainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white hover:text-gray-300 transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/"
            className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            Bắt đầu ngay
          </Link>
        </div>
      </div>

      <div className="flex justify-center py-4">
        <Image
          src="/images/cover-page-aroma-03.png"
          alt="Aroma Stay"
          width={1300}
          height={1300}
          className="h-auto w-auto rounded-lg"
        />
      </div>
    </footer>
  );
}

export default Footer;
